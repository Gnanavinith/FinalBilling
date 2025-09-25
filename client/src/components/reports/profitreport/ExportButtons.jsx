import React from 'react'
import { FiDownload, FiPrinter } from 'react-icons/fi'

const ExportButtons = ({ onExport }) => {
  const buttons = [
    {
      label: 'Export PDF',
      icon: FiDownload,
      onClick: onExport.exportToPDF,
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      label: 'Export Excel',
      icon: FiDownload,
      onClick: onExport.exportToExcel,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      label: 'Print',
      icon: FiPrinter,
      onClick: onExport.printReport,
      color: 'bg-blue-600 hover:bg-blue-700'
    }
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          className={`flex items-center gap-2 px-3 py-2 text-white rounded-lg transition-colors ${button.color} text-sm`}
        >
          <button.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{button.label}</span>
        </button>
      ))}
    </div>
  )
}

export default ExportButtons