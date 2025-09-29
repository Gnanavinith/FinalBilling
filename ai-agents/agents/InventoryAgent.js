const BaseAgent = require('./BaseAgent');
const mongoose = require('mongoose');
const { notifyBoth } = require('../utils/notifier');

class InventoryAgent extends BaseAgent {
  constructor(io) {
    super('inventory', io);
    this.mobilesCollection = mongoose.connection.db.collection('mobiles');
    this.accessoriesCollection = mongoose.connection.db.collection('accessories');
    this.storeStockCollection = mongoose.connection.db.collection('storestocks');
    this.purchasesCollection = mongoose.connection.db.collection('purchases');
    this.salesCollection = mongoose.connection.db.collection('sales');
    
    this.config = {
      ...this.config,
      lowStockThreshold: parseInt(process.env.LOW_STOCK_THRESHOLD) || 5,
      highStockThreshold: parseInt(process.env.HIGH_STOCK_THRESHOLD) || 50,
      reorderMultiplier: 2.5, // Order 2.5x the average monthly consumption
      analysisDays: 30
    };
  }

  async checkStockLevels() {
    try {
      await this.log('Starting stock level check...', 'info');
      
      // Check mobile stock
      const mobileStock = await this.mobilesCollection.find({}).toArray();
      const mobileAlerts = await this.analyzeStockLevels(mobileStock, 'mobile');
      
      // Check accessory stock
      const accessoryStock = await this.accessoriesCollection.find({}).toArray();
      const accessoryAlerts = await this.analyzeStockLevels(accessoryStock, 'accessory');
      
      const allAlerts = [...mobileAlerts, ...accessoryAlerts];
      
      // Create insights for each alert
      for (const alert of allAlerts) {
        await this.createInsight(
          alert.title,
          alert.description,
          alert.type,
          alert.priority,
          alert.data
        );
      }

      await this.log(`Stock check completed. Found ${allAlerts.length} alerts`, 'info');
      
    } catch (error) {
      await this.log(`Stock level check failed: ${error.message}`, 'error');
    }
  }

  async analyzeStockLevels(items, category) {
    const alerts = [];
    
    for (const item of items) {
      const currentStock = item.remainingStock ?? item.quantity ?? 0;
      const productName = item.productName || item.name || item.productName || item.productModel || 'Unknown Product';
      
      // Low stock alert
      if (currentStock <= this.config.lowStockThreshold) {
        alerts.push({
          title: `Low Stock Alert: ${productName}`,
          description: `Only ${currentStock} units remaining. Consider reordering immediately.`,
          type: 'low_stock',
          priority: currentStock === 0 ? 'critical' : 'high',
          data: {
            product: productName,
            currentStock,
            category,
            threshold: this.config.lowStockThreshold,
            itemId: item._id
          }
        });

        // Notify via WhatsApp + Email
        await notifyBoth({
          subject: `Low Stock: ${productName}`,
          text: `${productName} only has ${currentStock} units remaining (threshold ${this.config.lowStockThreshold}).`,
          emails: [item.supplierEmail, item.dealerEmail, item.contactEmail].filter(Boolean),
          phones: [item.supplierPhone, item.dealerPhone, item.contactPhone].filter(Boolean),
        })
      }
      
      // High stock alert (overstocking)
      if (currentStock >= this.config.highStockThreshold) {
        alerts.push({
          title: `High Stock Alert: ${productName}`,
          description: `${currentStock} units in stock. Consider promotional pricing to reduce inventory.`,
          type: 'high_stock',
          priority: 'medium',
          data: {
            product: productName,
            currentStock,
            category,
            threshold: this.config.highStockThreshold,
            itemId: item._id
          }
        });
      }
      
      // Zero stock alert
      if (currentStock === 0) {
        alerts.push({
          title: `Out of Stock: ${productName}`,
          description: `${productName} is completely out of stock. Urgent reorder required.`,
          type: 'out_of_stock',
          priority: 'critical',
          data: {
            product: productName,
            currentStock,
            category,
            itemId: item._id
          }
        });

        await notifyBoth({
          subject: `Out of Stock: ${productName}`,
          text: `${productName} is out of stock. Please reorder immediately.`,
          emails: [item.supplierEmail, item.dealerEmail, item.contactEmail].filter(Boolean),
          phones: [item.supplierPhone, item.dealerPhone, item.contactPhone].filter(Boolean),
        })
      }
    }
    
    return alerts;
  }

