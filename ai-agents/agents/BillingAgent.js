const BaseAgent = require('./BaseAgent');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { notifyBoth } = require('../utils/notifier');

class BillingAgent extends BaseAgent {
  constructor(io) {
    super('billing', io);
    this.salesCollection = mongoose.connection.db.collection('sales');
    this.serviceInvoicesCollection = mongoose.connection.db.collection('serviceinvoices');
    this.customersCollection = mongoose.connection.db.collection('customers');
    
    this.config = {
      ...this.config,
      paymentReminderDays: parseInt(process.env.PAYMENT_REMINDER_DAYS) || 7,
      fraudDetectionThreshold: parseInt(process.env.FRAUD_DETECTION_THRESHOLD) || 10000,
      invoicePath: path.join(__dirname, '../generated-invoices'),
      autoGenerateInvoices: true
    };
    
    // Ensure invoice directory exists
    if (!fs.existsSync(this.config.invoicePath)) {
      fs.mkdirSync(this.config.invoicePath, { recursive: true });
    }
  }

  async checkPendingPayments() {
    try {
      await this.log('Checking pending payments...', 'info');
      
      // Check sales with pending payments
      const pendingSales = await this.salesCollection.find({
        paymentStatus: { $in: ['pending', 'partial'] },
        createdAt: { $gte: new Date(Date.now() - this.config.paymentReminderDays * 24 * 60 * 60 * 1000) }
      }).toArray();
      
      // Check service invoices with pending payments
      const pendingServiceInvoices = await this.serviceInvoicesCollection.find({
        paymentStatus: { $in: ['pending', 'partial'] },
        createdAt: { $gte: new Date(Date.now() - this.config.paymentReminderDays * 24 * 60 * 60 * 1000) }
      }).toArray();
      
      const allPending = [...pendingSales, ...pendingServiceInvoices];
      
      for (const invoice of allPending) {
        const daysOverdue = this.calculateDaysOverdue(invoice);
        
        if (daysOverdue >= this.config.paymentReminderDays) {
          await this.createInsight(
            `Payment Reminder: ${invoice.invoiceNumber || invoice._id}`,
            `Payment overdue by ${daysOverdue} days. Amount: ₹${invoice.totalAmount || invoice.amount || 0}`,
            'payment_reminder',
            daysOverdue > 14 ? 'critical' : 'high',
            {
              invoiceId: invoice._id,
              invoiceNumber: invoice.invoiceNumber,
              customerName: invoice.customerName,
              amount: invoice.totalAmount || invoice.amount,
              daysOverdue,
              type: invoice.items ? 'sale' : 'service'
            }
          );

          // Notify customer/admin via WhatsApp + Email (if contacts configured)
          await notifyBoth({
            subject: `Payment Reminder: ${invoice.invoiceNumber || invoice._id}`,
            text: `Dear ${invoice.customerName || 'Customer'}, your payment of ₹${invoice.totalAmount || invoice.amount || 0} is ${daysOverdue} days overdue. Please complete the payment at the earliest.`,
            emails: invoice.customerEmail ? [invoice.customerEmail] : [],
            phones: invoice.customerPhone ? [invoice.customerPhone] : [],
          })
        }
      }

      await this.log(`Payment check completed. Found ${allPending.length} pending payments`, 'info');
      
    } catch (error) {
      await this.log(`Payment check failed: ${error.message}`, 'error');
    }
  }

