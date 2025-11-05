import React, { useState, useEffect, useMemo } from 'react'
import ServiceReportFilters from '../../components/reports/ServiceReport/ServiceReportFilters'
import ServiceReportSummary from '../../components/reports/ServiceReport/ServiceReportSummary'
import ServiceReportCharts from '../../components/reports/ServiceReport/ServiceReportCharts'
import ServiceReportTable from '../../components/reports/ServiceReport/ServiceReportTable'
import { exportToPDF, exportToExcel } from '../../components/reports/ServiceReport/exportUtils'
import { FiDownload, FiPrinter } from 'react-icons/fi'

import { apiBase } from '../../utils/environment'

const ServiceReport = () => {
  const [serviceData, setServiceData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [filters, setFilters] = useState({
    dateRange: 'thisMonth',
    startDate: '',
    endDate: '',
    status: '',
    technician: '',
    customerName: '',
    serviceType: ''
  })

  // Sample data - in real app, this would come from API/database
  const sampleServiceData = [
    {
      serviceId: 'SRV-001234',
      dateOfRequest: '2025-01-15',
      customerName: 'Ravi Kumar',
      customerPhone: '9876543210',
      deviceName: 'iPhone 14 Pro',
      deviceModel: 'A2888',
      imei: '123456789012345',
      problemDescription: 'Screen cracked, needs replacement',
      partsUsed: [
        { partName: 'Screen Assembly', quantity: 1, cost: 15000 },
        { partName: 'Adhesive', quantity: 1, cost: 500 }
      ],
      serviceCharges: 2000,
      totalAmount: 17500,
      advancePaid: 5000,
      pendingBalance: 12500,
      serviceStatus: 'In Progress',
      technicianName: 'Amit Sharma',
      serviceStartDate: '2025-01-15',
      estimatedDeliveryDate: '2025-01-18',
      actualDeliveryDate: '',
      notes: 'Customer requested quick repair'
    },
    // ... rest of your sample data
  ]

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${apiBase}/api/service-invoices`)
        const data = await res.json()
        const rows = (Array.isArray(data) ? data : []).map(d => ({
          serviceId: d.serviceBillNumber || d.id,
          dateOfRequest: (d.createdAt ? new Date(d.createdAt).toISOString().split('T')[0] : ''),
          customerName: d.customerName || '',
          customerPhone: d.phoneNumber || '',
          deviceName: d.modelName || '',
          deviceModel: '',
          imei: d.imei || '',
          problemDescription: d.problem || '',
          partsUsed: Array.isArray(d.parts) ? d.parts.map(p => ({ partName: p.name, quantity: Number(p.quantity)||0, cost: Number(p.price)||0 })) : [],
          serviceCharges: Number(d.laborCost)||0,
          totalAmount: Number(d.grandTotal)||0,
          advancePaid: 0,
          pendingBalance: 0,
          serviceStatus: 'Completed',
          technicianName: '',
          serviceStartDate: '',
          estimatedDeliveryDate: '',
          actualDeliveryDate: '',
          notes: ''
        }))
        setServiceData(rows)
        setFilteredData(rows)
      } catch (e) {
        // fallback to sample if fetch fails
        setServiceData([])
        setFilteredData([])
      }
    }
    load()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, serviceData])

  const applyFilters = () => {
    let filtered = [...serviceData]

    // Date range filter
    if (filters.dateRange === 'custom' && filters.startDate && filters.endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.dateOfRequest)
        const startDate = new Date(filters.startDate)
        const endDate = new Date(filters.endDate)
        return itemDate >= startDate && itemDate <= endDate
      })
    } else if (filters.dateRange === 'today') {
      const today = new Date().toISOString().split('T')[0]
      filtered = filtered.filter(item => item.dateOfRequest === today)
    } else if (filters.dateRange === 'thisWeek') {
      const today = new Date()
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
      const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.dateOfRequest)
        return itemDate >= startOfWeek && itemDate <= endOfWeek
      })
    } else if (filters.dateRange === 'thisMonth') {
      const today = new Date()
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.dateOfRequest)
        return itemDate >= startOfMonth && itemDate <= endOfMonth
      })
    }

    // Other filters
    if (filters.status) {
      filtered = filtered.filter(item => item.serviceStatus === filters.status)
    }
    if (filters.technician) {
      filtered = filtered.filter(item => 
        item.technicianName.toLowerCase().includes(filters.technician.toLowerCase())
      )
    }
    if (filters.customerName) {
      filtered = filtered.filter(item => 
        item.customerName.toLowerCase().includes(filters.customerName.toLowerCase())
      )
    }
    if (filters.serviceType) {
      filtered = filtered.filter(item => 
        item.problemDescription.toLowerCase().includes(filters.serviceType.toLowerCase())
      )
    }

    setFilteredData(filtered)
  }

  const calculateSummary = useMemo(() => {
    const totalServices = filteredData.length
    const completedServices = filteredData.filter(item => item.serviceStatus === 'Completed' || item.serviceStatus === 'Delivered').length
    const pendingServices = filteredData.filter(item => item.serviceStatus === 'Pending' || item.serviceStatus === 'In Progress').length
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.totalAmount, 0)
    const totalAdvancePaid = filteredData.reduce((sum, item) => sum + item.advancePaid, 0)
    const totalPendingBalance = filteredData.reduce((sum, item) => sum + item.pendingBalance, 0)
    const totalPartsCost = filteredData.reduce((sum, item) => 
      sum + item.partsUsed.reduce((partSum, part) => partSum + (part.cost * part.quantity), 0), 0
    )
    const totalServiceCharges = filteredData.reduce((sum, item) => sum + item.serviceCharges, 0)

    return {
      totalServices,
      completedServices,
      pendingServices,
      totalRevenue,
      totalAdvancePaid,
      totalPendingBalance,
      totalPartsCost,
      totalServiceCharges
    }
  }, [filteredData])

    const printReport = () => {
    window.print()
  }


  const handleExportPDF = () => {
    exportToPDF(filteredData, calculateSummary)
  }

  const handleExportExcel = () => {
    exportToExcel(filteredData)
  }

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Service Report
        </h1>
        
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-md hover:shadow-lg transition-all text-sm md:text-base flex-1 lg:flex-none justify-center"
          >
            <FiDownload className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-md hover:shadow-lg transition-all text-sm md:text-base flex-1 lg:flex-none justify-center"
          >
            <FiDownload className="w-4 h-4" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>
          <button
            onClick={printReport}
            className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all text-sm md:text-base flex-1 lg:flex-none justify-center"
          >
            <FiPrinter className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      <ServiceReportSummary summary={calculateSummary} />
      <ServiceReportFilters filters={filters} setFilters={setFilters} />
      <ServiceReportCharts filteredData={filteredData} />
      <ServiceReportTable filteredData={filteredData} />
    </div>
  )
}

export default ServiceReport