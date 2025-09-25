import React from 'react'
import { formatCurrency } from '../utils/formatters'

const CartItem = ({ mobile, onRemove, onUpdateQuantity }) => {
  return (
    <div className="border-2 border-slate-200 rounded-2xl p-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-slate-900">{mobile.brand} {mobile.model}</h3>
          <p className="text-sm text-slate-500">{mobile.modelNumber}</p>
        </div>
        <button
          onClick={onRemove}
          className="text-red-600 hover:text-red-800"
        >
          ✕
        </button>
      </div>
      
      <div className="flex justify-between items-center">
        <QuantityControls
          quantity={mobile.quantity}
          onDecrease={() => onUpdateQuantity(mobile.quantity - 1)}
          onIncrease={() => onUpdateQuantity(mobile.quantity + 1)}
        />
        <PricingInfo mobile={mobile} />
      </div>
    </div>
  )
}

const QuantityControls = ({ quantity, onDecrease, onIncrease }) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={onDecrease}
      className="w-7 h-7 bg-slate-100 border border-slate-300 rounded-full flex items-center justify-center hover:bg-slate-200"
    >
      -
    </button>
    <span className="w-8 text-center">{quantity}</span>
    <button
      onClick={onIncrease}
      className="w-7 h-7 bg-slate-100 border border-slate-300 rounded-full flex items-center justify-center hover:bg-slate-200"
    >
      +
    </button>
  </div>
)

const PricingInfo = ({ mobile }) => (
  <div className="text-right">
    <div className="font-semibold text-slate-900">{formatCurrency(mobile.sellingPrice * mobile.quantity)}</div>
    <div className="text-sm text-slate-500">{formatCurrency(mobile.sellingPrice)} each</div>
  </div>
)

export default CartItem