import { useState, useEffect } from 'react'

import { apiBase } from '../../../utils/environment'

export const useProductLookup = (draftItem, setDraftItem) => {
  const [productSuggestions, setProductSuggestions] = useState([])
  const [showProductSuggestions, setShowProductSuggestions] = useState(false)
  const [showImeiSuggestions, setShowImeiSuggestions] = useState(false)
  const [allProducts, setAllProducts] = useState([])

  // Load all products on mount
  useEffect(() => {
    loadAllProducts()
  }, [])

  const loadAllProducts = async () => {
    try {
      const [mobilesRes, accessoriesRes] = await Promise.all([
        fetch(`${apiBase}/api/mobiles`),
        fetch(`${apiBase}/api/accessories`)
      ])
      
      const mobiles = await mobilesRes.json()
      const accessories = await accessoriesRes.json()
      
      const allProducts = [
        ...(Array.isArray(mobiles) ? mobiles.map(m => ({
          ...m,
          type: 'Mobile',
          searchName: m.mobileName,
          searchId: m.imeiNumber1 || m.imeiNumber2 || m.productIds?.[0] || ''
        })) : []),
        ...(Array.isArray(accessories) ? accessories.map(a => ({
          ...a,
          type: 'Accessory',
          searchName: a.productName,
          searchId: a.productId
        })) : [])
      ]
      setAllProducts(allProducts)
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  // Filter products based on search query
  const filterProducts = (query, type = null) => {
    if (!query || query.length < 2) return []
    
    const searchQuery = query.toLowerCase().trim()
    let productsToSearch = allProducts
    
    if (type) {
      productsToSearch = allProducts.filter(p => p.type === type)
    }
    
    return productsToSearch.filter(product => {
      const nameMatch = product.searchName?.toLowerCase().includes(searchQuery)
      const idMatch = product.searchId?.toLowerCase().includes(searchQuery)
      const imeiMatch = product.imeiNumber1?.includes(searchQuery) || product.imeiNumber2?.includes(searchQuery)
      const productIdMatch = product.productIds?.some(id => id.toLowerCase().includes(searchQuery))
      const accessoryNameMatch = product.productName?.toLowerCase().includes(searchQuery)
      
      return nameMatch || idMatch || imeiMatch || productIdMatch || accessoryNameMatch
    })
    .sort((a, b) => {
      const aNameMatch = a.searchName?.toLowerCase().includes(searchQuery) || a.productName?.toLowerCase().includes(searchQuery)
      const bNameMatch = b.searchName?.toLowerCase().includes(searchQuery) || b.productName?.toLowerCase().includes(searchQuery)
      
      if (aNameMatch && !bNameMatch) return -1
      if (!aNameMatch && bNameMatch) return 1
      return 0
    })
    .slice(0, 10)
  }

  const handleProductNameChange = (value) => {
    setDraftItem({ ...draftItem, name: value })
    
    if (value.length >= 2) {
      const suggestions = filterProducts(value, draftItem.type)
      setProductSuggestions(suggestions)
      setShowProductSuggestions(true)
    } else {
      setShowProductSuggestions(false)
      setProductSuggestions([])
    }
  }

  const selectProductSuggestion = () => {
    // Implementation for selecting product suggestion
  }

  const lookupByImeiOrProduct = async () => {
    // Implementation for lookup
  }

  return {
    productSuggestions,
    showProductSuggestions,
    showImeiSuggestions,
    handleProductNameChange,
    selectProductSuggestion,
    lookupByImeiOrProduct,
    setShowProductSuggestions,
    setShowImeiSuggestions
  }
}