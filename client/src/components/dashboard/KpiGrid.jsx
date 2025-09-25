import React from 'react'
import KpiCard from './KpiCard'
import { 
  MdTrendingUp, 
  MdShoppingBag, 
  MdBuild, 
  MdShowChart, 
  MdWarningAmber 
} from 'react-icons/md'
import { formatCurrency  } from '../../utils/formatters'

const KpiGrid = ({ kpis }) => {
  const kpiConfigs = [
    {
      icon: MdTrendingUp,
      title: "Total Revenue (This Month)",
      value: formatCurrency(kpis.totalRevenueThisMonth),
      sub: "Last 30 days",
      color: "green"
    },
    {
      icon: MdShoppingBag,
      title: "Total Sales (Mobiles + Accessories)",
      value: `${kpis.totalSales}`,
      sub: "Units sold this month",
      color: "blue"
    },
    {
      icon: MdBuild,
      title: "Total Services",
      value: `${kpis.totalServices}`,
      sub: "Tickets closed this month",
      color: "purple"
    },
    {
      icon: MdShowChart,
      title: "Profit Margin",
      value: `${kpis.profitMargin}%`,
      sub: "Approximate",
      color: "orange"
    },
    {
      icon: MdWarningAmber,
      title: "Low Stock Alerts",
      value: `${kpis.lowStockAlerts}`,
      sub: "Items below threshold",
      color: "red"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
      {kpiConfigs.map((config, index) => (
        <div 
          key={config.title}
          className="animate-slide-in-left" 
          style={{animationDelay: `${0.1 * (index + 1)}s`}}
        >
          <KpiCard {...config} />
        </div>
      ))}
    </div>
  )
}

export default KpiGrid