import React from 'react'
import { FiShoppingBag } from 'react-icons/fi'
import { formatCurrency } from './utils'

const SummaryCards = ({ summary }) => {
  const cards = [
    {
      title: 'Total Sales',
      value: formatCurrency(summary.totalSales),
      icon: <FiShoppingBag className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />,
      color: 'blue'
    },
    {
      title: 'Total Quantity',
      value: summary.totalQuantity,
      icon: <FiShoppingBag className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />,
      color: 'green'
    },
    {
      title: 'Total Discount',
      value: formatCurrency(summary.totalDiscount),
      icon: <FiShoppingBag className="w-6 h-6 lg:w-8 lg:h-8 text-orange-600" />,
      color: 'orange'
    },
    {
      title: 'Total GST',
      value: formatCurrency(summary.totalGST),
      icon: <FiShoppingBag className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600" />,
      color: 'purple'
    },
    {
      title: 'Net Total',
      value: formatCurrency(summary.netTotal),
      icon: <FiShoppingBag className="w-6 h-6 lg:w-8 lg:h-8 text-indigo-600" />,
      color: 'indigo'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-3 lg:p-4 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs lg:text-sm text-slate-600 truncate">{card.title}</p>
              <p className="text-lg lg:text-2xl font-semibold truncate">{card.value}</p>
            </div>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards