import React, { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

const ServiceReportCharts = ({ filteredData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const statusData = useMemo(() => {
    const statusCounts = {}
    filteredData.forEach(item => {
      statusCounts[item.serviceStatus] = (statusCounts[item.serviceStatus] || 0) + 1
    })
    return Object.entries(statusCounts).map(([status, count]) => ({ status, count }))
  }, [filteredData])

  const technicianData = useMemo(() => {
    const techData = {}
    filteredData.forEach(item => {
      if (!techData[item.technicianName]) {
        techData[item.technicianName] = { technician: item.technicianName || 'Unassigned', services: 0, revenue: 0 }
      }
      techData[item.technicianName].services += 1
      techData[item.technicianName].revenue += item.totalAmount
    })
    return Object.values(techData)
  }, [filteredData])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  if (filteredData.length === 0) {
    return (
      <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 p-4 md:p-6 shadow-lg mb-4 md:mb-6">
        <p className="text-center text-slate-500">No data available for charts</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
      <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 p-4 md:p-6 shadow-lg hover:shadow-xl transition-all">
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Service Status Distribution</h3>
        <div className="h-48 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="count"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 p-4 md:p-6 shadow-lg hover:shadow-xl transition-all">
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Technician Performance</h3>
        <div className="h-48 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={technicianData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="technician" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="services" fill="#8884d8" name="Services Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default ServiceReportCharts