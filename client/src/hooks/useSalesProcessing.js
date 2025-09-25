import { useState } from 'react'

export const useSalesProcessing = () => {
  const [processingSale, setProcessingSale] = useState(false)

  const processSale = async (saleData) => {
    if (saleData.selectedMobiles.length === 0) {
      alert('Please select at least one mobile')
      return false
    }

    if (!saleData.customerInfo.name.trim()) {
      alert('Please enter customer name')
      return false
    }

    try {
      setProcessingSale(true)

      const saleItems = saleData.selectedMobiles.map(mobile => ({
        name: `${mobile.brand} ${mobile.model}`,
        model: mobile.modelNumber,
        imei: mobile.imeiNumber1,
        productId: mobile.id,
        quantity: mobile.quantity,
        price: mobile.sellingPrice,
        gstPercent: 0,
        discountType: 'percent',
        discountValue: 0,
        color: mobile.color,
        ram: mobile.ram,
        storage: mobile.storage,
        simSlot: mobile.simSlot,
        processor: mobile.processor,
        displaySize: mobile.displaySize,
        camera: mobile.camera,
        battery: mobile.battery,
        operatingSystem: mobile.operatingSystem,
        networkType: mobile.networkType
      }))

      const saleResponse = await fetch('/api/sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billNumber: saleData.billNumber,
          customerName: saleData.customerInfo.name,
          mobileNumber: saleData.customerInfo.phone,
          paymentMethod: saleData.paymentMethod,
          items: saleItems,
          subTotal: saleData.totals.subTotal,
          grandTotal: saleData.totals.grandTotal
        }),
      })

      if (!saleResponse.ok) {
        throw new Error('Failed to create sale')
      }

      // Mark mobiles as sold
      for (const mobile of saleData.selectedMobiles) {
        await fetch(`/api/secondhand-mobiles/${mobile.id}/sold`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            buyerName: saleData.customerInfo.name,
            buyerPhone: saleData.customerInfo.phone,
            saleDate: new Date().toISOString()
          }),
        })
      }

      alert('Sale completed successfully!')
      return true
    } catch (error) {
      console.error('Error processing sale:', error)
      alert('Error processing sale: ' + error.message)
      return false
    } finally {
      setProcessingSale(false)
    }
  }

  return { processingSale, processSale }
}