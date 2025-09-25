import React from 'react'

const KpiCard = ({ icon: Icon, title, value, sub, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-700",
    purple: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-700",
    orange: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-orange-700",
    red: "bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-red-700"
  }
  
  return (
    <div className={`rounded-2xl ${colorClasses[color]} border p-6 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 transform hover:scale-105 relative z-10`}>
      <div className="flex items-center justify-between">
        <div className="animate-fade-in">
          <div className="text-sm font-medium opacity-80 mb-1">{title}</div>
          <div className="text-3xl font-bold">{value}</div>
        </div>
        {Icon ? <Icon className="text-4xl opacity-80 animate-pulse" /> : null}
      </div>
      {sub ? <div className="mt-3 text-xs font-medium opacity-70">{sub}</div> : null}
    </div>
  )
}

export default KpiCard