import React, { useState, useEffect } from 'react';

const DropdownWithInput = ({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  className = "",
  label = "",
  required = false 
}) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  useEffect(() => {
    if (value && !options.includes(value)) {
      setIsCustom(true);
      setCustomValue(value);
    } else if (value && options.includes(value)) {
      setIsCustom(false);
      setCustomValue("");
    }
  }, [value, options]);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'Other') {
      setIsCustom(true);
      setCustomValue(value || "");
    } else {
      setIsCustom(false);
      setCustomValue("");
      onChange(selectedValue);
    }
  };

  const handleCustomInputChange = (e) => {
    const inputValue = e.target.value;
    setCustomValue(inputValue);
    onChange(inputValue);
  };

  const handleBlur = () => {
    if (customValue.trim() === '') {
      setIsCustom(false);
      onChange('');
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label} {required && '*'}
        </label>
      )}
      {!isCustom ? (
        <select
          value={value || ''}
          onChange={handleSelectChange}
          className={`w-full rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all px-4 py-2.5 ${className}`}
        >
          <option value="">Select {label || 'option'}</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={customValue}
          onChange={handleCustomInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all px-4 py-2.5 ${className}`}
        />
      )}
    </div>
  );
};

export default DropdownWithInput;