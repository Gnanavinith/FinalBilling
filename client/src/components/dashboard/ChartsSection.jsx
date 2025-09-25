import React from 'react'
import Card from './Card'
import RevenueChart from './charts/RevenueChart'
import ProfitExpenseChart from './charts/ProfitExpenseChart'
import ServiceSummaryChart from './charts/ServiceSummaryChart'

const ChartsSection = ({ charts }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
      <div className="xl:col-span-2 animate-slide-in-up" style={{animationDelay: '0.6s'}}>
        <Card title="📈 Month-wise Revenue" gradient={true}>
          <RevenueChart data={charts.monthlyRevenueData} />
        </Card>
      </div>

      <div className="animate-slide-in-up" style={{animationDelay: '0.7s'}}>
        <Card title="💰 Profit vs Expense" gradient={true}>
          <ProfitExpenseChart data={charts.profitExpenseData} />
        </Card>
      </div>

      <div className="animate-slide-in-up" style={{animationDelay: '0.8s'}}>
        <Card title="🔧 Service Summary" gradient={true}>
          <ServiceSummaryChart data={charts.serviceSummaryData} />
        </Card>
      </div>
    </div>
  )
}

export default ChartsSection