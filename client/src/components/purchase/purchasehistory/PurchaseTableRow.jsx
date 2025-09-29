import React from 'react'
import { FiEye, FiDownload } from 'react-icons/fi'
import { downloadItemDetails } from './utils/exportUtils'

const PurchaseTableRow = ({
  purchase,
  item,
  itemIndex,
  dealers,
  itemCodes,
  onViewDetails,
  onMarkReceived,
  onLoadItemCodes,
  getDealerName,
  calculateRemainingStock,
  isMobile = false
}) => {
  const key = `${purchase.id}-${itemIndex}`
  const identifier = String(item.category || '').toLowerCase().startsWith('mobile')
    ? (String(item.imeiNumber1 || '').trim() || '-')
    : (item.productId && String(item.productId).trim()
        ? item.productId
        : (itemCodes[key] && itemCodes[key].length
            ? itemCodes[key].join(', ')
            : '-'))

  if (isMobile) {
    return null // Handled by MobilePurchaseCard in Table component
  }

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="py-3 px-4">{getDealerName(purchase.dealerId, dealers)}</td>
      <td className="py-3 px-4">{item.productName}</td>
      <td className="py-3 px-4">{item.model}</td>
      <td className="py-3 px-4 text-xs">{identifier}</td>
      <td className="py-3 px-4">
        <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">
          {item.category}
        </span>
      </td>
      <td className="py-3 px-4">{item.quantity}</td>
      <td className="py-3 px-4">
        <button
          onClick={() => onLoadItemCodes(purchase, item, itemIndex)}
          className="text-indigo-600 hover:text-indigo-800 underline text-xs"
        >
          View IDs
        </button>
        {itemCodes[key] && (
          <div className="mt-1 text-xs text-slate-600 max-w-xs whitespace-pre-wrap break-words">
            {itemCodes[key].length ? itemCodes[key].join(', ') : '—'}
          </div>
        )}
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 text-xs rounded-full ${purchase.status === 'Received' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {purchase.status || 'Pending'}
        </span>
      </td>
      <td className="py-3 px-4">₹{item.purchasePrice.toFixed(2)}</td>
      <td className="py-3 px-4">₹{item.sellingPrice.toFixed(2)}</td>
      <td className="py-3 px-4">₹{item.totalPrice.toFixed(2)}</td>
      <td className="py-3 px-4">
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
          {purchase.paymentMode}
        </span>
      </td>
      <td className="py-3 px-4 text-sm">{purchase.purchaseDate}</td>
      <td className="py-3 px-4 text-sm">{purchase.invoiceNumber}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(purchase)}
            className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
            title="View"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => downloadItemDetails(purchase, item, dealers)}
            className="p-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
            title="Download Item PDF"
          >
            <FiDownload className="w-4 h-4" />
          </button>
          {purchase.status !== 'Received' && (
            <button
              onClick={() => onMarkReceived(purchase.id)}
              className="px-3 py-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-xs"
              title="Mark Received and move to stock"
            >
              Received
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

export default PurchaseTableRow