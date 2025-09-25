import React from 'react'
import { MdPerson, MdPhoneAndroid, MdPayment, MdDiscount } from 'react-icons/md'

const CustomerDetailsForm = ({
  customerName,
  setCustomerName,
  mobileNumber,
  setMobileNumber,
  paymentMethod,
  setPaymentMethod,
  billDiscountType,
  setBillDiscountType,
  billDiscountValue,
  setBillDiscountValue
}) => {
  return (
    <div className="animate-slide-in-left rounded-2xl bg-gradient-to-br from-white to-blue-50 border border-blue-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent flex items-center gap-2">
        <MdPerson /> Customer & Bill Details
      </h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block flex items-center gap-2">
            <MdPerson /> Customer Name
          </label>
          <input 
            value={customerName} 
            onChange={e => setCustomerName(e.target.value)} 
            className="w-full rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 px-4 py-3 bg-white shadow-sm" 
            placeholder="Walk-in Customer" 
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block flex items-center gap-2">
            <MdPhoneAndroid /> Mobile Number
          </label>
          <input 
            value={mobileNumber} 
            onChange={e => setMobileNumber(e.target.value)} 
            className="w-full rounded-xl border-2 border-green-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 px-4 py-3 bg-white shadow-sm" 
            placeholder="98765 43210" 
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block flex items-center gap-2">
            <MdPayment /> Payment Method
          </label>
          <select 
            value={paymentMethod} 
            onChange={e => setPaymentMethod(e.target.value)} 
            className="w-full rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 px-4 py-3 bg-white shadow-sm"
          >
            <option>Cash</option>
            <option>Card</option>
            <option>UPI</option>
            <option>EMI</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <MdDiscount /> Bill Discount
          </label>
          <select 
            value={billDiscountType} 
            onChange={e => setBillDiscountType(e.target.value)} 
            className="rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 px-3 py-2 bg-white shadow-sm"
          >
            <option value="none">None</option>
            <option value="percent">% Percentage</option>
            <option value="flat">Flat Amount</option>
          </select>
          {billDiscountType !== 'none' && (
            <input 
              type="number" 
              value={billDiscountValue} 
              onChange={e => setBillDiscountValue(e.target.value)} 
              className="w-32 rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 px-3 py-2 bg-white shadow-sm" 
              placeholder="0" 
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomerDetailsForm