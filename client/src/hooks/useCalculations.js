import { useMemo } from 'react'

export const useCalculations = (parts, laborCost, billDiscountPercent, billGstPercent) => {
  return useMemo(() => {
    const partsForCalc = parts.draftPartActive ? [...parts.parts, parts.draftPart] : parts.parts
    
    let partsSubtotal = 0
    let partsDiscounts = 0
    let partsGst = 0

    partsForCalc.forEach(p => {
      const qty = Number(p.quantity) || 0
      const price = Number(p.price) || 0
      const gross = qty * price
      let discount = 0
      if (p.discountType === 'percent') discount = gross * ((Number(p.discountValue) || 0) / 100)
      if (p.discountType === 'flat') discount = Number(p.discountValue) || 0
      const net = Math.max(gross - discount, 0)
      const gst = net * ((Number(p.gstPercent) || 0) / 100)
      partsSubtotal += net
      partsDiscounts += discount
      partsGst += gst
    })

    const labor = Number(laborCost) || 0
    const subtotal = partsSubtotal + labor
    const billLevelDiscount = Math.max(0, (Number(billDiscountPercent) || 0) * subtotal / 100)
    const afterBillDiscount = Math.max(subtotal - billLevelDiscount, 0)
    const gstOverride = Number(billGstPercent) || 0
    const gstTotal = gstOverride > 0 ? (afterBillDiscount * gstOverride / 100) : partsGst
    const cgst = gstTotal / 2
    const sgst = gstTotal / 2
    const grandTotal = afterBillDiscount + gstTotal

    return {
      partsSubtotal,
      partsDiscounts,
      partsGst,
      labor,
      subtotal,
      billLevelDiscount,
      billDiscountPercent,
      afterBillDiscount,
      gstTotal,
      cgst,
      sgst,
      grandTotal
    }
  }, [parts, laborCost, billDiscountPercent, billGstPercent])
}