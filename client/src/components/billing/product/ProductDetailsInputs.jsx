import React from 'react';
import { MdAttachMoney, MdPercent, MdInventory, MdDescription } from 'react-icons/md';

const ProductDetailsInputs = ({ draftItem, setDraftItem }) => {
  const handleDetailChange = (e) => {
    const { name, value, type } = e.target;
    setDraftItem(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const calculateTotal = () => {
    const price = parseFloat(draftItem.price) || 0;
    const quantity = parseFloat(draftItem.quantity) || 0;
    const gstRate = parseFloat(draftItem.gstRate) || 0;
    
    const subtotal = price * quantity;
    const gstAmount = (subtotal * gstRate) / 100;
    return subtotal + gstAmount;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Price Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <MdAttachMoney className="text-green-600" />
            Price (₹) *
          </label>
          <input
            type="number"
            name="price"
            value={draftItem.price || ''}
            onChange={handleDetailChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            required
          />
        </div>

        {/* Quantity Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <MdInventory className="text-green-600" />
            Quantity *
          </label>
          <input
            type="number"
            name="quantity"
            value={draftItem.quantity || ''}
            onChange={handleDetailChange}
            placeholder="1"
            min="1"
            step="1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            required
          />
        </div>

        {/* GST Rate Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <MdPercent className="text-green-600" />
            GST Rate (%)
          </label>
          <input
            type="number"
            name="gstRate"
            value={draftItem.gstRate || ''}
            onChange={handleDetailChange}
            placeholder="0"
            min="0"
            max="100"
            step="0.1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          <MdDescription className="text-green-600" />
          Description
        </label>
        <textarea
          name="description"
          value={draftItem.description || ''}
          onChange={handleDetailChange}
          placeholder="Product description..."
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
        />
      </div>

      {/* Total Calculation Display */}
      {(draftItem.price || draftItem.quantity || draftItem.gstRate) && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">
              ₹{((parseFloat(draftItem.price) || 0) * (parseFloat(draftItem.quantity) || 0)).toFixed(2)}
            </span>
          </div>
          {draftItem.gstRate && (
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-600">GST ({draftItem.gstRate}%):</span>
              <span className="font-medium">
                ₹{(((parseFloat(draftItem.price) || 0) * (parseFloat(draftItem.quantity) || 0) * (parseFloat(draftItem.gstRate) || 0)) / 100).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center font-semibold text-green-700 mt-2 pt-2 border-t border-green-200">
            <span>Total:</span>
            <span>₹{calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsInputs;