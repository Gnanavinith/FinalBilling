import React, { useState } from 'react'
import { formatCurrency } from '../utils/formatters'

const ProfitTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [data, sortConfig])

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️'
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Profit Details ({data.length} records)</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader sortConfig={sortConfig} onSort={handleSort} />
          <TableBody data={sortedData} />
        </table>
      </div>
    </div>
  )
}

const TableHeader = ({ sortConfig, onSort }) => (
  <thead className="bg-gray-50">
    <tr>
      {[
        { key: 'date', label: 'Date' },
        { key: 'productName', label: 'Product' },
        { key: 'category', label: 'Category' },
        { key: 'quantitySold', label: 'Qty' },
        { key: 'purchasePrice', label: 'Purchase Price' },
        { key: 'sellingPrice', label: 'Selling Price' },
        { key: 'totalSalesAmount', label: 'Sales Amount' },
        { key: 'grossProfit', label: 'Gross Profit' },
        { key: 'netProfit', label: 'Net Profit' },
        { key: 'margin', label: 'Margin' }
      ].map(({ key, label }) => (
        <th
          key={key}
          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          onClick={() => onSort(key)}
        >
          <div className="flex items-center gap-1">
            {label}
            <span className="text-xs">{getSortIcon(key, sortConfig)}</span>
          </div>
        </th>
      ))}
    </tr>
  </thead>
)

const TableBody = ({ data }) => (
  <tbody className="bg-white divide-y divide-gray-200">
    {data.map((item, index) => (
      <tr key={index} className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
          <div className="font-medium">{item.productName}</div>
          <div className="text-gray-500 text-xs">{item.productId}</div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantitySold}</td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.purchasePrice)}</td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.sellingPrice)}</td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.totalSalesAmount)}</td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
          {formatCurrency(item.grossProfit)}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
          {formatCurrency(item.netProfit)}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.margin.toFixed(2)}%</td>
      </tr>
    ))}
  </tbody>
)

export default ProfitTable