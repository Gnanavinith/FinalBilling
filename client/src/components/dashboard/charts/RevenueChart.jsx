import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { formatCurrency  } from '../../../utils/formatters'

const RevenueChart = ({ data }) => (
  <div className="h-64 sm:h-72 lg:h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 15, left: 10, bottom: 10 }}>
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
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#3b82f6" 
          strokeWidth={2} 
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} 
          name="Revenue"
          strokeDasharray="0"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

export default RevenueChart