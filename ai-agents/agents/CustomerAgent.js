const BaseAgent = require('./BaseAgent');
const mongoose = require('mongoose');

class CustomerAgent extends BaseAgent {
  constructor(io) {
    super('customer', io);
    this.mobilesCollection = mongoose.connection.db.collection('mobiles');
    this.accessoriesCollection = mongoose.connection.db.collection('accessories');
    this.salesCollection = mongoose.connection.db.collection('sales');
    this.serviceInvoicesCollection = mongoose.connection.db.collection('serviceinvoices');
    this.customersCollection = mongoose.connection.db.collection('customers');
    
    this.config = {
      ...this.config,
      maxRecommendations: 5,
      conversationTimeout: 30 * 60 * 1000, // 30 minutes
      maxConversationHistory: 10
    };
    
    // Initialize conversation storage
    this.conversations = new Map();
    this.faqDatabase = this.initializeFAQ();
  }

  initializeFAQ() {
    return [
      {
        question: "What are your business hours?",
        answer: "We are open Monday to Saturday from 9:00 AM to 8:00 PM, and Sunday from 10:00 AM to 6:00 PM.",
        category: "general"
      },
      {
        question: "Do you offer mobile phone repairs?",
        answer: "Yes, we provide comprehensive mobile phone repair services including screen replacement, battery replacement, software issues, and more.",
        category: "services"
      },
      {
        question: "What brands of mobile phones do you sell?",
        answer: "We sell all major brands including Samsung, Apple, OnePlus, Xiaomi, Realme, Vivo, Oppo, and many more.",
        category: "products"
      },
      {
        question: "Do you buy old mobile phones?",
        answer: "Yes, we buy and sell second-hand mobile phones. Bring your old phone for evaluation and get the best price.",
        category: "services"
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept cash, credit/debit cards, UPI, net banking, and EMI options for purchases above ₹10,000.",
        category: "payment"
      },
      {
        question: "Do you provide warranty on repairs?",
        answer: "Yes, we provide 90 days warranty on all repair services and 1 year warranty on new mobile phone purchases.",
        category: "warranty"
      },
      {
        question: "How long does a typical repair take?",
        answer: "Most repairs are completed within 2-4 hours. Complex repairs may take 1-2 days. We'll inform you of the exact timeline.",
        category: "services"
      },
      {
        question: "Do you have accessories for mobile phones?",
        answer: "Yes, we have a wide range of accessories including cases, screen protectors, chargers, earphones, and more.",
        category: "products"
      }
    ];
  }

  async processCustomerQuery(query, customerId = null, sessionId = null) {
    try {
      await this.log(`Processing customer query: ${query.substring(0, 100)}...`, 'info');
      
      // Get or create conversation
      const conversation = this.getConversation(sessionId || customerId);
      
      // Add query to conversation history
      conversation.messages.push({
        type: 'user',
        content: query,
        timestamp: new Date()
      });
      
      // Determine query type and generate response
      const queryType = await this.classifyQuery(query);
      let response;
      
      switch (queryType.type) {
        case 'faq':
          response = await this.handleFAQQuery(query);
          break;
        case 'product_inquiry':
          response = await this.handleProductInquiry(query);
          break;
        case 'price_check':
          response = await this.handlePriceCheck(query);
          break;
        case 'recommendation':
          response = await this.handleRecommendationRequest(query, customerId);
          break;
        case 'service_inquiry':
          response = await this.handleServiceInquiry(query);
          break;
        case 'order_status':
          response = await this.handleOrderStatusQuery(query, customerId);
          break;
        default:
          response = await this.handleGeneralQuery(query);
      }
      
      // Add response to conversation
      conversation.messages.push({
        type: 'assistant',
        content: response.text,
        timestamp: new Date(),
        metadata: response.metadata
      });
      
      // Keep conversation history manageable
      if (conversation.messages.length > this.config.maxConversationHistory * 2) {
        conversation.messages = conversation.messages.slice(-this.config.maxConversationHistory * 2);
      }
      
      // Create insight for customer interaction
      await this.createInsight(
        'Customer Query Processed',
        `Query type: ${queryType.type}. Response generated successfully.`,
        'customer_interaction',
        'low',
        {
          queryType: queryType.type,
          confidence: queryType.confidence,
          customerId,
          sessionId,
          responseLength: response.text.length
        }
      );
      
      return {
        response: response.text,
        type: queryType.type,
        confidence: queryType.confidence,
        metadata: response.metadata,
        conversationId: sessionId || customerId
      };
      
    } catch (error) {
      await this.log(`Customer query processing failed: ${error.message}`, 'error');
      return {
        response: "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team.",
        type: 'error',
        confidence: 0,
        metadata: { error: error.message }
      };
    }
  }

