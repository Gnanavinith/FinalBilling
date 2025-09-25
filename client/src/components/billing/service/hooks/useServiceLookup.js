import { useState } from 'react'

export const useServiceLookup = (setCustomerInfo, setParts, setLaborCost, setPaymentMethod, setAdvancePaid) => {
  const [serviceIdLookup, setServiceIdLookup] = useState('')
  const [phoneLookup, setPhoneLookup] = useState('')

  const onLookup = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('mobilebill:services') || '[]')
      const service = saved.find(s => 
        String(s.id).trim() === String(serviceIdLookup).trim() && 
        String(s.customerDetails?.phone || '').trim() === String(phoneLookup).trim()
      )
      
      if (!service) {
        alert('Service not found')
        return
      }

      setCustomerInfo({
        name: service.customerDetails?.name || '',
        phone: service.customerDetails?.phone || '',
        address: service.customerDetails?.address || '',
        modelName: service.deviceDetails?.model || '',
        imei: service.deviceDetails?.imei || '',
        problem: service.deviceDetails?.problemDescription || ''
      })

      const partsFromRequest = Array.isArray(service?.serviceDetails?.serviceParts)
        ? service.serviceDetails.serviceParts.map(p => ({
            name: p.partName || '',
            productId: p.partId || '',
            quantity: Number(p.quantity) || 1,
            price: Number(p.unitPrice) || 0,
            gstPercent: Number(service?.serviceDetails?.gstPercentage) || 18,
            discountType: 'percent',
            discountValue: Number(service?.serviceDetails?.discount) || 0,
          }))
        : []
      
      setParts(partsFromRequest)
      setLaborCost(Number(service?.serviceDetails?.estimatedCost) || 0)
      setPaymentMethod(service?.serviceDetails?.paymentMode || 'Cash')
      setAdvancePaid(Number(service?.serviceDetails?.advancePayment) || 0)
    } catch (e) {
      alert('Lookup failed')
    }
  }

  return {
    serviceIdLookup,
    setServiceIdLookup,
    phoneLookup,
    setPhoneLookup,
    onLookup
  }
}