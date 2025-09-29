import React, { useState, useEffect } from 'react';
import { agentsBase } from '../../utils/environment';
import { 
  FiCpu, 
  FiTrendingUp, 
  FiPackage, 
  FiCreditCard, 
  FiUsers, 
  FiDollarSign,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { FaBrain } from 'react-icons/fa';

const AIAgentsDashboard = () => {
  const [agents, setAgents] = useState({});
  const [insights, setInsights] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [showResolved, setShowResolved] = useState(false);

  const agentConfig = {
    sales: {
      name: 'Sales Agent',
      icon: FiTrendingUp,
      color: 'blue',
      description: 'Analyzes sales patterns, predicts demand, and suggests promotions'
    },
    inventory: {
      name: 'Inventory Agent',
      icon: FiPackage,
      color: 'green',
      description: 'Monitors stock levels, suggests reorders, and prevents overstocking'
    },
    billing: {
      name: 'Billing Agent',
      icon: FiCreditCard,
      color: 'purple',
      description: 'Automates invoices, detects fraud, and manages payment reminders'
    },
    customer: {
      name: 'Customer Agent',
      icon: FiUsers,
      color: 'orange',
      description: 'Handles customer queries and provides product recommendations'
    },
    finance: {
      name: 'Finance Agent',
      icon: FiDollarSign,
      color: 'emerald',
      description: 'Analyzes P&L, forecasts revenue, and suggests cost optimizations'
    }
  };

  useEffect(() => {
    fetchAgentData();
    const interval = setInterval(fetchAgentData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAgentData = async () => {
    try {
      const [healthRes, insightsRes, statsRes] = await Promise.all([
        fetch(`${agentsBase}/api/agents/health`),
        fetch(`${agentsBase}/api/agents/insights?limit=20`),
        fetch(`${agentsBase}/api/agents/stats`)
      ]);

      const healthData = await healthRes.json();
      const insightsData = await insightsRes.json();
      const statsData = await statsRes.json();

      setAgents(healthData.agents);
      setInsights(insightsData.insights);
      setStats(statsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching agent data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'medium': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'low': return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const filteredInsights = insights.filter(insight => {
    if (selectedAgent !== 'all' && insight.agentType !== selectedAgent) return false;
    if (!showResolved && insight.isResolved) return false;
    return true;
  });

  const triggerAgentAction = async (agentType, action) => {
    try {
      const response = await fetch(`${agentsBase}/api/agents/trigger/${agentType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      if (response.ok) {
        fetchAgentData(); // Refresh data
      }
    } catch (error) {
      console.error('Error triggering agent action:', error);
    }
  };

  const runAllAgents = async () => {
    try {
      // Map agent types to a representative action
      const actions = [
        { agent: 'sales', action: 'analyze' },
        { agent: 'inventory', action: 'analyze' },
        { agent: 'billing', action: 'analyze' },
        { agent: 'finance', action: 'analyze' },
      ];
      await Promise.all(actions.map(({ agent, action }) =>
        fetch(`${agentsBase}/api/agents/trigger/${agent}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action })
        })
      ));
      fetchAgentData();
    } catch (error) {
      console.error('Error running all agents:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiRefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading AI Agents...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaBrain className="w-8 h-8 text-blue-600 mr-3" />
            AI Agents Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Intelligent automation for your billing system</p>
        </div>
        <button
          onClick={fetchAgentData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FiRefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Agent Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(agentConfig).map(([key, config]) => {
          const Icon = config.icon;
          const agent = agents[key];
          const status = agent?.status || 'inactive';
          
          return (
            <div key={key} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-${config.color}-100`}>
                  <Icon className={`w-6 h-6 text-${config.color}-600`} />
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
                  {status}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{config.name}</h3>
              <p className="text-xs text-gray-600 mb-3">{config.description}</p>
              <div className="text-xs text-gray-500">
                <div>Activity: {agent?.recentActivity || 0}</div>
                <div>Errors: {agent?.recentErrors || 0}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <FiAlertTriangle className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Unread Insights</p>
              <p className="text-2xl font-bold text-gray-900">{stats.summary?.unreadInsights || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <FiClock className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Unresolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.summary?.unresolvedInsights || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <FiCheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(agents).filter(agent => agent.status === 'healthy').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <FiCpu className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Insights</p>
              <p className="text-2xl font-bold text-gray-900">{insights.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agent Type</label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Agents</option>
              {Object.entries(agentConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Show Resolved</span>
            </label>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Insights</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredInsights.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No insights found
            </div>
          ) : (
            filteredInsights.map((insight) => {
              const config = agentConfig[insight.agentType];
              const Icon = config?.icon || FaBrain;
              
              return (
                <div key={insight._id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-${config?.color || 'gray'}-100`}>
                        <Icon className={`w-5 h-5 text-${config?.color || 'gray'}-600`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{insight.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(insight.priority)}`}>
                            {insight.priority}
                          </span>
                          {insight.isResolved && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                              Resolved
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{config?.name || insight.agentType}</span>
                          <span>{new Date(insight.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!insight.isRead && (
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <FiEye className="w-4 h-4" />
                        </button>
                      )}
                      {!insight.isResolved && (
                        <button className="p-1 text-gray-400 hover:text-green-600">
                          <FiCheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={runAllAgents}
            className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
          >
            <FaBrain className="w-5 h-5 text-blue-600 mb-2" />
            <div className="font-medium">Run All Agents</div>
            <div className="text-sm text-gray-600">Execute key checks across agents</div>
          </button>
          <button
            onClick={() => triggerAgentAction('sales', 'analyze')}
            className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
          >
            <FiTrendingUp className="w-5 h-5 text-blue-600 mb-2" />
            <div className="font-medium">Explain Sales Growth</div>
            <div className="text-sm text-gray-600">Analyze patterns and generate recommendations</div>
          </button>
          <button
            onClick={() => triggerAgentAction('inventory', 'check')}
            className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
          >
            <FiPackage className="w-5 h-5 text-green-600 mb-2" />
            <div className="font-medium">Check Inventory</div>
            <div className="text-sm text-gray-600">Monitor stock levels</div>
          </button>
          <button
            onClick={() => triggerAgentAction('finance', 'analyze')}
            className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
          >
            <FiDollarSign className="w-5 h-5 text-emerald-600 mb-2" />
            <div className="font-medium">Analyze Finance</div>
            <div className="text-sm text-gray-600">Run P&L analysis</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAgentsDashboard;
