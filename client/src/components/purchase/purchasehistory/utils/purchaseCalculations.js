export const calculateRemainingStock = () => {
  return '—'
}

export const getDealerName = (dealerId, dealers) => {
  if (!dealers || !Array.isArray(dealers)) {
    return 'Unknown'
  }
  const dealer = dealers.find(d => d.id === dealerId)
  return dealer ? dealer.name : 'Unknown'
}