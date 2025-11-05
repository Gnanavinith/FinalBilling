import React from 'react'
import SummaryCard from './SummaryCard'
import { formatCurrency } from '../../../utils/formatters'

const SummaryCards = ({ summary }) => {
  const cards = [
    {
      title: 'Total Sales',
      value: formatCurrency(summary.totalSalesAmount),
      icon: 'dollar',
      color: 'blue'
    },
    {
      title: 'Total Purchase Cost',
      value: formatCurrency(summary.totalPurchaseCost),
      icon: 'package',
      color: 'orange'
    },
    {
      title: 'Gross Profit',
      value: formatCurrency(summary.totalGrossProfit),
      icon: 'trending-up',
      color: 'green'
    },
    {
      title: 'Net Profit',
      value: formatCurrency(summary.totalNetProfit),
      icon: 'trending-up',
      color: 'indigo'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      icon: 'dollar',
      color: 'red'
    },
    {
      title: 'Total Quantity',
      value: summary.totalQuantity.toString(),
      icon: 'package',
      color: 'purple'
    },
    {
      title: 'Average Margin',
      value: `${summary.averageMargin.toFixed(2)}%`,
      icon: 'trending-up',
      color: 'teal'
    },
    {
      title: 'Profit Margin',
      value: `${(summary.totalSalesAmount > 0 
        ? (summary.totalNetProfit / summary.totalSalesAmount) * 100 
        : 0).toFixed(2)}%`,
      icon: 'users',
      color: 'emerald'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <SummaryCard key={index} {...card} />
      ))}
    </div>
  )
}

export default SummaryCards