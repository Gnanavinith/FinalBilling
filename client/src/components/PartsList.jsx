import React from 'react'

const PartsList = ({ parts, draftPart, draftPartActive, removePart, removeLastPart }) => {
  const calculateLineTotal = (part) => {
    const qty = Number(part.quantity) || 0
    const price = Number(part.price) || 0
    const gross = qty * price
    const discount = part.discountType === 'percent' 
      ? gross * ((Number(part.discountValue) || 0) / 100) 
      : (Number(part.discountValue) || 0)
    const net = Math.max(gross - discount, 0)
    const gst = net * ((Number(part.gstPercent) || 0) / 100)
    return net + gst
  }

  return (
    <>
      {parts.length === 0 && !draftPartActive ? (
        <div className="text-sm text-slate-500 text-center py-8">No parts added yet.</div>
      ) : (
        <div className="space-y-3">
          {draftPartActive && (
            <PartItem 
              part={draftPart} 
              isPending={true}
              calculateLineTotal={calculateLineTotal}
            />
          )}
          {parts.map((part, index) => (
            <PartItem
              key={index}
              part={part}
              index={index}
              onRemove={removePart}
              calculateLineTotal={calculateLineTotal}
            />
          ))}
        </div>
      )}
      
      {parts.length > 0 && (
        <button 
          onClick={removeLastPart} 
          type="button" 
          disabled={parts.length === 0}
          className="mt-4 px-6 py-2.5 rounded-xl border-2 border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
        >
          Remove Last
        </button>
      )}
    </>
  )
}

const PartItem = ({ part, index, onRemove, isPending = false, calculateLineTotal }) => {
  const qty = Number(part.quantity) || 0
  const price = Number(part.price) || 0
  const total = calculateLineTotal(part)
  
  const containerClasses = isPending 
    ? "border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-sm"
    : "border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
  
  const textClasses = isPending ? "text-amber-800" : "text-green-800"
  const accentClasses = isPending ? "text-amber-700" : "text-green-700"

  return (
    <div className={`rounded-xl p-4 flex items-start justify-between ${containerClasses}`}>
      <div>
        <div className={`font-semibold ${textClasses}`}>
          {part.name || (isPending ? 'New part' : 'Unnamed Part')}
          {isPending && (
            <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
              Pending
            </span>
          )}
        </div>
        {!isPending && (
          <div className={`text-xs ${accentClasses}`}>Product ID: {part.productId || '-'}</div>
        )}
        <div className={`mt-1 text-sm ${textClasses}`}>
          Qty: {qty} • Price: {price} • GST: {part.gstPercent}% • 
          Disc: {part.discountType === 'percent' ? `${part.discountValue}%` : `₹${part.discountValue || 0}`}
        </div>
      </div>
      <div className="text-right">
        <div className={`text-sm ${accentClasses}`}>Line Total</div>
        <div className={`font-bold ${textClasses}`}>{total.toFixed(2)}</div>
        {!isPending && (
          <button 
            onClick={() => onRemove(index)} 
            className="mt-2 text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}

export default PartsList