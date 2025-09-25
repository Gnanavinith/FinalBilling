import React, { useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'
import { formatCurrency } from './utils'

const Charts = ({ filteredData }) => {
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6">
      {/* Daily Sales Trend */}
      <div className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all">
        <h3 className="text-base lg:text-lg font-semibold mb-4">Daily Sales Trend</h3>
        <div className="h-48 lg:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} name="Sales Amount" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Mode Distribution */}
      <div className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all">
        <h3 className="text-base lg:text-lg font-semibold mb-4">Payment Mode Distribution</h3>
        <div className="h-48 lg:h-64">
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
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Charts