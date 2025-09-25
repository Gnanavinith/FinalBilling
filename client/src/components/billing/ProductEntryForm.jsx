import React from 'react'
import { MdInventory2, MdSearch, MdAdd, MdClear } from 'react-icons/md'
import ProductTypeSelector from './product/ProductTypeSelector'
import ProductNameInput from './product/ProductNameInput'
import ProductIdentifierInput from './product/ProductIdentifierInput'
import ProductDetailsInputs from './product/ProductDetailsInputs'

const ProductEntryForm = ({
  draftItem,
  setDraftItem,
  productLookup,
  addDraftItem,
  clearDraftItem
}) => {
  return (
    <div className="animate-slide-in-left rounded-2xl bg-gradient-to-br from-white to-green-50 border border-green-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent flex items-center gap-2">
        <MdInventory2 /> Add Product
      </h2>
      <div className="space-y-4">
        <ProductTypeSelector draftItem={draftItem} setDraftItem={setDraftItem} />
        
        <ProductNameInput 
          draftItem={draftItem} 
          setDraftItem={setDraftItem}
          productLookup={productLookup}
        />
        
        <ProductIdentifierInput
          draftItem={draftItem}
          setDraftItem={setDraftItem}
          productLookup={productLookup}
        />
        
        <ProductDetailsInputs draftItem={draftItem} setDraftItem={setDraftItem} />
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={addDraftItem} 
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-semibold flex items-center gap-2"
          >
            <MdAdd /> Add to Bill
          </button>
          <button 
            onClick={clearDraftItem} 
            type="button" 
            className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold flex items-center gap-2"
          >
            <MdClear /> Clear
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductEntryForm