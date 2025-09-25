import React from 'react'
import { MdShoppingCart } from 'react-icons/md'
import { formatCurrency } from '../utils/formatters'

const MobileCard = ({ mobile, onAddToCart }) => {
  return (
    <div className="border-2 border-slate-200 rounded-2xl p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-slate-900">{mobile.brand} {mobile.model}</h3>
          <p className="text-sm text-slate-500">{mobile.modelNumber}</p>
          {mobile.imeiNumber1 && (
            <p className="text-xs text-slate-400">IMEI: {mobile.imeiNumber1}</p>
          )}
        </div>
        <ConditionBadge condition={mobile.condition} />
      </div>
      
      <PricingInfo mobile={mobile} />
      <MobileSpecs mobile={mobile} />
      
      <button
        onClick={() => onAddToCart(mobile)}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-3 rounded-xl hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
      >
        <MdShoppingCart className="w-4 h-4" />
        Add to Cart
      </button>
    </div>
  )
}

const ConditionBadge = ({ condition }) => {
  const conditionStyles = {
    excellent: 'bg-green-100 text-green-800',
    good: 'bg-blue-100 text-blue-800',
    fair: 'bg-yellow-100 text-yellow-800',
    poor: 'bg-red-100 text-red-800'
  }

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${conditionStyles[condition] || conditionStyles.fair}`}>
      {condition}
    </span>
  )
}

const PricingInfo = ({ mobile }) => (
  <div className="mb-3">
    <div className="text-lg font-bold text-slate-900">{formatCurrency(mobile.sellingPrice)}</div>
    <div className="text-sm text-slate-500">Cost: {formatCurrency(mobile.purchasePrice)}</div>
    <div className="text-sm text-green-600">Profit: {formatCurrency(mobile.profitMargin)}</div>
  </div>
)

const MobileSpecs = ({ mobile }) => (
  <div className="text-xs text-slate-500 mb-3">
    <div>Seller: {mobile.sellerName}</div>
    {mobile.color && <div>Color: {mobile.color}</div>}
    {mobile.ram && <div>RAM: {mobile.ram}</div>}
    {mobile.storage && <div>Storage: {mobile.storage}</div>}
  </div>
)

export default MobileCard