  async suggestReorder() {
    try {
      await this.log('Generating reorder suggestions...', 'info');
      
      // Get low stock items
      const lowStockItems = await this.getLowStockItems();
      
      for (const item of lowStockItems) {
        const reorderSuggestion = await this.calculateReorderQuantity(item);
        
        if (reorderSuggestion.quantity > 0) {
          await this.createInsight(
            `Reorder Suggestion: ${item.productName}`,
            `Suggested quantity: ${reorderSuggestion.quantity} units. Estimated cost: ₹${reorderSuggestion.estimatedCost.toFixed(2)}`,
            'reorder',
            item.remainingStock === 0 ? 'critical' : 'high',
            {
              product: item.productName,
              currentStock: item.remainingStock,
              suggestedQuantity: reorderSuggestion.quantity,
              estimatedCost: reorderSuggestion.estimatedCost,
              reasoning: reorderSuggestion.reasoning,
              itemId: item._id
            }
          );
        }
      }

      await this.log(`Generated ${lowStockItems.length} reorder suggestions`, 'info');
      
    } catch (error) {
      await this.log(`Reorder suggestion failed: ${error.message}`, 'error');
    }
  }

  async getLowStockItems() {
    const lowStockMobiles = await this.mobilesCollection.find({
      $or: [
        { remainingStock: { $lte: this.config.lowStockThreshold } },
        { quantity: { $lte: this.config.lowStockThreshold } }
      ]
    }).toArray();

    const lowStockAccessories = await this.accessoriesCollection.find({
      $or: [
        { remainingStock: { $lte: this.config.lowStockThreshold } },
        { quantity: { $lte: this.config.lowStockThreshold } }
      ]
    }).toArray();

    const lowStockStore = await this.storeStockCollection.find({
      quantity: { $lte: this.config.lowStockThreshold }
    }).toArray();

    return [...lowStockMobiles, ...lowStockAccessories, ...lowStockStore];
  }

  async calculateReorderQuantity(item) {
    try {
      // Get sales data for this product in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - this.config.analysisDays);
      
      const salesData = await this.salesCollection.find({
        'items.productName': item.productName,
        createdAt: { $gte: thirtyDaysAgo }
      }).toArray();
      
      // Calculate average monthly consumption
      const totalSold = salesData.reduce((sum, sale) => {
        const itemSale = sale.items.find(i => i.productName === item.productName);
        return sum + (itemSale?.quantity || 0);
      }, 0);
      
      const averageMonthlyConsumption = totalSold / (this.config.analysisDays / 30);
      
      // Calculate suggested reorder quantity
      const safetyStock = Math.max(10, averageMonthlyConsumption * 0.5); // 50% of monthly consumption as safety stock
      const suggestedQuantity = Math.ceil((averageMonthlyConsumption * this.config.reorderMultiplier) + safetyStock);
      
      // Ensure minimum reorder quantity
      const minReorderQuantity = Math.max(5, suggestedQuantity);
      
      const estimatedCost = minReorderQuantity * (item.purchasePrice || 0);
      
      let reasoning = `Based on ${totalSold} units sold in last ${this.config.analysisDays} days`;
      if (averageMonthlyConsumption > 0) {
        reasoning += ` (avg: ${averageMonthlyConsumption.toFixed(1)} units/month)`;
      } else {
        reasoning += '. No recent sales data available';
      }
      
      return {
        quantity: minReorderQuantity,
        estimatedCost,
        reasoning,
        averageMonthlyConsumption,
        totalSold
      };
      
    } catch (error) {
      await this.log(`Reorder calculation failed for ${item.productName}: ${error.message}`, 'error');
      return {
        quantity: 10, // Default fallback
        estimatedCost: 10 * (item.purchasePrice || 0),
        reasoning: 'Default reorder quantity due to calculation error'
      };
    }
  }

  async analyzeOverstock() {
    try {
      await this.log('Analyzing overstock situations...', 'info');
      
      // Get high stock items
      const highStockItems = await this.getHighStockItems();
      
      for (const item of highStockItems) {
        const overstockAnalysis = await this.analyzeOverstockItem(item);
        
        if (overstockAnalysis.isOverstocked) {
          await this.createInsight(
            `Overstock Analysis: ${item.productName}`,
            overstockAnalysis.description,
            'overstock',
            'medium',
            {
              product: item.productName,
              currentStock: item.remainingStock,
              analysis: overstockAnalysis,
              itemId: item._id
            }
          );
        }
      }

      await this.log(`Overstock analysis completed for ${highStockItems.length} items`, 'info');
      
    } catch (error) {
      await this.log(`Overstock analysis failed: ${error.message}`, 'error');
    }
  }

