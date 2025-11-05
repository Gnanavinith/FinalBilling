import React, { useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts'

const Charts = ({ data }) => {
  const chartData = useMemo(() => ({
    dailyProfit: processDailyProfitData(data),
    categoryProfit: processCategoryData(data),
    topProducts: processTopProductsData(data)
  }), [data])

  return (
    <div className="space-y-6 mb-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DailyProfitChart data={chartData.dailyProfit} />
        <CategoryProfitChart data={chartData.categoryProfit} />
      </div>
      <TopProductsChart data={chartData.topProducts} />
    </div>
  )
}

export default Charts

// Local chart components (inlined to avoid missing imports)
const DailyProfitChart = ({ data }) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
    <h3 className="text-base font-semibold mb-3">Daily Net Profit</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="netProfit" name="Net Profit" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
)

const CategoryProfitChart = ({ data }) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
    <h3 className="text-base font-semibold mb-3">Profit by Category</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="netProfit" name="Net Profit" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)

const TopProductsChart = ({ data }) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
    <h3 className="text-base font-semibold mb-3">Top Products by Profit</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="productName" width={140} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="netProfit" name="Net Profit" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)

// Data processing helpers
function processDailyProfitData(raw) {
  const byDate = new Map()
  for (const item of Array.isArray(raw) ? raw : []) {
    const date = String(item?.date || '').slice(0, 10)
    const profit = Number(item?.netProfit ?? item?.totalNetProfit ?? 0)
    if (!date) continue
    byDate.set(date, (byDate.get(date) || 0) + profit)
  }
  return Array.from(byDate, ([date, netProfit]) => ({ date, netProfit }))
}

function processCategoryData(raw) {
  const byCat = new Map()
  for (const item of Array.isArray(raw) ? raw : []) {
    const category = item?.category || 'Uncategorized'
    const profit = Number(item?.netProfit ?? item?.totalNetProfit ?? 0)
    byCat.set(category, (byCat.get(category) || 0) + profit)
  }
  return Array.from(byCat, ([category, netProfit]) => ({ category, netProfit }))
}

function processTopProductsData(raw, topN = 10) {
  const byProduct = new Map()
  for (const item of Array.isArray(raw) ? raw : []) {
    const name = item?.productName || 'Unknown'
    const profit = Number(item?.netProfit ?? item?.totalNetProfit ?? 0)
    byProduct.set(name, (byProduct.get(name) || 0) + profit)
  }
  return Array.from(byProduct, ([productName, netProfit]) => ({ productName, netProfit }))
    .sort((a, b) => b.netProfit - a.netProfit)
    .slice(0, topN)
}