  calculateDaysOverdue(invoice) {
    const invoiceDate = new Date(invoice.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - invoiceDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  async detectFraud() {
    try {
      await this.log('Running fraud detection...', 'info');
      
      // Get recent high-value transactions
      const recentTransactions = await this.salesCollection.find({
        totalAmount: { $gte: this.config.fraudDetectionThreshold },
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
      }).toArray();
      
      const fraudAlerts = [];
      
      for (const transaction of recentTransactions) {
        const fraudScore = await this.calculateFraudScore(transaction);
        
        if (fraudScore.risk > 0.7) {
          fraudAlerts.push({
            title: `Fraud Alert: High-Risk Transaction`,
            description: `Transaction ${transaction.invoiceNumber || transaction._id} flagged with ${(fraudScore.risk * 100).toFixed(1)}% fraud risk`,
            type: 'fraud_alert',
            priority: 'critical',
            data: {
              transactionId: transaction._id,
              invoiceNumber: transaction.invoiceNumber,
              amount: transaction.totalAmount,
              fraudScore: fraudScore.risk,
              reasons: fraudScore.reasons,
              customerName: transaction.customerName
            }
          });
        }
      }
      
      // Check for unusual patterns
      const patternAlerts = await this.detectUnusualPatterns();
      fraudAlerts.push(...patternAlerts);
      
      for (const alert of fraudAlerts) {
        await this.createInsight(
          alert.title,
          alert.description,
          alert.type,
          alert.priority,
          alert.data
        );
      }

      await this.log(`Fraud detection completed. Found ${fraudAlerts.length} alerts`, 'info');
      
    } catch (error) {
      await this.log(`Fraud detection failed: ${error.message}`, 'error');
    }
  }

  async calculateFraudScore(transaction) {
    let risk = 0;
    const reasons = [];
    
    // High amount risk
    if (transaction.totalAmount > this.config.fraudDetectionThreshold * 2) {
      risk += 0.3;
      reasons.push('Very high transaction amount');
    }
    
    // Cash payment risk (higher fraud potential)
    if (transaction.paymentMethod === 'cash' && transaction.totalAmount > 5000) {
      risk += 0.2;
      reasons.push('High-value cash transaction');
    }
    
    // Multiple items risk
    if (transaction.items && transaction.items.length > 5) {
      risk += 0.1;
      reasons.push('Unusually high number of items');
    }
    
    // Time-based risk (late night/early morning)
    const hour = new Date(transaction.createdAt).getHours();
    if (hour < 6 || hour > 22) {
      risk += 0.1;
      reasons.push('Transaction outside business hours');
    }
    
    // Customer history check
    const customerHistory = await this.salesCollection.find({
      customerName: transaction.customerName,
      createdAt: { $lt: transaction.createdAt }
    }).toArray();
    
    if (customerHistory.length === 0) {
      risk += 0.2;
      reasons.push('New customer with high-value transaction');
    }
    
    return { risk: Math.min(risk, 1), reasons };
  }

  async detectUnusualPatterns() {
    const alerts = [];
    
    try {
      // Check for rapid successive transactions
      const recentTransactions = await this.salesCollection.find({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
      }).sort({ createdAt: 1 }).toArray();
      
      // Group by customer
      const customerTransactions = {};
      recentTransactions.forEach(transaction => {
        const customer = transaction.customerName;
        if (!customerTransactions[customer]) {
          customerTransactions[customer] = [];
        }
        customerTransactions[customer].push(transaction);
      });
      
      // Check for customers with multiple transactions in short time
      Object.entries(customerTransactions).forEach(([customer, transactions]) => {
        if (transactions.length > 3) {
          const totalAmount = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
          alerts.push({
            title: `Unusual Pattern: Multiple Transactions`,
            description: `${customer} made ${transactions.length} transactions in 24 hours totaling ₹${totalAmount}`,
            type: 'pattern_alert',
            priority: 'medium',
            data: {
              customer,
              transactionCount: transactions.length,
              totalAmount,
              transactions: transactions.map(t => ({
                id: t._id,
                amount: t.totalAmount,
                time: t.createdAt
              }))
            }
          });
        }
      });
      
    } catch (error) {
      await this.log(`Pattern detection failed: ${error.message}`, 'error');
    }
    
    return alerts;
  }

  async generateInvoices() {
    try {
      await this.log('Generating pending invoices...', 'info');
      
      if (!this.config.autoGenerateInvoices) {
        await this.log('Auto invoice generation disabled', 'info');
        return;
      }
      
      // Find sales without generated invoices
      const salesWithoutInvoices = await this.salesCollection.find({
        invoiceGenerated: { $ne: true },
        paymentStatus: { $ne: 'cancelled' }
      }).limit(10).toArray(); // Limit to prevent overload
      
      let generatedCount = 0;
      
      for (const sale of salesWithoutInvoices) {
        try {
          const invoicePath = await this.createInvoicePDF(sale);
          
          // Update sale record
          await this.salesCollection.updateOne(
            { _id: sale._id },
            { 
              $set: { 
                invoiceGenerated: true,
                invoicePath: invoicePath,
                invoiceGeneratedAt: new Date()
              }
            }
          );
          
          generatedCount++;
          
          await this.createInsight(
            `Invoice Generated: ${sale.invoiceNumber || sale._id}`,
            `PDF invoice created for ₹${sale.totalAmount}`,
            'invoice_generated',
            'low',
            {
              saleId: sale._id,
              invoiceNumber: sale.invoiceNumber,
              amount: sale.totalAmount,
              invoicePath,
              customerName: sale.customerName
            }
          );
          
        } catch (error) {
          await this.log(`Failed to generate invoice for sale ${sale._id}: ${error.message}`, 'error');
        }
      }

      await this.log(`Invoice generation completed. Generated ${generatedCount} invoices`, 'info');
      
    } catch (error) {
      await this.log(`Invoice generation failed: ${error.message}`, 'error');
    }
  }

  async createInvoicePDF(sale) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const fileName = `invoice_${sale._id}_${Date.now()}.pdf`;
        const filePath = path.join(this.config.invoicePath, fileName);
        
        doc.pipe(fs.createWriteStream(filePath));
        
        // Header
        doc.fontSize(20).text('INVOICE', 50, 50);
        doc.fontSize(12).text(`Invoice #: ${sale.invoiceNumber || sale._id}`, 50, 80);
        doc.text(`Date: ${new Date(sale.createdAt).toLocaleDateString()}`, 50, 100);
        
        // Customer details
        doc.text('Bill To:', 50, 130);
        doc.text(sale.customerName || 'N/A', 50, 150);
        if (sale.customerPhone) {
          doc.text(`Phone: ${sale.customerPhone}`, 50, 170);
        }
        
        // Items table
        let yPosition = 220;
        doc.text('Items:', 50, yPosition);
        yPosition += 20;
        
        if (sale.items && sale.items.length > 0) {
          sale.items.forEach(item => {
            doc.text(`${item.productName} x${item.quantity}`, 50, yPosition);
            doc.text(`₹${item.price}`, 400, yPosition);
            yPosition += 20;
          });
        }
        
        // Total
        yPosition += 20;
        doc.fontSize(14).text(`Total: ₹${sale.totalAmount}`, 400, yPosition);
        
        // Payment status
        yPosition += 40;
        doc.fontSize(12).text(`Payment Status: ${sale.paymentStatus || 'Pending'}`, 50, yPosition);
        
        doc.end();
        
        doc.on('end', () => {
          resolve(filePath);
        });
        
        doc.on('error', (error) => {
          reject(error);
        });
        
      } catch (error) {
        reject(error);
      }
    });
  }

  async generateDailySummary() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Sales summary
      const todaySales = await this.salesCollection.find({
        createdAt: { $gte: today, $lt: tomorrow }
      }).toArray();

      const totalRevenue = todaySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
      const paidAmount = todaySales
        .filter(sale => sale.paymentStatus === 'paid')
        .reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
      
      const pendingAmount = totalRevenue - paidAmount;

      // Service invoices summary
      const todayServiceInvoices = await this.serviceInvoicesCollection.find({
        createdAt: { $gte: today, $lt: tomorrow }
      }).toArray();

      const serviceRevenue = todayServiceInvoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);

      await this.createInsight(
        'Daily Billing Summary',
        `Sales: ₹${totalRevenue.toFixed(2)} (Paid: ₹${paidAmount.toFixed(2)}, Pending: ₹${pendingAmount.toFixed(2)}). Services: ₹${serviceRevenue.toFixed(2)}`,
        'summary',
        'medium',
        {
          totalRevenue,
          paidAmount,
          pendingAmount,
          serviceRevenue,
          salesCount: todaySales.length,
          serviceCount: todayServiceInvoices.length,
          date: today.toDateString()
        }
      );

      await this.log(`Daily billing summary generated`, 'info');
      
    } catch (error) {
      await this.log(`Daily summary failed: ${error.message}`, 'error');
    }
  }

  async getPaymentAnalytics() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentSales = await this.salesCollection.find({
        createdAt: { $gte: thirtyDaysAgo }
      }).toArray();
      
      const paymentMethods = {};
      const paymentStatuses = {};
      
      recentSales.forEach(sale => {
        const method = sale.paymentMethod || 'unknown';
        const status = sale.paymentStatus || 'pending';
        
        paymentMethods[method] = (paymentMethods[method] || 0) + 1;
        paymentStatuses[status] = (paymentStatuses[status] || 0) + 1;
      });
      
      return {
        paymentMethods,
        paymentStatuses,
        totalTransactions: recentSales.length,
        period: '30 days'
      };
      
    } catch (error) {
      await this.log(`Payment analytics failed: ${error.message}`, 'error');
      return { paymentMethods: {}, paymentStatuses: {}, totalTransactions: 0, period: '30 days' };
    }
  }
}

module.exports = BillingAgent;
