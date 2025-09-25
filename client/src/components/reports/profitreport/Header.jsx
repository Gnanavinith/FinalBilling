import React from 'react'
import ExportButtons from './ExportButtons'

const Header = ({ onExport }) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
      <h1 className="text-2xl font-semibold text-gray-900">Profit Report</h1>
      <ExportButtons onExport={onExport} />
    </div>
  )
}

export default Header