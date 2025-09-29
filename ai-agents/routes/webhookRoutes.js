const express = require('express');
const router = express.Router();

// Webhook for database change notifications
router.post('/database-change', async (req, res) => {
  try {
    const { collection, operation, document, documentId } = req.body;
    
    // Get agents from app context
    const agents = req.app.locals.agents;
    if (!agents) {
      return res.status(500).json({ error: 'Agents not available' });
    }
    
    // Trigger relevant agents based on collection and operation
    switch (collection) {
      case 'sales':
        if (operation === 'insert') {
          // New sale - trigger sales and finance agents
          await Promise.all([
            agents.sales.analyzeSalesPatterns(),
            agents.finance.analyzeProfitLoss()
          ]);
        }
        break;
        
      case 'mobiles':
      case 'accessories':
        if (operation === 'update' && document.remainingStock !== undefined) {
          // Stock change - trigger inventory agent
          await agents.inventory.checkStockLevels();
        }
        break;
        
      case 'purchases':
        if (operation === 'insert') {
          // New purchase - trigger inventory and finance agents
          await Promise.all([
            agents.inventory.checkStockLevels(),
            agents.finance.analyzeProfitLoss()
          ]);
        }
        break;
        
      case 'serviceinvoices':
        if (operation === 'insert') {
          // New service invoice - trigger billing and finance agents
          await Promise.all([
            agents.billing.checkPendingPayments(),
            agents.finance.analyzeProfitLoss()
          ]);
        }
        break;
    }
    
    res.json({ 
      message: 'Webhook processed successfully',
      triggered: collection,
      operation 
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook for external system notifications
router.post('/external/:system', async (req, res) => {
  try {
    const { system } = req.params;
    const data = req.body;
    
    const agents = req.app.locals.agents;
    if (!agents) {
      return res.status(500).json({ error: 'Agents not available' });
    }
    
    switch (system) {
      case 'payment-gateway':
        // Payment notification - trigger billing agent
        await agents.billing.checkPendingPayments();
        break;
        
      case 'supplier':
        // Supplier notification - trigger inventory agent
        await agents.inventory.checkStockLevels();
        break;
        
      case 'customer-feedback':
        // Customer feedback - trigger customer agent
        // Could trigger sentiment analysis or response generation
        break;
    }
    
    res.json({ 
      message: `External webhook from ${system} processed successfully`,
      system,
      data: Object.keys(data)
    });
  } catch (error) {
    console.error('External webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook for manual triggers
router.post('/trigger/:agentType/:action', async (req, res) => {
  try {
    const { agentType, action } = req.params;
    const data = req.body;
    
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
        
      case 'generate-summary':
        result = await agent.generateDailySummary();
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    res.json({ 
      message: `${agentType} agent ${action} completed successfully`,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Manual trigger error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check for webhooks
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /webhooks/database-change',
      'POST /webhooks/external/:system',
      'POST /webhooks/trigger/:agentType/:action'
    ]
  });
});

module.exports = router;
