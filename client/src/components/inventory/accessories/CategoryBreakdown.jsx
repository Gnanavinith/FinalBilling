import React from 'react'

const CategoryBreakdown = ({ categories, accessoryInventory, lowStockThreshold }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Accessories': return '🎧'
      case 'Service Item': return '🔧'
      case 'Other': return '📦'
      default: return '📦'
    }
  }

  return (
    <div className="mt-6 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(category => {
          const categoryItems = accessoryInventory.filter(item => item.category === category)
          const categoryLowStock = categoryItems.filter(item => item.remainingStock <= lowStockThreshold).length
          const categoryOutOfStock = categoryItems.filter(item => item.remainingStock <= 0).length

          return (
            <div key={category} className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{getCategoryIcon(category)}</span>
                <h4 className="font-semibold">{category}</h4>
              </div>
              <div className="space-y-1 text-sm">
                <p>Total Products: {categoryItems.length}</p>
                <p className="text-yellow-600">Low Stock: {categoryLowStock}</p>
                <p className="text-red-600">Out of Stock: {categoryOutOfStock}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryBreakdown