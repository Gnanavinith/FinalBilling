import React from 'react';
import { MdCategory } from 'react-icons/md';

const ProductTypeSelector = ({ draftItem, setDraftItem }) => {
  const productTypes = [
    { value: 'medicine', label: '💊 Medicine' },
    { value: 'medical-supplies', label: '🩺 Medical Supplies' },
    { value: 'equipment', label: '⚙️ Equipment' },
    { value: 'consumables', label: '🧴 Consumables' },
    { value: 'other', label: '📦 Other' }
  ];

  const handleTypeChange = (type) => {
    setDraftItem(prev => ({
      ...prev,
      type: type,
      // Reset specific fields when type changes
      category: '',
      subCategory: ''
    }));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
        <MdCategory className="text-green-600" />
        Product Type
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {productTypes.map((productType) => (
          <button
            key={productType.value}
            type="button"
            onClick={() => handleTypeChange(productType.value)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${
              draftItem.type === productType.value
                ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                : 'border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-25'
            }`}
          >
            {productType.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductTypeSelector;