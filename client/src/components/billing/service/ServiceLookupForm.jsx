import React from 'react'

const ServiceLookupForm = ({ 
  serviceIdLookup, 
  setServiceIdLookup, 
  phoneLookup, 
  setPhoneLookup, 
  onLookup 
}) => {
  return (
    <div className="mb-6 rounded-2xl bg-white border border-slate-200 p-6 shadow-lg">
      <div className="text-lg font-semibold mb-3">Lookup Service</div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Service ID</label>
          <input 
            value={serviceIdLookup} 
            onChange={e => setServiceIdLookup(e.target.value)} 
            className="mt-1 w-full rounded-xl border-2 border-slate-200 px-3 py-2 focus:border-blue-400 focus:ring-4 focus:ring-blue-100" 
            placeholder="SRV-XXXXXX" 
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <input 
            value={phoneLookup} 
            onChange={e => setPhoneLookup(e.target.value)} 
            className="mt-1 w-full rounded-xl border-2 border-slate-200 px-3 py-2 focus:border-blue-400 focus:ring-4 focus:ring-blue-100" 
            placeholder="Customer phone" 
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={onLookup}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md"
          >
            Fetch
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServiceLookupForm