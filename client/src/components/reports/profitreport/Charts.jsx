import React, { useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts'
import DailyProfitChart from './charts/DailyProfitChart'
import CategoryProfitChart from './charts/CategoryProfitChart'
import TopProductsChart from './charts/TopProductsChart'

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