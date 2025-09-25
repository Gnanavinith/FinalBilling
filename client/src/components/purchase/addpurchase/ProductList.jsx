import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

const ProductList = ({ items, onRemoveItem }) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-md font-semibold mb-2">Added Products</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 text-xs uppercase border-b bg-gradient-to-r from-indigo-50 to-blue-50">
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">Model</th>
              <th className="py-2 px-4">Qty</th>
              <th className="py-2 px-4">Purchase Price</th>
              <th className="py-2 px-4">Selling Price</th>
              <th className="py-2 px-4">Total</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4">{item.category}</td>
                <td className="py-3 px-4">{item.productName}</td>
                <td className="py-3 px-4">{item.model}</td>
                <td className="py-3 px-4">{item.quantity}</td>
                <td className="py-3 px-4">₹{item.purchasePrice.toFixed(2)}</td>
                <td className="py-3 px-4">₹{item.sellingPrice.toFixed(2)}</td>
                <td className="py-3 px-4">₹{item.totalPrice.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Remove item"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;