  getConversation(sessionId) {
    if (!this.conversations.has(sessionId)) {
      this.conversations.set(sessionId, {
        messages: [],
        createdAt: new Date(),
        lastActivity: new Date()
      });
    }
    
    const conversation = this.conversations.get(sessionId);
    conversation.lastActivity = new Date();
    return conversation;
  }

  async classifyQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    // FAQ classification
    for (const faq of this.faqDatabase) {
      const similarity = this.calculateSimilarity(lowerQuery, faq.question.toLowerCase());
      if (similarity > 0.7) {
        return { type: 'faq', confidence: similarity, faq };
      }
    }
    
    // Product inquiry keywords
    const productKeywords = ['phone', 'mobile', 'smartphone', 'model', 'brand', 'specification', 'feature'];
    if (productKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return { type: 'product_inquiry', confidence: 0.8 };
    }
    
    // Price check keywords
    const priceKeywords = ['price', 'cost', 'how much', 'expensive', 'cheap', 'budget'];
    if (priceKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return { type: 'price_check', confidence: 0.8 };
    }
    
    // Recommendation keywords
    const recommendationKeywords = ['recommend', 'suggest', 'best', 'good', 'which', 'should i buy'];
    if (recommendationKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return { type: 'recommendation', confidence: 0.8 };
    }
    
    // Service inquiry keywords
    const serviceKeywords = ['repair', 'service', 'fix', 'broken', 'damaged', 'warranty'];
    if (serviceKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return { type: 'service_inquiry', confidence: 0.8 };
    }
    
    // Order status keywords
    const orderKeywords = ['order', 'status', 'delivery', 'when', 'track', 'invoice'];
    if (orderKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return { type: 'order_status', confidence: 0.8 };
    }
    
