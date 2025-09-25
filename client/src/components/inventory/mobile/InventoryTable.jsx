import React from 'react'
import { FiPackage, FiTag, FiSmartphone, FiDollarSign, FiCheckCircle, FiCalendar, FiDownload, FiAlertTriangle } from 'react-icons/fi'
import InventoryTableRow from './InventoryTableRow'

const InventoryTable = ({ inventory, lowStockThreshold, onDownloadStatement }) => {
  const getStockStatus = (stock) => {
    if (stock <= 0) return { color: 'bg-red-100 text-red-700', icon: FiAlertTriangle, text: 'Out of Stock' }
    if (stock <= lowStockThreshold) return { color: 'bg-yellow-100 text-yellow-700', icon: FiAlertTriangle, text: 'Low Stock' }
    return { color: 'bg-green-100 text-green-700', icon: FiCheckCircle, text: 'In Stock' }
  }

  const columns = [
    { key: 'productName', label: 'Product Name', icon: FiTag },
    { key: 'brand', label: 'Brand', icon: FiTag },
    { key: 'model', label: 'Model/Variant', icon: FiSmartphone },
    { key: 'imei', label: 'IMEI', icon: FiTag, width: 'w-48' },
    { key: 'features', label: 'Features' },
    { key: 'stock', label: 'Remaining Stock' },
    { key: 'purchasePrice', label: 'Purchase Price', icon: FiDollarSign },
    { key: 'stockValue', label: 'Stock Value', icon: FiDollarSign },
    { key: 'status', label: 'Status', icon: FiCheckCircle },
    { key: 'updated', label: 'Last Updated', icon: FiCalendar },
    { key: 'actions', label: 'Actions', icon: FiDownload }
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
          <FiPackage className="text-slate-700" /> Mobile Stock Details
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 text-xs uppercase border-b bg-gradient-to-r from-indigo-50 to-blue-50">
              {columns.map(column => (
                <th key={column.key} className={`py-3 px-4 ${column.width || ''}`}>
                  <div className="flex items-center gap-1">
                    {column.icon && <column.icon className="w-4 h-4" />}
                    {column.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td className="py-8 px-4 text-center text-slate-500" colSpan={columns.length}>
                  No mobile products found in inventory.
                </td>
              </tr>
            ) : (
              inventory.map(item => (
                <InventoryTableRow
                  key={item.id}
                  item={item}
                  lowStockThreshold={lowStockThreshold}
                  getStockStatus={getStockStatus}
                  onDownloadStatement={onDownloadStatement}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InventoryTable