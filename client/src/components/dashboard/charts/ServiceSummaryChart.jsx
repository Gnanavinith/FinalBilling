import React from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const ServiceSummaryChart = ({ data }) => (
  <div className="h-64 sm:h-72 lg:h-80 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 15, left: 10, bottom: 10 }}>
        <defs>
          <linearGradient id="colorServices" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
          </linearGradient>
        </defs>
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
          tick={{ fontSize: 10 }}
        />
        <Tooltip 
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
        <Area 
          type="monotone" 
          dataKey="services" 
          stroke="#06b6d4" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorServices)" 
          name="Services" 
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
)

export default ServiceSummaryChart