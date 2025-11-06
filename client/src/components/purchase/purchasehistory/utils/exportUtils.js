import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export const exportToPDF = (filteredPurchases, dealers, filters, calculateRemainingStock) => {
  const doc = new jsPDF()
  
  doc.setFontSize(20)
  doc.text('Purchase History Report', 14, 22)
  
  doc.setFontSize(10)
  const dateRange = filters.dateFrom && filters.dateTo 
    ? `${filters.dateFrom} to ${filters.dateTo}`
    : 'All Time'
  doc.text(`Date Range: ${dateRange}`, 14, 30)
  
  if (filters.dealerId) {
    const dealer = dealers.find(d => d.id === filters.dealerId)
    doc.text(`Dealer: ${dealer ? dealer.name : 'Unknown'}`, 14, 35)
  }

  const tableData = []
  filteredPurchases.forEach(purchase => {
    const dealer = dealers.find(d => d.id === purchase.dealerId)
    purchase.items.forEach(item => {
      tableData.push([
        dealer ? dealer.name : 'Unknown',
        item.productName,
        item.model,
        item.category,
        item.quantity,
        calculateRemainingStock(item.productName, item.model),
        `₹${item.purchasePrice.toFixed(2)}`,
        `₹${item.sellingPrice.toFixed(2)}`,
        `₹${item.totalPrice.toFixed(2)}`,
        purchase.paymentMode,
        purchase.purchaseDate,
        purchase.invoiceNumber
      ])
    })
  })

  const headers = [
    'Dealer', 'Product', 'Model', 'Category', 'Qty Purchased', 
    'Remaining Stock', 'Purchase Price', 'Selling Price', 'Total', 
    'Payment Mode', 'Date', 'Invoice'
  ]

  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [71, 85, 105] }
  })

  doc.save('purchase-history.pdf')
}

export const exportToExcel = (filteredPurchases, dealers, calculateRemainingStock) => {
  const headers = [
    'Dealer', 'Product', 'Model', 'Category', 'Qty Purchased', 
    'Remaining Stock', 'Purchase Price', 'Selling Price', 'Total', 
    'Payment Mode', 'Date', 'Invoice', 'GST Applied', 'GST Amount', 'Grand Total'
  ]
  
  const csvContent = [
    headers.join(','),
    ...filteredPurchases.map(purchase => {
      const dealer = dealers.find(d => d.id === purchase.dealerId)
      return purchase.items.map(item => [
        `"${dealer ? dealer.name : 'Unknown'}"`,
        `"${item.productName}"`,
        `"${item.model}"`,
        `"${item.category}"`,
        item.quantity,
        calculateRemainingStock(item.productName, item.model),
        item.purchasePrice.toFixed(2),
        item.sellingPrice.toFixed(2),
        item.totalPrice.toFixed(2),
        `"${purchase.paymentMode}"`,
        purchase.purchaseDate,
        `"${purchase.invoiceNumber}"`,
        purchase.gstEnabled ? 'Yes' : 'No',
        purchase.gstAmount.toFixed(2),
        purchase.grandTotal.toFixed(2)
      ].join(','))
    }).flat()
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'purchase-history.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}

export const downloadItemDetails = (purchase, item, dealers) => {
  const dealer = dealers.find(d => d.id === purchase.dealerId)
  const dealerName = dealer ? dealer.name : 'Unknown'
  
  try {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Purchase Item Report', 14, 18)
    doc.setFontSize(10)
    doc.text(`Dealer: ${dealerName}`, 14, 26)
    doc.text(`Date: ${purchase.purchaseDate}`, 14, 31)
    doc.text(`Invoice: ${purchase.invoiceNumber}`, 14, 36)

    const body = [
      ['Product', item.productName],
      ['Model', item.model],
      ['Category', item.category],
      ['Quantity', String(item.quantity)],
      ['Purchase Price', `₹${item.purchasePrice.toFixed(2)}`],
      ['Selling Price', `₹${item.sellingPrice.toFixed(2)}`],
      ['Line Total', `₹${item.totalPrice.toFixed(2)}`],
      ['Payment Mode', purchase.paymentMode],
    ]
    
    autoTable(doc, {
      startY: 42,
      head: [['Field', 'Value']],
      body,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [71, 85, 105] },
    })

    const safe = (s) => String(s).replace(/[^a-z0-9-_]+/gi, '_')
    const filename = `${safe(dealerName)}_${safe(purchase.purchaseDate)}.pdf`
    
    try {
      doc.save(filename)
    } catch {
      const blob = doc.output('blob')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  } catch (e) {
    alert('Failed to generate PDF: ' + (e?.message || e))
    console.error(e)
  }
}