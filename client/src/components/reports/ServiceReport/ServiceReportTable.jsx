import React, { useState } from 'react'

const ServiceReportTable = ({ filteredData }) => {
  const [expandedRow, setExpandedRow] = useState(null)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return 'text-green-600 bg-green-100'
      case 'In Progress':
        return 'text-blue-600 bg-blue-100'
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const toggleRowExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index)
  }

  if (filteredData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold">Service Details (0 records)</h3>
        </div>
        <div className="p-8 text-center text-slate-500">
          No service records found matching your filters
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold">Service Details ({filteredData.length} records)</h3>
      </div>
      
      {/* Mobile View */}
      <div className="block lg:hidden">
        {filteredData.map((item, index) => (
          <div key={index} className="border-b border-slate-200 last:border-b-0">
            <div 
              className="p-4 hover:bg-slate-50 cursor-pointer"
              onClick={() => toggleRowExpand(index)}
            >
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium text-slate-600">Service ID:</span>
                  <div className="font-semibold">{item.serviceId}</div>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Date:</span>
                  <div>{item.dateOfRequest}</div>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-slate-600">Customer:</span>
                  <div>{item.customerName} ({item.customerPhone})</div>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-slate-600">Device:</span>
                  <div>{item.deviceName} {item.deviceModel}</div>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Total:</span>
                  <div className="font-semibold">{formatCurrency(item.totalAmount)}</div>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.serviceStatus)}`}>
                    {item.serviceStatus}
                  </span>
                </div>
              </div>
            </div>
            
            {expandedRow === index && (
              <div className="px-4 pb-4 bg-slate-50">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-slate-600">Problem:</span>
                    <div>{item.problemDescription}</div>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Parts Used:</span>
                    <div>
                      {item.partsUsed.length > 0 ? (
                        item.partsUsed.map((part, idx) => (
                          <div key={idx} className="text-xs">
                            • {part.partName} ({part.quantity}x) - {formatCurrency(part.cost * part.quantity)}
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400">No parts</span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium text-slate-600">Service Charges:</span>
                      <div>{formatCurrency(item.serviceCharges)}</div>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">Advance:</span>
                      <div>{formatCurrency(item.advancePaid)}</div>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">Pending:</span>
                      <div>{formatCurrency(item.pendingBalance)}</div>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">Technician:</span>
                      <div>{item.technicianName || 'Not assigned'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Service ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Device</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Problem</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Parts</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Charges</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Advance</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pending</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Technician</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{item.serviceId}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{item.dateOfRequest}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                  <div>{item.customerName}</div>
                  <div className="text-slate-500 text-xs">{item.customerPhone}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                  <div>{item.deviceName}</div>
                  <div className="text-slate-500 text-xs">{item.deviceModel}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-900 max-w-xs">
                  <div className="truncate" title={item.problemDescription}>
                    {item.problemDescription}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                  {item.partsUsed.length > 0 ? (
                    <div className="text-xs">
                      {item.partsUsed.map((part, idx) => (
                        <div key={idx}>
                          {part.partName} ({part.quantity}x)
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400">No parts</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{formatCurrency(item.serviceCharges)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{formatCurrency(item.totalAmount)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{formatCurrency(item.advancePaid)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{formatCurrency(item.pendingBalance)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.serviceStatus)}`}>
                    {item.serviceStatus}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{item.technicianName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ServiceReportTable