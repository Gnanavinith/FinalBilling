import React, { useMemo, useState } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { formatCurrency } from './utils'
import { FiTrendingUp, FiPieChart, FiBarChart } from 'react-icons/fi'

const Charts = ({ filteredData }) => {
  const [activeChart, setActiveChart] = useState('line')

  const dailySalesData = useMemo(() => {
    const dailyData = {}
    filteredData.forEach(item => {
      if (!dailyData[item.date]) {
        dailyData[item.date] = { date: item.date, sales: 0, count: 0 }
      }
      dailyData[item.date].sales += item.netTotal
      dailyData[item.date].count += 1
    })
    return Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [filteredData])

  const paymentModeData = useMemo(() => {
    const paymentData = {}
    filteredData.forEach(item => {
      paymentData[item.paymentMode] = (paymentData[item.paymentMode] || 0) + item.netTotal
    })
    return Object.entries(paymentData).map(([mode, amount]) => ({ mode, amount }))
  }, [filteredData])

  const productSalesData = useMemo(() => {
    const productData = {}
    filteredData.forEach(item => {
      const product = item.productName || 'Unknown'
      productData[product] = (productData[product] || 0) + item.netTotal
    })
    return Object.entries(productData)
      .map(([product, amount]) => ({ product, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10) // Top 10 products
  }, [filteredData])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#4ECDC4', '#45B7D1']

  const chartTabs = [
    { id: 'line', label: 'Sales Trend', icon: FiTrendingUp },
    { id: 'pie', label: 'Payment Modes', icon: FiPieChart },
    { id: 'bar', label: 'Top Products', icon: FiBarChart }
  ]

  const renderChart = () => {
    switch (activeChart) {
      case 'line':
        return (
          <div className="h-48 sm:h-56 lg:h-64 xl:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailySalesData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  fontSize={9}
                  tick={{ fontSize: 9 }}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis 
                  fontSize={9}
                  tick={{ fontSize: 9 }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Sales']}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '11px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2 }}
                  name="Sales Amount" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )

      case 'pie':
        return (
          <div className="h-48 sm:h-56 lg:h-64 xl:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentModeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ mode, percent }) => `${mode} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {paymentModeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Amount']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )

      case 'bar':
        return (
          <div className="h-48 sm:h-56 lg:h-64 xl:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productSalesData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="product" 
                  fontSize={9}
                  tick={{ fontSize: 9 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  fontSize={9}
                  tick={{ fontSize: 9 }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Sales']}
                  labelFormatter={(label) => `Product: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-md sm:rounded-lg lg:rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 mb-3 sm:mb-4 lg:mb-6">
      {/* Chart Header with Tabs */}
      <div className="p-2 sm:p-3 lg:p-4 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-800">
            Analytics Dashboard
          </h3>
          
          {/* Chart Type Tabs */}
          <div className="flex bg-slate-100 rounded-md p-0.5">
            {chartTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveChart(tab.id)}
                  className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-sm transition-all ${
                    activeChart === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden xs:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-2 sm:p-3 lg:p-4">
        {renderChart()}
      </div>

      {/* Chart Legend for Mobile */}
      <div className="px-2 sm:px-3 lg:px-4 pb-2 sm:pb-3 lg:pb-4">
        <div className="text-xs text-slate-500 text-center">
          {activeChart === 'line' && 'Daily sales trend over time'}
          {activeChart === 'pie' && 'Payment method distribution'}
          {activeChart === 'bar' && 'Top 10 products by sales'}
        </div>
      </div>
    </div>
  )
}

export default Charts