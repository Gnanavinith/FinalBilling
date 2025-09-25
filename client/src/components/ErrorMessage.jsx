import React from 'react'

const ErrorMessage = ({ message }) => (
  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-shake">
    {message}
  </div>
)

export default ErrorMessage