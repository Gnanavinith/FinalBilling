import React from 'react'
import PartEntryForm from '../../PartEntryForm'
import PartsList from '../../PartsList'
import ChargesSection from '../../ChargesSection'

const PartsManagement = ({
  parts,
  laborCost,
  setLaborCost,
  billDiscountPercent,
  setBillDiscountPercent,
  billGstPercent,
  setBillGstPercent
}) => {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
        Add Service Part
      </h2>
      
      <PartEntryForm {...parts} />
      
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
          Parts & Charges
        </h2>
        
        <PartsList {...parts} />
        
        <ChargesSection
          laborCost={laborCost}
          setLaborCost={setLaborCost}
          billDiscountPercent={billDiscountPercent}
          setBillDiscountPercent={setBillDiscountPercent}
          billGstPercent={billGstPercent}
          setBillGstPercent={setBillGstPercent}
        />
      </div>
    </div>
  )
}

export default PartsManagement