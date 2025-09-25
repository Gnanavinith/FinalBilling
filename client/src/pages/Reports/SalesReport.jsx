import React, { useState, useEffect, useMemo } from 'react'
import SummaryCards from '../../components/reports/salesreport/SummaryCards'
import Filters from '../../components/reports/salesreport/Filters'
import Charts from '../../components/reports/salesreport/Charts'
import SalesTable from '../../components/reports/salesreport/SalesTable'
import { useSalesData, formatCurrency } from '../../components/reports/salesreport/utils'
import { FiPrinter } from 'react-icons/fi'

const SalesReport = () => {
  const { salesData, filteredData, filters, setFilters, calculateSummary } = useSalesData()

  return (
    <div className="p-4 lg:p-6 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Export Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h1 className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Sales Report
        </h1>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all text-sm lg:text-base flex-1 lg:flex-none justify-center"
          >
            <FiPrinter className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Wrap scrollable content */}
      <div className="overflow-x-auto">
        <div className="min-w-[1000px] lg:min-w-full">
          {/* Summary Cards */}
          <SummaryCards summary={calculateSummary} />

          {/* Filters */}
          <Filters filters={filters} setFilters={setFilters} />

          {/* Charts */}
          <Charts filteredData={filteredData} />

          {/* Sales Table */}
          <SalesTable data={filteredData} />
        </div>
      </div>
    </div>

  )
}

export default SalesReport