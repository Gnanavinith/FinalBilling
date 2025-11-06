import { useState, useEffect } from 'react'

export const useFilters = (profitData) => {
  const [filters, setFilters] = useState({
    dateRange: 'thisMonth',
    startDate: '',
    endDate: '',
    productName: '',
    category: '',
    salesperson: ''
  })
  
  const [filteredData, setFilteredData] = useState([])

  const applyFilters = (data, filterConfig) => {
    let filtered = [...data]
    
    if (filterConfig.productName) {
      filtered = filtered.filter(item => 
        item.productName?.toLowerCase().includes(filterConfig.productName.toLowerCase())
      )
    }
    
    if (filterConfig.category) {
      filtered = filtered.filter(item => item.category === filterConfig.category)
    }
    
    if (filterConfig.startDate) {
      filtered = filtered.filter(item => item.date >= filterConfig.startDate)
    }
    
    if (filterConfig.endDate) {
      filtered = filtered.filter(item => item.date <= filterConfig.endDate)
    }
    
    return filtered
  }

  useEffect(() => {
    if (profitData.length > 0) {
      setFilteredData(applyFilters(profitData, filters))
    }
  }, [filters, profitData])

  return { filters, setFilters, filteredData }
}