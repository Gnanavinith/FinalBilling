import React from 'react'
import { FiShoppingBag, FiTrendingUp, FiPercent, FiDollarSign, FiCreditCard } from 'react-icons/fi'
import { formatCurrency } from './utils'

const SummaryCards = ({ summary }) => {
  const cards = [
    {
      title: 'Total Sales',
      value: formatCurrency(summary.totalSales),
      icon: <FiShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-600" />,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Total Quantity',
      value: summary.totalQuantity.toLocaleString(),
      icon: <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-green-600" />,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Total Discount',
      value: formatCurrency(summary.totalDiscount),
      icon: <FiPercent className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-orange-600" />,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'Total GST',
      value: formatCurrency(summary.totalGST),
      icon: <FiDollarSign className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-purple-600" />,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Net Total',
      value: formatCurrency(summary.netTotal),
      icon: <FiCreditCard className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-indigo-600" />,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    }
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={`bg-white rounded-md sm:rounded-lg lg:rounded-xl border border-slate-200 p-2 sm:p-3 lg:p-4 shadow-sm hover:shadow-md transition-all duration-200 ${card.bgColor} hover:scale-105`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-1 sm:pr-2">
              <p className="text-xs text-slate-600 truncate mb-1">{card.title}</p>
              <p className={`text-sm sm:text-base lg:text-lg xl:text-xl font-bold truncate ${card.textColor}`}>
                {card.value}
              </p>
            </div>
            <div className="flex-shrink-0">
              {card.icon}
            </div>
          </div>
          
          {/* Progress indicator for mobile */}
          <div className="mt-1 sm:hidden">
            <div className="h-0.5 bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full w-3/4 bg-gradient-to-r from-${card.color}-400 to-${card.color}-600 rounded-full`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards