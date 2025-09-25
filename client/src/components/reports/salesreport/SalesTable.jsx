import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiInfo } from 'react-icons/fi'
import { formatCurrency } from './utils'

const SalesTable = ({ data }) => {
  const [expandedRow, setExpandedRow] = useState(null)

  const MobileRow = ({ item, index }) => (
    <div className="bg-white rounded-lg border border-slate-200 p-4 mb-3 shadow-sm">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="font-medium">Invoice #</div>
        <div>{item.invoiceNumber}</div>
        
        <div className="font-medium">Date</div>
        <div>{item.date} {item.time}</div>
        
        <div className="font-medium">Customer</div>
        <div>
          <div>{item.customerName}</div>
          <div className="text-slate-500 text-xs">{item.customerPhone}</div>
        </div>
        
        <div className="font-medium">Product</div>
        <div>
          <div>{item.productName}{item.model ? ` (${item.model})` : ''}</div>
          <div className="text-slate-500 text-xs">{item.productId}</div>
        </div>
        
        <div className="font-medium">Price</div>
        <div>{formatCurrency(item.sellingPrice)}</div>
        
        <div className="font-medium">Net Total</div>
        <div className="font-medium">{formatCurrency(item.netTotal)}</div>
      </div>
      
      <button
        onClick={() => setExpandedRow(expandedRow === index ? null : index)}
        className="w-full mt-3 flex items-center justify-center gap-1 text-slate-600 hover:text-slate-900 py-2 border-t border-slate-200"
      >
        {expandedRow === index ? <FiChevronUp /> : <FiChevronDown />}
        Details
      </button>
      
      {expandedRow === index && (
        <div className="mt-3 pt-3 border-t border-slate-200 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div><span className="text-slate-500">Specs:</span> {[item.color,item.ram,item.storage].filter(Boolean).join(' • ') || '-'}</div>
            <div><span className="text-slate-500">IMEI:</span> {item.imei || '-'}</div>
            <div><span className="text-slate-500">Qty:</span> {item.quantity}</div>
            <div><span className="text-slate-500">Discount:</span> {formatCurrency(item.discount)}</div>
            <div><span className="text-slate-500">GST:</span> {formatCurrency(item.gstAmount)}</div>
            <div><span className="text-slate-500">Payment:</span> {item.paymentMode}</div>
            <div><span className="text-slate-500">Salesperson:</span> {item.salesperson}</div>
          </div>
          
          <div className="mt-2 grid grid-cols-1 gap-1 text-xs">
            <div><span className="text-slate-500">Processor:</span> {item.processor || '-'}</div>
            <div><span className="text-slate-500">Display:</span> {item.displaySize || '-'}</div>
            <div><span className="text-slate-500">Camera:</span> {item.camera || '-'}</div>
            <div><span className="text-slate-500">Battery:</span> {item.battery || '-'}</div>
            <div><span className="text-slate-500">OS:</span> {item.operatingSystem || '-'}</div>
            <div><span className="text-slate-500">Network:</span> {item.networkType || '-'}</div>
          </div>
        </div>
      )}
    </div>
  )

  const DesktopRow = ({ item, index }) => (
    <React.Fragment key={index}>
      <tr className="hover:bg-slate-50">
        <td className="px-3 py-4 text-sm">
          <button 
            onClick={() => setExpandedRow(expandedRow === index ? null : index)}
            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"
          >
            {expandedRow === index ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.invoiceNumber}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.date} {item.time}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
          <div>{item.customerName}</div>
          <div className="text-slate-500">{item.customerPhone}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
          <div>{item.productName}{item.model ? ` (${item.model})` : ''}</div>
          <div className="text-slate-500">{item.productId}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{[item.color,item.ram,item.storage].filter(Boolean).join(' • ') || '-'}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.imei || '-'}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{item.quantity}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{formatCurrency(item.sellingPrice)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{formatCurrency(item.totalAmount)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{formatCurrency(item.discount)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{formatCurrency(item.gstAmount)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{formatCurrency(item.netTotal)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{item.paymentMode}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{item.salesperson}</td>
      </tr>
      {expandedRow === index && (
        <tr className="bg-slate-50">
          <td></td>
          <td colSpan={14} className="px-6 py-4 text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <FiInfo className="mt-1 text-slate-500" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-1 w-full">
                <div><span className="text-slate-500">Processor:</span> {item.processor || '-'}</div>
                <div><span className="text-slate-500">Display:</span> {item.displaySize || '-'}</div>
                <div><span className="text-slate-500">Camera:</span> {item.camera || '-'}</div>
                <div><span className="text-slate-500">Battery:</span> {item.battery || '-'}</div>
                <div><span className="text-slate-500">OS:</span> {item.operatingSystem || '-'}</div>
                <div><span className="text-slate-500">Network:</span> {item.networkType || '-'}</div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  )

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all">
      <div className="p-4 lg:p-6 border-b border-slate-200">
        <h3 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
          Sales Details ({data.length} records)
        </h3>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden p-4">
        {data.map((item, index) => (
          <MobileRow key={index} item={item} index={index} />
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Invoice #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Specs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">IMEI</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Qty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">GST</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Net Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Salesperson</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.map((item, index) => (
              <DesktopRow key={index} item={item} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SalesTable