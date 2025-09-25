import React from 'react'

const ChargesSection = ({
  laborCost,
  setLaborCost,
  billDiscountPercent,
  setBillDiscountPercent,
  billGstPercent,
  setBillGstPercent
}) => {
  return (
    <div className="mt-4 space-y-4">
      <div>
        <label className="text-sm font-semibold text-slate-700">Service Charges (Labor)</label>
        <input 
          type="number" 
          value={laborCost} 
          onChange={e => setLaborCost(e.target.value)} 
          className="mt-1 w-52 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all px-4 py-2.5" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-slate-700">Bill Discount (%)</label>
          <input 
            type="number" 
            min="0" 
            max="100" 
            step="0.01" 
            value={billDiscountPercent} 
            onChange={e => setBillDiscountPercent(Number(e.target.value) || 0)} 
            className="mt-1 w-52 rounded-xl border-2 border-slate-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all px-4 py-2.5" 
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Bill GST Override (%)</label>
          <input 
            type="number" 
            min="0" 
            max="100" 
            step="0.01" 
            value={billGstPercent} 
            onChange={e => setBillGstPercent(Number(e.target.value) || 0)} 
            className="mt-1 w-52 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all px-4 py-2.5" 
          />
          <div className="text-xs text-slate-500 mt-1">Leave 0 to use line-item GST.</div>
        </div>
      </div>
    </div>
  )
}

export default ChargesSection