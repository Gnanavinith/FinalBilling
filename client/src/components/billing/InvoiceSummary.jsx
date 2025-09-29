import React from 'react'
import { MdReceiptLong, MdCalendarToday, MdAttachMoney, MdDiscount, MdShowChart, MdCardGiftcard, MdCheckCircle, MdPrint, MdFileDownload } from 'react-icons/md'

const InvoiceSummary = ({
  billNumber,
  calculations,
  customerName,
  mobileNumber,
  paymentMethod,
  items,
  printInvoice,
  exportPdf,
  onCheckout
}) => {
  const now = new Date()

  return (
    <div className="animate-slide-in-up rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-indigo-50 border border-indigo-200 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="text-xs sm:text-sm font-semibold text-indigo-700 inline-flex items-center gap-2">
          <MdReceiptLong className="w-4 h-4" /> Bill No.
        </div>
        <div className="font-bold text-base sm:text-lg text-indigo-800 truncate ml-2">{billNumber}</div>
      </div>
      
      <div className="mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-indigo-700 inline-flex items-center gap-2">
        <MdCalendarToday className="w-4 h-4" /> Date & Time
      </div>
      <div className="text-xs sm:text-sm text-indigo-800 font-medium">{now.toLocaleString()}</div>

      <CalculationSummary calculations={calculations} />
      
      <ActionButtons 
        printInvoice={printInvoice}
        exportPdf={exportPdf}
        onCheckout={onCheckout}
        customerName={customerName}
        mobileNumber={mobileNumber}
        paymentMethod={paymentMethod}
        items={items}
      />
    </div>
  )
}

const CalculationSummary = ({ calculations }) => (
  <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-xs sm:text-sm bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
    <CalculationRow label="Subtotal" value={calculations.subTotal} icon={MdAttachMoney} />
    <CalculationRow label="Item Discounts" value={-calculations.totalDiscountOnItems} isNegative icon={MdDiscount} />
    {calculations.billLevelDiscount > 0 && (
      <CalculationRow label="Bill Discount" value={-calculations.billLevelDiscount} isNegative icon={MdCardGiftcard} />
    )}
    <CalculationRow label="CGST" value={calculations.cgst} icon={MdShowChart} />
    <CalculationRow label="SGST" value={calculations.sgst} icon={MdShowChart} />
    <GrandTotalRow value={calculations.grandTotal} />
  </div>
)

const CalculationRow = ({ label, value, isNegative = false, icon: Icon }) => (
  <div className="flex justify-between items-center py-1 sm:py-2 border-b border-gray-100">
    <span className={`font-semibold inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${isNegative ? 'text-red-600' : 'text-gray-700'}`}>
      <Icon className="w-3 h-3 sm:w-4 sm:h-4" /> {label}
    </span>
    <span className={`font-bold text-xs sm:text-sm ${isNegative ? 'text-red-600' : 'text-gray-800'}`}>
      {isNegative ? '- ' : ''}₹{Math.abs(value).toFixed(2)}
    </span>
  </div>
)

const GrandTotalRow = ({ value }) => (
  <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t-2 border-indigo-300 flex justify-between items-center">
    <span className="text-base sm:text-lg font-bold text-indigo-800 inline-flex items-center gap-1 sm:gap-2">
      <MdCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Grand Total
    </span>
    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-800">₹{value.toFixed(2)}</span>
  </div>
)

const ActionButtons = ({ printInvoice, exportPdf, onCheckout }) => (
  <div className="mt-4 sm:mt-6 flex flex-col gap-2 sm:gap-3">
    <button 
      onClick={printInvoice} 
      className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-semibold inline-flex items-center justify-center gap-2 text-sm sm:text-base"
    >
      <MdPrint className="w-4 h-4" /> Print Invoice
    </button>
    <button 
      onClick={exportPdf} 
      className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 font-semibold inline-flex items-center justify-center gap-2 text-sm sm:text-base"
    >
      <MdFileDownload className="w-4 h-4" /> Export PDF
    </button>
    <button 
      onClick={onCheckout} 
      className="px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-bold text-base sm:text-lg inline-flex items-center justify-center gap-2"
    >
      <MdCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Checkout & Save
    </button>
  </div>
)

export default InvoiceSummary