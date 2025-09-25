import { useState, useEffect } from 'react'

export const useAvailableMobiles = () => {
  const [availableMobiles, setAvailableMobiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchAvailableMobiles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('status', 'available')
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await fetch(`/api/secondhand-mobiles?${params}`)
      const result = await response.json()
      
      if (result.success) {
        setAvailableMobiles(result.data)
      }
    } catch (error) {
      console.error('Error fetching mobiles:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAvailableMobiles()
  }, [searchTerm])

  return {
    availableMobiles,
    loading,
    searchTerm,
    setSearchTerm,
    fetchAvailableMobiles
  }
}