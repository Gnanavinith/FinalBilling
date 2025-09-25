import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { formatCurrencyInr } from '../../utils/formatters'

const RevenueChart = ({ data }) => (
  <div className="h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.3} />
        <XAxis dataKey="name" stroke="#475569" fontSize={12} />
        <YAxis stroke="#475569" fontSize={12} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
        <Tooltip 
          formatter={(v) => formatCurrencyInr(v)} 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            border: 'none', 
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }} 
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#3b82f6" 
          strokeWidth={3} 
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }} 
          name="Revenue"
          strokeDasharray="0"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

export default RevenueChart