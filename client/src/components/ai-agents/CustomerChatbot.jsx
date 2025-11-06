import React, { useState, useEffect, useRef } from 'react';
import { agentsBase } from '../../utils/environment';
import { 
  FiSend, 
  FiUser, 
  FiCpu, 
  FiMessageCircle,
  FiMinimize2,
  FiMaximize2,
  FiX
} from 'react-icons/fi';

// Use unified agents base URL from environment utils
const AI_BASE = String(agentsBase || 'https://finalbilling-1.onrender.com').replace(/\/$/, '')

const CustomerChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message when chatbot opens
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        type: 'assistant',
        content: 'Hello! I\'m your AI assistant. I can help you with:\n\n• Product information and prices\n• Mobile phone recommendations\n• Service inquiries\n• Order status\n• General questions\n\nHow can I assist you today?',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length]);

  // Simple local fallback for common FAQs when backend is unreachable
  const localFallbackAnswer = (query) => {
    const q = (query || '').toLowerCase()
    if (!q) return null
    if (q.includes('business hours') || q.includes('open') || q.includes('timing')) {
      return "We're open Mon–Sat 9:00 AM–8:00 PM, Sun 10:00 AM–6:00 PM."
    }
    if (q.includes('repair') || q.includes('service') || q.includes('fix')) {
      return "Yes, we repair phones: screens, batteries, software and more. Most repairs finish in 2–4 hours."
    }
    if (q.includes('brand') || q.includes('sell') || q.includes('products')) {
      return "We sell Samsung, Apple, OnePlus, Xiaomi, Realme, Vivo, Oppo and more."
    }
    if (q.includes('buy old') || q.includes('old phone') || q.includes('exchange')) {
      return "Yes, we buy second-hand phones. Bring your device for evaluation to get the best price."
    }
    if (q.includes('payment') || q.includes('price') || q.includes('cost')) {
      return "We accept UPI, cards, net banking and cash. Pricing varies by model—tell me the brand/model for a quote."
    }
    return null
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${AI_BASE}/api/agents/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputMessage,
          sessionId: sessionId
        })
      });

      let data
      try {
        data = await response.json()
      } catch {
        data = { error: 'Invalid server response' }
      }

      if (!response.ok) {
        throw new Error(data?.error || `Request failed (${response.status})`)
      }

      const text = typeof data?.response === 'string' && data.response.trim().length > 0
        ? data.response
        : (data?.message || data?.error || 'I could not process your request right now. Please try again later.')

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: text,
        timestamp: new Date(),
        metadata: data?.metadata
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const fallback = localFallbackAnswer(inputMessage)
      if (fallback) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: fallback,
          timestamp: new Date(),
          metadata: { source: 'local_fallback' }
        }])
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: `I couldn't process your request. ${error?.message || ''}`.trim(),
          timestamp: new Date(),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content) => {
    const safe = typeof content === 'string' ? content : (content == null ? '' : String(content))
    return safe.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < safe.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const quickQuestions = [
    "What are your business hours?",
    "Do you repair mobile phones?",
    "What brands do you sell?",
    "Do you buy old phones?",
    "What payment methods do you accept?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <FiMessageCircle className="w-6 h-6" />
          <span className="hidden sm:block">Chat with AI</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-80' : 'w-96'} transition-all duration-300`}>
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiCpu className="w-5 h-5" />
            <span className="font-medium">AI Assistant</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-blue-700 p-1 rounded"
            >
              {isMinimized ? <FiMaximize2 className="w-4 h-4" /> : <FiMinimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 p-1 rounded"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.isError
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'assistant' && (
                        <FiCpu className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      {message.type === 'user' && (
                        <FiUser className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm">
                          {formatMessage(message.content)}
                        </div>
                        {message.metadata && (
                          <div className="text-xs mt-1 opacity-75">
                            {message.metadata.source && `Source: ${message.metadata.source}`}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FiCpu className="w-4 h-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="p-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
                <div className="space-y-1">
                  {quickQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerChatbot;
