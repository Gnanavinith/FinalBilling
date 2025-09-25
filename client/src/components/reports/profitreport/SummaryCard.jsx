import React from 'react'
import { 
  FiDollarSign, 
  FiPackage, 
  FiTrendingUp, 
  FiUsers 
} from 'react-icons/fi'

const iconMap = {
  dollar: FiDollarSign,
  package: FiPackage,
  'trending-up': FiTrendingUp,
  users: FiUsers
}

const colorMap = {
  blue: 'text-blue-600',
  orange: 'text-orange-600',
  green: 'text-green-600',
  indigo: 'text-indigo-600',
  red: 'text-red-600',
  purple: 'text-purple-600',
  teal: 'text-teal-600',
  emerald: 'text-emerald-600'
}

const SummaryCard = ({ title, value, icon, color }) => {
  const IconComponent = iconMap[icon]
  const colorClass = colorMap[color]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 truncate">{title}</p>
          <p className={`text-xl sm:text-2xl font-semibold truncate ${colorClass}`}>
            {value}
          </p>
        </div>
        <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 ${colorClass}`} />
      </div>
    </div>
  )
}

export default SummaryCard