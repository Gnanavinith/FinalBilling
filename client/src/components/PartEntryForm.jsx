import React from 'react'

const PartEntryForm = ({
  draftPart,
  setDraftPart,
  lookupPartByProductId,
  addDraftPart,
  clearDraftPart
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-slate-700">Product ID</label>
        <div className="mt-1 flex gap-2">
          <input 
            value={draftPart.productId} 
            onChange={e => setDraftPart({ ...draftPart, productId: e.target.value })} 
            className="flex-1 rounded-xl border-2 border-slate-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all px-4 py-2.5" 
            placeholder="Enter Product ID to auto-fill" 
          />
          <button 
            type="button" 
            onClick={lookupPartByProductId} 
            disabled={!draftPart.productId}
            className="px-4 py-2.5 rounded-xl border-2 border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Find
          </button>
        </div>
      </div>
      
      <div>
        <label className="text-sm font-semibold text-slate-700">Part Name</label>
        <input 
          value={draftPart.name} 
          onChange={e => setDraftPart({ ...draftPart, name: e.target.value })} 
          className="mt-1 w-full rounded-xl border-2 border-slate-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all px-4 py-2.5" 
          placeholder="Search / type" 
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FormInput
          label="Quantity"
          value={draftPart.quantity}
          onChange={(value) => setDraftPart({ ...draftPart, quantity: value })}
          type="number"
          borderColor="border-amber-200"
          focusBorderColor="border-amber-400"
          focusRingColor="ring-amber-100"
        />
        
        <FormInput
          label="Price per Part"
          value={draftPart.price}
          onChange={(value) => setDraftPart({ ...draftPart, price: value })}
          type="number"
          borderColor="border-emerald-200"
          focusBorderColor="border-emerald-400"
          focusRingColor="ring-emerald-100"
        />
        
        <FormInput
          label="GST %"
          value={draftPart.gstPercent}
          onChange={(value) => setDraftPart({ ...draftPart, gstPercent: value })}
          type="number"
          borderColor="border-blue-200"
          focusBorderColor="border-blue-400"
          focusRingColor="ring-blue-100"
        />
        
        <DiscountInput
          draftPart={draftPart}
          setDraftPart={setDraftPart}
        />
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={addDraftPart} 
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all font-semibold"
        >
          Add Part
        </button>
        <button 
          onClick={clearDraftPart} 
          type="button" 
          className="px-6 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all font-semibold"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

const FormInput = ({ label, value, onChange, type = 'text', borderColor, focusBorderColor, focusRingColor }) => (
  <div>
    <label className="text-sm font-semibold text-slate-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`mt-1 w-full rounded-xl border-2 ${borderColor} focus:${focusBorderColor} focus:ring-4 ${focusRingColor} transition-all px-4 py-2.5`}
    />
  </div>
)

const DiscountInput = ({ draftPart, setDraftPart }) => (
  <div>
    <label className="text-sm font-semibold text-slate-700">Discount</label>
    <div className="mt-1 flex items-center gap-2">
      <select
        value={draftPart.discountType}
        onChange={e => setDraftPart({ ...draftPart, discountType: e.target.value })}
        className="rounded-xl border-2 border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all px-3 py-2"
      >
        <option value="percent">% </option>
        <option value="flat">Flat</option>
      </select>
      <input
        type="number"
        value={draftPart.discountValue}
        onChange={e => setDraftPart({ ...draftPart, discountValue: e.target.value })}
        className="w-full rounded-xl border-2 border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all px-3 py-2"
      />
    </div>
  </div>
)

export default PartEntryForm