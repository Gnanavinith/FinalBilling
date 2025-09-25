import { useState, useEffect, useMemo } from 'react'

const apiBase = (typeof window !== 'undefined' && window?.process?.versions?.electron) ? 'http://localhost:5000' : ''

// Custom hook for data management
export const useSalesData = () => {
  const [salesData, setSalesData] = useState([])
  const [filters, setFilters] = useState({
    dateRange: 'thisMonth',
    startDate: '',
    endDate: '',
    invoiceNumber: '',
    productName: '',
    paymentMode: '',
    salesperson: '',
    customerName: ''
  })

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [saleRes, mobRes] = await Promise.all([
          fetch(`${apiBase}/api/sale`),
          fetch(`${apiBase}/api/mobiles`)
        ])
        const saleData = await saleRes.json()
        const mobileData = await mobRes.json()
        
        const rows = Array.isArray(saleData) ? saleData : []
        const mobiles = Array.isArray(mobileData) ? mobileData : []
        
        const enriched = enrichSalesData(rows, mobiles)
        setSalesData(enriched)
      } catch (error) {
        console.error('Error loading sales data:', error)
        setSalesData([])
      }
    }
    
    loadData()
  }, [])

  // Apply filters
  const filteredData = useMemo(() => {
    return applyFilters(salesData, filters)
  }, [salesData, filters])

  // Calculate summary
  const calculateSummary = useMemo(() => {
    const totalSales = filteredData.reduce((sum, item) => sum + (item.totalAmount || 0), 0)
    const totalQuantity = filteredData.reduce((sum, item) => sum + (item.quantity || 0), 0)
    const totalDiscount = filteredData.reduce((sum, item) => sum + (item.discount || 0), 0)
    const totalGST = filteredData.reduce((sum, item) => sum + (item.gstAmount || 0), 0)
    const netTotal = filteredData.reduce((sum, item) => sum + (item.netTotal || 0), 0)

    return { totalSales, totalQuantity, totalDiscount, totalGST, netTotal }
  }, [filteredData])

  return {
    salesData,
    filteredData,
    filters,
    setFilters,
    calculateSummary
  }
}

// Utility functions
export const enrichSalesData = (sales, mobiles) => {
  const byModel = new Map()
  const byImei = new Map()
  
  mobiles.forEach(m => {
    byModel.set(String(m.modelNumber || '').toLowerCase(), m)
    if (m.imeiNumber1) byImei.set(String(m.imeiNumber1), m)
    if (m.imeiNumber2) byImei.set(String(m.imeiNumber2), m)
  })

  return sales.map(sale => {
    let specs = { ...sale }
    
    if (!sale.color && !sale.ram && !sale.storage) {
      let source = null
      if (sale.imei && byImei.has(String(sale.imei))) {
        source = byImei.get(String(sale.imei))
      } else if (sale.model) {
        source = byModel.get(String(sale.model || '').toLowerCase())
      }
      
      if (source) {
        specs = {
          ...specs,
          color: source.color || sale.color,
          ram: source.ram || sale.ram,
          storage: source.storage || sale.storage,
          processor: source.processor || sale.processor,
          displaySize: source.displaySize || sale.displaySize,
          camera: source.camera || sale.camera,
          battery: source.battery || sale.battery,
          operatingSystem: source.operatingSystem || sale.operatingSystem,
          networkType: source.networkType || sale.networkType
        }
      }
    }
    
    return specs
  })
}

export const applyFilters = (data, filters) => {
  let filtered = [...data]

  // Date range filter
  if (filters.dateRange === 'custom' && filters.startDate && filters.endDate) {
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.date)
      const startDate = new Date(filters.startDate)
      const endDate = new Date(filters.endDate)
      return itemDate >= startDate && itemDate <= endDate
    })
  } else if (filters.dateRange === 'today') {
    const today = new Date().toISOString().split('T')[0]
    filtered = filtered.filter(item => item.date === today)
  } else if (filters.dateRange === 'thisWeek') {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= startOfWeek && itemDate <= endOfWeek
    })
  } else if (filters.dateRange === 'thisMonth') {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= startOfMonth && itemDate <= endOfMonth
    })
  }

  // Other filters
  if (filters.invoiceNumber) {
    const query = filters.invoiceNumber.trim().toLowerCase()
    filtered = filtered.filter(item => 
      String(item.invoiceNumber || '').toLowerCase().includes(query)
    )
  }
  if (filters.productName) {
    filtered = filtered.filter(item => 
      String(item.productName || '').toLowerCase().includes(filters.productName.toLowerCase())
    )
  }
  if (filters.paymentMode) {
    filtered = filtered.filter(item => item.paymentMode === filters.paymentMode)
  }
  if (filters.salesperson) {
    filtered = filtered.filter(item => 
      String(item.salesperson || '').toLowerCase().includes(filters.salesperson.toLowerCase())
    )
  }
  if (filters.customerName) {
    filtered = filtered.filter(item => 
      String(item.customerName || '').toLowerCase().includes(filters.customerName.toLowerCase())
    )
  }

  return filtered
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0)
}

// Export functions for PDF/Excel
export const exportToPDF = (filteredData, calculateSummary) => {
  // PDF export implementation
}

export const exportToExcel = (filteredData) => {
  // Excel export implementation
}