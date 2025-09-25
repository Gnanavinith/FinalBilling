import { useMemo } from 'react'

export const useBillCalculations = (items, draftItem, billDiscountType, billDiscountValue) => {
  return useMemo(() => {
    const draftItemActive = () => {
      const qty = Number(draftItem.quantity) || 0
      const price = Number(draftItem.price) || 0
      return qty > 0 && price > 0
    }

    const itemsForCalc = draftItemActive() ? [...items, draftItem] : items
    let subTotal = 0
    let totalDiscountOnItems = 0
    let totalGst = 0

    itemsForCalc.forEach(it => {
      const qty = Number(it.quantity) || 0
      const price = Number(it.price) || 0
      const rowGross = qty * price
      let rowDiscount = 0
      if (it.discountType === 'percent') {
        rowDiscount = rowGross * ((Number(it.discountValue) || 0) / 100)
      } else if (it.discountType === 'flat') {
        rowDiscount = Number(it.discountValue) || 0
      }
      const rowNet = Math.max(rowGross - rowDiscount, 0)
      const rowGst = rowNet * ((Number(it.gstPercent) || 0) / 100)
      subTotal += rowNet
      totalDiscountOnItems += rowDiscount
      totalGst += rowGst
    })

    let billLevelDiscount = 0
    if (billDiscountType === 'percent') billLevelDiscount = subTotal * ((Number(billDiscountValue) || 0) / 100)
    if (billDiscountType === 'flat') billLevelDiscount = Number(billDiscountValue) || 0

    const taxableAfterBillDiscount = Math.max(subTotal - billLevelDiscount, 0)
    const cgst = totalGst / 2
    const sgst = totalGst / 2
    const grandTotal = taxableAfterBillDiscount + totalGst

    return {
      subTotal,
      totalDiscountOnItems,
      billLevelDiscount,
      totalGst,
      cgst,
      sgst,
      grandTotal,
    }
  }, [items, draftItem, billDiscountType, billDiscountValue])
}