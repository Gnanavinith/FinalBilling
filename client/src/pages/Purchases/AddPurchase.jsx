import React, { useState, useEffect } from 'react';
import PurchaseDetails from '../../components/purchase/addpurchase/PurchaseDetails';
import ProductEntryForm from '../../components/purchase/addpurchase/ProductEntryForm';
import ProductList from '../../components/purchase/addpurchase/ProductList';
import TotalSummary from '../../components/purchase/addpurchase/TotalSummary';
import SaveButtons from '../../components/purchase/addpurchase/SaveButtons';
import { generateInvoiceNumber, apiBase } from '../../components/purchase/addpurchase/constants';

const AddPurchase = () => {
  const [dealers, setDealers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [form, setForm] = useState({
    dealerId: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    invoiceNumber: generateInvoiceNumber(),
    paymentMode: 'Cash',
    gstEnabled: false,
    gstPercentage: 18,
    totalAmount: 0,
    gstAmount: 0,
    grandTotal: 0,
    items: []
  });

  const [newItem, setNewItem] = useState({
    category: 'Mobile',
    productName: '',
    model: '',
    productId: '',
    brand: '',
    accessoryCategory: '',
    accessoryCategoryCustom: '',
    color: '',
    ram: '',
    storage: '',
    imeiNumber1: '',
    imeiNumber2: '',
    simSlot: '',
    processor: '',
    displaySize: '',
    camera: '',
    battery: '',
    operatingSystem: '',
    networkType: '',
    quantity: 1,
    purchasePrice: 0,
    sellingPrice: 0,
    totalPrice: 0
  });

  // Load dealers on component mount
  useEffect(() => {
    const loadDealers = async () => {
      try {
        const res = await fetch(`${apiBase}/api/dealers`);
        const data = await res.json();
        setDealers(Array.isArray(data) ? data : []);
      } catch {
        setDealers([]);
      }
    };
    loadDealers();
  }, []);

  // Search accessories function
  const searchAccessories = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/accessories?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching accessories:', error);
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (value.trim().length >= 2) {
      searchAccessories(value);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Handle accessory selection
  const handleAccessorySelect = (accessory) => {
    setNewItem(prev => ({
      ...prev,
      productName: accessory.productName,
      model: accessory.productId,
      productId: accessory.productId,
      purchasePrice: accessory.unitPrice || 0,
      sellingPrice: accessory.sellingPrice || accessory.unitPrice || 0
    }));
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSearchResults && !event.target.closest('.search-dropdown')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchResults]);

  const calculateItemTotal = (item) => {
    return item.quantity * item.purchasePrice;
  };

  const calculateTotals = (items, gstEnabled, gstPercentage) => {
    const totalAmount = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    const gstAmount = gstEnabled ? (totalAmount * (parseFloat(gstPercentage) || 0)) / 100 : 0;
    const grandTotal = totalAmount + gstAmount;

    setForm(prev => ({
      ...prev,
      totalAmount,
      gstAmount,
      grandTotal
    }));
  };

  const handleFormChange = (updates) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const handleNewItemChange = (field, value) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    if (!newItem.productName || newItem.quantity <= 0 || newItem.purchasePrice <= 0) {
      alert('Please fill all required fields for the product');
      return;
    }
    
    if (newItem.category === 'Accessories' && !newItem.model) {
      alert('Please fill the Model/Variant field for accessories');
      return;
    }
    
    if (newItem.category === 'Mobile' && !newItem.brand) {
      alert('Please fill the Brand field for mobiles');
      return;
    }

    const itemTotal = calculateItemTotal(newItem);
    const resolvedAccessoryCategory = newItem.category === 'Accessories'
      ? (newItem.accessoryCategory === 'Other' ? (newItem.accessoryCategoryCustom || '') : newItem.accessoryCategory)
      : '';
    const item = {
      ...newItem,
      accessoryCategory: resolvedAccessoryCategory,
      totalPrice: itemTotal
    };

    const updatedItems = [...form.items, item];
    setForm(prev => ({ ...prev, items: updatedItems }));
    calculateTotals(updatedItems, form.gstEnabled, form.gstPercentage);

    // Reset new item form
    setNewItem({
      category: 'Mobile',
      productName: '',
      model: '',
      productId: '',
      brand: '',
      accessoryCategory: '',
      accessoryCategoryCustom: '',
      color: '',
      ram: '',
      storage: '',
      imeiNumber1: '',
      imeiNumber2: '',
      simSlot: '',
      processor: '',
      displaySize: '',
      camera: '',
      battery: '',
      operatingSystem: '',
      networkType: '',
      quantity: 1,
      purchasePrice: 0,
      sellingPrice: 0,
      totalPrice: 0
    });
  };

  const removeItem = (index) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, items: updatedItems }));
    calculateTotals(updatedItems, form.gstEnabled, form.gstPercentage);
  };

  useEffect(() => {
    calculateTotals(form.items, form.gstEnabled, form.gstPercentage);
  }, [form.gstEnabled, form.gstPercentage, form.items]);

  const savePurchase = async (mode = 'pending') => {
    if (!form.dealerId) {
      alert('Please select a dealer');
      return;
    }

    if (form.items.length === 0) {
      alert('Please add at least one product');
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/purchases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.error || 'Failed to save purchase');
      }
      
      const saved = await res.json();
      
      if (mode === 'received') {
        try {
          const rx = await fetch(`${apiBase}/api/purchases/${encodeURIComponent(saved.id)}/receive`, { 
            method: 'POST' 
          });
          if (!rx.ok) {
            const msg = await rx.json().catch(() => ({}));
            throw new Error(msg?.error || 'Failed to mark as received');
          }
          alert('Purchase saved and marked Received. Product IDs generated.');
        } catch (e) {
          alert('Saved as Pending (failed to mark Received): ' + (e?.message || e));
        }
      } else {
        alert('Purchase saved as Pending.');
      }
      
      // Reset form
      setForm({
        dealerId: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        invoiceNumber: generateInvoiceNumber(),
        paymentMode: 'Cash',
        gstEnabled: false,
        gstPercentage: 18,
        totalAmount: 0,
        gstAmount: 0,
        grandTotal: 0,
        items: []
      });
    } catch (error) {
      alert('Error saving purchase: ' + error.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Add Purchase
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Purchase Details - Left Panel */}
        <div className="lg:col-span-1">
          <PurchaseDetails 
            form={form} 
            dealers={dealers} 
            onFormChange={handleFormChange} 
          />
        </div>

        {/* Product Entry - Right Panel */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <ProductEntryForm
            newItem={newItem}
            onNewItemChange={handleNewItemChange}
            onAddItem={addItem}
            searchResults={searchResults}
            showSearchResults={showSearchResults}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onAccessorySelect={handleAccessorySelect}
            onSearchBlur={setShowSearchResults}
          />

          <ProductList items={form.items} onRemoveItem={removeItem} />

          <TotalSummary
            totalAmount={form.totalAmount}
            gstEnabled={form.gstEnabled}
            gstPercentage={form.gstPercentage}
            gstAmount={form.gstAmount}
            grandTotal={form.grandTotal}
          />

          <SaveButtons 
            onSave={savePurchase} 
            items={form.items} 
            dealerId={form.dealerId} 
          />
        </div>
      </div>
    </div>
  );
};

export default AddPurchase;