import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { formatCurrency  } from '../../../utils/formatters'

const ProfitExpenseChart = ({ data }) => (
  <div className="h-64 sm:h-72 lg:h-80 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 15, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.3} />
        <XAxis 
          dataKey="name" 
          stroke="#475569" 
          fontSize={10} 
          className="text-xs"
          tick={{ fontSize: 10 }}
        />
        <YAxis 
          stroke="#475569" 
          fontSize={10} 
          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          tick={{ fontSize: 10 }}
        />
        <Tooltip 
          formatter={(v) => formatCurrency(v)} 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            border: 'none', 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontSize: '12px'
          }} 
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px' }}
        />
        <Bar dataKey="profit" fill="#10b981" name="Profit" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
        <Bar dataKey="gst" fill="#8b5cf6" name="GST" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
)

export default ProfitExpenseChart