  async getHighStockItems() {
    const highStockMobiles = await this.mobilesCollection.find({
      $or: [
        { remainingStock: { $gte: this.config.highStockThreshold } },
        { quantity: { $gte: this.config.highStockThreshold } }
      ]
    }).toArray();

    const highStockAccessories = await this.accessoriesCollection.find({
      $or: [
        { remainingStock: { $gte: this.config.highStockThreshold } },
        { quantity: { $gte: this.config.highStockThreshold } }
      ]
    }).toArray();

    const highStockStore = await this.storeStockCollection.find({
      quantity: { $gte: this.config.highStockThreshold }
    }).toArray();

    return [...highStockMobiles, ...highStockAccessories, ...highStockStore];
  }

  async analyzeOverstockItem(item) {
    try {
      // Get sales data for this product
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - this.config.analysisDays);
      
      const salesData = await this.salesCollection.find({
        'items.productName': item.productName,
        createdAt: { $gte: thirtyDaysAgo }
      }).toArray();
      
      const totalSold = salesData.reduce((sum, sale) => {
        const itemSale = sale.items.find(i => i.productName === item.productName);
        return sum + (itemSale?.quantity || 0);
      }, 0);
      
      const averageMonthlyConsumption = totalSold / (this.config.analysisDays / 30);
      const monthsOfStock = item.remainingStock / Math.max(averageMonthlyConsumption, 1);
      
      let isOverstocked = false;
      let description = '';
      
      if (monthsOfStock > 6) {
        isOverstocked = true;
        description = `Has ${monthsOfStock.toFixed(1)} months of stock. Consider promotional pricing or bulk discounts.`;
      } else if (monthsOfStock > 3) {
        isOverstocked = true;
        description = `Has ${monthsOfStock.toFixed(1)} months of stock. Monitor sales closely.`;
      }
      
      return {
        isOverstocked,
        description,
        monthsOfStock,
        averageMonthlyConsumption,
        totalSold
      };
      
    } catch (error) {
      await this.log(`Overstock analysis failed for ${item.productName}: ${error.message}`, 'error');
      return {
        isOverstocked: false,
        description: 'Analysis failed',
        monthsOfStock: 0,
        averageMonthlyConsumption: 0,
        totalSold: 0
      };
    }
  }

  async generateDailySummary() {
    try {
      const totalMobiles = await this.mobilesCollection.countDocuments();
      const totalAccessories = await this.accessoriesCollection.countDocuments();
      
      const lowStockMobiles = await this.mobilesCollection.countDocuments({
        remainingStock: { $lte: this.config.lowStockThreshold }
      });
      
      const lowStockAccessories = await this.accessoriesCollection.countDocuments({
        remainingStock: { $lte: this.config.lowStockThreshold }
      });
      
      const outOfStockMobiles = await this.mobilesCollection.countDocuments({
        remainingStock: 0
      });
      
      const outOfStockAccessories = await this.accessoriesCollection.countDocuments({
        remainingStock: 0
      });
      
      await this.createInsight(
        'Daily Inventory Summary',
        `Total: ${totalMobiles} mobiles, ${totalAccessories} accessories. Low stock: ${lowStockMobiles + lowStockAccessories}. Out of stock: ${outOfStockMobiles + outOfStockAccessories}`,
        'summary',
        'medium',
        {
          totalMobiles,
          totalAccessories,
          lowStockMobiles,
          lowStockAccessories,
          outOfStockMobiles,
          outOfStockAccessories,
          date: new Date().toDateString()
        }
      );

      await this.log(`Daily inventory summary generated`, 'info');
      
    } catch (error) {
      await this.log(`Daily summary failed: ${error.message}`, 'error');
    }
  }

  async getInventoryValue() {
    try {
      const mobiles = await this.mobilesCollection.find({}).toArray();
      const accessories = await this.accessoriesCollection.find({}).toArray();
      
      const mobileValue = mobiles.reduce((sum, item) => 
        sum + ((item.remainingStock || 0) * (item.purchasePrice || 0)), 0);
      
      const accessoryValue = accessories.reduce((sum, item) => 
        sum + ((item.remainingStock || 0) * (item.purchasePrice || 0)), 0);
      
      return {
        totalValue: mobileValue + accessoryValue,
        mobileValue,
        accessoryValue,
        totalItems: mobiles.length + accessories.length
      };
      
    } catch (error) {
      await this.log(`Inventory value calculation failed: ${error.message}`, 'error');
      return { totalValue: 0, mobileValue: 0, accessoryValue: 0, totalItems: 0 };
    }
  }
}

module.exports = InventoryAgent;
