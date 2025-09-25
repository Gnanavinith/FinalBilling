import React from 'react'
import { MdSearch, MdShoppingCart, MdPhoneAndroid } from 'react-icons/md'
import MobileCard from './MobileCard'

const AvailableMobilesList = ({ availableMobiles, loading, searchTerm, onSearchChange, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
          Available Mobiles
        </h2>
        <SearchBox searchTerm={searchTerm} onSearchChange={onSearchChange} />
      </div>

      {loading ? (
        <LoadingState />
      ) : availableMobiles.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {availableMobiles.map((mobile) => (
            <MobileCard key={mobile.id} mobile={mobile} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  )
}

const SearchBox = ({ searchTerm, onSearchChange }) => (
  <div className="relative w-64">
    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    <input
      type="text"
      placeholder="Search mobiles..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full pl-10 pr-3 py-2 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all"
    />
  </div>
)

const LoadingState = () => (
  <div className="text-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    <p className="mt-2 text-slate-600">Loading mobiles...</p>
  </div>
)

const EmptyState = () => (
  <div className="text-center py-8 text-slate-500">
    <MdPhoneAndroid className="w-12 h-12 mx-auto mb-4 text-slate-300" />
    <p>No available mobiles found</p>
  </div>
)

export default AvailableMobilesList