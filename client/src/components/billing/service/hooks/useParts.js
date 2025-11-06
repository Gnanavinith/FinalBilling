import { useState, useMemo, useCallback } from 'react'

import { apiBase } from '../../../../utils/environment'

export const useParts = (emptyPart) => {
  const [parts, setParts] = useState([])
  const [draftPart, setDraftPart] = useState(emptyPart())

  const draftPartActive = useMemo(() => {
    const qty = Number(draftPart.quantity) || 0
    const price = Number(draftPart.price) || 0
    return qty > 0 && price > 0
  }, [draftPart])

  const removePart = useCallback((index) => {
    setParts(prev => prev.filter((_, i) => i !== index))
  }, [])

  const addDraftPart = useCallback(() => {
    const qty = Number(draftPart.quantity) || 0
    const price = Number(draftPart.price) || 0
    if (!draftPart.name || qty <= 0 || price < 0) return
    setParts(prev => [...prev, { ...draftPart }])
    setDraftPart(emptyPart())
  }, [draftPart, emptyPart])

  const clearDraftPart = useCallback(() => {
    setDraftPart(emptyPart())
  }, [emptyPart])

  const removeLastPart = useCallback(() => {
    setParts(prev => prev.slice(0, -1))
  }, [])

  const lookupPartByProductId = useCallback(async () => {
    const id = String(draftPart.productId || '').trim()
    if (!id) return
    
    try {
      const res = await fetch(`${apiBase}/api/accessories?productId=${encodeURIComponent(id)}`)
      const data = await res.json()
      const row = Array.isArray(data) && data.length > 0 ? data[0] : null
      
      if (!row) {
        alert('No accessory found for this Product ID')
        return
      }
      
      setDraftPart(prev => ({
        ...prev,
        name: row.productName || prev.name,
        price: Number(row.sellingPrice ?? row.unitPrice) || prev.price,
      }))
    } catch {
      alert('Failed to fetch accessory')
    }
  }, [draftPart.productId])

  return {
    parts,
    setParts,
    draftPart,
    setDraftPart,
    draftPartActive,
    removePart,
    addDraftPart,
    clearDraftPart,
    removeLastPart,
    lookupPartByProductId
  }
}