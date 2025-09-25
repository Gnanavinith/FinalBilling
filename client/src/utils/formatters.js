// Currency formatter (Indian Rupees by default)
export const formatCurrency = (value, currency = "INR") => {
  if (value === null || value === undefined || isNaN(value)) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Date formatter (DD/MM/YYYY)
export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// DateTime formatter (DD/MM/YYYY, HH:mm)
export const formatDateTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Percentage formatter (e.g., 12.5%)
export const formatPercentage = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "0%";
  return `${parseFloat(value).toFixed(2)}%`;
};

// Phone formatter (adds +91 if 10 digits)
export const formatPhone = (phone) => {
  if (!phone) return "";
  const cleaned = phone.toString().replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};
