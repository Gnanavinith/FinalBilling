const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cron = require('node-cron');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import AI Agents
const SalesAgent = require('./agents/SalesAgent');
const InventoryAgent = require('./agents/InventoryAgent');
const BillingAgent = require('./agents/BillingAgent');
const CustomerAgent = require('./agents/CustomerAgent');
const FinanceAgent = require('./agents/FinanceAgent');

// Import routes
const agentRoutes = require('./routes/agentRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

// Import models
const AgentLog = require('./models/AgentLog');
const AgentInsight = require('./models/AgentInsight');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/billing_ai_agents', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('🤖 AI Agents Database Connected');
});

mongoose.connection.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Initialize AI Agents AFTER DB connects
let salesAgent;
let inventoryAgent;
let billingAgent;
let customerAgent;
let financeAgent;

mongoose.connection.once('open', async () => {
  salesAgent = new SalesAgent(io);
  inventoryAgent = new InventoryAgent(io);
  billingAgent = new BillingAgent(io);
  customerAgent = new CustomerAgent(io);
  financeAgent = new FinanceAgent(io);

  // Expose agents for routes/webhooks
  app.locals.agents = {
    sales: salesAgent,
    inventory: inventoryAgent,
    billing: billingAgent,
    customer: customerAgent,
    finance: financeAgent,
  };
  app.locals.customerAgent = customerAgent;

  console.log('🤖 AI Agents initialized');
});

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/webhooks', webhookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    agents: {
      sales: salesAgent ? 'healthy' : 'inactive',
      inventory: inventoryAgent ? 'healthy' : 'inactive',
      billing: billingAgent ? 'healthy' : 'inactive',
      customer: customerAgent ? 'healthy' : 'inactive',
      finance: financeAgent ? 'healthy' : 'inactive'
    }
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 Client connected to AI Agents:', socket.id);
  
  socket.on('subscribe-agent', (agentType) => {
    socket.join(`agent-${agentType}`);
    console.log(`📡 Client subscribed to ${agentType} agent updates`);
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Scheduled Tasks for AI Agents
// Sales Analysis - Every hour
cron.schedule('0 * * * *', async () => {
  console.log('🛒 Running Sales Agent Analysis...');
  try {
    if (salesAgent) {
      await salesAgent.analyzeSalesPatterns();
      await salesAgent.predictDemand();
      await salesAgent.suggestPromotions();
    }
  } catch (error) {
    console.error('Sales Agent Error:', error);
  }
});

// Inventory Check - Every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('📦 Running Inventory Agent Check...');
  try {
    if (inventoryAgent) {
      await inventoryAgent.checkStockLevels();
      await inventoryAgent.suggestReorder();
      await inventoryAgent.analyzeOverstock();
    }
  } catch (error) {
    console.error('Inventory Agent Error:', error);
  }
});

// Billing Check - Every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  console.log('💳 Running Billing Agent Check...');
  try {
    if (billingAgent) {
      await billingAgent.checkPendingPayments();
      await billingAgent.detectFraud();
      await billingAgent.generateInvoices();
    }
  } catch (error) {
    console.error('Billing Agent Error:', error);
  }
});

// Finance Analysis - Every 2 hours
cron.schedule('0 */2 * * *', async () => {
  console.log('💰 Running Finance Agent Analysis...');
  try {
    if (financeAgent) {
      await financeAgent.analyzeProfitLoss();
      await financeAgent.forecastRevenue();
      await financeAgent.suggestCostCutting();
    }
  } catch (error) {
    console.error('Finance Agent Error:', error);
  }
});

// Daily summary - Every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('📊 Generating Daily AI Summary...');
  try {
    if (salesAgent && inventoryAgent && billingAgent && financeAgent) {
      await Promise.all([
        salesAgent.generateDailySummary(),
        inventoryAgent.generateDailySummary(),
        billingAgent.generateDailySummary(),
        financeAgent.generateDailySummary()
      ]);
    }
  } catch (error) {
    console.error('Daily Summary Error:', error);
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🤖 AI Agents Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log('🚀 AI Agents initialized and ready!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down AI Agents server...');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

module.exports = { app, io };
