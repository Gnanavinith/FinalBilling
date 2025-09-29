const mongoose = require('mongoose');

const agentLogSchema = new mongoose.Schema({
  agentType: {
    type: String,
    required: true,
    enum: ['sales', 'inventory', 'billing', 'customer', 'finance']
  },
  message: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['info', 'warn', 'error', 'debug']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
agentLogSchema.index({ agentType: 1, timestamp: -1 });
agentLogSchema.index({ level: 1, timestamp: -1 });
agentLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AgentLog', agentLogSchema);
