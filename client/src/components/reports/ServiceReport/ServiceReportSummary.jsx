import React from 'react'
import { FiSettings, FiCheckCircle, FiClock, FiUser, FiXCircle } from 'react-icons/fi'

const ServiceReportSummary = ({ summary }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const summaryCards = [
    {
      title: 'Total Services',
      value: summary.totalServices,
      icon: FiSettings,
      color: 'text-blue-600'
    },
    {
      title: 'Completed',
      value: summary.completedServices,
      icon: FiCheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Pending',
      value: summary.pendingServices,
      icon: FiClock,
      color: 'text-yellow-600'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(summary.totalRevenue),
      icon: FiSettings,
      color: 'text-purple-600'
    },
    {
      title: 'Advance Paid',
      value: formatCurrency(summary.totalAdvancePaid),
      icon: FiUser,
      color: 'text-indigo-600'
    },
    {
      title: 'Pending Balance',
      value: formatCurrency(summary.totalPendingBalance),
      icon: FiXCircle,
      color: 'text-red-600'
    },
    {
      title: 'Parts Cost',
      value: formatCurrency(summary.totalPartsCost),
      icon: FiSettings,
      color: 'text-orange-600'
    },
    {
      title: 'Service Charges',
      value: formatCurrency(summary.totalServiceCharges),
      icon: FiSettings,
      color: 'text-teal-600'
    }
  ]

  return (
    <>
      {/* Main Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        {summaryCards.slice(0, 4).map((card, index) => (
          <SummaryCard key={index} card={card} />
        ))}
      </div>

      {/* Additional Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        {summaryCards.slice(4).map((card, index) => (
          <SummaryCard key={index} card={card} />
        ))}
      </div>
    </>
  )
}

const SummaryCard = ({ card }) => {
  const Icon = card.icon
  return (
    <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 p-3 md:p-4 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-slate-600 truncate">{card.title}</p>
          <p className={`text-lg md:text-2xl font-semibold truncate ${card.color}`}>
            {card.value}
          </p>
        </div>
        <Icon className={`w-6 h-6 md:w-8 md:h-8 flex-shrink-0 ml-2 ${card.color}`} />
      </div>
    </div>
  )
}

export default ServiceReportSummary