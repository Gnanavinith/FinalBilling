import React from 'react'
import { Link } from 'react-router-dom'
import Card from './Card'
import { 
  MdAddShoppingCart, 
  MdPlayForWork, 
  MdHomeRepairService, 
  MdCompareArrows 
} from 'react-icons/md'

const QuickActions = () => {
  const actions = [
    {
      to: "/billing/new",
      icon: MdAddShoppingCart,
      label: "New Bill",
      gradient: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
    },
    {
      to: "/purchases/add",
      icon: MdPlayForWork,
      label: "Add Purchase",
      gradient: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
    },
    {
      to: "/services/requests",
      icon: MdHomeRepairService,
      label: "New Service",
      gradient: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
    },
    {
      to: "/transfers/new",
      icon: MdCompareArrows,
      label: "Transfer",
      gradient: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
    }
  ]

  return (
    <div className="animate-slide-in-up" style={{animationDelay: '0.9s'}}>
      <Card title="⚡ Quick Actions" gradient={true}>
        <div className="flex flex-wrap gap-4">
          {actions.map((action) => (
            <ActionLink key={action.label} {...action} />
          ))}
        </div>
      </Card>
    </div>
  )
}

const ActionLink = ({ to, icon: Icon, label, gradient }) => (
  <Link 
    to={to} 
    className={`group inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r ${gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 relative z-10`}
  >
    <Icon className="text-xl group-hover:animate-bounce" />
    <span className="font-semibold">{label}</span>
  </Link>
)

export default QuickActions