import { useState, useCallback } from 'react'

export const useCart = () => {
  const [selectedMobiles, setSelectedMobiles] = useState([])

  const addToCart = useCallback((mobile) => {
    setSelectedMobiles(prev => {
      const existingIndex = prev.findIndex(m => m.id === mobile.id)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex].quantity += 1
        return updated
      }
      return [...prev, { ...mobile, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((mobileId) => {
    setSelectedMobiles(prev => prev.filter(m => m.id !== mobileId))
  }, [])

  const updateQuantity = useCallback((mobileId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(mobileId)
      return
    }
    
    setSelectedMobiles(prev => prev.map(m => 
      m.id === mobileId ? { ...m, quantity } : m
    ))
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setSelectedMobiles([])
  }, [])

  const totals = {
    subTotal: selectedMobiles.reduce((sum, mobile) => sum + (mobile.sellingPrice * mobile.quantity), 0),
    totalItems: selectedMobiles.reduce((sum, mobile) => sum + mobile.quantity, 0),
    grandTotal: selectedMobiles.reduce((sum, mobile) => sum + (mobile.sellingPrice * mobile.quantity), 0)
  }

  return {
    selectedMobiles,
    addToCart,
    removeFromCart,
    updateQuantity,
    totals,
    clearCart
  }
}