    return { type: 'general', confidence: 0.5 };
  }

  calculateSimilarity(str1, str2) {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    const intersection = words1.filter(word => words2.includes(word));
    return intersection.length / Math.max(words1.length, words2.length);
  }

  async handleFAQQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    for (const faq of this.faqDatabase) {
      if (this.calculateSimilarity(lowerQuery, faq.question.toLowerCase()) > 0.7) {
        return {
          text: faq.answer,
          metadata: { category: faq.category, source: 'faq' }
        };
      }
    }
    
    return {
      text: "I couldn't find a specific answer to your question. Could you please rephrase it or contact our support team for assistance?",
      metadata: { source: 'fallback' }
    };
  }

  async handleProductInquiry(query) {
    try {
      // Extract product information from query
      const productInfo = this.extractProductInfo(query);
      
      // Search for matching products
      const products = await this.searchProducts(productInfo);
      
      if (products.length > 0) {
        const product = products[0];
        const response = `I found information about ${product.productName}:\n\n` +
          `Brand: ${product.brand || 'N/A'}\n` +
          `Model: ${product.model || 'N/A'}\n` +
          `Price: ₹${product.purchasePrice || 'N/A'}\n` +
          `Stock: ${product.remainingStock || 0} units available\n` +
          `Specifications: ${this.formatSpecifications(product)}`;
        
        return {
          text: response,
          metadata: { 
            products: products.slice(0, 3),
            productCount: products.length,
            source: 'product_search'
          }
        };
      } else {
        return {
          text: "I couldn't find any products matching your description. Could you provide more specific details about the product you're looking for?",
          metadata: { source: 'no_results' }
        };
      }
    } catch (error) {
      return {
        text: "I'm having trouble searching for products right now. Please try again or visit our store for assistance.",
        metadata: { error: error.message }
      };
    }
  }

  extractProductInfo(query) {
    const lowerQuery = query.toLowerCase();
    const brands = ['samsung', 'apple', 'iphone', 'oneplus', 'xiaomi', 'realme', 'vivo', 'oppo'];
    const foundBrand = brands.find(brand => lowerQuery.includes(brand));
    
    return {
      brand: foundBrand,
      query: lowerQuery
    };
  }

  async searchProducts(productInfo) {
    const searchQuery = {};
    
    if (productInfo.brand) {
      searchQuery.brand = { $regex: productInfo.brand, $options: 'i' };
    }
    
    if (productInfo.query) {
      searchQuery.$or = [
        { productName: { $regex: productInfo.query, $options: 'i' } },
        { model: { $regex: productInfo.query, $options: 'i' } }
      ];
    }
    
    const mobiles = await this.mobilesCollection.find(searchQuery).limit(5).toArray();
    const accessories = await this.accessoriesCollection.find(searchQuery).limit(5).toArray();
    
    return [...mobiles, ...accessories];
  }

  formatSpecifications(product) {
    const specs = [];
    if (product.ram) specs.push(`RAM: ${product.ram}`);
    if (product.storage) specs.push(`Storage: ${product.storage}`);
    if (product.processor) specs.push(`Processor: ${product.processor}`);
    if (product.displaySize) specs.push(`Display: ${product.displaySize}`);
    if (product.color) specs.push(`Color: ${product.color}`);
    
    return specs.length > 0 ? specs.join(', ') : 'Specifications not available';
  }

  async handlePriceCheck(query) {
    try {
      const productInfo = this.extractProductInfo(query);
      const products = await this.searchProducts(productInfo);
      
      if (products.length > 0) {
        const product = products[0];
        return {
          text: `The price for ${product.productName} is ₹${product.purchasePrice}. We have ${product.remainingStock} units in stock.`,
          metadata: { 
            product: product,
            source: 'price_check'
          }
        };
      } else {
        return {
          text: "I couldn't find pricing information for that product. Please provide more specific details or visit our store for current prices.",
          metadata: { source: 'no_results' }
        };
      }
    } catch (error) {
      return {
        text: "I'm having trouble checking prices right now. Please try again or contact our store directly.",
        metadata: { error: error.message }
      };
    }
  }

  async handleRecommendationRequest(query, customerId) {
    try {
      // Get customer's purchase history for personalized recommendations
      let customerHistory = [];
      if (customerId) {
        customerHistory = await this.salesCollection.find({
          customerName: customerId
        }).limit(10).toArray();
      }
      
      // Generate recommendations based on query and history
      const recommendations = await this.generateRecommendations(query, customerHistory);
      
      if (recommendations.length > 0) {
        let response = "Based on your request, I recommend:\n\n";
        recommendations.forEach((rec, index) => {
          response += `${index + 1}. ${rec.productName} - ₹${rec.purchasePrice}\n`;
          response += `   ${rec.description}\n\n`;
        });
        
        return {
          text: response,
          metadata: { 
            recommendations: recommendations,
            personalized: customerHistory.length > 0,
            source: 'recommendation_engine'
          }
        };
      } else {
        return {
          text: "I couldn't generate specific recommendations. Could you tell me more about your preferences, budget, or specific needs?",
          metadata: { source: 'no_recommendations' }
        };
      }
    } catch (error) {
      return {
        text: "I'm having trouble generating recommendations right now. Please try again or visit our store for personalized assistance.",
        metadata: { error: error.message }
      };
    }
  }

  async generateRecommendations(query, customerHistory) {
    try {
      // Simple recommendation logic based on popular products and customer history
      const popularProducts = await this.mobilesCollection.find({
        remainingStock: { $gt: 0 }
      }).sort({ remainingStock: -1 }).limit(10).toArray();
      
      // Filter based on query keywords
      const lowerQuery = query.toLowerCase();
      const filteredProducts = popularProducts.filter(product => {
        const productText = `${product.productName} ${product.brand} ${product.model}`.toLowerCase();
        return productText.includes(lowerQuery) || lowerQuery.includes('recommend') || lowerQuery.includes('suggest');
      });
      
      return filteredProducts.slice(0, this.config.maxRecommendations).map(product => ({
        ...product,
        description: this.formatSpecifications(product)
      }));
      
    } catch (error) {
      await this.log(`Recommendation generation failed: ${error.message}`, 'error');
      return [];
    }
  }

  async handleServiceInquiry(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('repair') || lowerQuery.includes('fix')) {
      return {
        text: "We provide comprehensive mobile phone repair services including:\n\n• Screen replacement\n• Battery replacement\n• Software issues\n• Water damage repair\n• Charging port repair\n• Camera repair\n\nMost repairs are completed within 2-4 hours. Please bring your phone to our store for evaluation.",
        metadata: { source: 'service_info' }
      };
    }
    
    if (lowerQuery.includes('warranty')) {
      return {
        text: "We provide:\n\n• 90 days warranty on all repair services\n• 1 year warranty on new mobile phone purchases\n• Warranty covers manufacturing defects and workmanship\n\nPlease keep your receipt for warranty claims.",
        metadata: { source: 'warranty_info' }
      };
    }
    
    return {
      text: "We offer various mobile phone services including repairs, accessories, and second-hand phone sales. Could you be more specific about what service you need?",
      metadata: { source: 'general_service' }
    };
  }

  async handleOrderStatusQuery(query, customerId) {
    try {
      if (!customerId) {
        return {
          text: "To check your order status, please provide your customer ID or phone number. You can also visit our store with your receipt.",
          metadata: { source: 'no_customer_id' }
        };
      }
      
      // Search for recent orders
      const recentOrders = await this.salesCollection.find({
        customerName: customerId
      }).sort({ createdAt: -1 }).limit(5).toArray();
      
      if (recentOrders.length > 0) {
        const latestOrder = recentOrders[0];
        const status = latestOrder.paymentStatus || 'pending';
        
        return {
          text: `Your latest order (${latestOrder.invoiceNumber || latestOrder._id}) status: ${status.toUpperCase()}\n\nOrder Date: ${new Date(latestOrder.createdAt).toLocaleDateString()}\nAmount: ₹${latestOrder.totalAmount}\n\nFor more details, please visit our store or call us.`,
          metadata: { 
            orders: recentOrders,
            latestOrder: latestOrder,
            source: 'order_status'
          }
        };
      } else {
        return {
          text: "I couldn't find any recent orders for you. Please check your customer ID or visit our store for assistance.",
          metadata: { source: 'no_orders' }
        };
      }
    } catch (error) {
      return {
        text: "I'm having trouble checking your order status right now. Please try again or contact our store directly.",
        metadata: { error: error.message }
      };
    }
  }

  async handleGeneralQuery(query) {
    // Use AI to generate a general response
    try {
      const aiResponse = await this.generateAIResponse(
        `Customer asked: "${query}". Provide a helpful response as a mobile phone store assistant.`,
        { query, context: 'customer_service' }
      );
      
      return {
        text: aiResponse,
        metadata: { source: 'ai_generated' }
      };
    } catch (error) {
      return {
        text: "Thank you for your question. I'm here to help with mobile phones, accessories, repairs, and services. Could you please be more specific about what you need assistance with?",
        metadata: { source: 'fallback' }
      };
    }
  }

  async generateDailySummary() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Count active conversations
      const activeConversations = Array.from(this.conversations.values())
        .filter(conv => conv.lastActivity > new Date(Date.now() - 24 * 60 * 60 * 1000)).length;

      // Clean up old conversations
      this.cleanupOldConversations();

      await this.createInsight(
        'Daily Customer Service Summary',
        `Active conversations: ${activeConversations}. Customer service agent is running smoothly.`,
        'summary',
        'low',
        {
          activeConversations,
          totalConversations: this.conversations.size,
          date: today.toDateString()
        }
      );

      await this.log(`Daily customer service summary generated`, 'info');
      
    } catch (error) {
      await this.log(`Daily summary failed: ${error.message}`, 'error');
    }
  }

  cleanupOldConversations() {
    const cutoffTime = new Date(Date.now() - this.config.conversationTimeout);
    
    for (const [sessionId, conversation] of this.conversations.entries()) {
      if (conversation.lastActivity < cutoffTime) {
        this.conversations.delete(sessionId);
      }
    }
  }

  async getConversationStats() {
    return {
      activeConversations: this.conversations.size,
      totalFAQEntries: this.faqDatabase.length,
      lastCleanup: new Date()
    };
  }
}

module.exports = CustomerAgent;
