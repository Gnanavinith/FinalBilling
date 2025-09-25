export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

export const calculateProfitSummary = (data) => {
  const totals = data.reduce((acc, item) => ({
    sales: acc.sales + item.totalSalesAmount,
    purchase: acc.purchase + item.totalPurchaseCost,
    grossProfit: acc.grossProfit + item.grossProfit,
    expenses: acc.expenses + item.expenses,
    netProfit: acc.netProfit + item.netProfit,
    quantity: acc.quantity + item.quantitySold
  }), { sales: 0, purchase: 0, grossProfit: 0, expenses: 0, netProfit: 0, quantity: 0 })

  return {
    totalSalesAmount: totals.sales,
    totalPurchaseCost: totals.purchase,
    totalGrossProfit: totals.grossProfit,
    totalExpenses: totals.expenses,
    totalNetProfit: totals.netProfit,
    totalQuantity: totals.quantity,
    averageMargin: totals.sales > 0 ? (totals.grossProfit / totals.sales) * 100 : 0
  }
}