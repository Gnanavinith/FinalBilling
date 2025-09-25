import React from 'react'
import PurchaseTableRow from './PurchaseTableRow'

const PurchaseTable = ({
  purchases,
  dealers,
  itemCodes,
  onViewDetails,
  onMarkReceived,
  onLoadItemCodes,
  getDealerName,
  calculateRemainingStock
}) => {
  if (purchases.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 text-center">
        <p className="text-slate-500 text-lg">No purchases found matching the current filters.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all">
      <div className="p-4 lg:p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
          Purchase Records ({purchases.length})
        </h2>
      </div>
      
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 text-xs uppercase border-b bg-gradient-to-r from-indigo-50 to-blue-50">
              <th className="py-3 px-4">Dealer</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Model</th>
              <th className="py-3 px-4">Identifier</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Qty</th>
              <th className="py-3 px-4">Product IDs</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Purchase Price</th>
              <th className="py-3 px-4">Selling Price</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Invoice</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map(purchase => 
              purchase.items.map((item, itemIndex) => (
                <PurchaseTableRow
                  key={`${purchase.id}-${itemIndex}`}
                  purchase={purchase}
                  item={item}
                  itemIndex={itemIndex}
                  dealers={dealers}
                  itemCodes={itemCodes}
                  onViewDetails={onViewDetails}
                  onMarkReceived={onMarkReceived}
                  onLoadItemCodes={onLoadItemCodes}
                  getDealerName={getDealerName}
                  calculateRemainingStock={calculateRemainingStock}
                  isMobile={false}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-4 space-y-4">
        {purchases.map(purchase => 
          purchase.items.map((item, itemIndex) => (
            <MobilePurchaseCard
              key={`${purchase.id}-${itemIndex}`}
              purchase={purchase}
              item={item}
              itemIndex={itemIndex}
              dealers={dealers}
              itemCodes={itemCodes}
              onViewDetails={onViewDetails}
              onMarkReceived={onMarkReceived}
              onLoadItemCodes={onLoadItemCodes}
              getDealerName={getDealerName}
            />
          ))
        )}
      </div>
    </div>
  )
}

// Mobile Card Component
const MobilePurchaseCard = ({
  purchase,
  item,
  itemIndex,
  dealers,
  itemCodes,
  onViewDetails,
  onMarkReceived,
  onLoadItemCodes,
  getDealerName
}) => {
  const key = `${purchase.id}-${itemIndex}`
  
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-sm">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs text-slate-500">Dealer</label>
          <p className="font-medium">{getDealerName(purchase.dealerId)}</p>
        </div>
        <div>
          <label className="text-xs text-slate-500">Status</label>
          <span className={`px-2 py-1 text-xs rounded-full ${purchase.status === 'Received' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {purchase.status || 'Pending'}
          </span>
        </div>
        <div>
          <label className="text-xs text-slate-500">Product</label>
          <p className="font-medium truncate">{item.productName}</p>
        </div>
        <div>
          <label className="text-xs text-slate-500">Model</label>
          <p className="font-medium">{item.model}</p>
        </div>
        <div>
          <label className="text-xs text-slate-500">Qty</label>
          <p className="font-medium">{item.quantity}</p>
        </div>
        <div>
          <label className="text-xs text-slate-500">Total</label>
          <p className="font-medium">₹{item.totalPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-slate-200 pt-3">
        <div className="text-xs text-slate-500">
          {purchase.purchaseDate} • {purchase.invoiceNumber}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(purchase)}
            className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
            title="View"
          >
            <FiEye className="w-4 h-4" />
          </button>
          {purchase.status !== 'Received' && (
            <button
              onClick={() => onMarkReceived(purchase.id)}
              className="px-3 py-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-xs"
            >
              Received
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PurchaseTable