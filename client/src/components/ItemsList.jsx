import React from 'react'
import { MdListAlt, MdSchedule, MdDelete } from 'react-icons/md'

const ItemsList = ({ items, draftItem, draftItemActive, removeItem, removeLastItem }) => {
  const calculateLineTotal = (item) => {
    const qty = Number(item.quantity) || 0
    const price = Number(item.price) || 0
    const gross = qty * price
    const discount = item.discountType === 'percent' 
      ? gross * ((Number(item.discountValue) || 0) / 100) 
      : (Number(item.discountValue) || 0)
    const net = Math.max(gross - discount, 0)
    const gst = net * ((Number(item.gstPercent) || 0) / 100)
    return net + gst
  }

  return (
    <div className="animate-slide-in-left rounded-2xl bg-gradient-to-br from-white to-purple-50 border border-purple-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent flex items-center gap-2">
        <MdListAlt /> Items
      </h2>
      
      {items.length === 0 && !draftItemActive ? (
        <div className="text-center py-8 text-slate-500">
          <div className="text-6xl mb-4 flex justify-center"><MdListAlt className="w-16 h-16" /></div>
          <div className="text-lg font-medium">No items added yet</div>
          <div className="text-sm">Start adding products to create your bill</div>
        </div>
      ) : (
        <div className="space-y-4">
          {draftItemActive && (
            <PendingItem item={draftItem} calculateLineTotal={calculateLineTotal} />
          )}
          {items.map((item, index) => (
            <ItemRow 
              key={index} 
              item={item} 
              index={index} 
              removeItem={removeItem}
              calculateLineTotal={calculateLineTotal}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const PendingItem = ({ item, calculateLineTotal }) => (
  <div className="rounded-xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 flex items-start justify-between shadow-lg animate-pulse">
    <div>
      <div className="font-semibold text-amber-800 flex items-center gap-2">
        {item.name || 'New item'} 
        <span className="ml-2 text-sm bg-amber-200 text-amber-800 px-2 py-1 rounded-full inline-flex items-center gap-1">
          <MdSchedule /> Pending
        </span>
      </div>
      <div className="text-sm text-amber-700 mt-1">IMEI: {item.imei || '-'}</div>
      <div className="mt-2 text-sm text-amber-800 font-medium">
        Qty: {item.quantity} • Price: ₹{item.price} • GST: {item.gstPercent}% • 
        Disc: {item.discountType === 'percent' ? `${item.discountValue}%` : `₹${item.discountValue || 0}`}
      </div>
    </div>
    <div className="text-right">
      <div className="text-sm text-amber-700">Line Total</div>
      <div className="font-bold text-lg text-amber-800">₹{calculateLineTotal(item).toFixed(2)}</div>
    </div>
  </div>
)

const ItemRow = ({ item, index, removeItem, calculateLineTotal }) => {
  const qty = Number(item.quantity) || 0
  const price = Number(item.price) || 0

  return (
    <div className="rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 flex items-start justify-between shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div>
        <div className="font-semibold text-green-800">{item.name || 'Unnamed Item'}</div>
        <div className="text-sm text-green-700 mt-1">IMEI: {item.imei || '-'}</div>
        <div className="mt-2 text-sm text-green-800 font-medium">
          Qty: {qty} • Price: ₹{price} • GST: {item.gstPercent}% • 
          Disc: {item.discountType === 'percent' ? `${item.discountValue}%` : `₹${item.discountValue || 0}`}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-green-700">Line Total</div>
        <div className="font-bold text-lg text-green-800">₹{calculateLineTotal(item).toFixed(2)}</div>
        <button 
          onClick={() => removeItem(index)} 
          className="mt-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors duration-200 font-semibold inline-flex items-center gap-1"
        >
          <MdDelete /> Remove
        </button>
      </div>
    </div>
  )
}

export default ItemsList