import React from 'react';
import { FiSave } from 'react-icons/fi';

const SaveButtons = ({ onSave, items, dealerId }) => {
  const isDisabled = items.length === 0 || !dealerId;

  return (
    <div className="flex justify-end">
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button
          onClick={() => onSave('pending')}
          disabled={isDisabled}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-xl hover:from-slate-600 hover:to-slate-700 shadow-md hover:shadow-lg transition-all disabled:bg-slate-400 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          <FiSave className="w-4 h-4" />
          <span>Save as Pending</span>
        </button>
        <button
          onClick={() => onSave('received')}
          disabled={isDisabled}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all disabled:bg-slate-400 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          <FiSave className="w-4 h-4" />
          <span>Save & Receive</span>
        </button>
      </div>
    </div>
  );
};

export default SaveButtons;