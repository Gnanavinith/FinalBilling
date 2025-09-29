const BaseAgent = require('./BaseAgent');
const mongoose = require('mongoose');

class FinanceAgent extends BaseAgent {
  constructor(io) {
    super('finance', io);
    this.salesCollection = mongoose.connection.db.collection('sales');
    this.purchasesCollection = mongoose.connection.db.collection('purchases');
    this.serviceInvoicesCollection = mongoose.connection.db.collection('serviceinvoices');
    this.mobilesCollection = mongoose.connection.db.collection('mobiles');
    this.accessoriesCollection = mongoose.connection.db.collection('accessories');
    
    this.config = {
      ...this.config,
      analysisPeriod: 30, // days
      profitMarginThreshold: 0.15, // 15% minimum profit margin
      expenseAlertThreshold: 0.2, // 20% of revenue
      cashFlowWarningDays: 7
    };
  }

  async analyzeProfitLoss() {
    try {
      await this.log('Starting profit & loss analysis...', 'info');
      
      const analysisPeriod = this.config.analysisPeriod;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - analysisPeriod);
      
      // Get financial data
      const salesData = await this.salesCollection.find({
        createdAt: { $gte: startDate }
      }).toArray();
      
      const purchaseData = await this.purchasesCollection.find({
        createdAt: { $gte: startDate }
      }).toArray();
      
      const serviceData = await this.serviceInvoicesCollection.find({
        createdAt: { $gte: startDate }
      }).toArray();
      
      // Calculate P&L
      const profitLoss = await this.calculateProfitLoss(salesData, purchaseData, serviceData);
      
      // Generate insights
      await this.generateProfitLossInsights(profitLoss);
      
      await this.log(`P&L analysis completed for ${analysisPeriod} days`, 'info');
      
    } catch (error) {
      await this.log(`P&L analysis failed: ${error.message}`, 'error');
    }
  }

  async calculateProfitLoss(salesData, purchaseData, serviceData) {
    // Revenue calculations
    const salesRevenue = salesData.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
    const serviceRevenue = serviceData.reduce((sum, service) => sum + (service.amount || 0), 0);
    const totalRevenue = salesRevenue + serviceRevenue;
    
    // Cost calculations
    const purchaseCosts = purchaseData.reduce((sum, purchase) => sum + (purchase.totalAmount || 0), 0);
    
    // Calculate cost of goods sold (COGS) for sales
    const cogs = await this.calculateCOGS(salesData);
    
    // Calculate service costs (assuming 30% of service revenue as cost)
    const serviceCosts = serviceRevenue * 0.3;
    
    const totalCosts = purchaseCosts + cogs + serviceCosts;
    
    // Calculate profit
    const grossProfit = totalRevenue - totalCosts;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    
    return {
      period: this.config.analysisPeriod,
      revenue: {
        sales: salesRevenue,
        services: serviceRevenue,
        total: totalRevenue
      },
      costs: {
        purchases: purchaseCosts,
        cogs: cogs,
        services: serviceCosts,
        total: totalCosts
      },
      profit: {
        gross: grossProfit,
        margin: profitMargin
      },
      transactions: {
        sales: salesData.length,
        purchases: purchaseData.length,
        services: serviceData.length
      }
    };
  }

  async calculateCOGS(salesData) {
    let totalCOGS = 0;
    
    for (const sale of salesData) {
      if (sale.items && sale.items.length > 0) {
        for (const item of sale.items) {
          // Find the product in inventory to get purchase price
          const product = await this.findProductInInventory(item.productName);
          if (product) {
            const itemCOGS = (product.purchasePrice || 0) * (item.quantity || 1);
            totalCOGS += itemCOGS;
          }
        }
      }
    }
    
    return totalCOGS;
  }

  async findProductInInventory(productName) {
    // Search in mobiles collection
    let product = await this.mobilesCollection.findOne({
      productName: { $regex: productName, $options: 'i' }
    });
    
    // If not found in mobiles, search in accessories
    if (!product) {
      product = await this.accessoriesCollection.findOne({
        productName: { $regex: productName, $options: 'i' }
      });
    }
    
    return product;
  }

  async generateProfitLossInsights(profitLoss) {
    // Profit margin analysis
    if (profitLoss.profit.margin < this.config.profitMarginThreshold * 100) {
      await this.createInsight(
        'Low Profit Margin Alert',
        `Profit margin is ${profitLoss.profit.margin.toFixed(2)}%, below the recommended ${this.config.profitMarginThreshold * 100}%. Consider reviewing pricing strategy.`,
        'profit_alert',
        'high',
        {
          currentMargin: profitLoss.profit.margin,
          recommendedMargin: this.config.profitMarginThreshold * 100,
          totalRevenue: profitLoss.revenue.total,
          grossProfit: profitLoss.profit.gross
        }
      );
    }
    
    // Revenue analysis
    if (profitLoss.revenue.total > 0) {
      const salesPercentage = (profitLoss.revenue.sales / profitLoss.revenue.total) * 100;
      const servicePercentage = (profitLoss.revenue.services / profitLoss.revenue.total) * 100;
      
      await this.createInsight(
        'Revenue Breakdown Analysis',
        `Sales: ${salesPercentage.toFixed(1)}% (₹${profitLoss.revenue.sales.toFixed(2)}), Services: ${servicePercentage.toFixed(1)}% (₹${profitLoss.revenue.services.toFixed(2)})`,
        'revenue_analysis',
        'medium',
        {
          salesRevenue: profitLoss.revenue.sales,
          serviceRevenue: profitLoss.revenue.services,
          salesPercentage,
          servicePercentage
        }
      );
    }
    
    // Cost analysis
    if (profitLoss.costs.total > 0) {
      const costToRevenueRatio = (profitLoss.costs.total / profitLoss.revenue.total) * 100;
      
      if (costToRevenueRatio > 80) {
        await this.createInsight(
          'High Cost Ratio Alert',
          `Costs represent ${costToRevenueRatio.toFixed(1)}% of revenue. Consider cost optimization strategies.`,
          'cost_alert',
          'high',
          {
            costRatio: costToRevenueRatio,
            totalCosts: profitLoss.costs.total,
            totalRevenue: profitLoss.revenue.total
          }
        );
      }
    }
  }

  async forecastRevenue() {
    try {
      await this.log('Starting revenue forecasting...', 'info');
      
      // Get historical data for trend analysis
      const historicalData = await this.getHistoricalRevenueData();
      
      if (historicalData.length < 7) {
        await this.log('Insufficient data for revenue forecasting', 'warn');
        return;
      }
      
      // Calculate trends
      const trends = this.calculateRevenueTrends(historicalData);
      
      // Generate forecasts
      const forecasts = this.generateRevenueForecasts(trends);
      
      for (const forecast of forecasts) {
        await this.createInsight(
          forecast.title,
          forecast.description,
          'revenue_forecast',
          forecast.priority,
          forecast.data
        );
      }
      
      await this.log(`Revenue forecasting completed. Generated ${forecasts.length} forecasts`, 'info');
      
    } catch (error) {
      await this.log(`Revenue forecasting failed: ${error.message}`, 'error');
    }
  }

  async getHistoricalRevenueData() {
    const days = 30;
    const dailyRevenue = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const salesRevenue = await this.salesCollection.aggregate([
        {
          $match: {
            createdAt: { $gte: date, $lt: nextDate }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]).toArray();
      
      const serviceRevenue = await this.serviceInvoicesCollection.aggregate([
        {
          $match: {
            createdAt: { $gte: date, $lt: nextDate }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]).toArray();
      
      const totalRevenue = (salesRevenue[0]?.total || 0) + (serviceRevenue[0]?.total || 0);
      
      dailyRevenue.push({
        date: date.toISOString().split('T')[0],
        revenue: totalRevenue
      });
    }
    
    return dailyRevenue;
  }

  calculateRevenueTrends(historicalData) {
    const revenues = historicalData.map(d => d.revenue);
    
    // Calculate simple moving averages
    const weeklyAverage = revenues.slice(-7).reduce((sum, r) => sum + r, 0) / 7;
    const monthlyAverage = revenues.reduce((sum, r) => sum + r, 0) / revenues.length;
    
    // Calculate growth rate
    const firstWeek = revenues.slice(0, 7).reduce((sum, r) => sum + r, 0) / 7;
    const lastWeek = revenues.slice(-7).reduce((sum, r) => sum + r, 0) / 7;
    const growthRate = firstWeek > 0 ? ((lastWeek - firstWeek) / firstWeek) * 100 : 0;
    
    return {
      weeklyAverage,
      monthlyAverage,
      growthRate,
      trend: growthRate > 5 ? 'increasing' : growthRate < -5 ? 'decreasing' : 'stable'
    };
  }

  generateRevenueForecasts(trends) {
    const forecasts = [];
    
    // Weekly forecast
    const weeklyForecast = trends.weeklyAverage * 7;
    forecasts.push({
      title: 'Weekly Revenue Forecast',
      description: `Expected weekly revenue: ₹${weeklyForecast.toFixed(2)} (based on recent trend: ${trends.trend})`,
      priority: 'medium',
      data: {
        forecast: weeklyForecast,
        trend: trends.trend,
        growthRate: trends.growthRate,
        period: 'weekly'
      }
    });
    
    // Monthly forecast
    const monthlyForecast = trends.weeklyAverage * 30;
    forecasts.push({
      title: 'Monthly Revenue Forecast',
      description: `Expected monthly revenue: ₹${monthlyForecast.toFixed(2)}`,
      priority: 'medium',
      data: {
        forecast: monthlyForecast,
        trend: trends.trend,
        growthRate: trends.growthRate,
        period: 'monthly'
      }
    });
    
    // Growth trend insight
    if (trends.growthRate > 10) {
      forecasts.push({
        title: 'Strong Growth Trend',
        description: `Revenue is growing at ${trends.growthRate.toFixed(1)}% rate. Consider scaling operations.`,
        priority: 'high',
        data: {
          growthRate: trends.growthRate,
          trend: trends.trend,
          recommendation: 'scale_up'
        }
      });
    } else if (trends.growthRate < -10) {
      forecasts.push({
        title: 'Revenue Decline Alert',
        description: `Revenue is declining at ${Math.abs(trends.growthRate).toFixed(1)}% rate. Immediate action required.`,
        priority: 'critical',
        data: {
          growthRate: trends.growthRate,
          trend: trends.trend,
          recommendation: 'urgent_review'
        }
      });
    }
    
    return forecasts;
  }

  async suggestCostCutting() {
    try {
      await this.log('Analyzing cost optimization opportunities...', 'info');
      
      const analysisPeriod = this.config.analysisPeriod;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - analysisPeriod);
      
      // Get expense data
      const purchaseData = await this.purchasesCollection.find({
        createdAt: { $gte: startDate }
      }).toArray();
      
      const expenseAnalysis = await this.analyzeExpenses(purchaseData);
      const suggestions = await this.generateCostCuttingSuggestions(expenseAnalysis);
      
      for (const suggestion of suggestions) {
        await this.createInsight(
          suggestion.title,
          suggestion.description,
          'cost_optimization',
          suggestion.priority,
          suggestion.data
        );
      }
      
      await this.log(`Cost cutting analysis completed. Generated ${suggestions.length} suggestions`, 'info');
      
    } catch (error) {
      await this.log(`Cost cutting analysis failed: ${error.message}`, 'error');
    }
  }

  async analyzeExpenses(purchaseData) {
    const expenseCategories = {};
    let totalExpenses = 0;
    
    purchaseData.forEach(purchase => {
      const category = purchase.category || 'General';
      const amount = purchase.totalAmount || 0;
      
      if (!expenseCategories[category]) {
        expenseCategories[category] = {
          total: 0,
          count: 0,
          average: 0
        };
      }
      
      expenseCategories[category].total += amount;
      expenseCategories[category].count += 1;
      totalExpenses += amount;
    });
    
    // Calculate averages
    Object.keys(expenseCategories).forEach(category => {
      expenseCategories[category].average = 
        expenseCategories[category].total / expenseCategories[category].count;
      expenseCategories[category].percentage = 
        (expenseCategories[category].total / totalExpenses) * 100;
    });
    
    return {
      categories: expenseCategories,
      total: totalExpenses,
      period: this.config.analysisPeriod
    };
  }

  async generateCostCuttingSuggestions(expenseAnalysis) {
    const suggestions = [];
    const categories = expenseAnalysis.categories;
    
    // Find high-expense categories
    Object.entries(categories).forEach(([category, data]) => {
      if (data.percentage > this.config.expenseAlertThreshold * 100) {
        suggestions.push({
          title: `High Expense Category: ${category}`,
          description: `${category} represents ${data.percentage.toFixed(1)}% of total expenses (₹${data.total.toFixed(2)}). Consider negotiating better rates or finding alternative suppliers.`,
          priority: 'high',
          data: {
            category,
            amount: data.total,
            percentage: data.percentage,
            count: data.count,
            average: data.average
          }
        });
      }
    });
    
    // Suggest bulk purchasing for frequently purchased items
    const frequentPurchases = Object.entries(categories)
      .filter(([, data]) => data.count > 5)
      .sort(([, a], [, b]) => b.count - a.count);
    
    if (frequentPurchases.length > 0) {
      const [category, data] = frequentPurchases[0];
      suggestions.push({
        title: `Bulk Purchase Opportunity: ${category}`,
        description: `${category} was purchased ${data.count} times. Consider bulk purchasing to reduce per-unit costs.`,
        priority: 'medium',
        data: {
          category,
          frequency: data.count,
          totalAmount: data.total,
          averageAmount: data.average
        }
      });
    }
    
    // Suggest inventory optimization
    const inventoryValue = await this.calculateInventoryValue();
    if (inventoryValue.total > expenseAnalysis.total * 0.5) {
      suggestions.push({
        title: 'Inventory Optimization',
        description: `Inventory value (₹${inventoryValue.total.toFixed(2)}) is high compared to expenses. Consider reducing slow-moving inventory.`,
        priority: 'medium',
        data: {
          inventoryValue: inventoryValue.total,
          expenseRatio: (inventoryValue.total / expenseAnalysis.total) * 100
        }
      });
    }
    
    return suggestions;
  }

  async calculateInventoryValue() {
    try {
      const mobiles = await this.mobilesCollection.find({}).toArray();
      const accessories = await this.accessoriesCollection.find({}).toArray();
      
      const mobileValue = mobiles.reduce((sum, item) => 
        sum + ((item.remainingStock || 0) * (item.purchasePrice || 0)), 0);
      
      const accessoryValue = accessories.reduce((sum, item) => 
        sum + ((item.remainingStock || 0) * (item.purchasePrice || 0)), 0);
      
      return {
        total: mobileValue + accessoryValue,
        mobile: mobileValue,
        accessory: accessoryValue
      };
    } catch (error) {
      await this.log(`Inventory value calculation failed: ${error.message}`, 'error');
      return { total: 0, mobile: 0, accessory: 0 };
    }
  }

  async generateDailySummary() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Today's financial summary
      const todaySales = await this.salesCollection.find({
        createdAt: { $gte: today, $lt: tomorrow }
      }).toArray();

      const todayServices = await this.serviceInvoicesCollection.find({
        createdAt: { $gte: today, $lt: tomorrow }
      }).toArray();

      const todayRevenue = todaySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0) +
                          todayServices.reduce((sum, service) => sum + (service.amount || 0), 0);

      // Calculate profit margin for today
      const todayCOGS = await this.calculateCOGS(todaySales);
      const todayProfit = todayRevenue - todayCOGS;
      const todayMargin = todayRevenue > 0 ? (todayProfit / todayRevenue) * 100 : 0;

      await this.createInsight(
        'Daily Financial Summary',
        `Revenue: ₹${todayRevenue.toFixed(2)}, Profit: ₹${todayProfit.toFixed(2)} (${todayMargin.toFixed(1)}% margin)`,
        'summary',
        'medium',
        {
          revenue: todayRevenue,
          profit: todayProfit,
          margin: todayMargin,
          salesCount: todaySales.length,
          serviceCount: todayServices.length,
          date: today.toDateString()
        }
      );

      await this.log(`Daily financial summary generated`, 'info');
      
    } catch (error) {
      await this.log(`Daily summary failed: ${error.message}`, 'error');
    }
  }

  async getFinancialHealthScore() {
    try {
      const analysisPeriod = 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - analysisPeriod);
      
      const salesData = await this.salesCollection.find({
        createdAt: { $gte: startDate }
      }).toArray();
      
      const purchaseData = await this.purchasesCollection.find({
        createdAt: { $gte: startDate }
      }).toArray();
      
      const profitLoss = await this.calculateProfitLoss(salesData, purchaseData, []);
      
      // Calculate health score (0-100)
      let score = 50; // Base score
      
      // Profit margin factor
      if (profitLoss.profit.margin > 20) score += 20;
      else if (profitLoss.profit.margin > 10) score += 10;
      else if (profitLoss.profit.margin < 5) score -= 20;
      
      // Revenue growth factor
      const trends = this.calculateRevenueTrends(await this.getHistoricalRevenueData());
      if (trends.growthRate > 10) score += 15;
      else if (trends.growthRate > 0) score += 5;
      else if (trends.growthRate < -10) score -= 15;
      
      // Cost control factor
      const costRatio = profitLoss.costs.total / Math.max(profitLoss.revenue.total, 1);
      if (costRatio < 0.6) score += 15;
      else if (costRatio < 0.8) score += 5;
      else if (costRatio > 0.9) score -= 15;
      
      return {
        score: Math.max(0, Math.min(100, score)),
        factors: {
          profitMargin: profitLoss.profit.margin,
          revenueGrowth: trends.growthRate,
          costRatio: costRatio * 100
        },
        period: analysisPeriod
      };
      
    } catch (error) {
      await this.log(`Financial health score calculation failed: ${error.message}`, 'error');
      return { score: 0, factors: {}, period: 0 };
    }
  }
}

module.exports = FinanceAgent;
