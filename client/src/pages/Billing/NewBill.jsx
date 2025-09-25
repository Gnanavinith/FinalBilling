import React, { useMemo, useState, useRef } from 'react'
import CustomerDetailsForm from '../../components/billing/CustomerDetailsForm'
import ProductEntryForm from '../../components/billing/ProductEntryForm'
import ItemsList from '../../components/billing/ItemsList'
import InvoiceSummary from '../../components/billing/InvoiceSummary'
import PrintableInvoice from '../../components/billing/PrintableInvoice'
import { useProductLookup } from '../../components/billing/hooks/useProductLookup'
import { useBillCalculations } from '../../components/billing/hooks/useBillCalculations'
import { MdShoppingCart } from 'react-icons/md'

const emptyItem = () => ({
  type: 'Mobile',
  name: '',
  imei: '',
  productId: '',
  quantity: 1,
  price: 0,
  gstPercent: 18,
  discountType: 'percent',
  discountValue: 0,
  model: '',
  color: '',
  ram: '',
  storage: '',
  simSlot: '',
  processor: '',
  displaySize: '',
  camera: '',
  battery: '',
  operatingSystem: '',
  networkType: ''
})

const NewBill = () => {
  const [customerName, setCustomerName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [items, setItems] = useState([])
  const [draftItem, setDraftItem] = useState(emptyItem())
  const [billDiscountType, setBillDiscountType] = useState('none')
  const [billDiscountValue, setBillDiscountValue] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [billNumber] = useState(() => `INV-${Date.now().toString().slice(-6)}`)
  const invoiceRef = useRef(null)

  // Custom hooks
  const productLookup = useProductLookup(draftItem, setDraftItem)
  const calculations = useBillCalculations(items, draftItem, billDiscountType, billDiscountValue)

  const removeItem = (index) => setItems(prev => prev.filter((_, i) => i !== index))
  const removeLastItem = () => setItems(prev => prev.slice(0, -1))
  const clearDraftItem = () => setDraftItem(prev => ({ ...emptyItem(), type: prev.type }))

  const addDraftItem = async () => {
    // Validation logic here
    setItems(prev => [...prev, { ...draftItem }])
    setDraftItem(prev => ({ ...emptyItem(), type: prev.type }))
  }

  const draftItemActive = useMemo(() => {
    const qty = Number(draftItem.quantity) || 0
    const price = Number(draftItem.price) || 0
    return qty > 0 && price > 0
  }, [draftItem])

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
          <MdShoppingCart /> New Bill / POS
        </h1>
        <p className="text-slate-600 mb-8">Create and manage customer invoices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CustomerDetailsForm
            customerName={customerName}
            setCustomerName={setCustomerName}
            mobileNumber={mobileNumber}
            setMobileNumber={setMobileNumber}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            billDiscountType={billDiscountType}
            setBillDiscountType={setBillDiscountType}
            billDiscountValue={billDiscountValue}
            setBillDiscountValue={setBillDiscountValue}
          />

          <ProductEntryForm
            draftItem={draftItem}
            setDraftItem={setDraftItem}
            productLookup={productLookup}
            addDraftItem={addDraftItem}
            clearDraftItem={clearDraftItem}
          />

          <ItemsList
            items={items}
            draftItem={draftItem}
            draftItemActive={draftItemActive}
            removeItem={removeItem}
            removeLastItem={removeLastItem}
          />
        </div>

        <InvoiceSummary
          billNumber={billNumber}
          calculations={calculations}
          customerName={customerName}
          mobileNumber={mobileNumber}
          paymentMethod={paymentMethod}
          items={items}
          printInvoice={() => {/* print logic */ }}
          exportPdf={() => {/* export logic */ }}
          onCheckout={async () => {/* checkout logic */ }}
        />
      </div>

      {/* // Add import at the top */}
      {/* import PrintableInvoice from './PrintableInvoice'; */}

      {/* // Replace the entire printable invoice section in NewBill.js with: */}
      <PrintableInvoice
        ref={invoiceRef}
        billNumber={billNumber}
        customerName={customerName}
        mobileNumber={mobileNumber}
        paymentMethod={paymentMethod}
        items={items}
        draftItemActive={draftItemActive}
        draftItem={draftItem}
        calc={calculations}
        now={Date.now()}
      />
    </div>
  )
}

export default NewBill