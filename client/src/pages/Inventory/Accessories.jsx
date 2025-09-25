import React, { useState, useEffect, useMemo } from 'react'
import StockSummaryCards from '../../components/inventory/accessories/StockSummaryCards'
import SearchAndFilters from '../../components/inventory/accessories/SearchAndFilters'
import InventoryTable from '../../components/inventory/accessories/InventoryTable'
import LowStockAlert from '../../components/inventory/accessories/LowStockAlert'
import CategoryBreakdown from '../../components/inventory/accessories/CategoryBreakdown'

const apiBase = (typeof window !== 'undefined' && window?.process?.versions?.electron) ? 'http://localhost:5000' : ''

const Accessories = () => {
  const [inventory, setInventory] = useState([])
  const [search, setSearch] = useState('')
  const [lowStockThreshold, setLowStockThreshold] = useState(10)
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await fetch(`${apiBase}/api/accessories`)
      const data = await res.json()
      const rows = Array.isArray(data) ? data : []
      const mapped = rows.map(r => ({
        id: r.id,
        category: 'Accessories',
        productName: r.productName,
        model: r.productId,
        stock: Number(r.quantity) || 0,
        purchasePrice: Number(r.unitPrice) || 0,
        sellingPrice: Number(r.unitPrice) || 0,
        createdAt: r.createdAt || new Date().toISOString(),
      }))
      setInventory(mapped)
    } catch (error) {
      console.error('Error loading accessories:', error)
      setInventory([])
    }
  }

  const accessoryInventory = useMemo(() => {
    return inventory.map(item => ({ ...item, remainingStock: item.stock }))
  }, [inventory])

  const filteredInventory = useMemo(() => {
    let filtered = accessoryInventory
    
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }
    
    const q = search.trim().toLowerCase()
    if (q) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q)
      )
    }
    
    return filtered
  }, [accessoryInventory, search, selectedCategory])

  const categories = useMemo(() => {
    const cats = [...new Set(accessoryInventory.map(item => item.category))]
    return cats.sort()
  }, [accessoryInventory])

  const lowStockItems = filteredInventory.filter(item => item.remainingStock <= lowStockThreshold)
  const outOfStockItems = filteredInventory.filter(item => item.remainingStock <= 0)

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Accessories & Service Items
        </h1>
        
        <SearchAndFilters
          search={search}
          onSearchChange={setSearch}
          lowStockThreshold={lowStockThreshold}
          onThresholdChange={setLowStockThreshold}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />
      </div>

      <StockSummaryCards
        filteredInventory={filteredInventory}
        lowStockItems={lowStockItems}
        outOfStockItems={outOfStockItems}
        lowStockThreshold={lowStockThreshold}
      />

      <InventoryTable
        inventory={filteredInventory}
        lowStockThreshold={lowStockThreshold}
      />

      <LowStockAlert lowStockItems={lowStockItems} />

      <CategoryBreakdown
        categories={categories}
        accessoryInventory={accessoryInventory}
        lowStockThreshold={lowStockThreshold}
      />
    </div>
  )
}

export default Accessories