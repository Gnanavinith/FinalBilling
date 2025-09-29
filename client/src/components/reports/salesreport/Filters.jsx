import React, { useState } from 'react'
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const Filters = ({ filters, setFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearAllFilters = () => {
    setFilters({
      dateRange: 'thisMonth',
      startDate: '',
      endDate: '',
      invoiceNumber: '',
      productName: '',
      paymentMode: '',
      salesperson: '',
      customerName: ''
    })
  }

  // Count active filters
  React.useEffect(() => {
    const count = Object.entries(filters).filter(([key, value]) => {
      if (key === 'dateRange') return value !== 'thisMonth'
      return value !== ''
    }).length
    setActiveFiltersCount(count)
  }, [filters])

  const filterFields = [
    {
      key: 'dateRange',
      label: 'Date Range',
      type: 'select',
      options: [
        { value: 'today', label: 'Today' },
        { value: 'thisWeek', label: 'This Week' },
        { value: 'thisMonth', label: 'This Month' },
        { value: 'custom', label: 'Custom Range' }
      ],
      colSpan: 'col-span-1 sm:col-span-2 lg:col-span-1'
    },
    {
      key: 'invoiceNumber',
      label: 'Invoice #',
      type: 'text',
      placeholder: 'Search invoice...',
      colSpan: 'col-span-1'
    },
    {
      key: 'productName',
      label: 'Product Name',
      type: 'text',
      placeholder: 'Search product...',
      colSpan: 'col-span-1'
    },
    {
      key: 'paymentMode',
      label: 'Payment Mode',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'Cash', label: 'Cash' },
        { value: 'UPI', label: 'UPI' },
        { value: 'Card', label: 'Card' },
        { value: 'EMI', label: 'EMI' }
      ],
      colSpan: 'col-span-1'
    },
    {
      key: 'salesperson',
      label: 'Salesperson',
      type: 'text',
      placeholder: 'Search salesperson...',
      colSpan: 'col-span-1'
    },
    {
      key: 'customerName',
      label: 'Customer Name',
      type: 'text',
      placeholder: 'Search customer...',
      colSpan: 'col-span-1'
    }
  ]

  return (
    <div className="bg-white rounded-md sm:rounded-lg lg:rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 mb-3 sm:mb-4 lg:mb-6">
      {/* Header */}
      <div className="p-2 sm:p-3 lg:p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiFilter className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm sm:text-base lg:text-lg font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              Filters
            </h2>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
              >
                <FiX className="w-3 h-3" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden text-slate-600 hover:text-slate-800"
            >
              {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Fields */}
      <div className={`p-2 sm:p-3 lg:p-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
          {filterFields.map((field) => (
            <div key={field.key} className={field.colSpan}>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  value={filters[field.key]}
                  onChange={(e) => handleFilterChange(field.key, e.target.value)}
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs sm:text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all bg-white"
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={filters[field.key]}
                  onChange={(e) => handleFilterChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs sm:text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
                />
              )}
            </div>
          ))}
        </div>

        {/* Custom Date Range */}
        {filters.dateRange === 'custom' && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs sm:text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs sm:text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Filters