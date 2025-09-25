import { useState, useEffect } from 'react'

export const useProfitData = () => {
  const [profitData, setProfitData] = useState([])

  useEffect(() => {
    // Simulate API call
    const sampleData = [
      // Your sample data here
    ]
    setProfitData(sampleData)
  }, [])

  return { profitData }
}