import React from 'react'
import Card from './Card'
import RecentPurchasesTable from './tables/RecentPurchasesTable'
import RecentSalesTable from './tables/RecentSalesTable'
import RecentServicesTable from './tables/RecentServicesTable'

const RecentActivity = ({ recent }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <div className="animate-slide-in-up" style={{animationDelay: '1.0s'}}>
        <Card title="🛒 Recent Dealer Purchases" gradient={true}>
          <RecentPurchasesTable data={recent.purchases} />
        </Card>
      </div>

      <div className="animate-slide-in-up" style={{animationDelay: '1.1s'}}>
        <Card title="💳 Recent Sales Invoices" gradient={true}>
          <RecentSalesTable data={recent.sales} />
        </Card>
      </div>

      <div className="animate-slide-in-up" style={{animationDelay: '1.2s'}}>
        <Card title="🔧 Recent Service Bills" gradient={true}>
          <RecentServicesTable data={recent.services} />
        </Card>
      </div>
    </div>
  )
}

export default RecentActivity