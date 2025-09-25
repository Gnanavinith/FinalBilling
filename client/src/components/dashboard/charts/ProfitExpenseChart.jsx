import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { formatCurrency  } from '../../../utils/formatters'

const ProfitExpenseChart = ({ data }) => (
  <div className="h-80 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.3} />
        <XAxis dataKey="name" stroke="#475569" fontSize={12} />
        <YAxis stroke="#475569" fontSize={12} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
        <Tooltip 
          formatter={(v) => formatCurrency(v)} 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            border: 'none', 
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }} 
        />
        <Legend />
        <Bar dataKey="profit" fill="#10b981" name="Profit" radius={[8, 8, 0, 0]} />
        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[8, 8, 0, 0]} />
        <Bar dataKey="gst" fill="#8b5cf6" name="GST" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
)

export default ProfitExpenseChart