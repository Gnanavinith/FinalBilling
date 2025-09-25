import React from 'react'
import { FiFilter, FiSearch } from 'react-icons/fi'

const PurchaseFilters = ({ filters, onFiltersChange, dealers }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <FiFilter className="w-4 h-4" />
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Dealer</label>
          <select
            value={filters.dealerId}
            onChange={(e) => handleFilterChange('dealerId', e.target.value)}
            className="w-full rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all px-3 lg:px-4 py-2 lg:py-2.5 text-sm lg:text-base"
          >
            <option value="">All Dealers</option>
            {dealers.map(dealer => (
              <option key={dealer.id} value={dealer.id}>
                {dealer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="w-full rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all px-3 lg:px-4 py-2 lg:py-2.5 text-sm lg:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="w-full rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all px-3 lg:px-4 py-2 lg:py-2.5 text-sm lg:text-base"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Product, model, invoice..."
              className="w-full rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all px-3 lg:px-4 py-2 lg:py-2.5 pl-9 lg:pl-10 text-sm lg:text-base"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Additional filters row */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-3 lg:px-4 py-2 lg:py-2.5 text-sm lg:text-base"
          >
            <option value="">All Categories</option>
            <option value="Mobile">Mobile</option>
            <option value="Accessories">Accessories</option>
            <option value="Service Item">Service Item</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default PurchaseFilters