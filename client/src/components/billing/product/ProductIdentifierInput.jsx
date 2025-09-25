import React from 'react';
// import { MdQrCode, MdBarcode } from 'react-icons/md';

// ✅ QR Code (Material Icons)
import { MdQrCode, MdSearch } from "react-icons/md";

// ✅ Barcode (FontAwesome or Ant Design)
import { FaBarcode } from "react-icons/fa"; 

const ProductIdentifierInput = ({ draftItem, setDraftItem, productLookup }) => {
  const handleIdentifierChange = (e) => {
    const { name, value } = e.target;
    setDraftItem(prev => ({ ...prev, [name]: value }));
  };

  const handleBarcodeLookup = () => {
    if (draftItem.barcode && productLookup) {
      const product = productLookup.find(item => 
        item.barcode === draftItem.barcode || item.sku === draftItem.barcode
      );
      if (product) {
        setDraftItem(prev => ({
          ...prev,
          name: product.name,
          price: product.price || '',
          hsnCode: product.hsnCode || '',
          gstRate: product.gstRate || ''
        }));
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SKU Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <MdQrCode className="text-green-600" />
            SKU Code
          </label>
          <input
            type="text"
            name="sku"
            value={draftItem.sku || ''}
            onChange={handleIdentifierChange}
            placeholder="Enter SKU code..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          />
        </div>

        {/* Barcode Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <FaBarcode className="text-green-600" />
            Barcode
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="barcode"
              value={draftItem.barcode || ''}
              onChange={handleIdentifierChange}
              placeholder="Enter barcode..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            />
            <button
              type="button"
              onClick={handleBarcodeLookup}
              className="px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
            >
              <MdSearch />
              Lookup
            </button>
          </div>
        </div>
      </div>

      {/* HSN Code Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          HSN Code
        </label>
        <input
          type="text"
          name="hsnCode"
          value={draftItem.hsnCode || ''}
          onChange={handleIdentifierChange}
          placeholder="Enter HSN code..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
        />
      </div>
    </div>
  );
};

export default ProductIdentifierInput;