import React from 'react'
import { formatCurrency } from '../../../utils/formatters'

const RecentSalesTable = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="text-left text-slate-600 text-xs uppercase font-semibold">
          <th className="py-3 pr-4">Customer</th>
          <th className="py-3 pr-4">Product</th>
          <th className="py-3 pr-4">Amount</th>
          <th className="py-3">Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
            <td className="py-3 pr-4 font-medium">{row.customer}</td>
            <td className="py-3 pr-4">{row.product}</td>
            <td className="py-3 pr-4 font-semibold text-blue-600">{formatCurrency(row.amount)}</td>
            <td className="py-3 text-slate-500">{row.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default RecentSalesTable