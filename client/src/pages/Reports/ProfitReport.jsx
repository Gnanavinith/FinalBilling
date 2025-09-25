import React, { useState, useEffect, useMemo } from 'react'
import SummaryCards from '../../components/reports/profitreport/SummaryCards'
import Filters from '../../components/reports/profitreport/Filters'
import Charts from '../../components/reports/profitreport/Charts'
import ProfitTable from '../../components/reports/profitreport/ProfitTable'
import ExportButtons from '../../components/reports/profitreport/ExportButtons'
import { useProfitData } from '../../components/reports/profitreport/hooks/useProfitData'
import { useFilters } from '../../components/reports/profitreport/hooks/useFilters'

const ProfitReport = () => {
  const { profitData } = useProfitData()
  const { filters, setFilters, filteredData } = useFilters(profitData)
  const calculateSummary = useMemo(() => calculateProfitSummary(filteredData), [filteredData])

  return (
    <div className="p-4">
      <Header onExport={{ exportToPDF, exportToExcel, printReport }} />
      <SummaryCards summary={calculateSummary} />
      <Filters filters={filters} onFiltersChange={setFilters} />
      <Charts data={filteredData} />
      <ProfitTable data={filteredData} />
    </div>
  )
}

export default ProfitReport