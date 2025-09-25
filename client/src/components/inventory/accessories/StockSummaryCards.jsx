import React from 'react'
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi'

const StockSummaryCards = ({
  filteredInventory,
  lowStockItems,
  outOfStockItems,
  lowStockThreshold
}) => {
  const cards = [
    {
      title: 'Total Products',
      value: filteredInventory.length,
      color: 'blue',
      icon: '📦'
    },
    {
      title: 'In Stock',
      value: filteredInventory.filter(item => item.remainingStock > lowStockThreshold).length,
      color: 'green',
      icon: <FiCheckCircle className="w-4 h-4" />
    },
    {
      title: 'Low Stock',
      value: lowStockItems.length,
      color: 'yellow',
      icon: <FiAlertTriangle className="w-4 h-4" />
    },
    {
      title: 'Out of Stock',
      value: outOfStockItems.length,
      color: 'red',
      icon: <FiAlertTriangle className="w-4 h-4" />
    }
  ]

  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', value: 'text-slate-900' },
    green: { bg: 'bg-green-100', text: 'text-green-600', value: 'text-green-600' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', value: 'text-yellow-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600', value: 'text-red-600' }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{card.title}</p>
              <p className={`text-2xl font-semibold ${colorClasses[card.color].value}`}>
                {card.value}
              </p>
            </div>
            <div className={`w-8 h-8 ${colorClasses[card.color].bg} rounded-full flex items-center justify-center`}>
              <span className={colorClasses[card.color].text}>
                {card.icon}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StockSummaryCards