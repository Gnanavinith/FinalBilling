const { GoogleGenerativeAI } = require('@google/generative-ai');
const AgentLog = require('../models/AgentLog');
const AgentInsight = require('../models/AgentInsight');

class BaseAgent {
  constructor(agentType, io) {
    this.agentType = agentType;
    this.io = io;
    this.isActive = false;
    this.lastRun = null;
    this.config = {
      geminiApiKey: process.env.GEMINI_API_KEY,
      updateInterval: parseInt(process.env.AGENT_UPDATE_INTERVAL) || 300000,
      maxRetries: 3,
      timeout: 30000
    };
    
    // Initialize Gemini AI
    if (this.config.geminiApiKey) {
      this.genAI = new GoogleGenerativeAI(this.config.geminiApiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    }
  }

  async log(message, level = 'info', data = null) {
    const logEntry = new AgentLog({
      agentType: this.agentType,
      message,
      level,
      data,
      timestamp: new Date()
    });
    
    await logEntry.save();
    console.log(`[${this.agentType.toUpperCase()}] ${message}`, data ? JSON.stringify(data) : '');
  }

  async createInsight(title, description, type, priority = 'medium', data = null) {
    // Prevent duplicate insights within a short time window (e.g., 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const existing = await AgentInsight.findOne({
      agentType: this.agentType,
      title,
      type,
      priority,
      timestamp: { $gte: fiveMinutesAgo }
    });

    if (existing) {
      await this.log(`Duplicate insight suppressed: ${title}`, 'warn');
      return existing;
    }

    const insight = new AgentInsight({
      agentType: this.agentType,
      title,
      description,
      type,
      priority,
      data,
      timestamp: new Date(),
      isRead: false
    });

    await insight.save();
    
    // Emit to connected clients
    if (this.io) {
      this.io.to(`agent-${this.agentType}`).emit('new-insight', {
        agentType: this.agentType,
        insight: insight.toObject()
      });
    }
    
    return insight;
  }

  async generateAIResponse(prompt, context = {}) {
    if (!this.model) {
      throw new Error('Gemini AI not initialized. Please check GEMINI_API_KEY.');
    }

    try {
      const fullPrompt = this.buildPrompt(prompt, context);
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      await this.log(`AI Generation Error: ${error.message}`, 'error', { prompt, context });
      throw error;
    }
  }

  buildPrompt(prompt, context) {
    const systemPrompt = `You are an AI agent specialized in ${this.agentType} analysis for a mobile phone billing system. 
    Provide actionable insights and recommendations based on the data provided. Be concise and practical.`;
    
    return `${systemPrompt}\n\nContext: ${JSON.stringify(context)}\n\nPrompt: ${prompt}`;
  }

  async executeWithRetry(operation, retries = this.config.maxRetries) {
    for (let i = 0; i < retries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.log(`Retry ${i + 1}/${retries} failed: ${error.message}`, 'warn');
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  async start() {
    this.isActive = true;
    await this.log(`${this.agentType} agent started`, 'info');
    
    if (this.io) {
      this.io.emit('agent-status', {
        agentType: this.agentType,
        status: 'active',
        timestamp: new Date()
      });
    }
  }

  async stop() {
    this.isActive = false;
    await this.log(`${this.agentType} agent stopped`, 'info');
    
    if (this.io) {
      this.io.emit('agent-status', {
        agentType: this.agentType,
        status: 'inactive',
        timestamp: new Date()
      });
    }
  }

  isActive() {
    return this.isActive;
  }

  async getStatus() {
    return {
      agentType: this.agentType,
      isActive: this.isActive,
      lastRun: this.lastRun,
      config: this.config
    };
  }

  async getRecentInsights(limit = 10) {
    return await AgentInsight.find({ agentType: this.agentType })
      .sort({ timestamp: -1 })
      .limit(limit);
  }

  async getRecentLogs(limit = 20) {
    return await AgentLog.find({ agentType: this.agentType })
      .sort({ timestamp: -1 })
      .limit(limit);
  }
}

module.exports = BaseAgent;
