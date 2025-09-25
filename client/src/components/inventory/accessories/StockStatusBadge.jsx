import React from 'react'
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'

const StockStatusBadge = ({ stock, lowStockThreshold }) => {
  const getStockStatus = (stock) => {
    if (stock <= 0) return { color: 'bg-red-100 text-red-700', icon: FiAlertTriangle, text: 'Out of Stock' }
    if (stock <= lowStockThreshold) return { color: 'bg-yellow-100 text-yellow-700', icon: FiAlertTriangle, text: 'Low Stock' }
    return { color: 'bg-green-100 text-green-700', icon: FiCheckCircle, text: 'In Stock' }
  }

  const stockStatus = getStockStatus(stock)
  const StatusIcon = stockStatus.icon

  return (
    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
      <StatusIcon className="w-3 h-3" />
      <span>{stockStatus.text}</span>
    </span>
  )
}

export default StockStatusBadge