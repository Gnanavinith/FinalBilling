import React, { useState } from 'react';
import { MdTitle, MdSearch } from 'react-icons/md';

const ProductNameInput = ({ draftItem, setDraftItem, productLookup }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setDraftItem(prev => ({ ...prev, name: value }));

    // Show suggestions if there's text and productLookup is available
    if (value.length > 1 && productLookup) {
      const filtered = productLookup.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product) => {
    setDraftItem(prev => ({
      ...prev,
      name: product.name,
      price: product.price || '',
      hsnCode: product.hsnCode || '',
      gstRate: product.gstRate || '',
      category: product.category || '',
      subCategory: product.subCategory || ''
    }));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="space-y-3 relative">
      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
        <MdTitle className="text-green-600" />
        Product Name *
      </label>
      <div className="relative">
        <input
          type="text"
          value={draftItem.name || ''}
          onChange={handleNameChange}
          placeholder="Enter product name..."
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          required
        />
        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {suggestions.map((product, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(product)}
              className="w-full p-3 text-left hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
            >
              <div className="font-medium text-gray-800">{product.name}</div>
              {product.price && (
                <div className="text-sm text-gray-600">₹{product.price}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductNameInput;