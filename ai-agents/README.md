# 🤖 AI Agents for Billing System

Intelligent AI agents that actively monitor, analyze, and suggest actions for your mobile phone billing system using free/open-source AI technologies.

## 🚀 Features

### 🛒 Sales Agent
- **Pattern Analysis**: Identifies sales trends and peak hours
- **Demand Prediction**: Forecasts future product demand
- **Promotion Suggestions**: Recommends discounts and bundle deals
- **Daily Summaries**: Provides sales performance insights

### 📦 Inventory Agent
- **Stock Monitoring**: Real-time stock level tracking
- **Auto-Reorder Suggestions**: Calculates optimal reorder quantities
- **Overstock Detection**: Identifies slow-moving inventory
- **Cost Optimization**: Suggests inventory management improvements

### 💳 Billing Agent
- **Invoice Automation**: Auto-generates PDF invoices
- **Fraud Detection**: Identifies suspicious transactions
- **Payment Reminders**: Tracks overdue payments
- **Error Detection**: Catches billing discrepancies

### 🤖 Customer Agent (Chatbot)
- **24/7 Support**: Answers customer queries instantly
- **Product Recommendations**: Suggests products based on needs
- **FAQ Handling**: Responds to common questions
- **Order Status**: Provides order and payment information

### 💰 Finance Agent
- **P&L Analysis**: Tracks profit and loss metrics
- **Revenue Forecasting**: Predicts future revenue trends
- **Cost Optimization**: Suggests cost-cutting measures
- **Financial Health**: Provides business health scores

## 🛠️ Technology Stack

- **Backend**: Node.js + Express
- **AI**: Google Gemini API (Free tier)
- **Database**: MongoDB
- **Real-time**: Socket.IO
- **PDF Generation**: PDFKit
- **Scheduling**: Node-cron
- **Frontend**: React + Tailwind CSS

## 📋 Prerequisites

- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Google Gemini API key (free)
- Your existing billing system database

## 🚀 Installation

### 1. Clone and Setup

```bash
# Navigate to your project directory
cd /path/to/your/billing/project

# Create AI agents directory
mkdir ai-agents
cd ai-agents

# Copy the AI agents files to this directory
# (All the files from this implementation)
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp config.env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/billing_ai_agents
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/billing_ai_agents

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Server Configuration
PORT=3001
NODE_ENV=development

# Agent Configuration
AGENT_UPDATE_INTERVAL=300000
LOW_STOCK_THRESHOLD=5
HIGH_STOCK_THRESHOLD=50
PAYMENT_REMINDER_DAYS=7
FRAUD_DETECTION_THRESHOLD=10000
```

### 4. Get Gemini API Key (Free)

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file

### 5. Database Setup

The agents will automatically connect to your existing MongoDB database and create the necessary collections:
- `agentlogs` - Agent activity logs
- `agentinsights` - AI-generated insights and recommendations

### 6. Start the AI Agents Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## 🎯 Frontend Integration

### 1. Add AI Agents Dashboard

Add the AI Agents Dashboard to your React app:

```jsx
// In your main App.jsx or routing component
import AIAgentsDashboard from './components/ai-agents/AIAgentsDashboard';

// Add route
<Route path="/ai-agents" element={<AIAgentsDashboard />} />
```

### 2. Add Customer Chatbot

Add the chatbot to your main layout:

```jsx
// In your main layout component
import CustomerChatbot from './components/ai-agents/CustomerChatbot';

// Add to your layout
<CustomerChatbot />
```

### 3. Update Navigation

Add AI Agents to your sidebar navigation:

```jsx
// In your Sidebar component
{
  name: 'AI Agents',
  href: '/ai-agents',
  icon: FiBrain,
  current: location.pathname === '/ai-agents'
}
```

## 🔧 Configuration

### Agent Scheduling

The agents run on automatic schedules:

- **Sales Agent**: Every hour (pattern analysis, demand prediction)
- **Inventory Agent**: Every 30 minutes (stock monitoring)
- **Billing Agent**: Every 15 minutes (payment checks, fraud detection)
- **Finance Agent**: Every 2 hours (P&L analysis, forecasting)
- **Daily Summary**: Every day at 9 AM

### Customization

You can customize agent behavior by modifying:

1. **Thresholds** in `.env` file
2. **Schedules** in `server.js`
3. **Analysis logic** in individual agent files
4. **UI components** in the frontend

## 📊 API Endpoints

### Agent Management
- `GET /api/agents/health` - Agent health status
- `GET /api/agents/insights` - Get AI insights
- `GET /api/agents/stats` - Agent statistics
- `POST /api/agents/trigger/:agentType` - Manual agent trigger

### Customer Chatbot
- `POST /api/agents/chatbot` - Process customer queries

### Webhooks
- `POST /api/webhooks/database-change` - Database change notifications
- `POST /api/webhooks/external/:system` - External system notifications

## 🔄 Database Integration

The agents automatically monitor your existing collections:

- `sales` - Sales transactions
- `mobiles` - Mobile phone inventory
- `accessories` - Accessory inventory
- `purchases` - Purchase records
- `serviceinvoices` - Service invoices
- `customers` - Customer data

## 📈 Monitoring and Alerts

### Real-time Notifications
- WebSocket connections for live updates
- Email notifications for critical alerts
- SMS notifications (with Twilio integration)

### Dashboard Features
- Agent health monitoring
- Insight management
- Performance statistics
- Manual trigger controls

## 🚨 Troubleshooting

### Common Issues

1. **Gemini API Errors**
   - Check API key validity
   - Verify API quota limits
   - Check network connectivity

2. **Database Connection Issues**
   - Verify MongoDB URI
   - Check database permissions
   - Ensure collections exist

3. **Agent Not Running**
   - Check server logs
   - Verify environment variables
   - Restart the server

### Logs and Debugging

```bash
# View agent logs
tail -f logs/agent.log

# Check specific agent status
curl http://localhost:3001/api/agents/health

# Manual agent trigger
curl -X POST http://localhost:3001/api/agents/trigger/sales -H "Content-Type: application/json" -d '{"action": "analyze"}'
```

## 🔒 Security Considerations

- API keys are stored in environment variables
- Database connections use authentication
- WebSocket connections are secured
- Input validation on all endpoints

## 📚 Advanced Features

### Custom AI Prompts
Modify agent behavior by editing prompts in individual agent files.

### Integration with External Systems
- Payment gateways
- Supplier APIs
- Email services
- SMS services

### Machine Learning Enhancements
- Historical data analysis
- Predictive modeling
- Anomaly detection
- Recommendation engines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use and modify for your business needs.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review server logs
3. Check agent health status
4. Verify database connectivity

---

**🎉 Congratulations!** You now have a fully functional AI-powered billing system with intelligent agents that work 24/7 to optimize your business operations.
