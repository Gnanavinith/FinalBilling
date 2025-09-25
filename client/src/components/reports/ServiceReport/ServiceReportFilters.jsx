import React from 'react'
import { FiFilter } from 'react-icons/fi'

const ServiceReportFilters = ({ filters, setFilters }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 p-4 md:p-6 shadow-lg hover:shadow-xl transition-all mb-4 md:mb-6">
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <FiFilter className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
        <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
          Filters
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full rounded-lg md:rounded-xl border-2 border-slate-200 px-3 py-2 text-sm md:text-base focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all"
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
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full rounded-lg md:rounded-xl border-2 border-slate-200 px-3 py-2 text-sm md:text-base focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full rounded-lg md:rounded-xl border-2 border-slate-200 px-3 py-2 text-sm md:text-base focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
              />
            </div>
          </>
        )}
        
        <div>
          <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full rounded-lg md:rounded-xl border-2 border-slate-200 px-3 py-2 text-sm md:text-base focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">Technician</label>
          <input
            type="text"
            value={filters.technician}
            onChange={(e) => handleFilterChange('technician', e.target.value)}
            placeholder="Search technician..."
            className="w-full rounded-lg md:rounded-xl border-2 border-slate-200 px-3 py-2 text-sm md:text-base focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all"
          />
        </div>
        
        <div>
          <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">Customer Name</label>
          <input
            type="text"
            value={filters.customerName}
            onChange={(e) => handleFilterChange('customerName', e.target.value)}
            placeholder="Search customer..."
            className="w-full rounded-lg md:rounded-xl border-2 border-slate-200 px-3 py-2 text-sm md:text-base focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all"
          />
        </div>
        
        <div>
          <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">Service Type</label>
          <input
            type="text"
            value={filters.serviceType}
            onChange={(e) => handleFilterChange('serviceType', e.target.value)}
            placeholder="Search problem type..."
            className="w-full rounded-lg md:rounded-xl border-2 border-slate-200 px-3 py-2 text-sm md:text-base focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all"
          />
        </div>
      </div>
    </div>
  )
}

export default ServiceReportFilters