import React from 'react'

const ServiceInvoiceSummary = ({
  serviceBillNumber,
  now,
  calculations,
  advancePaid,
  printInvoice,
  exportPdf,
  onSave
}) => {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-700">Service Bill No.</div>
        <div className="font-bold text-slate-900">{serviceBillNumber}</div>
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-700">Date & Time</div>
      <div className="text-slate-900">{now.toLocaleString()}</div>

      <CalculationSummary calculations={calculations} advancePaid={advancePaid} />
      
      <ActionButtons 
        printInvoice={printInvoice}
        exportPdf={exportPdf}
        onSave={onSave}
      />
    </div>
  )
}

const CalculationSummary = ({ calculations, advancePaid }) => (
  <div className="mt-4 space-y-2 text-sm bg-white rounded-xl p-4">
    <CalculationRow label="Parts Subtotal" value={calculations.partsSubtotal} />
    <CalculationRow label="Parts Discounts" value={-calculations.partsDiscounts} isNegative />
    <CalculationRow label="Labor" value={calculations.labor} />
    
    {calculations.billLevelDiscount > 0 && (
      <CalculationRow 
        label={`Bill Discount (${calculations.billDiscountPercent}%)`} 
        value={-calculations.billLevelDiscount} 
        isNegative 
        className="text-rose-700"
      />
    )}
    
    <CalculationRow label="CGST" value={calculations.cgst} className="text-blue-600" />
    <CalculationRow label="SGST" value={calculations.sgst} className="text-blue-600" />
    <CalculationRow label="GST Total" value={calculations.gstTotal} className="text-indigo-700" />
    <CalculationRow label="Total Amount" value={calculations.afterBillDiscount} />
    <CalculationRow label="Total Payment" value={calculations.grandTotal} />
    <CalculationRow label="Advance Paid" value={-advancePaid} isNegative className="text-emerald-700" />
    
    <div className="pt-3 mt-3 border-t-2 border-indigo-200 flex justify-between items-center text-lg">
      <span className="font-bold text-indigo-800">Balance</span>
      <span className="font-extrabold text-indigo-800">
        {Math.max(calculations.grandTotal - advancePaid, 0).toFixed(2)}
      </span>
    </div>
  </div>
)

const CalculationRow = ({ label, value, isNegative = false, className = "" }) => (
  <div className="flex justify-between">
    <span className={`font-semibold ${className}`}>{label}</span>
    <span className={`font-bold ${className}`}>
      {isNegative ? '- ' : ''}{Math.abs(value).toFixed(2)}
    </span>
  </div>
)

const ActionButtons = ({ printInvoice, exportPdf, onSave }) => (
  <div className="mt-4 flex gap-3">
    <button 
      onClick={printInvoice} 
      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all font-semibold"
    >
      Print
    </button>
    <button 
      onClick={exportPdf} 
      className="px-5 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all font-semibold"
    >
      Export PDF
    </button>
    <button 
      onClick={onSave} 
      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all font-semibold"
    >
      Save Service Bill
    </button>
  </div>
)

export default ServiceInvoiceSummary