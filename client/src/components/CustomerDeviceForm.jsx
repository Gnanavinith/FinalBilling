import React from 'react'

const CustomerDeviceForm = ({ customerInfo, setCustomerInfo, paymentMethod, setPaymentMethod }) => {
  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
        Customer & Device
      </h2>
      <div className="space-y-4">
        <FormField
          label="Customer Name"
          value={customerInfo.name}
          onChange={(value) => handleInputChange('name', value)}
        />
        <FormField
          label="Phone Number"
          value={customerInfo.phone}
          onChange={(value) => handleInputChange('phone', value)}
        />
        <FormField
          label="Address"
          value={customerInfo.address}
          onChange={(value) => handleInputChange('address', value)}
        />
        <FormField
          label="Mobile Model Name"
          value={customerInfo.modelName}
          onChange={(value) => handleInputChange('modelName', value)}
        />
        <FormField
          label="IMEI Number"
          value={customerInfo.imei}
          onChange={(value) => handleInputChange('imei', value)}
        />
        <FormField
          label="ID Proof (URL)"
          value={customerInfo.idProofUrl}
          onChange={(value) => handleInputChange('idProofUrl', value)}
          placeholder="optional"
        />
        <FormField
          label="Problem Description"
          value={customerInfo.problem}
          onChange={(value) => handleInputChange('problem', value)}
          type="textarea"
          rows={3}
        />
        <PaymentMethodSelect 
          value={paymentMethod} 
          onChange={setPaymentMethod} 
        />
      </div>
    </div>
  )
}

const FormField = ({ label, value, onChange, type = 'text', placeholder, rows }) => {
  const commonClasses = "mt-1 w-full rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all px-4 py-2.5"
  
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={commonClasses}
          rows={rows}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={commonClasses}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}

const PaymentMethodSelect = ({ value, onChange }) => (
  <div>
    <label className="text-sm font-semibold text-slate-700">Mode of Payment</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all px-4 py-2.5"
    >
      <option>Cash</option>
      <option>Card</option>
      <option>UPI</option>
    </select>
  </div>
)

export default CustomerDeviceForm