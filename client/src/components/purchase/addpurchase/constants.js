export const ACCESSORY_CATEGORIES = [
  'Earphones / Headphones',
  'Chargers & Adapters',
  'USB Cables / Data Cables',
  'Power Banks',
  'Memory Cards',
  'Batteries (for older models)',
  'Screen Guards / Tempered Glass',
  'Mobile Cases & Covers',
  'Back Covers (Silicon, Leather, Hard Case, etc.)',
  'Bluetooth Devices (Earbuds, Neckbands, Speakers)',
  'Smartwatches / Fitness Bands',
  'Mobile Holders / Stands',
  'OTG (On-The-Go) Connectors',
  'Car Chargers & Mounts',
  'Selfie Sticks / Tripods',
  'Stylus Pens',
  'Mobile Cleaning Kits',
  'Wireless Chargers',
  'Camera Lens Attachments',
  'Other',
];

export const brandOptions = [
  'Samsung', 'Apple', 'Xiaomi', 'OnePlus', 'Vivo', 'Oppo', 'Realme', 'Motorola', 
  'Nokia', 'Huawei', 'Honor', 'Nothing', 'Google', 'Sony', 'LG', 'Other'
];

export const colorOptions = [
  'Black', 'White', 'Blue', 'Red', 'Green', 'Purple', 'Pink', 'Gold', 'Silver', 
  'Gray', 'Space Gray', 'Midnight', 'Starlight', 'Product Red', 'Other'
];

export const ramOptions = [
  '2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB', '18GB', '24GB', 'Other'
];

export const storageOptions = [
  '16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB', '2TB', 'Other'
];

export const simSlotOptions = [
  'Single SIM', 'Dual SIM', 'eSIM', 'Hybrid SIM', 'Other'
];

export const processorOptions = [
  'Snapdragon 8 Gen 2', 'Snapdragon 8 Gen 1', 'Snapdragon 888', 'Snapdragon 870', 
  'Snapdragon 778G', 'Snapdragon 695', 'A17 Pro', 'A16 Bionic', 'A15 Bionic', 
  'A14 Bionic', 'A13 Bionic', 'MediaTek Dimensity 9000', 'MediaTek Dimensity 8000', 
  'MediaTek Dimensity 7000', 'Exynos 2200', 'Exynos 2100', 'Kirin 9000', 'Other'
];

export const displaySizeOptions = [
  '5.0 inches', '5.5 inches', '6.0 inches', '6.1 inches', '6.2 inches', '6.3 inches', 
  '6.4 inches', '6.5 inches', '6.6 inches', '6.7 inches', '6.8 inches', '6.9 inches', 
  '7.0 inches', 'Other'
];

export const cameraOptions = [
  '12MP', '48MP', '50MP', '64MP', '108MP', '12MP + 12MP', '48MP + 12MP', 
  '50MP + 12MP', '64MP + 12MP', '108MP + 12MP', '12MP + 12MP + 12MP', 
  '48MP + 12MP + 12MP', '50MP + 12MP + 12MP', '64MP + 12MP + 12MP', 
  '108MP + 12MP + 12MP', 'Other'
];

export const batteryOptions = [
  '2000mAh', '3000mAh', '4000mAh', '4500mAh', '5000mAh', '5500mAh', '6000mAh', 
  '7000mAh', '8000mAh', 'Other'
];

export const osOptions = [
  'Android 14', 'Android 13', 'Android 12', 'Android 11', 'Android 10', 
  'iOS 17', 'iOS 16', 'iOS 15', 'iOS 14', 'iOS 13', 'Other'
];

export const networkOptions = [
  '5G', '4G LTE', '3G', '2G', '5G + 4G LTE', '4G LTE + 3G', 'Other'
];

export const productNameOptions = [
  'Ear Buds', 'Charger', 'Cable', 'Case', 'Screen Protector', 'Power Bank', 
  'Headphones', 'Speaker', 'Memory Card', 'Adapter', 'Other'
];

export const generateInvoiceNumber = () => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const ms = String(now.getTime()).slice(-5);
  return `INV-${yy}${mm}${dd}-${ms}`;
};

export { apiBase } from '../../../utils/environment';