import React from 'react'
import { FiSearch, FiFilter } from 'react-icons/fi'

const SearchAndFilterBar = ({
  searchInput,
  setSearchInput,
  search,
  setSearch,
  filters,
  onFilterChange,
  filterOptions,
  onClearFilters
}) => {
  return (
    <div className="space-y-4">
      {/* Search Section */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { setSearch(searchInput.trim()) } }}
            placeholder="Search by brand or mobile name..."
            className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 sm:focus:ring-4 focus:ring-indigo-100 transition-all px-3 sm:px-4 py-2 sm:py-2.5 pl-8 sm:pl-10 text-sm sm:text-base"
          />
          <FiSearch className="absolute left-2 sm:left-3 top-2 sm:top-2.5 w-4 h-4 text-slate-400" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSearch(searchInput.trim())}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 flex items-center gap-1 sm:gap-2 transition-all text-sm sm:text-base"
          >
            <FiSearch className="w-4 h-4" />
            <span className="hidden sm:inline">Find</span>
          </button>
          <button
            onClick={onClearFilters}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all text-sm sm:text-base"
          >
            <span className="hidden sm:inline">Clear Filters</span>
            <span className="sm:hidden">Clear</span>
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-600">
          <FiFilter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <select
            value={filters.brand}
            onChange={e => onFilterChange('brand', e.target.value)}
            className="rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 py-2 focus:border-blue-400 focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base"
          >
            <option value="">All Brand</option>
            {filterOptions.brands.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          
          <select
            value={filters.mobile}
            onChange={e => onFilterChange('mobile', e.target.value)}
            className="rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 py-2 focus:border-emerald-400 focus:ring-2 sm:focus:ring-4 focus:ring-emerald-100 transition-all text-sm sm:text-base"
          >
            <option value="">All Mobile</option>
            {filterOptions.mobiles.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          
          <select
            value={filters.model}
            onChange={e => onFilterChange('model', e.target.value)}
            className="rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 py-2 focus:border-purple-400 focus:ring-2 sm:focus:ring-4 focus:ring-purple-100 transition-all text-sm sm:text-base"
          >
            <option value="">All Model</option>
            {filterOptions.models.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          
          <select
            value={filters.color}
            onChange={e => onFilterChange('color', e.target.value)}
            className="rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 py-2 focus:border-pink-400 focus:ring-2 sm:focus:ring-4 focus:ring-pink-100 transition-all text-sm sm:text-base"
          >
            <option value="">All Color</option>
            {filterOptions.colors.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          
          <select
            value={filters.ram}
            onChange={e => onFilterChange('ram', e.target.value)}
            className="rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 py-2 focus:border-amber-400 focus:ring-2 sm:focus:ring-4 focus:ring-amber-100 transition-all text-sm sm:text-base"
          >
            <option value="">All RAM</option>
            {filterOptions.rams.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          
          <select
            value={filters.storage}
            onChange={e => onFilterChange('storage', e.target.value)}
            className="rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 py-2 focus:border-teal-400 focus:ring-2 sm:focus:ring-4 focus:ring-teal-100 transition-all text-sm sm:text-base"
          >
            <option value="">All Storage</option>
            {filterOptions.storages.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          
          <select
            value={filters.processor}
            onChange={e => onFilterChange('processor', e.target.value)}
            className="rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 py-2 focus:border-indigo-400 focus:ring-2 sm:focus:ring-4 focus:ring-indigo-100 transition-all text-sm sm:text-base"
          >
            <option value="">All Processor</option>
            {filterOptions.processors.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          
          <input
            type="text"
            value={filters.imei}
            onChange={e => onFilterChange('imei', e.target.value)}
            placeholder="IMEI"
            className="rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 py-2 focus:border-purple-400 focus:ring-2 sm:focus:ring-4 focus:ring-purple-100 transition-all text-sm sm:text-base"
          />
        </div>
      </div>
    </div>
  )
}

export default SearchAndFilterBar