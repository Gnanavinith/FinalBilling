import React from 'react'
import StockStatusBadge from './StockStatusBadge'

const InventoryTable = ({ inventory, lowStockThreshold }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Accessories': return '🎧'
      case 'Service Item': return '🔧'
      case 'Other': return '📦'
      default: return '📦'
    }
  }

  if (inventory.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
            Accessory Stock Details
          </h2>
        </div>
        <div className="py-8 text-center text-slate-500">
          No accessory products found in inventory.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all mb-6">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
          Accessory Stock Details
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 text-xs uppercase border-b bg-gradient-to-r from-indigo-50 to-blue-50">
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Model/Variant</th>
              <th className="py-3 px-4">Remaining Stock</th>
              <th className="py-3 px-4">Purchase Price</th>
              <th className="py-3 px-4">Selling Price</th>
              <th className="py-3 px-4">Stock Value</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => {
              const stockValue = item.remainingStock * item.purchasePrice

              return (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">
                      <span>{getCategoryIcon(item.category)}</span>
                      <span>{item.category}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">{item.productName}</td>
                  <td className="py-3 px-4">{item.model}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      item.remainingStock <= 0 
                        ? 'bg-red-100 text-red-700' 
                        : item.remainingStock <= lowStockThreshold
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {item.remainingStock}
                    </span>
                  </td>
                  <td className="py-3 px-4">₹{item.purchasePrice.toFixed(2)}</td>
                  <td className="py-3 px-4">₹{item.sellingPrice.toFixed(2)}</td>
                  <td className="py-3 px-4">₹{stockValue.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <StockStatusBadge stock={item.remainingStock} lowStockThreshold={lowStockThreshold} />
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InventoryTable