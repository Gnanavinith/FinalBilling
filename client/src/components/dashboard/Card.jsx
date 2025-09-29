import React from 'react'

const Card = ({ title, children, right, gradient = false }) => (
  <div className={`rounded-xl sm:rounded-2xl ${gradient ? 'bg-gradient-to-br from-white to-slate-50' : 'bg-white'} border border-slate-200 p-4 sm:p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform relative z-10`}>
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <h2 className="text-base sm:text-lg font-bold text-slate-800 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent truncate">
        {title}
      </h2>
      {right}
    </div>
    <div className="animate-fade-in-up">
      {children}
    </div>
  </div>
)

export default Card