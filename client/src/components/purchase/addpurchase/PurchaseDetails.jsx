import React from 'react';

const PurchaseDetails = ({ form, dealers, onFormChange }) => {
  const selectedDealer = dealers.find(d => d.id === form.dealerId);

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
        Purchase Details
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Dealer *</label>
          <select
            value={form.dealerId}
            onChange={(e) => onFormChange({ dealerId: e.target.value })}
            className="w-full rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all px-4 py-2.5"
            required
          >
            <option value="">Select Dealer</option>
            {dealers.map(dealer => (
              <option key={dealer.id} value={dealer.id}>
                {dealer.name} ({dealer.id})
              </option>
            ))}
          </select>
          {selectedDealer && (
            <div className="mt-2 text-sm text-slate-700">
              <p>Phone: {selectedDealer.phone}</p>
              <p>GST: {selectedDealer.gst || 'N/A'}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Date *</label>
          <input
            type="date"
            value={form.purchaseDate}
            onChange={(e) => onFormChange({ purchaseDate: e.target.value })}
            className="w-full rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all px-4 py-2.5"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Number (auto)</label>
          <input
            type="text"
            value={form.invoiceNumber}
            onChange={(e) => onFormChange({ invoiceNumber: e.target.value })}
            className="w-full rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all px-4 py-2.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Payment Mode *</label>
          <select
            value={form.paymentMode}
            onChange={(e) => onFormChange({ paymentMode: e.target.value })}
            className="w-full rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all px-4 py-2.5"
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank">Bank Transfer</option>
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.gstEnabled}
              onChange={(e) => onFormChange({ gstEnabled: e.target.checked })}
              className="rounded border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">Apply GST</span>
          </label>
          {form.gstEnabled && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">GST Percentage</label>
              <input
                type="number"
                value={form.gstPercentage}
                onChange={(e) => onFormChange({ gstPercentage: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all px-4 py-2.5"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetails;