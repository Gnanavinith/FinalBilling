import React from 'react'
import { FiAlertTriangle } from 'react-icons/fi'

const LowStockAlert = ({ lowStockItems }) => {
  return (
    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
      <div className="flex items-center space-x-2 mb-2">
        <FiAlertTriangle className="w-5 h-5 text-yellow-600" />
        <h3 className="font-semibold text-yellow-800">Low Stock Alert</h3>
      </div>
      <p className="text-yellow-700 text-sm mb-3">
        The following mobile products are running low on stock:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {lowStockItems.map(item => (
          <div key={item.id} className="bg-white rounded-lg p-2 border border-yellow-200">
            <p className="font-medium text-sm">{item.productName} - {item.model}</p>
            <p className="text-xs text-slate-600">Stock: {item.remainingStock}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LowStockAlert