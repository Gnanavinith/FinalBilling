import React from 'react'
import { isElectron, apiBase } from '../utils/environment'
import KpiGrid from './components/KpiGrid'
import ChartsSection from './components/ChartsSection'
import QuickActions from './components/QuickActions'
import RecentActivity from './components/RecentActivity'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'

const Dashboard = () => {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [dashboardData, setDashboardData] = React.useState({
    kpis: { 
      totalRevenueThisMonth: 0, 
      totalSales: 0, 
      totalServices: 0, 
      profitMargin: 0, 
      lowStockAlerts: 0 
    },
    charts: {
      monthlyRevenueData: [],
      profitExpenseData: [],
      serviceSummaryData: []
    },
    recent: {
      purchases: [],
      sales: [],
      services: []
    }
  })

  React.useEffect(() => {
    let mounted = true
    const loadDashboardData = async () => {
      try {
        const res = await fetch(`${apiBase}/api/dashboard/summary`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to load dashboard')
        if (!mounted) return
        setDashboardData(data)
        setError('')
      } catch (e) {
        setError(String(e?.message || e))
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
    return () => { mounted = false }
  }, [])

  if (loading) return <LoadingSpinner />
  
  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen relative z-0">
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-slate-600 mb-8">Welcome to your business overview</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <KpiGrid kpis={dashboardData.kpis} />
      <ChartsSection charts={dashboardData.charts} />
      <QuickActions />
      <RecentActivity recent={dashboardData.recent} />
    </div>
  )
}

export default Dashboard