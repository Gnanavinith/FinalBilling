import React, { useState, useEffect, useMemo } from 'react'
import SummaryCards from '../../components/reports/salesreport/SummaryCards'
import Filters from '../../components/reports/salesreport/Filters'
import Charts from '../../components/reports/salesreport/Charts'
import SalesTable from '../../components/reports/salesreport/SalesTable'
import { useSalesData, formatCurrency } from '../../components/reports/salesreport/utils'
import { FiPrinter, FiDownload, FiFileText, FiChevronUp } from 'react-icons/fi'

const SalesReport = () => {
  const { salesData, filteredData, filters, setFilters, calculateSummary } = useSalesData()
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      {/* Mobile-first responsive container with proper height management */}
      <div className="px-2 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6 max-w-full overflow-hidden">
        {/* Header with Export Buttons - Fully Responsive */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 lg:mb-6 sticky top-0 bg-gradient-to-br from-slate-50 to-blue-50 z-10 pb-2 sm:pb-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
              Sales Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {filteredData.length} records found
            </p>
          </div>
          
          {/* Action buttons - Responsive layout */}
          <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-600 text-white rounded-md sm:rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-md transition-all text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <FiPrinter className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Print</span>
            </button>
            
            <button
              onClick={() => {/* PDF export logic */}}
              className="flex items-center justify-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-green-600 text-white rounded-md sm:rounded-lg hover:bg-green-700 shadow-sm hover:shadow-md transition-all text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <FiDownload className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">PDF</span>
            </button>
            
            <button
              onClick={() => {/* Excel export logic */}}
              className="flex items-center justify-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-emerald-600 text-white rounded-md sm:rounded-lg hover:bg-emerald-700 shadow-sm hover:shadow-md transition-all text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <FiFileText className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Excel</span>
            </button>
          </div>
        </div>

        {/* Content - Mobile-first responsive design with proper overflow handling */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6 pb-4">
          {/* Summary Cards - Responsive grid */}
          <div className="w-full">
            <SummaryCards summary={calculateSummary} />
          </div>

          {/* Filters - Responsive form */}
          <div className="w-full">
            <Filters filters={filters} setFilters={setFilters} />
          </div>

          {/* Charts - Responsive layout */}
          <div className="w-full">
            <Charts filteredData={filteredData} />
          </div>

          {/* Sales Table - Responsive table with proper height management */}
          <div className="w-full">
            <SalesTable data={filteredData} />
          </div>
        </div>
      </div>

      {/* Scroll to top button - Mobile responsive */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-blue-600 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-110"
          aria-label="Scroll to top"
        >
          <FiChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}
    </div>
  )
}

export default SalesReport