import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

export const exportToPDF = (filteredData, calculateSummary) => {
  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(20)
  doc.text('Service Report', 20, 20)
  doc.setFontSize(12)
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30)
  doc.text(`Total Records: ${filteredData.length}`, 20, 35)
  
  // Summary
  doc.setFontSize(14)
  doc.text('Summary', 20, 50)
  doc.setFontSize(10)
  doc.text(`Total Services: ${calculateSummary.totalServices}`, 20, 60)
  doc.text(`Completed: ${calculateSummary.completedServices}`, 20, 65)
  doc.text(`Pending: ${calculateSummary.pendingServices}`, 20, 70)
  doc.text(`Total Revenue: ${formatCurrency(calculateSummary.totalRevenue)}`, 20, 75)
  doc.text(`Total Advance Paid: ${formatCurrency(calculateSummary.totalAdvancePaid)}`, 20, 80)
  doc.text(`Pending Balance: ${formatCurrency(calculateSummary.totalPendingBalance)}`, 20, 85)

  // Table
  const tableData = filteredData.map(item => [
    item.serviceId,
    item.dateOfRequest,
    item.customerName,
    item.deviceName,
    item.problemDescription.substring(0, 30) + '...',
    item.partsUsed.length,
    formatCurrency(item.serviceCharges),
    formatCurrency(item.totalAmount),
    formatCurrency(item.advancePaid),
    formatCurrency(item.pendingBalance),
    item.serviceStatus,
    item.technicianName
  ])

  doc.autoTable({
    head: [['Service ID', 'Date', 'Customer', 'Device', 'Problem', 'Parts', 'Service Charges', 'Total', 'Advance', 'Pending', 'Status', 'Technician']],
    body: tableData,
    startY: 95,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] }
  })

  doc.save('service-report.pdf')
}

export const exportToExcel = (filteredData) => {
  const headers = ['Service ID', 'Date of Request', 'Customer Name', 'Customer Phone', 'Device Name', 'Device Model', 'IMEI', 'Problem Description', 'Parts Used', 'Service Charges', 'Total Amount', 'Advance Paid', 'Pending Balance', 'Service Status', 'Technician Name', 'Service Start Date', 'Estimated Delivery Date', 'Actual Delivery Date', 'Notes']
  const csvContent = [
    headers.join(','),
    ...filteredData.map(item => [
      item.serviceId,
      item.dateOfRequest,
      item.customerName,
      item.customerPhone,
      item.deviceName,
      item.deviceModel,
      item.imei,
      `"${item.problemDescription}"`,
      `"${item.partsUsed.map(part => `${part.partName} (${part.quantity}x${part.cost})`).join(', ')}"`,
      item.serviceCharges,
      item.totalAmount,
      item.advancePaid,
      item.pendingBalance,
      item.serviceStatus,
      item.technicianName,
      item.serviceStartDate,
      item.estimatedDeliveryDate,
      item.actualDeliveryDate,
      `"${item.notes}"`
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'service-report.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}