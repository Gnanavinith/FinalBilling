import React from 'react'
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi'

const StockSummaryCards = ({ inventory, lowStockThreshold, lowStockItems, outOfStockItems }) => {
  const summaryCards = [
    {
      title: 'Total Products',
      value: inventory.length,
      color: 'blue',
      icon: '📱'
    },
    {
      title: 'In Stock',
      value: inventory.filter(item => item.remainingStock > lowStockThreshold).length,
      color: 'green',
      icon: FiCheckCircle
    },
    {
      title: 'Low Stock',
      value: lowStockItems.length,
      color: 'yellow',
      icon: FiAlertTriangle
    },
    {
      title: 'Out of Stock',
      value: outOfStockItems.length,
      color: 'red',
      icon: FiAlertTriangle
    }
  ]

  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' }
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {summaryCards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">{card.title}</p>
              <p className={`text-lg sm:text-xl lg:text-2xl font-semibold ${colorClasses[card.color].text}`}>
                {card.value}
              </p>
            </div>
            <div className={`w-6 h-6 sm:w-8 sm:h-8 ${colorClasses[card.color].bg} rounded-full flex items-center justify-center flex-shrink-0 ml-2`}>
              {typeof card.icon === 'string' ? (
                <span className="text-xs sm:text-sm font-semibold">{card.icon}</span>
              ) : (
                <card.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${colorClasses[card.color].text}`} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StockSummaryCards