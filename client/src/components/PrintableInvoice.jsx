import React from 'react';
import { MdReceiptLong, MdCalendarToday, MdAttachMoney, MdDiscount, MdCardGiftcard, MdShowChart, MdCheckCircle } from 'react-icons/md';

const PrintableInvoice = React.forwardRef((props, ref) => {
  const {
    billNumber,
    customerName,
    mobileNumber,
    paymentMethod,
    items = [],
    draftItemActive = false,
    draftItem = {},
    calc = {},
    now = new Date()
  } = props;

  // Calculate items to display (including draft item if active)
  const displayItems = draftItemActive ? [...items, draftItem] : items;

  return (
    <div ref={ref} className="hidden print:block p-6">
      {/* Shop Header */}
      <div className="text-center">
        <div className="text-2xl font-bold">Spot</div>
        <div className="text-xs text-slate-700 mt-0.5">No.334, 7th Street, Gandhipuram, Coimbatore – 641012</div>
        <div className="text-xs text-slate-700 mt-0.5">📞 94876 55058 | 99524 31995 | 90426 40440</div>
        <div className="text-xs text-slate-700 mt-0.5">GSTIN: 123456789</div>
      </div>

      {/* Invoice Title */}
      <div className="mt-3 text-center text-lg font-semibold">Invoice</div>

      {/* Bill Info */}
      <div className="mt-2 text-sm flex justify-between">
        <div>Bill No: {billNumber}</div>
        <div>Date: {now.toLocaleString()}</div>
      </div>

      {/* Customer Details */}
      <div className="mt-3 text-sm">
        <div className="font-semibold mb-1">Customer Details</div>
        <div>Name: {customerName || '____________________'}</div>
        <div>Phone: {mobileNumber || '_________________'}</div>
        <div>Address: {'_________________'}</div>
      </div>

      {/* Items Table */}
      <table className="mt-4 w-full text-sm border-t border-b border-slate-300">
        <thead>
          <tr className="text-left">
            <th className="py-1 pr-2">Item</th>
            <th className="py-1 pr-2">Model</th>
            <th className="py-1 pr-2">IMEI / Serial No.</th>
            <th className="py-1 pr-2">Specs</th>
            <th className="py-1 pr-2">Qty</th>
            <th className="py-1 pr-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.map((it, idx) => {
            const qty = Number(it.quantity) || 0;
            const price = Number(it.price) || 0;
            const gross = qty * price;
            let discount = 0;
            if (it.discountType === 'percent') discount = gross * ((Number(it.discountValue) || 0) / 100);
            if (it.discountType === 'flat') discount = Number(it.discountValue) || 0;
            const net = Math.max(gross - discount, 0);
            const gst = net * ((Number(it.gstPercent) || 0) / 100);
            const total = net + gst;
            
            const specs = [
              it.color ? `Color: ${it.color}` : null,
              it.ram ? `RAM: ${it.ram}` : null,
              it.storage ? `Storage: ${it.storage}` : null,
              it.processor ? `Processor: ${it.processor}` : null,
              it.displaySize ? `Display: ${it.displaySize}` : null,
              it.camera ? `Camera: ${it.camera}` : null,
              it.battery ? `Battery: ${it.battery}` : null,
              it.operatingSystem ? `OS: ${it.operatingSystem}` : null,
              it.networkType ? `Network: ${it.networkType}` : null,
            ].filter(Boolean).join(', ');

            return (
              <tr key={idx} className="border-t border-slate-200 align-top">
                <td className="py-1 pr-2 font-medium">{it.name && String(it.name).trim() ? it.name : 'Item'}</td>
                <td className="py-1 pr-2">{it.model || '-'}</td>
                <td className="py-1 pr-2">{it.imei || it.productId || '-'}</td>
                <td className="py-1 pr-2 max-w-xs whitespace-pre-wrap break-words">{specs || '-'}</td>
                <td className="py-1 pr-2">{qty}</td>
                <td className="py-1 pr-2">₹{total.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Summary */}
      {(() => {
        // Derive uniform GST percent across items, if any
        const allItems = displayItems;
        const percSet = new Set(allItems.map(it => Number(it.gstPercent) || 0));
        const uniform = percSet.size === 1 ? [...percSet][0] : null;
        const cgstLabel = uniform != null ? `CGST (${(uniform/2).toFixed(0)}%)` : 'CGST';
        const sgstLabel = uniform != null ? `SGST (${(uniform/2).toFixed(0)}%)` : 'SGST';
        
        return (
          <div className="mt-3 text-sm">
            <div className="flex justify-between"><span>Subtotal:</span><span>₹{calc.subTotal?.toFixed(2) || '0.00'}</span></div>
            <div className="flex justify-between"><span>{cgstLabel}:</span><span>₹{calc.cgst?.toFixed(2) || '0.00'}</span></div>
            <div className="flex justify-between"><span>{sgstLabel}:</span><span>₹{calc.sgst?.toFixed(2) || '0.00'}</span></div>
            {calc.billLevelDiscount > 0 && (
              <div className="flex justify-between"><span>Bill Discount:</span><span>- ₹{calc.billLevelDiscount?.toFixed(2) || '0.00'}</span></div>
            )}
            <div className="mt-1 pt-2 border-t border-slate-300 flex justify-between font-semibold text-base">
              <span>Grand Total:</span>
              <span>₹{calc.grandTotal?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        );
      })()}

      {/* Payment Details */}
      <div className="mt-4 text-sm">
        <div className="font-semibold mb-1">Payment Details</div>
        <div>Mode: {paymentMethod || '____________________'}</div>
        <div>Transaction ID: {'______________'}</div>
      </div>

      {/* Terms & Conditions */}
      <div className="mt-4 text-sm">
        <div className="font-semibold mb-1">Terms & Conditions</div>
        <ul className="list-disc pl-5 space-y-1">
          <li>Goods once sold will not be taken back or exchanged.</li>
          <li>Warranty as per manufacturer's policy.</li>
          <li>Please retain this invoice for future warranty/service.</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="mt-6 text-sm flex justify-between items-center">
        <div className="italic">💡 Thank you for shopping at Spot!</div>
        <div>Authorized Signatory ___________________</div>
      </div>
    </div>
  );
});

PrintableInvoice.displayName = 'PrintableInvoice';

export default PrintableInvoice;