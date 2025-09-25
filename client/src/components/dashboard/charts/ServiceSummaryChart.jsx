import React from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const ServiceSummaryChart = ({ data }) => (
  <div className="h-80 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <defs>
          <linearGradient id="colorServices" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.3} />
        <XAxis dataKey="name" stroke="#475569" fontSize={12} />
        <YAxis stroke="#475569" fontSize={12} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            border: 'none', 
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }} 
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="services" 
          stroke="#06b6d4" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorServices)" 
          name="Services" 
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
)

export default ServiceSummaryChart