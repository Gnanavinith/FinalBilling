import React from 'react'

const CustomerInfoForm = ({ customerInfo, onCustomerInfoChange, paymentMethod, onPaymentMethodChange }) => {
  const handleInputChange = (field, value) => {
    onCustomerInfoChange({ ...customerInfo, [field]: value })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all">
      <h2 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-4">
        Customer Information
      </h2>
      <div className="space-y-4">
        <FormField
          label="Customer Name *"
          type="text"
          required
          value={customerInfo.name}
          onChange={(value) => handleInputChange('name', value)}
        />
        <FormField
          label="Phone Number"
          type="tel"
          value={customerInfo.phone}
          onChange={(value) => handleInputChange('phone', value)}
        />
        <FormField
          label="Address"
          type="textarea"
          value={customerInfo.address}
          onChange={(value) => handleInputChange('address', value)}
          rows="3"
        />
        <PaymentMethodSelect 
          value={paymentMethod} 
          onChange={onPaymentMethodChange} 
        />
      </div>
    </div>
  )
}

const FormField = ({ label, type = 'text', value, onChange, required = false, rows }) => {
  const commonClasses = "w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all"
  
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={commonClasses}
        />
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={commonClasses}
        />
      )}
    </div>
  )
}

const PaymentMethodSelect = ({ value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1">Payment Method</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all"
    >
      <option value="Cash">Cash</option>
      <option value="Card">Card</option>
      <option value="UPI">UPI</option>
      <option value="Bank Transfer">Bank Transfer</option>
    </select>
  </div>
)

export default CustomerInfoForm