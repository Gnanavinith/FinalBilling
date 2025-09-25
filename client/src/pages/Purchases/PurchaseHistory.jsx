import React, { useState, useEffect, useMemo } from 'react'
import PurchaseFilters from '../../components/purchase/purchasehistory/PurchaseFilters'
import PurchaseTable from '../../components/purchase/purchasehistory/PurchaseTable'
import PurchaseDetailsModal from '../../components/purchase/purchasehistory/PurchaseDetailsModal'
import { exportToPDF, exportToExcel } from '../../components/purchase/purchasehistory/utils/exportUtils'
import { calculateRemainingStock, getDealerName } from '../../components/purchase/purchasehistory/utils/purchaseCalculations'

const apiBase = 'http://localhost:5000'

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([])
  const [dealers, setDealers] = useState([])
  const [itemCodes, setItemCodes] = useState({})
  const [filters, setFilters] = useState({
    dealerId: '',
    dateFrom: '',
    dateTo: '',
    category: '',
    search: ''
  })
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [pRes, dRes] = await Promise.all([
        fetch(`${apiBase}/api/purchases`),
        fetch(`${apiBase}/api/dealers`),
      ])
      const p = await pRes.json()
      const d = await dRes.json()
      setPurchases(Array.isArray(p) ? p : [])
      setDealers(Array.isArray(d) ? d : [])
    } catch (e) {
      console.error('Failed to load purchases/dealers', e)
      setPurchases([])
      setDealers([])
    } finally {
      setLoading(false)
    }
  }

  const reloadPurchases = async () => {
    try {
      const res = await fetch(`${apiBase}/api/purchases`)
      const p = await res.json()
      setPurchases(Array.isArray(p) ? p : [])
    } catch (e) {
      console.error('Failed to reload purchases', e)
    }
  }

  const markReceived = async (purchaseId) => {
    try {
      const res = await fetch(`${apiBase}/api/purchases/${encodeURIComponent(purchaseId)}/receive`, { 
        method: 'POST' 
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}))
        throw new Error(msg.error || 'Failed to mark received')
      }
      await reloadPurchases()
      alert('Purchase marked as Received and moved into stock. Click OK to go to Update Stock page.')
      window.location.href = '/stock/mobiles'
    } catch (e) {
      console.error('Error marking as received:', e)
      alert(String(e?.message || e))
    }
  }

  const loadItemCodes = async (purchase, item, idx) => {
    const key = `${purchase.id}-${idx}`
    if (itemCodes[key]) return
    
    try {
      const codes = []
      const category = String(item.category || '').toLowerCase()
      
      if (category === 'mobile' || category === 'mobiles') {
        const res = await fetch(`${apiBase}/api/mobiles?dealerId=${encodeURIComponent(purchase.dealerId)}&modelNumber=${encodeURIComponent(item.model || '')}`)
        const rows = await res.json()
        const list = Array.isArray(rows) ? rows : []
        list.forEach(m => { if (Array.isArray(m.productIds)) codes.push(...m.productIds) })
      } else if (category === 'accessories' || category === 'accessory') {
        const res = await fetch(`${apiBase}/api/accessories?dealerId=${encodeURIComponent(purchase.dealerId)}`)
        const rows = await res.json()
        const list = Array.isArray(rows) ? rows : []
        list.filter(a => String(a.productName || '') === String(item.productName || ''))
          .forEach(a => { if (Array.isArray(a.productIds)) codes.push(...a.productIds) })
      }
      
      setItemCodes(prev => ({ ...prev, [key]: codes }))
    } catch {
      setItemCodes(prev => ({ ...prev, [key]: [] }))
    }
  }

  const filteredPurchases = useMemo(() => {
    let filtered = purchases

    if (filters.dealerId) {
      filtered = filtered.filter(p => p.dealerId === filters.dealerId)
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(p => p.purchaseDate >= filters.dateFrom)
    }
    if (filters.dateTo) {
      filtered = filtered.filter(p => p.purchaseDate <= filters.dateTo)
    }
    if (filters.category) {
      filtered = filtered.filter(p => 
        p.items.some(item => item.category === filters.category)
      )
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(p => 
        p.invoiceNumber.toLowerCase().includes(searchLower) ||
        p.items.some(item => 
          item.productName.toLowerCase().includes(searchLower) ||
          item.model.toLowerCase().includes(searchLower)
        )
      )
    }

    return filtered.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
  }, [purchases, filters])

  const handleExportPDF = () => {
    exportToPDF(filteredPurchases, dealers, filters, calculateRemainingStock)
  }

  const handleExportExcel = () => {
    exportToExcel(filteredPurchases, dealers, calculateRemainingStock)
  }

  const handleViewDetails = (purchase) => {
    setSelectedPurchase(purchase)
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h1 className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Purchase History
        </h1>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-4 py-2 lg:px-5 lg:py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 shadow-md hover:shadow-lg transition-all text-sm lg:text-base flex-1 lg:flex-none justify-center"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-2 px-4 py-2 lg:px-5 lg:py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all text-sm lg:text-base flex-1 lg:flex-none justify-center"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      <PurchaseFilters 
        filters={filters}
        onFiltersChange={setFilters}
        dealers={dealers}
      />

      <PurchaseTable
        purchases={filteredPurchases}
        dealers={dealers}
        itemCodes={itemCodes}
        onViewDetails={handleViewDetails}
        onMarkReceived={markReceived}
        onLoadItemCodes={loadItemCodes}
        getDealerName={getDealerName}
        calculateRemainingStock={calculateRemainingStock}
      />

      {showModal && selectedPurchase && (
        <PurchaseDetailsModal
          purchase={selectedPurchase}
          dealers={dealers}
          onClose={() => setShowModal(false)}
          onMarkReceived={markReceived}
        />
      )}
    </div>
  )
}

export default PurchaseHistory