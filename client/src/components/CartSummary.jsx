import React from 'react'
import { MdShoppingCart, MdReceipt, MdPrint } from 'react-icons/md'
import CartItem from './CartItem'
import { formatCurrency } from '../utils/formatters'

const CartSummary = ({ selectedMobiles, totals, onRemoveFromCart, onUpdateQuantity, onProcessSale, onPrintInvoice, processingSale }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all">
      <h2 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-4">
        Cart ({selectedMobiles.length})
      </h2>
      
      {selectedMobiles.length === 0 ? (
        <EmptyCartState />
      ) : (
        <>
          <CartItemsList 
            items={selectedMobiles}
            onRemoveFromCart={onRemoveFromCart}
            onUpdateQuantity={onUpdateQuantity}
          />
          <CartTotals totals={totals} />
          <ActionButtons
            onProcessSale={onProcessSale}
            onPrintInvoice={onPrintInvoice}
            processingSale={processingSale}
            hasItems={selectedMobiles.length > 0}
          />
        </>
      )}
    </div>
  )
}

const EmptyCartState = () => (
  <div className="text-center py-8 text-slate-500">
    <MdShoppingCart className="w-12 h-12 mx-auto mb-4 text-slate-300" />
    <p>No items in cart</p>
  </div>
)

const CartItemsList = ({ items, onRemoveFromCart, onUpdateQuantity }) => (
  <div className="space-y-4">
    {items.map((mobile) => (
      <CartItem
        key={mobile.id}
        mobile={mobile}
        onRemove={() => onRemoveFromCart(mobile.id)}
        onUpdateQuantity={(quantity) => onUpdateQuantity(mobile.id, quantity)}
      />
    ))}
  </div>
)

const CartTotals = ({ totals }) => (
  <div className="border-t pt-4 space-y-2">
    <div className="flex justify-between">
      <span className="text-slate-600">Subtotal:</span>
      <span className="font-semibold text-slate-900">{formatCurrency(totals.subTotal)}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-slate-600">Total Items:</span>
      <span className="font-semibold text-slate-900">{totals.totalItems}</span>
    </div>
    <div className="flex justify-between text-lg font-bold border-t pt-2">
      <span>Grand Total:</span>
      <span className="text-slate-900">{formatCurrency(totals.grandTotal)}</span>
    </div>
  </div>
)

const ActionButtons = ({ onProcessSale, onPrintInvoice, processingSale, hasItems }) => (
  <div className="mt-4 space-y-2">
    <button
      onClick={onProcessSale}
      disabled={processingSale || !hasItems}
      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
    >
      {processingSale ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Processing...
        </>
      ) : (
        <>
          <MdReceipt className="w-5 h-5" />
          Process Sale
        </>
      )}
    </button>
    <button
      type="button"
      onClick={onPrintInvoice}
      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
    >
      <MdPrint className="w-5 h-5" /> Print Invoice
    </button>
  </div>
)

export default CartSummary