const BaseAgent = require('./BaseAgent');
const mongoose = require('mongoose');

class SalesAgent extends BaseAgent {
  constructor(io) {
    super('sales', io);
    this.salesCollection = mongoose.connection.db.collection('sales');
    this.mobilesCollection = mongoose.connection.db.collection('mobiles');
  }

  async analyzeSalesPatterns() {
    try {
      await this.log('Starting sales pattern analysis...', 'info');
      
      // Get sales data from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const salesData = await this.salesCollection.find({
        $or: [
          { createdAt: { $gte: thirtyDaysAgo } },
          { saleDate: { $gte: thirtyDaysAgo } }
        ]
      }).toArray();

      if (salesData.length === 0) {
        await this.log('No sales data found for analysis', 'warn');
        return;
      }

      // Analyze patterns
      const patterns = await this.identifyPatterns(salesData);
      
      // Generate insights
      for (const pattern of patterns) {
        await this.createInsight(
          pattern.title,
          pattern.description,
          'pattern',
          pattern.priority,
          pattern.data
        );
      }

      // Generate actionable recommendations that explain how to increase sales
      await this.generateSalesRecommendations(patterns);

      await this.log(`Sales pattern analysis completed. Found ${patterns.length} patterns`, 'info');
      
    } catch (error) {
      await this.log(`Sales pattern analysis failed: ${error.message}`, 'error');
    }
  }

  async identifyPatterns(salesData) {
    const patterns = [];
    
    // Group by product
    const productSales = {};
    const dailySales = {};
    const hourlySales = {};

    salesData.forEach(sale => {
      const firstItem = sale.items?.[0] || {};
      const productName = firstItem.productName || firstItem.name || 'Unknown';
      const ts = sale.createdAt || sale.saleDate || new Date();
      const date = new Date(ts).toDateString();
      const hour = new Date(ts).getHours();

      // Product sales
      if (!productSales[productName]) {
        productSales[productName] = { count: 0, revenue: 0 };
      }
      productSales[productName].count++;
      productSales[productName].revenue += (sale.totalAmount || sale.grandTotal || sale.subTotal || 0);

      // Daily sales
      if (!dailySales[date]) {
        dailySales[date] = { count: 0, revenue: 0 };
      }
      dailySales[date].count++;
      dailySales[date].revenue += (sale.totalAmount || sale.grandTotal || sale.subTotal || 0);

      // Hourly sales
      if (!hourlySales[hour]) {
        hourlySales[hour] = { count: 0, revenue: 0 };
      }
      hourlySales[hour].count++;
      hourlySales[hour].revenue += (sale.totalAmount || sale.grandTotal || sale.subTotal || 0);
    });

    // Top selling products
    const topProducts = Object.entries(productSales)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 5);

    if (topProducts.length > 0) {
      patterns.push({
        title: 'Top Selling Products',
        description: `Top 5 products: ${topProducts.map(([name, data]) => `${name} (${data.count} sales)`).join(', ')}`,
        priority: 'high',
        data: { topProducts }
      });
    }

    // Peak hours analysis
    const peakHours = Object.entries(hourlySales)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 3);

    if (peakHours.length > 0) {
      patterns.push({
        title: 'Peak Sales Hours',
        description: `Busiest hours: ${peakHours.map(([hour, data]) => `${hour}:00 (${data.count} sales)`).join(', ')}`,
        priority: 'medium',
        data: { peakHours }
      });
    }

    // Sales trend analysis
    const dailyTrend = this.calculateTrend(dailySales);
    if (dailyTrend.direction !== 'stable') {
      patterns.push({
        title: 'Sales Trend',
        description: `Sales are ${dailyTrend.direction} by ${dailyTrend.percentage}% over the last 30 days`,
        priority: dailyTrend.direction === 'declining' ? 'high' : 'medium',
        data: { trend: dailyTrend }
      });
    }

    return patterns;
  }

  calculateTrend(dailySales) {
    const dates = Object.keys(dailySales).sort();
    if (dates.length < 7) return { direction: 'stable', percentage: 0 };

    const firstWeek = dates.slice(0, 7);
    const lastWeek = dates.slice(-7);

    const firstWeekAvg = firstWeek.reduce((sum, date) => sum + dailySales[date].revenue, 0) / 7;
    const lastWeekAvg = lastWeek.reduce((sum, date) => sum + dailySales[date].revenue, 0) / 7;

    const percentage = ((lastWeekAvg - firstWeekAvg) / firstWeekAvg) * 100;
    
    if (percentage > 10) return { direction: 'increasing', percentage: Math.round(percentage) };
    if (percentage < -10) return { direction: 'declining', percentage: Math.round(Math.abs(percentage)) };
    return { direction: 'stable', percentage: Math.round(Math.abs(percentage)) };
  }

  async predictDemand() {
    try {
      await this.log('Starting demand prediction...', 'info');
      
      const salesData = await this.salesCollection.find({}).sort({ createdAt: -1 }).limit(100).toArray();
      
      if (salesData.length < 10) {
        await this.log('Insufficient data for demand prediction', 'warn');
        return;
      }

      // Simple demand prediction based on recent trends
      const predictions = await this.generateDemandPredictions(salesData);
      
      for (const prediction of predictions) {
        await this.createInsight(
          prediction.title,
          prediction.description,
          'prediction',
          prediction.priority,
          prediction.data
        );
      }

      await this.log(`Demand prediction completed. Generated ${predictions.length} predictions`, 'info');
      
    } catch (error) {
      await this.log(`Demand prediction failed: ${error.message}`, 'error');
    }
  }

  async generateDemandPredictions(salesData) {
    const predictions = [];
    
    // Group by product and calculate weekly averages
    const productWeeklySales = {};
    
    salesData.forEach(sale => {
      const productName = sale.items?.[0]?.productName || 'Unknown';
      const week = this.getWeekNumber(sale.createdAt);
      
      if (!productWeeklySales[productName]) {
        productWeeklySales[productName] = {};
      }
      
      if (!productWeeklySales[productName][week]) {
        productWeeklySales[productName][week] = 0;
      }
      
      productWeeklySales[productName][week]++;
    });

    // Predict demand for each product
    Object.entries(productWeeklySales).forEach(([product, weeklyData]) => {
      const weeks = Object.keys(weeklyData).sort();
      if (weeks.length < 2) return;

      const recentWeeks = weeks.slice(-2);
      const recentAvg = recentWeeks.reduce((sum, week) => sum + weeklyData[week], 0) / recentWeeks.length;
      
      const predictedDemand = Math.round(recentAvg * 1.1); // 10% growth assumption
      
      if (predictedDemand > 5) {
        predictions.push({
          title: `Demand Prediction: ${product}`,
          description: `Expected demand: ${predictedDemand} units per week. Current trend: ${recentAvg.toFixed(1)} units/week`,
          priority: predictedDemand > 10 ? 'high' : 'medium',
          data: { product, predictedDemand, currentTrend: recentAvg }
        });
      }
    });

    return predictions;
  }

  getWeekNumber(date) {
    const d = new Date(date);
    const dayNum = d.getDay() || 7;
    d.setDate(d.getDate() + 4 - dayNum);
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  async suggestPromotions() {
    try {
      await this.log('Generating promotion suggestions...', 'info');
      
      // Get low-performing products
      const salesData = await this.salesCollection.find({}).sort({ createdAt: -1 }).limit(200).toArray();
      const productPerformance = this.analyzeProductPerformance(salesData);
      
      const suggestions = [];
      
      // Suggest promotions for low-performing products
      productPerformance.lowPerforming.forEach(product => {
        suggestions.push({
          title: `Promotion Suggestion: ${product.name}`,
          description: `Consider 10-15% discount on ${product.name}. Only ${product.sales} sales in last 30 days.`,
          priority: 'medium',
          data: { product, suggestedDiscount: '10-15%' }
        });
      });

      // Suggest bundle deals for complementary products
      if (productPerformance.topPerforming.length > 1) {
        suggestions.push({
          title: 'Bundle Deal Suggestion',
          description: `Create bundle deals with top products: ${productPerformance.topPerforming.slice(0, 3).map(p => p.name).join(', ')}`,
          priority: 'high',
          data: { products: productPerformance.topPerforming.slice(0, 3) }
        });
      }

      for (const suggestion of suggestions) {
        await this.createInsight(
          suggestion.title,
          suggestion.description,
          'promotion',
          suggestion.priority,
          suggestion.data
        );
      }

      await this.log(`Generated ${suggestions.length} promotion suggestions`, 'info');
      
    } catch (error) {
      await this.log(`Promotion suggestion failed: ${error.message}`, 'error');
    }
  }

  async generateSalesRecommendations(patterns) {
    // Craft an explanatory narrative and concrete actions from detected patterns
    const sections = [];
    const actions = [];

    const topProducts = patterns.find(p => p.title === 'Top Selling Products')?.data?.topProducts || [];
    const peakHours = patterns.find(p => p.title === 'Peak Sales Hours')?.data?.peakHours || [];
    const trend = patterns.find(p => p.title === 'Sales Trend')?.data?.trend;

    if (topProducts.length > 0) {
      sections.push(`Focus products: ${topProducts.map(([name, data]) => `${name} (${data.count} sales)`).join(', ')}`);
      actions.push(
        'Increase stock and visibility of top products on homepage and store banners',
        'Create bundles that pair a top product with a lower-performing accessory',
        'Negotiate better purchase pricing for top movers to widen margins'
      );
    }

    if (peakHours.length > 0) {
      sections.push(`Peak hours: ${peakHours.map(([hour, data]) => `${hour}:00 (${data.count} sales)`).join(', ')}`);
      actions.push(
        'Schedule flash deals and push notifications during peak hours',
        'Staff more sales reps during peak to reduce wait time and cart abandonment'
      );
    }

    if (trend) {
      sections.push(`Trend: ${trend.direction} by ${trend.percentage}% over the last 30 days`);
      if (trend.direction === 'declining') {
        actions.push(
          'Run time-bound promotions on slipping categories to recover momentum',
          'Re-check pricing vs competitors; adjust if price gap > 5%',
          'Review top traffic sources and fix drop-offs in checkout funnel'
        );
      } else if (trend.direction === 'increasing') {
        actions.push(
          'Safeguard inventory for fast movers to avoid stockouts',
          'Test small price increases (1-2%) where demand is inelastic'
        );
      }
    }

    const description = [
      'How to increase sales based on current patterns:',
      sections.length ? `Patterns observed: ${sections.join(' | ')}` : 'No strong patterns detected due to limited data.',
      actions.length ? `Recommended actions: ${actions.map(a => `• ${a}`).join(' ')}` : 'Add more data to unlock targeted recommendations.'
    ].join(' \n');

    await this.createInsight(
      'Sales Growth Recommendations',
      description,
      'recommendation',
      trend?.direction === 'declining' ? 'high' : 'medium',
      { sections, actions, topProducts, peakHours, trend }
    );
  }

  analyzeProductPerformance(salesData) {
    const productSales = {};
    
    salesData.forEach(sale => {
      const productName = sale.items?.[0]?.productName || 'Unknown';
      if (!productSales[productName]) {
        productSales[productName] = 0;
      }
      productSales[productName]++;
    });

    const products = Object.entries(productSales).map(([name, sales]) => ({ name, sales }));
    const sortedProducts = products.sort((a, b) => b.sales - a.sales);
    
    const topCount = Math.ceil(sortedProducts.length * 0.2);
    const bottomCount = Math.ceil(sortedProducts.length * 0.2);
    
    return {
      topPerforming: sortedProducts.slice(0, topCount),
      lowPerforming: sortedProducts.slice(-bottomCount).filter(p => p.sales < 5)
    };
  }

  async generateDailySummary() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todaySales = await this.salesCollection.find({
        createdAt: { $gte: today, $lt: tomorrow }
      }).toArray();

      const totalRevenue = todaySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
      const totalSales = todaySales.length;

      await this.createInsight(
        'Daily Sales Summary',
        `Today: ${totalSales} sales, ₹${totalRevenue.toFixed(2)} revenue`,
        'summary',
        'medium',
        { totalSales, totalRevenue, date: today.toDateString() }
      );

      await this.log(`Daily summary generated: ${totalSales} sales, ₹${totalRevenue.toFixed(2)}`, 'info');
      
    } catch (error) {
      await this.log(`Daily summary failed: ${error.message}`, 'error');
    }
  }
}

module.exports = SalesAgent;
