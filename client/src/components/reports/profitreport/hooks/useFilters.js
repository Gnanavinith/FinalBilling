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

  useEffect(() => {
    if (profitData.length > 0) {
      setFilteredData(applyFilters(profitData, filters))
    }
  }, [filters, profitData])

  return { filters, setFilters, filteredData }
}