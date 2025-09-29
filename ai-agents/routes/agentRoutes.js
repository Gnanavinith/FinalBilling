const express = require('express');
const router = express.Router();
const AgentLog = require('../models/AgentLog');
const AgentInsight = require('../models/AgentInsight');

// Get all agent insights
router.get('/insights', async (req, res) => {
  try {
    const { agentType, type, priority, isRead, limit = 50, page = 1 } = req.query;
    
    const filter = {};
    if (agentType) filter.agentType = agentType;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    
    const skip = (page - 1) * limit;
    
    const insights = await AgentInsight.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await AgentInsight.countDocuments(filter);
    
    res.json({
      insights,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get insights by agent type
router.get('/insights/:agentType', async (req, res) => {
  try {
    const { agentType } = req.params;
    const { limit = 20 } = req.query;
    
    const insights = await AgentInsight.find({ agentType })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean();
    
    res.json({ insights });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark insight as read
router.patch('/insights/:id/read', async (req, res) => {
  try {
    const insight = await AgentInsight.findById(req.params.id);
    if (!insight) {
      return res.status(404).json({ error: 'Insight not found' });
    }
    
    await insight.markAsRead();
    res.json({ message: 'Insight marked as read', insight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark insight as resolved
router.patch('/insights/:id/resolve', async (req, res) => {
  try {
    const { resolvedBy = 'user' } = req.body;
    const insight = await AgentInsight.findById(req.params.id);
    if (!insight) {
      return res.status(404).json({ error: 'Insight not found' });
    }
    
    await insight.markAsResolved(resolvedBy);
    res.json({ message: 'Insight marked as resolved', insight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent logs
router.get('/logs', async (req, res) => {
  try {
    const { agentType, level, limit = 100, page = 1 } = req.query;
    
    const filter = {};
    if (agentType) filter.agentType = agentType;
    if (level) filter.level = level;
    
    const skip = (page - 1) * limit;
    
    const logs = await AgentLog.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await AgentLog.countDocuments(filter);
    
    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent statistics
router.get('/stats', async (req, res) => {
  try {
    const { period = 7 } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    // Get insights statistics
    const insightsStats = await AgentInsight.aggregate([
      {
        $match: { timestamp: { $gte: startDate } }
      },
      {
        $group: {
          _id: {
            agentType: '$agentType',
            priority: '$priority'
          },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get logs statistics
    const logsStats = await AgentLog.aggregate([
      {
        $match: { timestamp: { $gte: startDate } }
      },
      {
        $group: {
          _id: {
            agentType: '$agentType',
            level: '$level'
          },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get unread insights count
    const unreadCount = await AgentInsight.countDocuments({ isRead: false });
    
    // Get unresolved insights count
    const unresolvedCount = await AgentInsight.countDocuments({ isResolved: false });
    
    res.json({
      period: `${period} days`,
      insights: insightsStats,
      logs: logsStats,
      summary: {
        unreadInsights: unreadCount,
        unresolvedInsights: unresolvedCount
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent health status
router.get('/health', async (req, res) => {
  try {
    const agents = ['sales', 'inventory', 'billing', 'customer', 'finance'];
    const healthStatus = {};
    
    for (const agentType of agents) {
      // Get recent activity (last 24 hours)
      const recentActivity = await AgentLog.countDocuments({
        agentType,
        timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });
      
      // Get recent errors
      const recentErrors = await AgentLog.countDocuments({
        agentType,
        level: 'error',
        timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });
      
      // Determine health status
      let status = 'healthy';
      if (recentErrors > 5) status = 'critical';
      else if (recentErrors > 0) status = 'warning';
      else if (recentActivity === 0) status = 'inactive';
      
      healthStatus[agentType] = {
        status,
        recentActivity,
        recentErrors,
        lastActivity: recentActivity > 0 ? 'active' : 'inactive'
      };
    }
    
    res.json({ agents: healthStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customer chatbot endpoint
router.post('/chatbot', async (req, res) => {
  try {
    const { query, customerId, sessionId } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // Get customer agent from app context
    const customerAgent = req.app.locals.customerAgent;
    if (!customerAgent) {
      return res.status(500).json({ error: 'Customer agent not available' });
    }
    
    const response = await customerAgent.processCustomerQuery(query, customerId, sessionId);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trigger manual agent execution
router.post('/trigger/:agentType', async (req, res) => {
  try {
    const { agentType } = req.params;
    const { action } = req.body;
    
    const agents = req.app.locals.agents;
    if (!agents || !agents[agentType]) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const agent = agents[agentType];
    let result;
    
    switch (action) {
      case 'analyze':
        if (agentType === 'sales') {
          result = await agent.analyzeSalesPatterns();
        } else if (agentType === 'inventory') {
          result = await agent.checkStockLevels();
        } else if (agentType === 'billing') {
          result = await agent.checkPendingPayments();
        } else if (agentType === 'finance') {
          result = await agent.analyzeProfitLoss();
        }
        break;
      case 'predict':
        if (agentType === 'sales') {
          result = await agent.predictDemand();
        } else if (agentType === 'finance') {
          result = await agent.forecastRevenue();
        }
        break;
      case 'suggest':
        if (agentType === 'sales') {
          result = await agent.suggestPromotions();
        } else if (agentType === 'inventory') {
          result = await agent.suggestReorder();
        } else if (agentType === 'finance') {
          result = await agent.suggestCostCutting();
        }
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    res.json({ 
      message: `${agentType} agent ${action} completed successfully`,
      result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
