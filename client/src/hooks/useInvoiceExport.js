import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export const useInvoiceExport = (invoiceRef, serviceBillNumber) => {
  const printInvoice = () => window.print()

  const exportPdf = async () => {
    const element = invoiceRef.current
    if (!element) return
    
    const canvas = await html2canvas(element, { scale: 2, useCORS: true })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgProps = pdf.getImageProperties(imgData)
    const imgWidth = pageWidth
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    
    if (imgHeight > pageHeight) {
      let heightLeft = imgHeight - pageHeight
      while (heightLeft > 0) {
        pdf.addPage()
        position = heightLeft * -1
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
    }
    
    pdf.save(`${serviceBillNumber}.pdf`)
  }

  return { printInvoice, exportPdf }
}