import React from 'react'
import { FiPackage, FiTag, FiSmartphone, FiDollarSign, FiCheckCircle, FiCalendar, FiDownload, FiAlertTriangle } from 'react-icons/fi'

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
    <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all">
      <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-200">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
          <FiPackage className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" /> 
          <span className="truncate">Mobile Stock Details</span>
        </h2>
      </div>
      
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
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

      {/* Mobile Cards */}
      <div className="lg:hidden p-3 sm:p-4 space-y-3">
        {inventory.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FiPackage className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">No mobile products found in inventory.</p>
          </div>
        ) : (
          inventory.map(item => (
            <MobileInventoryCard
              key={item.id}
              item={item}
              lowStockThreshold={lowStockThreshold}
              getStockStatus={getStockStatus}
              onDownloadStatement={onDownloadStatement}
            />
          ))
        )}
      </div>
    </div>
  )
}

// Desktop row component
const InventoryTableRow = ({ item, lowStockThreshold, getStockStatus, onDownloadStatement }) => {
  const stockStatus = getStockStatus(item.remainingStock)
  const stockValue = item.remainingStock * item.purchasePrice
  const lastUpdated = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString()

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4 text-slate-900 font-medium">{item.productName}</td>
      <td className="py-3 px-4 text-slate-700">{item.brand && item.brand.trim() ? item.brand : 'No Brand'}</td>
      <td className="py-3 px-4 text-slate-700">{item.model}</td>
      <td className="py-3 px-4 text-slate-700 font-mono">{item.imei1 || item.imei || '-'}</td>
      <td className="py-3 px-4 text-slate-700 text-xs space-y-1">
        {item.ram && <div>RAM: {item.ram}</div>}
        {item.storage && <div>Storage: {item.storage}</div>}
        {item.processor && <div>CPU: {item.processor}</div>}
        {item.displaySize && <div>Display: {item.displaySize}</div>}
      </td>
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
      <td className="py-3 px-4 text-slate-700">₹{item.purchasePrice.toFixed(2)}</td>
      <td className="py-3 px-4 text-green-700 font-medium">₹{stockValue.toFixed(2)}</td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
          <FiCheckCircle className="w-3 h-3" />
          <span>{stockStatus.text}</span>
        </span>
      </td>
      <td className="py-3 px-4 text-slate-500 text-xs">{lastUpdated}</td>
      <td className="py-3 px-4">
        <button 
          onClick={() => onDownloadStatement(item)}
          className="px-3 py-1.5 text-xs rounded-md border hover:bg-slate-50 inline-flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
        >
          <FiDownload className="w-3 h-3" /> Download
        </button>
      </td>
    </tr>
  )
}

// Mobile Card Component
const MobileInventoryCard = ({ item, lowStockThreshold, getStockStatus, onDownloadStatement }) => {
  const stockStatus = getStockStatus(item.remainingStock)
  const StockIcon = stockStatus.icon
  const stockValue = item.remainingStock * item.purchasePrice
  const lastUpdated = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString()

  return (
    <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs text-slate-500">Product Name</label>
          <p className="font-medium text-slate-900 truncate">{item.productName}</p>
          <p className="text-xs text-slate-500">{item.dealerName}</p>
        </div>
        <div>
          <label className="text-xs text-slate-500">Brand</label>
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            {item.brand && item.brand.trim() ? item.brand : 'No Brand'}
          </span>
        </div>
        <div>
          <label className="text-xs text-slate-500">Model</label>
          <p className="font-medium">{item.model}</p>
          {item.color && (
            <p className="text-xs text-slate-500">Color: {item.color}</p>
          )}
        </div>
        <div>
          <label className="text-xs text-slate-500">IMEI</label>
          <div className="font-mono text-xs">
            <div>{item.imei1 ? item.imei1 : '-'}</div>
            {item.imei2 && (
              <div className="text-slate-500">{item.imei2}</div>
            )}
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500">Features</label>
          <div className="text-xs space-y-1">
            {item.ram && <div>RAM: {item.ram}</div>}
            {item.storage && <div>Storage: {item.storage}</div>}
            {item.processor && <div>CPU: {item.processor}</div>}
            {item.displaySize && <div>Display: {item.displaySize}</div>}
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500">Stock Status</label>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              item.remainingStock <= 0 
                ? 'bg-red-100 text-red-700' 
                : item.remainingStock <= lowStockThreshold
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {item.remainingStock}
            </span>
            <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
              <StockIcon className="w-3 h-3" />
              <span>{stockStatus.text}</span>
            </span>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500">Purchase Price</label>
          <p className="font-medium">₹{item.purchasePrice.toFixed(2)}</p>
        </div>
        <div>
          <label className="text-xs text-slate-500">Stock Value</label>
          <p className="font-medium text-green-600">₹{stockValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-slate-200 pt-3">
        <div className="text-xs text-slate-500">
          Updated: {lastUpdated}
        </div>
        <button 
          onClick={() => onDownloadStatement(item)} 
          className="px-3 py-1.5 text-xs rounded-md border hover:bg-slate-50 inline-flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
        >
          <FiDownload className="w-3 h-3" /> Download
        </button>
      </div>
    </div>
  )
}

export default InventoryTable