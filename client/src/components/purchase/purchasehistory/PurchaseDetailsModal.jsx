import React from 'react'
import { getDealerName } from './utils/purchaseCalculations'

const PurchaseDetailsModal = ({ purchase, dealers, onClose, onMarkReceived }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 lg:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Purchase Details</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Purchase Information</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Invoice:</span> {purchase.invoiceNumber}</p>
              <p><span className="font-medium">Date:</span> {purchase.purchaseDate}</p>
              <p><span className="font-medium">Dealer:</span> {getDealerName(purchase.dealerId, dealers)}</p>
              <p><span className="font-medium">Payment Mode:</span> {purchase.paymentMode}</p>
              <p><span className="font-medium">Status:</span> {purchase.status || 'Pending'}</p>
              {purchase.status === 'Received' && purchase.receivedAt && (
                <p><span className="font-medium">Received At:</span> {new Date(purchase.receivedAt).toLocaleString()}</p>
              )}
              <p><span className="font-medium">GST Applied:</span> {purchase.gstEnabled ? 'Yes' : 'No'}</p>
              {purchase.gstEnabled && (
                <p><span className="font-medium">GST %:</span> {purchase.gstPercentage}%</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Amount Summary</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Subtotal:</span> ₹{purchase.totalAmount.toFixed(2)}</p>
              {purchase.gstEnabled && (
                <p><span className="font-medium">GST Amount:</span> ₹{purchase.gstAmount.toFixed(2)}</p>
              )}
              <p className="text-lg font-semibold">
                <span className="font-medium">Grand Total:</span> ₹{purchase.grandTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Products Purchased</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 text-xs uppercase border-b">
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">Model</th>
                  <th className="py-2 pr-4">Qty</th>
                  <th className="py-2 pr-4">Purchase Price</th>
                  <th className="py-2 pr-4">Selling Price</th>
                  <th className="py-2 pr-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {purchase.items.map((item, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="py-2 pr-4">{item.category}</td>
                    <td className="py-2 pr-4">{item.productName}</td>
                    <td className="py-2 pr-4">{item.model}</td>
                    <td className="py-2 pr-4">{item.quantity}</td>
                    <td className="py-2 pr-4">₹{item.purchasePrice.toFixed(2)}</td>
                    <td className="py-2 pr-4">₹{item.sellingPrice.toFixed(2)}</td>
                    <td className="py-2 pr-4">₹{item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
          {purchase.status !== 'Received' && (
            <button 
              onClick={() => onMarkReceived(purchase.id)}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors order-2 sm:order-1"
            >
              Mark as Received
            </button>
          )}
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg border-2 border-slate-300 hover:bg-slate-50 transition-colors order-1 sm:order-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default PurchaseDetailsModal