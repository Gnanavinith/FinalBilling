import React, { useState, useEffect } from 'react';
import DropdownWithInput from './DropdownWithInput';
import { 
  ACCESSORY_CATEGORIES, 
  brandOptions, 
  colorOptions, 
  ramOptions, 
  storageOptions,
  simSlotOptions,
  processorOptions,
  displaySizeOptions,
  cameraOptions,
  batteryOptions,
  osOptions,
  networkOptions
} from './constants';

const ProductEntryForm = ({ 
  newItem, 
  onNewItemChange, 
  onAddItem, 
  searchResults, 
  showSearchResults, 
  searchQuery,
  onSearchChange,
  onAccessorySelect,
  onSearchBlur 
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (value) => {
    setLocalSearchQuery(value);
    onSearchChange(value);
  };

  const genAccessoryId = (name) => {
    const prefix = 'ACC';
    const short = (name || 'XXX').toString().trim().substring(0,3).toUpperCase() || 'XXX';
    const unique = Date.now().toString().slice(-4);
    return `${prefix}-${short}-${unique}`;
  };

  const renderMobileFields = () => (
    <>
      <div className="md:col-span-2 lg:col-span-1">
        <label className="block text-sm font-medium text-slate-700 mb-1">Brand *</label>
        <input
          type="text"
          required
          value={newItem.brand}
          onChange={(e) => onNewItemChange('brand', e.target.value)}
          list="brandOptions"
          className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
          placeholder="e.g., Vivo"
        />
        <datalist id="brandOptions">
          {brandOptions.map((option, index) => (
            <option key={index} value={option} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Model/Variant</label>
        <input
          type="text"
          value={newItem.model}
          onChange={(e) => onNewItemChange('model', e.target.value)}
          className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
          placeholder="e.g., Y21 (optional)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
        <input
          type="text"
          value={newItem.color}
          onChange={(e) => onNewItemChange('color', e.target.value)}
          list="colorOptions"
          className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
          placeholder="e.g., Black"
        />
        <datalist id="colorOptions">
          {colorOptions.map((option, index) => (
            <option key={index} value={option} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">RAM</label>
        <input
          type="text"
          value={newItem.ram}
          onChange={(e) => onNewItemChange('ram', e.target.value)}
          list="ramOptions"
          className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
          placeholder="e.g., 8GB"
        />
        <datalist id="ramOptions">
          {ramOptions.map((option, index) => (
            <option key={index} value={option} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Storage</label>
        <input
          type="text"
          value={newItem.storage}
          onChange={(e) => onNewItemChange('storage', e.target.value)}
          list="storageOptions"
          className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
          placeholder="e.g., 128GB"
        />
        <datalist id="storageOptions">
          {storageOptions.map((option, index) => (
            <option key={index} value={option} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">IMEI 1</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={newItem.imeiNumber1}
          onChange={(e) => onNewItemChange('imeiNumber1', e.target.value.replace(/\D/g, ''))}
          className="w-full rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all px-4 py-2.5"
          placeholder="Scan/enter IMEI 1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">IMEI 2 (optional)</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={newItem.imeiNumber2}
          onChange={(e) => onNewItemChange('imeiNumber2', e.target.value.replace(/\D/g, ''))}
          className="w-full rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all px-4 py-2.5"
          placeholder="Scan/enter IMEI 2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">SIM Slot</label>
        <input
          type="text"
          value={newItem.simSlot}
          onChange={(e) => onNewItemChange('simSlot', e.target.value)}
          list="simSlotOptions"
          className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
          placeholder="e.g., Dual SIM"
        />
        <datalist id="simSlotOptions">
          {simSlotOptions.map((option, index) => (
            <option key={index} value={option} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Processor</label>
        <input
          type="text"
          value={newItem.processor}
          onChange={(e) => onNewItemChange('processor', e.target.value)}
          list="processorOptions"
          className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
          placeholder="e.g., Snapdragon 888"
        />
        <datalist id="processorOptions">
          {processorOptions.map((option, index) => (
            <option key={index} value={option} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Display Size</label>
        <input
          type="text"
          value={newItem.displaySize}
          onChange={(e) => onNewItemChange('displaySize', e.target.value)}
          list="displaySizeOptions"
          className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
          placeholder="e.g., 6.7 inches"
        />
        <datalist id="displaySizeOptions">
          {displaySizeOptions.map((option, index) => (
            <option key={index} value={option} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Camera</label>
        <input
          type="text"
          value={newItem.camera}
          onChange={(e) => onNewItemChange('camera', e.target.value)}
          list="cameraOptions"
          className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
          placeholder="e.g., 108MP + 12MP"
        />
        <datalist id="cameraOptions">
          {cameraOptions.map((option, index) => (
            <option key={index} value={option} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Battery</label>
        <input
          type="text"
          value={newItem.battery}
          onChange={(e) => onNewItemChange('battery', e.target.value)}
          list="batteryOptions"
          className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
          placeholder="e.g., 5000mAh"
        />
        <datalist id="batteryOptions">
          {batteryOptions.map((option, index) => (
            <option key={index} value={option} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Operating System</label>
        <input
          type="text"
          value={newItem.operatingSystem}
          onChange={(e) => onNewItemChange('operatingSystem', e.target.value)}
          list="osOptions"
          className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
          placeholder="e.g., Android 12"
        />
        <datalist id="osOptions">
          {osOptions.map((option, index) => (
            <option key={index} value={option} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Network Type</label>
        <input
          type="text"
          value={newItem.networkType}
          onChange={(e) => onNewItemChange('networkType', e.target.value)}
          list="networkOptions"
          className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
          placeholder="e.g., 5G, 4G LTE"
        />
        <datalist id="networkOptions">
          {networkOptions.map((option, index) => (
            <option key={index} value={option} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
        <input
          type="number"
          value={1}
          disabled
          className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 bg-slate-50 text-slate-500"
        />
      </div>
    </>
  );

  const renderAccessoryFields = () => (
    <>
      <div className="relative">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Product Name (Search existing or enter new) *
        </label>
        <div className="relative search-dropdown">
          <input
            type="text"
            value={localSearchQuery || newItem.productName}
            onChange={(e) => {
              const val = e.target.value;
              handleSearchChange(val);
              onNewItemChange('productName', val);
              onNewItemChange('productId', val ? genAccessoryId(val) : '');
            }}
            onFocus={() => {
              if (searchResults.length > 0) {
                onSearchBlur(true);
              }
            }}
            className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
            placeholder="Search for existing accessories (e.g., headphone) or enter new product name"
          />
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto search-dropdown">
              {searchResults.map((accessory, index) => (
                <div
                  key={index}
                  onClick={() => onAccessorySelect(accessory)}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                >
                  <div className="font-medium text-slate-900">{accessory.productName}</div>
                  <div className="text-sm text-slate-600">ID: {accessory.productId}</div>
                  <div className="text-sm text-slate-500">Price: ₹{accessory.unitPrice}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
        <input
          type="text"
          value={newItem.brand}
          onChange={(e) => onNewItemChange('brand', e.target.value)}
          className="w-full rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all px-4 py-2.5"
          placeholder="e.g., Boat, JBL, Portronics"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Accessory Category</label>
        <select
          value={newItem.accessoryCategory}
          onChange={(e) => onNewItemChange('accessoryCategory', e.target.value)}
          className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
        >
          <option value="">Select Category</option>
          {ACCESSORY_CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {newItem.accessoryCategory === 'Other' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Custom Category</label>
          <input
            type="text"
            value={newItem.accessoryCategoryCustom}
            onChange={(e) => onNewItemChange('accessoryCategoryCustom', e.target.value)}
            className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
            placeholder="Enter category"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Model/Variant (Product ID) *</label>
        <input
          type="text"
          value={newItem.productId}
          onChange={(e) => {
            onNewItemChange('productId', e.target.value);
            onNewItemChange('model', e.target.value);
          }}
          className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
          placeholder="e.g., ACC-EAR-5632"
        />
        <p className="text-xs text-slate-500 mt-1">
          This will be used as both Product ID and Model/Variant for accessories
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Quantity *</label>
        <input
          type="number"
          inputMode="numeric"
          pattern="\\d*"
          value={newItem.quantity || ''}
          onChange={(e) => {
            const digits = String(e.target.value || '').replace(/\D/g, '');
            const cleaned = digits.replace(/^0+/, '');
            const next = cleaned ? parseInt(cleaned, 10) : 0;
            onNewItemChange('quantity', next);
          }}
          className="w-full rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all px-4 py-2.5"
          min="1"
          placeholder="e.g., 1"
        />
      </div>
    </>
  );

  const renderCommonFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Price *</label>
        <input
          type="number"
          inputMode="decimal"
          value={newItem.purchasePrice || ''}
          onChange={(e) => {
            const cleaned = String(e.target.value || '').replace(/^0+(?=\d)/, '');
            onNewItemChange('purchasePrice', parseFloat(cleaned) || 0);
          }}
          className="w-full rounded-xl border-2 border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
          min="0.01"
          step="0.01"
          placeholder="e.g., 1500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price</label>
        <input
          type="number"
          inputMode="decimal"
          value={newItem.sellingPrice || ''}
          onChange={(e) => {
            const cleaned = String(e.target.value || '').replace(/^0+(?=\d)/, '');
            onNewItemChange('sellingPrice', parseFloat(cleaned) || 0);
          }}
          className="w-full rounded-xl border-2 border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
          min="0.01"
          step="0.01"
          placeholder="e.g., 1999.99"
        />
      </div>
    </>
  );

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
        Product Entry
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
          <select
            value={newItem.category}
            onChange={(e) => onNewItemChange('category', e.target.value)}
            className="w-full rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all px-4 py-2.5"
          >
            <option value="Mobile">Mobile</option>
            <option value="Accessories">Accessories</option>
            <option value="Service Item">Service Item</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {newItem.category === 'Mobile' ? renderMobileFields() : renderAccessoryFields()}
        {renderCommonFields()}

        <div className="md:col-span-2 lg:col-span-3 flex justify-end">
          <button
            type="button"
            onClick={onAddItem}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
          >
            <span>Add Product</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEntryForm;