import React from 'react'
import { FiFilter } from 'react-icons/fi'

const Filters = ({ filters, setFilters }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FiFilter className="w-4 h-4 lg:w-5 lg:h-5 text-slate-600" />
        <h2 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
          Filters
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full rounded-lg lg:rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {filters.dateRange === 'custom' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full rounded-lg lg:rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full rounded-lg lg:rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Invoice #</label>
          <input
            type="text"
            value={filters.invoiceNumber}
            onChange={(e) => handleFilterChange('invoiceNumber', e.target.value)}
            placeholder="Search invoice..."
            className="w-full rounded-lg lg:rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
          <input
            type="text"
            value={filters.productName}
            onChange={(e) => handleFilterChange('productName', e.target.value)}
            placeholder="Search product..."
            className="w-full rounded-lg lg:rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Payment Mode</label>
          <select
            value={filters.paymentMode}
            onChange={(e) => handleFilterChange('paymentMode', e.target.value)}
            className="w-full rounded-lg lg:rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
          >
            <option value="">All</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="EMI">EMI</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Salesperson</label>
          <input
            type="text"
            value={filters.salesperson}
            onChange={(e) => handleFilterChange('salesperson', e.target.value)}
            placeholder="Search salesperson..."
            className="w-full rounded-lg lg:rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
          <input
            type="text"
            value={filters.customerName}
            onChange={(e) => handleFilterChange('customerName', e.target.value)}
            placeholder="Search customer..."
            className="w-full rounded-lg lg:rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
          />
        </div>
      </div>
    </div>
  )
}

export default Filters