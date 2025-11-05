import React, { useState, useEffect, useMemo } from 'react'
import { FiSmartphone } from 'react-icons/fi'
import SearchAndFilterBar from '../../components/inventory/mobile/SearchAndFilterBar'
import StockSummaryCards from '../../components/inventory/mobile/StockSummaryCards'
import InventoryTable from '../../components/inventory/mobile/InventoryTable'
import LowStockAlert from '../../components/inventory/mobile/LowStockAlert'
import { apiBase as apiBaseFromEnv } from '../../utils/environment'

// Resolve API base from shared environment util
const apiBase = String(apiBaseFromEnv || '').replace(/\/$/, '')

const Mobiles = () => {
  const [inventory, setInventory] = useState([])
  const [storeStock, setStoreStock] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [storeId, setStoreId] = useState('')
  const [filters, setFilters] = useState({
    brand: '',
    mobile: '',
    model: '',
    color: '',
    ram: '',
    storage: '',
    processor: '',
    imei: ''
  })
  
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    mobiles: [],
    models: [],
    colors: [],
    rams: [],
    storages: [],
    processors: []
  })

  const lowStockThreshold = 5

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const loadStore = async () => {
      if (!storeId) { setStoreStock([]); return }
      try {
        const res = await fetch(`${apiBase}/api/store-stock?storeId=${encodeURIComponent(storeId)}`)
        const data = await res.json()
        setStoreStock(Array.isArray(data) ? data : [])
      } catch { setStoreStock([]) }
    }
    loadStore()
  }, [storeId])

  const loadData = async () => {
    try {
      const res = await fetch(`${apiBase}/api/mobiles`)
      const data = await res.json()
      const rows = Array.isArray(data) ? data : []
      
      // Filter to only show items that ARE in inventory (status === 'inventory')
      const inventoryItems = rows.filter(item => item.status === 'inventory')
      const mapped = inventoryItems.map(r => ({
        id: r.id,
        category: 'Mobile',
        productName: r.mobileName,
        brand: r.brand || '',
        model: r.modelNumber,
        color: r.color || '',
        ram: r.ram || '',
        storage: r.storage || '',
        processor: r.processor || '',
        displaySize: r.displaySize || '',
        camera: r.camera || '',
        battery: r.battery || '',
        operatingSystem: r.operatingSystem || '',
        networkType: r.networkType || '',
        simSlot: r.simSlot || '',
        productIds: Array.isArray(r.productIds) ? r.productIds : [],
        imei1: r.imeiNumber1 || null,
        imei2: r.imeiNumber2 || null,
        stock: Number(r.totalQuantity) || 0,
        purchasePrice: Number(r.pricePerProduct) || 0,
        sellingPrice: Number(r.sellingPrice ?? r.pricePerProduct) || 0,
        dealerName: r.dealerName || '',
        createdAt: r.createdAt || new Date().toISOString(),
        updatedAt: r.updatedAt || r.createdAt || new Date().toISOString(),
      }))
      
      setInventory(mapped)
      setFilterOptions(prev => ({
        ...prev,
        brands: Array.from(new Set(mapped.map(x => x.brand).filter(Boolean))).sort()
      }))
    } catch (error) {
      console.error('Error loading mobiles:', error)
      setInventory([])
    }
  }

  // Update filter options based on current filters
  useEffect(() => {
    const items = inventory.filter(x => x.category === 'Mobile')
    const forBrand = items
    const forMobile = items.filter(x => (!filters.brand || x.brand === filters.brand))
    const forModel = forMobile.filter(x => (!filters.mobile || x.productName === filters.mobile))
    const forDetails = forModel.filter(x => (!filters.model || x.model === filters.model))

    setFilterOptions({
      brands: Array.from(new Set(forBrand.map(x => x.brand).filter(Boolean))).sort(),
      mobiles: Array.from(new Set(forMobile.map(x => x.productName).filter(Boolean))).sort(),
      models: Array.from(new Set(forModel.map(x => x.model).filter(Boolean))).sort(),
      colors: Array.from(new Set(forDetails.map(x => x.color).filter(Boolean))).sort(),
      rams: Array.from(new Set(forDetails.map(x => x.ram).filter(Boolean))).sort(),
      storages: Array.from(new Set(forDetails.map(x => x.storage).filter(Boolean))).sort(),
      processors: Array.from(new Set(forDetails.map(x => x.processor).filter(Boolean))).sort()
    })
  }, [inventory, filters.brand, filters.mobile, filters.model])

  const mobileInventory = useMemo(() => {
    const mobileItems = inventory.filter(item => item.category === 'Mobile')
      .filter(it => {
        const q = search.trim().toLowerCase()
        if (!q) return true
        const brand = (it.brand || '').toLowerCase()
        const name = (it.productName || '').toLowerCase()
        const model = (it.model || '').toLowerCase()
        const terms = q.split(/\s+/).filter(Boolean)
        return terms.every(t => brand.includes(t) || name.includes(t) || model.includes(t))
      })
      .filter(it => (!filters.brand || it.brand === filters.brand))
      .filter(it => (!filters.mobile || it.productName === filters.mobile))
      .filter(it => (!filters.model || it.model === filters.model))
      .filter(it => (!filters.color || it.color === filters.color))
      .filter(it => (!filters.ram || it.ram === filters.ram))
      .filter(it => (!filters.storage || it.storage === filters.storage))
      .filter(it => (!filters.processor || it.processor === filters.processor))
      .filter(it => {
        if (!filters.imei) return true
        const q = String(filters.imei).trim()
        return String(it.imei1||'').includes(q) || String(it.imei2||'').includes(q)
      })

    const grouped = mobileItems.reduce((map, it) => {
      const key = `${(it.brand||'').toLowerCase()}::${(it.model||'').toLowerCase()}`
      if (!map[key]) map[key] = { ...it, id: key, productName: `${it.brand ? (it.brand + ' ') : ''}${it.productName}`, imei1: '', imei2: '', stock: 0, createdAt: it.createdAt }
      map[key].stock += Number(it.stock) || 0
      if (new Date(it.createdAt) < new Date(map[key].createdAt)) map[key].createdAt = it.createdAt
      return map
    }, {})

    const arr = Object.values(grouped)
    if (!storeId) return arr.map(item => ({ ...item, remainingStock: item.stock }))
    
    return arr.map(item => {
      const qty = storeStock
        .filter(s => (s.productModel || '') === item.model && (s.productName || '') === item.productName)
        .reduce((sum, r) => sum + (Number(r.quantity) || 0), 0)
      return { ...item, remainingStock: qty }
    })
  }, [inventory, storeId, storeStock, search, filters])

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterName]: value }
      
      // Reset dependent filters when parent filter changes
      if (filterName === 'brand') {
        newFilters.mobile = ''
        newFilters.model = ''
        newFilters.color = ''
        newFilters.ram = ''
        newFilters.storage = ''
        newFilters.processor = ''
      } else if (filterName === 'mobile') {
        newFilters.model = ''
        newFilters.color = ''
        newFilters.ram = ''
        newFilters.storage = ''
        newFilters.processor = ''
      } else if (filterName === 'model') {
        newFilters.color = ''
        newFilters.ram = ''
        newFilters.storage = ''
        newFilters.processor = ''
      }
      
      return newFilters
    })
  }

  const clearAllFilters = () => {
    setSearchInput('')
    setSearch('')
    setFilters({
      brand: '',
      mobile: '',
      model: '',
      color: '',
      ram: '',
      storage: '',
      processor: '',
      imei: ''
    })
  }

  const downloadStatement = async (item) => {
    try {
      const res = await fetch(`${apiBase}/api/mobiles?modelNumber=${encodeURIComponent(item.model)}`)
      const data = await res.json()
      const rows = Array.isArray(data) ? data : []
      const header = ['Mobile','Model','Color','RAM','Storage','IMEI1','IMEI2','Dealer','Cost','Sell']
      const lines = [header.join(',')]
      rows.forEach(r => {
        const fields = [
          (r.mobileName||'').replaceAll(',', ' '),
          (r.modelNumber||'').replaceAll(',', ' '),
          (r.color||'').replaceAll(',', ' '),
          (r.ram||'').replaceAll(',', ' '),
          (r.storage||'').replaceAll(',', ' '),
          (r.imeiNumber1||'').replaceAll(',', ' '),
          (r.imeiNumber2||'').replaceAll(',', ' '),
          (r.dealerName||'').replaceAll(',', ' '),
          String(r.pricePerProduct??'0'),
          String(r.sellingPrice??'0'),
        ]
        lines.push(fields.join(','))
      })
      const csv = lines.join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const fname = `${(item.brand||'brand').replaceAll(' ','_')}-${(item.model||'model').replaceAll(' ','_')}-statement.csv`
      a.download = fname
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      alert('Failed to download statement')
    }
  }

  const lowStockItems = mobileInventory.filter(item => item.remainingStock <= lowStockThreshold)
  const outOfStockItems = mobileInventory.filter(item => item.remainingStock <= 0)

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          <FiSmartphone className="text-slate-700" /> Mobile Inventory
        </h1>
        
        <SearchAndFilterBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          search={search}
          setSearch={setSearch}
          filters={filters}
          onFilterChange={handleFilterChange}
          filterOptions={filterOptions}
          onClearFilters={clearAllFilters}
        />
      </div>

      <StockSummaryCards
        inventory={mobileInventory}
        lowStockThreshold={lowStockThreshold}
        lowStockItems={lowStockItems}
        outOfStockItems={outOfStockItems}
      />

      <InventoryTable
        inventory={mobileInventory}
        lowStockThreshold={lowStockThreshold}
        onDownloadStatement={downloadStatement}
      />

      {lowStockItems.length > 0 && (
        <LowStockAlert lowStockItems={lowStockItems} />
      )}
    </div>
  )
}

export default Mobiles