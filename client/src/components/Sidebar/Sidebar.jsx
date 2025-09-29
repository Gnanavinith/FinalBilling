import React, { useMemo } from 'react'
import SidebarItem from './SidebarItem'
import { MdSpaceDashboard, MdReceiptLong, MdPeople, MdShoppingCart, MdInventory2, MdBuild, MdCompareArrows, MdAssessment, MdSettings, MdSmartphone, MdHeadphones, MdPhoneAndroid } from 'react-icons/md'
import { MdPsychology } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import thumbnail from '../../assets/thumbnail.bmp'

const Sidebar = ({ onClose }) => {
  const { auth } = useAuth()
  const role = auth.user?.role
  const isStaff = role === 'staff'

  const showDashboard = !isStaff
  const showDealers = !isStaff
  const showPurchases = !isStaff
  const showReports = !isStaff

  return (
    <aside className="h-screen w-72 flex-shrink-0 bg-gradient-to-b from-white to-indigo-50 border-r border-slate-200 text-slate-800 p-3 sticky top-0 transition-colors duration-200 overflow-y-auto print:hidden">
      <div className="px-2 py-3 mb-3 flex items-center justify-center">
        <img src={thumbnail} alt="Shop" className=" max-h-20 border object-full" />
      </div>

      <nav className="space-y-1">
        {showDashboard ? <SidebarItem label="Dashboard" icon={MdSpaceDashboard} to="/dashboard" onClose={onClose} /> : null}

        <SidebarItem label="Billing" icon={MdReceiptLong} childrenItems={[
          { label: 'New Bill / POS', to: '/billing/new' },
          { label: 'Service Billing', to: '/billing/service' },
          { label: 'Second Hand Mobiles', to: '/billing/secondhand' },
        ]} onClose={onClose} />

        {showDealers ? (
          <SidebarItem label="Dealers" icon={MdPeople} childrenItems={[
            { label: 'Manage Dealers', to: '/dealers/manage' },
            { label: 'Dealer History', to: '/dealers/history' },
          ]} onClose={onClose} />
        ) : null}

        {showPurchases ? (
          <SidebarItem label="Purchases" icon={MdShoppingCart} childrenItems={[
            { label: 'Purchase order', to: '/purchases/add' },
            { label: 'Purchase History', to: '/purchases/history' },
          ]} onClose={onClose} />
        ) : null}

        <SidebarItem label="Inventory" icon={MdInventory2} childrenItems={[
          { label: 'Mobiles', to: '/inventory/mobiles', icon: MdSmartphone },
          { label: 'Accessories', to: '/inventory/accessories', icon: MdHeadphones },
        ]} onClose={onClose} />

        <SidebarItem label="Second Hand Mobiles" icon={MdPhoneAndroid} childrenItems={[
          { label: 'Manage Mobiles', to: '/secondhand/manage' },
          { label: 'Transaction History', to: '/secondhand/history' },
        ]} onClose={onClose} />

        <SidebarItem label="Update Stock" icon={MdInventory2} childrenItems={[
          { label: 'Mobiles', to: '/stock/mobiles', icon: MdSmartphone },
          { label: 'Accessories', to: '/stock/accessories', icon: MdHeadphones },
        ]} onClose={onClose} />

        <SidebarItem label="Services" icon={MdBuild} childrenItems={[
          { label: 'Service Requests', to: '/services/requests' },
          { label: 'Service History', to: '/services/history' },
        ]} onClose={onClose} />

        <SidebarItem label="Transfers" icon={MdCompareArrows} childrenItems={[
          { label: 'New Transfer', to: '/transfers/new' },
          { label: 'Transfer History', to: '/transfers/history' },
        ]} onClose={onClose} />

        {showReports ? (
          <SidebarItem label="Reports" icon={MdAssessment} childrenItems={[
            { label: 'Sales Report', to: '/reports/sales' },
            { label: 'Service Report', to: '/reports/service' },
          ]} onClose={onClose} />
        ) : null}

        <SidebarItem label="AI Agents" icon={MdPsychology} to="/ai-agents" onClose={onClose} />

        <SidebarItem label="Settings" icon={MdSettings} childrenItems={[
          { label: 'General Settings', to: '/settings' },
          { label: 'Profile', to: '/settings/profile' },
          { label: 'Backup / Restore', to: '/settings/backup-restore' },
        ]} onClose={onClose} />
      </nav>
    </aside>
  )
}

export default Sidebar


