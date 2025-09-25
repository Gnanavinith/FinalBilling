export const calculateRemainingStock = () => {
  return '—'
}

export const getDealerName = (dealerId, dealers) => {
  const dealer = dealers.find(d => d.id === dealerId)
  return dealer ? dealer.name : 'Unknown'
}