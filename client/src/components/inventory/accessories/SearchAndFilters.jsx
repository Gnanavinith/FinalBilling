import React from 'react'
import { FiSearch } from 'react-icons/fi'

const SearchAndFilters = ({
  search,
  onSearchChange,
  lowStockThreshold,
  onThresholdChange,
  selectedCategory,
  onCategoryChange,
  categories
}) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Accessories': return '🎧'
      case 'Service Item': return '🔧'
      case 'Other': return '📦'
      default: return '📦'
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-slate-700">Low Stock Threshold:</label>
        <input
          type="number"
          value={lowStockThreshold}
          onChange={(e) => onThresholdChange(parseInt(e.target.value) || 0)}
          className="w-24 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all px-3 py-2"
          min="0"
        />
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search accessories..."
          className="w-72 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all px-4 py-2.5 pl-10"
        />
        <FiSearch className="absolute left-2 top-2.5 w-4 h-4 text-slate-400" />
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-slate-700">Category:</span>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all px-4 py-2.5"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {getCategoryIcon(category)} {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default SearchAndFilters