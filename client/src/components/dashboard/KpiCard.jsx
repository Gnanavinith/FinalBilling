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
    <div className={`rounded-xl sm:rounded-2xl ${colorClasses[color]} border p-4 sm:p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 transform hover:scale-105 relative z-10`}>
      <div className="flex items-center justify-between">
        <div className="animate-fade-in flex-1 min-w-0">
          <div className="text-xs sm:text-sm font-medium opacity-80 mb-1 truncate">{title}</div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">{value}</div>
        </div>
        {Icon ? <Icon className="text-2xl sm:text-3xl lg:text-4xl opacity-80 animate-pulse flex-shrink-0 ml-2" /> : null}
      </div>
      {sub ? <div className="mt-2 sm:mt-3 text-xs font-medium opacity-70 truncate">{sub}</div> : null}
    </div>
  )
}

export default KpiCard