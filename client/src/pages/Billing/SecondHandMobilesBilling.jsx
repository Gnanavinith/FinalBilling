import React, { useState, useEffect, useRef } from 'react'
import AvailableMobilesList from '../../components/AvailableMobilesList'
import CustomerInfoForm from '../../components/CustomerInfoForm'
import CartSummary from '../../components/CartSummary'
import PrintableInvoice from '../../components/PrintableInvoice'
import { useAvailableMobiles } from '../../hooks/useAvailableMobiles'
import { useCart } from '../../hooks/useCart'
import { useSalesProcessing } from '../../hooks/useSalesProcessing'
import { MdPhoneAndroid } from 'react-icons/md'

const SecondHandMobilesBilling = () => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [billNumber, setBillNumber] = useState('')
  const invoiceRef = useRef(null)

  // Custom hooks
  const { availableMobiles, loading, searchTerm, setSearchTerm, fetchAvailableMobiles } = useAvailableMobiles()
  const { selectedMobiles, addToCart, removeFromCart, updateQuantity, totals, clearCart } = useCart()
  const { processingSale, processSale } = useSalesProcessing()

  // Generate bill number on mount
  useEffect(() => {
    const now = new Date()
    const timestamp = now.getTime().toString().slice(-6)
    setBillNumber(`SHM-${timestamp}`)
  }, [])

  const handleProcessSale = async () => {
    const success = await processSale({
      selectedMobiles,
      customerInfo,
      paymentMethod,
      billNumber,
      totals
    })

    if (success) {
      clearCart()
      setCustomerInfo({ name: '', phone: '', address: '' })
      
      // Generate new bill number
      const now = new Date()
      const timestamp = now.getTime().toString().slice(-6)
      setBillNumber(`SHM-${timestamp}`)
      
      fetchAvailableMobiles()
    }
  }

  const handlePrintInvoice = () => {
    const printContent = invoiceRef.current
    if (!printContent) return
    
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${billNumber}</title>
          <style>/* Print styles */</style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header billNumber={billNumber} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AvailableMobilesList
            availableMobiles={availableMobiles}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddToCart={addToCart}
          />
        </div>

        <div className="space-y-6">
          <CustomerInfoForm
            customerInfo={customerInfo}
            onCustomerInfoChange={setCustomerInfo}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
          />

          <CartSummary
            selectedMobiles={selectedMobiles}
            totals={totals}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onProcessSale={handleProcessSale}
            onPrintInvoice={handlePrintInvoice}
            processingSale={processingSale}
          />
        </div>
      </div>

      <PrintableInvoice
        ref={invoiceRef}
        billNumber={billNumber}
        customerInfo={customerInfo}
        paymentMethod={paymentMethod}
        selectedMobiles={selectedMobiles}
        totals={totals}
      />
    </div>
  )
}

const Header = ({ billNumber }) => (
  <div className="flex justify-between items-center mb-6">
    <div>
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Second Hand Mobile Billing
      </h1>
      <p className="text-slate-600">Sell secondhand mobiles to customers</p>
    </div>
    <div className="text-sm text-slate-700 bg-white/70 backdrop-blur px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
      Bill Number: <span className="font-semibold text-slate-900">{billNumber}</span>
    </div>
  </div>
)

export default SecondHandMobilesBilling