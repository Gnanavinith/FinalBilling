import React from 'react'

const InventoryTableRow = ({ item, lowStockThreshold, getStockStatus, onDownloadStatement }) => {
  const stockStatus = getStockStatus(item.remainingStock)
  const StockIcon = stockStatus.icon
  const stockValue = item.remainingStock * item.purchasePrice
  const lastUpdated = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString()

  return (
    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
      <td className="py-3 px-4">
        <div className="font-medium text-slate-900">{item.productName}</div>
        <div className="text-xs text-slate-500">{item.dealerName}</div>
      </td>
      <td className="py-3 px-4">
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
          {item.brand && item.brand.trim() ? item.brand : 'No Brand'}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="font-medium">{item.model}</div>
        {item.color && (
          <div className="text-xs text-slate-500">Color: {item.color}</div>
        )}
      </td>
      <td className="py-3 px-4 w-48">
        <div className="font-mono text-xs">
          <div>{item.imei1 ? item.imei1 : '-'}</div>
          {item.imei2 ? (
            <div className="text-slate-500">{item.imei2}</div>
          ) : null}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="text-xs space-y-1">
          {item.ram && <div>RAM: {item.ram}</div>}
          {item.storage && <div>Storage: {item.storage}</div>}
          {item.processor && <div>CPU: {item.processor}</div>}
          {item.displaySize && <div>Display: {item.displaySize}</div>}
        </div>
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
      <td className="py-3 px-4">
        <span className="font-medium">₹{item.purchasePrice.toFixed(2)}</span>
      </td>
      <td className="py-3 px-4">
        <span className="font-medium text-green-600">₹{stockValue.toFixed(2)}</span>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
          <StockIcon className="w-3 h-3" />
          <span>{stockStatus.text}</span>
        </span>
      </td>
      <td className="py-3 px-4 text-slate-500">
        {lastUpdated}
      </td>
      <td className="py-3 px-4">
        <button 
          onClick={() => onDownloadStatement(item)} 
          className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50 inline-flex items-center gap-1"
        >
          <FiDownload className="w-3 h-3" /> Download
        </button>
      </td>
    </tr>
  )
}

export default InventoryTableRow