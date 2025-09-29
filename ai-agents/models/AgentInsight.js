const mongoose = require('mongoose');

const agentInsightSchema = new mongoose.Schema({
  agentType: {
    type: String,
    required: true,
    enum: ['sales', 'inventory', 'billing', 'customer', 'finance']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'pattern', 'prediction', 'promotion', 'low_stock', 'high_stock', 'out_of_stock',
      'reorder', 'overstock', 'payment_reminder', 'fraud_alert', 'pattern_alert',
      'invoice_generated', 'customer_interaction', 'profit_alert', 'revenue_analysis',
      'cost_alert', 'revenue_forecast', 'cost_optimization', 'summary'
    ]
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  resolvedBy: {
    type: String,
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
agentInsightSchema.index({ agentType: 1, timestamp: -1 });
agentInsightSchema.index({ type: 1, timestamp: -1 });
agentInsightSchema.index({ priority: 1, timestamp: -1 });
agentInsightSchema.index({ isRead: 1, timestamp: -1 });
agentInsightSchema.index({ isResolved: 1, timestamp: -1 });
agentInsightSchema.index({ timestamp: -1 });

// Virtual for formatted timestamp
agentInsightSchema.virtual('formattedTimestamp').get(function() {
  return this.timestamp.toLocaleString();
});

// Method to mark as read
agentInsightSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

// Method to mark as resolved
agentInsightSchema.methods.markAsResolved = function(resolvedBy = 'system') {
  this.isResolved = true;
  this.resolvedAt = new Date();
  this.resolvedBy = resolvedBy;
  return this.save();
};

module.exports = mongoose.model('AgentInsight', agentInsightSchema);
