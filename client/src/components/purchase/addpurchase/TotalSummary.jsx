import React from 'react';

const TotalSummary = ({ totalAmount, gstEnabled, gstPercentage, gstAmount, grandTotal }) => {
  if (totalAmount === 0) return null;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white p-4 rounded-xl border border-slate-200 mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-slate-700">Subtotal:</span>
        <span className="font-bold text-slate-900">₹{totalAmount.toFixed(2)}</span>
      </div>
      {gstEnabled && (
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-blue-600">GST ({gstPercentage}%):</span>
          <span className="font-bold text-blue-700">₹{gstAmount.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
        <span className="text-indigo-800 font-bold">Grand Total:</span>
        <span className="text-2xl font-extrabold text-indigo-900">₹{grandTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default TotalSummary;