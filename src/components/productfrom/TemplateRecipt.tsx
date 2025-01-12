

import React from "react";
import { format } from "date-fns";

interface Product {
  sku: string;
  name: string;
  quantitySold: number;
  sellingPrice: number;
  mrpprice: number;
  totalAmount: number;
  category?: {
    gstnumber: number;
  };
}

interface TemplateReciptProps {
  componentref: React.RefObject<HTMLDivElement>;
  saleDetails: {
    products: Product[];
    customerName: string;
    customerContact: string;
    paymentMethod: string;
    totalSaleAmount: number;
  };
}

const TemplateRecipt: React.FC<TemplateReciptProps> = ({ componentref, saleDetails }) => {
  const shopDetails = {
    name: "SHOP NAME RETAIL",
    address: "Shop Address Line 1, City, State",
    mobile: "+91-1234567890",
    gstin: "09ABZFA5370M1ZJ",
  };

  const billNo = Math.floor(Math.random() * 10000);

  // Calculate GST amounts
  const calculateGSTAmounts = () => {
    let totalCGST = 0;
    let totalSGST = 0;

    saleDetails.products.forEach(product => {
      if (product.category?.gstnumber) {
        const gstRate = product.category.gstnumber / 2; // Split into CGST and SGST
        const gstAmount = (product.totalAmount * gstRate) / 100;
        totalCGST += gstAmount;
        totalSGST += gstAmount;
      }
    });

    return { totalCGST, totalSGST };
  };

  const { totalCGST, totalSGST } = calculateGSTAmounts();

  return (
    <div ref={componentref} className="max-w-[80mm] mx-auto p-2 bg-white font-mono text-sm">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">{shopDetails.name}</h1>
        <p className="text-xs">{shopDetails.address}</p>
        <p className="text-xs">Mob.: {shopDetails.mobile}</p>
        <p className="text-xs">GSTIN: {shopDetails.gstin}</p>
      </div>

      <div className="border-t border-b border-black py-2">
        <div className="flex justify-between text-xs">
          <span>BILL No: {billNo}</span>
          <span>DATE: {format(new Date(), "dd/MM/yyyy")}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>TIME: {format(new Date(), "HH:mm:ss")}</span>
        </div>
      </div>

      <table className="w-full text-xs mt-2">
        <thead>
          <tr className="border-b border-black">
            <th className="text-left">ITEM</th>
            <th className="text-right">QTY</th>
            <th className="text-right">MRP</th>
            <th className="text-right">RATE</th>
            <th className="text-right">GST%</th>
            <th className="text-right">AMT</th>
          </tr>
        </thead>
        <tbody>
          {saleDetails.products.map((product, index) => (
            <tr key={index} className="border-b border-dotted">
              <td className="text-left">{product.name}</td>
              <td className="text-right">{product.quantitySold}</td>
              <td className="text-right">₹{product.mrpprice?.toFixed(2) || '0.00'}</td>
              <td className="text-right">₹{product.sellingPrice.toFixed(2)}</td>
              <td className="text-right">{product.category?.gstnumber || 0}%</td>
              <td className="text-right">₹{product.totalAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2 border-t border-black">
        <div className="flex justify-between font-bold">
          <span>NET PAYABLE AMT:</span>
          <span>₹{saleDetails.totalSaleAmount.toFixed(2)}</span>
        </div>
        <div className="text-xs mt-2">
          <div className="flex justify-between">
            <span>CGST AMT:</span>
            <span>₹{totalCGST.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>SGST AMT:</span>
            <span>₹{totalSGST.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold mt-1">
            <span>GRAND TOTAL:</span>
            <span>₹{(saleDetails.totalSaleAmount + totalCGST + totalSGST).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs border-t border-black">
        <p className="font-bold">Terms & Conditions:</p>
        <ol className="list-decimal list-inside">
          <li>Prices are inclusive of all taxes</li>
          <li>No refund on fresh products</li>
          <li>Free Home Delivery</li>
        </ol>
      </div>

      <div className="mt-4 text-center text-xs">
        <p>THANKS FOR SHOPPING WITH US</p>
        <p>PLEASE VISIT AGAIN</p>
      </div>

      <div className="mt-4 text-xs border-t border-black pt-2">
        <p>NAME: {saleDetails.customerName}</p>
        <p>MOB.: {saleDetails.customerContact}</p>
      </div>

      
      <div className="mt-4 text-xs border-t text-white pt-2">
        <p>NAME: {saleDetails.customerName}</p>
        <p>MOB.: {saleDetails.customerContact}</p>
      </div>
    </div>
  );
};

export default TemplateRecipt;