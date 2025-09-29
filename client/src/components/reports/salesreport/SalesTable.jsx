import React, { useState, useMemo } from 'react'
import { FiChevronDown, FiChevronUp, FiInfo, FiSearch, FiFilter, FiDownload } from 'react-icons/fi'
import { formatCurrency } from './utils'

const SalesTable = ({ data }) => {
  const [expandedRow, setExpandedRow] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item => {
      const searchLower = searchTerm.toLowerCase()
      return (
        item.invoiceNumber?.toLowerCase().includes(searchLower) ||
        item.customerName?.toLowerCase().includes(searchLower) ||
        item.productName?.toLowerCase().includes(searchLower) ||
        item.paymentMode?.toLowerCase().includes(searchLower)
      )
    })

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      
      if (sortField === 'date') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    return filtered
  }, [data, searchTerm, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredAndSortedData.slice(startIndex, endIndex)

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const MobileRow = ({ item, index }) => (
    <div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 mb-3 shadow-sm hover:shadow-md transition-all">
      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
        <div className="font-medium text-slate-600">Invoice #</div>
        <div className="font-semibold text-slate-900">{item.invoiceNumber}</div>
        
        <div className="font-medium text-slate-600">Date</div>
        <div className="text-slate-700">{item.date} {item.time}</div>
        
        <div className="font-medium text-slate-600">Customer</div>
        <div>
          <div className="font-medium text-slate-900">{item.customerName || '-'}</div>
          <div className="text-slate-500 text-xs">{item.customerPhone || '-'}</div>
        </div>
        
        <div className="font-medium text-slate-600">Product</div>
        <div>
          <div className="font-medium text-slate-900">{item.productName}{item.model ? ` (${item.model})` : ''}</div>
          <div className="text-slate-500 text-xs">{item.productId || '-'}</div>
        </div>
        
        <div className="font-medium text-slate-600">Price</div>
        <div className="font-semibold text-green-600">{formatCurrency(item.sellingPrice)}</div>
        
        <div className="font-medium text-slate-600">Net Total</div>
        <div className="font-bold text-blue-600">{formatCurrency(item.netTotal)}</div>
      </div>
      
      <button
        onClick={() => setExpandedRow(expandedRow === index ? null : index)}
        className="w-full mt-3 flex items-center justify-center gap-1 text-slate-600 hover:text-slate-900 py-2 border-t border-slate-200 text-xs sm:text-sm"
      >
        {expandedRow === index ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
        {expandedRow === index ? 'Hide Details' : 'Show Details'}
      </button>
      
      {expandedRow === index && (
        <div className="mt-3 pt-3 border-t border-slate-200 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div><span className="text-slate-500">Specs:</span> {[item.color,item.ram,item.storage].filter(Boolean).join(' • ') || '-'}</div>
            <div><span className="text-slate-500">IMEI:</span> {item.imei || '-'}</div>
            <div><span className="text-slate-500">Qty:</span> {item.quantity}</div>
            <div><span className="text-slate-500">Discount:</span> {formatCurrency(item.discount)}</div>
            <div><span className="text-slate-500">GST:</span> {formatCurrency(item.gstAmount)}</div>
            <div><span className="text-slate-500">Payment:</span> {item.paymentMode}</div>
            <div><span className="text-slate-500">Salesperson:</span> {item.salesperson || '-'}</div>
          </div>
          
          <div className="grid grid-cols-1 gap-1 text-xs">
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
      <tr className="hover:bg-slate-50 transition-colors">
        <td className="px-3 py-3 text-sm">
          <button 
            onClick={() => setExpandedRow(expandedRow === index ? null : index)}
            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 p-1 rounded hover:bg-slate-100"
          >
            {expandedRow === index ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </button>
        </td>
        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{item.invoiceNumber}</td>
        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-slate-500">{item.date} {item.time}</td>
        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-slate-900">
          <div className="font-medium">{item.customerName || '-'}</div>
          <div className="text-slate-500 text-xs">{item.customerPhone || '-'}</div>
        </td>
        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-slate-900">
          <div className="font-medium">{item.productName}{item.model ? ` (${item.model})` : ''}</div>
          <div className="text-slate-500 text-xs">{item.productId || '-'}</div>
        </td>
        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-slate-500">{[item.color,item.ram,item.storage].filter(Boolean).join(' • ') || '-'}</td>
        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-slate-500">{item.imei || '-'}</td>
        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-slate-900">{item.quantity}</td>
        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-slate-900">{formatCurrency(item.sellingPrice)}</td>
        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-slate-900">{formatCurrency(item.totalAmount)}</td>
        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-slate-900">{formatCurrency(item.discount)}</td>
        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-slate-900">{formatCurrency(item.gstAmount)}</td>
        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm font-bold text-blue-600">{formatCurrency(item.netTotal)}</td>
        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-slate-900">{item.paymentMode}</td>
        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-slate-900">{item.salesperson || '-'}</td>
      </tr>
      {expandedRow === index && (
        <tr className="bg-slate-50">
          <td></td>
          <td colSpan={14} className="px-3 sm:px-6 py-4 text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <FiInfo className="mt-1 text-slate-500 flex-shrink-0" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-1 w-full">
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
    <div className="bg-white rounded-md sm:rounded-lg lg:rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="p-2 sm:p-3 lg:p-4 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <h3 className="text-sm sm:text-base lg:text-lg font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
            Sales Details ({filteredAndSortedData.length} records)
          </h3>
          
          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3 sm:w-4 sm:h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-slate-200 rounded-md sm:rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-400 w-full sm:w-48 lg:w-64"
              />
            </div>
            
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-slate-200 rounded-md sm:rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-400"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden p-2 sm:p-3">
        {paginatedData.length === 0 ? (
          <div className="text-center py-6 text-slate-500">
            <FiFilter className="w-6 h-6 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">No records found</p>
          </div>
        ) : (
          paginatedData.map((item, index) => (
            <MobileRow key={index} item={item} index={index} />
          ))
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto max-h-96 lg:max-h-[500px] xl:max-h-[600px]">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 sticky top-0 z-10">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('invoiceNumber')}
              >
                Invoice # {sortField === 'invoiceNumber' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('date')}
              >
                Date & Time {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('customerName')}
              >
                Customer {sortField === 'customerName' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Specs</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">IMEI</th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('quantity')}
              >
                Qty {sortField === 'quantity' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('sellingPrice')}
              >
                Price {sortField === 'sellingPrice' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Discount</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">GST</th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('netTotal')}
              >
                Net Total {sortField === 'netTotal' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('paymentMode')}
              >
                Payment {sortField === 'paymentMode' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Salesperson</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={15} className="px-6 py-6 text-center text-slate-500">
                  <FiFilter className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No records found</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <DesktopRow key={index} item={item} index={index} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div className="text-xs sm:text-sm text-slate-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-slate-200 rounded-md sm:rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded-md sm:rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-slate-200 rounded-md sm:rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalesTable