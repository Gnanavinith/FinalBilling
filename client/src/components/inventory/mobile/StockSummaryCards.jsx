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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {summaryCards.map((card, index) => (
        <div key={index} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{card.title}</p>
              <p className={`text-2xl font-semibold ${colorClasses[card.color].text}`}>
                {card.value}
              </p>
            </div>
            <div className={`w-8 h-8 ${colorClasses[card.color].bg} rounded-full flex items-center justify-center`}>
              {typeof card.icon === 'string' ? (
                <span className="text-sm font-semibold">{card.icon}</span>
              ) : (
                <card.icon className={`w-4 h-4 ${colorClasses[card.color].text}`} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StockSummaryCards