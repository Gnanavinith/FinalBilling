import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ServiceLookupForm from '../../components/ServiceLookupForm'
import CustomerDeviceForm from '../../components/CustomerDeviceForm'
import PartsManagement from '../../components/PartsManagement'
import InvoiceSummary from '../../components/ServiceInvoiceSummary'
import PrintableInvoice from '../../components/PrintableInvoice'
import { useServiceLookup } from '../../hooks/useServiceLookup'
import { useParts } from '../../hooks/useParts'
import { useCalculations } from '../../hooks/useCalculations'
import { useInvoiceExport } from '../../hooks/useInvoiceExport'

const emptyPart = () => ({ 
  name: '', 
  productId: '', 
  quantity: 1, 
  price: 0, 
  gstPercent: 18, 
  discountType: 'percent', 
  discountValue: 0 
})

const ServiceBill = () => {
  const location = useLocation()
  const incoming = location?.state?.service
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    modelName: '',
    imei: '',
    idProofUrl: '',
    problem: ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [laborCost, setLaborCost] = useState(0)
  const [advancePaid, setAdvancePaid] = useState(0)
  const [billDiscountPercent, setBillDiscountPercent] = useState(0)
  const [billGstPercent, setBillGstPercent] = useState(0)
  const [serviceBillNumber] = useState(() => `SRV-${Date.now().toString().slice(-6)}`)
  
  const invoiceRef = useRef(null)
  const now = new Date()

  // Custom hooks
  const serviceLookup = useServiceLookup(setCustomerInfo, setParts, setLaborCost, setPaymentMethod, setAdvancePaid)
  const parts = useParts(emptyPart, incoming)
  const calculations = useCalculations(parts, laborCost, billDiscountPercent, billGstPercent)
  const { printInvoice, exportPdf } = useInvoiceExport(invoiceRef, serviceBillNumber)

  // Prefill from service request if provided
  useEffect(() => {
    if (incoming) {
      setCustomerInfo({
        name: incoming?.customerDetails?.name || '',
        phone: incoming?.customerDetails?.phone || '',
        address: incoming?.customerDetails?.address || '',
        modelName: incoming?.deviceDetails?.model || '',
        imei: incoming?.deviceDetails?.imei || '',
        idProofUrl: '',
        problem: incoming?.deviceDetails?.problemDescription || ''
      })
      
      const partsFromRequest = Array.isArray(incoming?.serviceDetails?.serviceParts)
        ? incoming.serviceDetails.serviceParts.map(p => ({
            name: p.partName || '',
            productId: p.partId || '',
            quantity: Number(p.quantity) || 1,
            price: Number(p.unitPrice) || 0,
            gstPercent: Number(incoming?.serviceDetails?.gstPercentage) || 18,
            discountType: 'percent',
            discountValue: Number(incoming?.serviceDetails?.discount) || 0,
          }))
        : []
      
      parts.setParts(partsFromRequest)
      setLaborCost(Number(incoming?.serviceDetails?.estimatedCost) || 0)
      setPaymentMethod(incoming?.serviceDetails?.paymentMode || 'Cash')
    }
  }, [incoming, parts.setParts])

  const handleSaveServiceBill = async () => {
    // Validation and save logic here
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="print:hidden">
        <h1 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Service Billing
        </h1>

        <ServiceLookupForm {...serviceLookup} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CustomerDeviceForm
              customerInfo={customerInfo}
              setCustomerInfo={setCustomerInfo}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

            <PartsManagement
              parts={parts}
              laborCost={laborCost}
              setLaborCost={setLaborCost}
              billDiscountPercent={billDiscountPercent}
              setBillDiscountPercent={setBillDiscountPercent}
              billGstPercent={billGstPercent}
              setBillGstPercent={setBillGstPercent}
            />
          </div>

          <InvoiceSummary
            serviceBillNumber={serviceBillNumber}
            now={now}
            calculations={calculations}
            advancePaid={advancePaid}
            printInvoice={printInvoice}
            exportPdf={exportPdf}
            onSave={handleSaveServiceBill}
          />
        </div>
      </div>

      <PrintableInvoice
        ref={invoiceRef}
        serviceBillNumber={serviceBillNumber}
        customerInfo={customerInfo}
        calculations={calculations}
        parts={parts}
        laborCost={laborCost}
        billDiscountPercent={billDiscountPercent}
        now={now}
      />
    </div>
  )
}

export default ServiceBill