


import React, { useState, useEffect, useRef } from "react";
import SalesService, { SaleProduct } from "../../services/Sales.service";
import { Printer, Barcode, PenLine, Plus, Trash2 } from 'lucide-react';

const Selladd: React.FC = () => {
  const [saleDetails, setSaleDetails] = useState({
    products: [{ sku: "", quantitySold: 1 }],
    paymentMethod: "",
    customerName: "",
    customerContact: "",
  });

  const [isScanning, setIsScanning] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const skuInputRef = useRef<HTMLInputElement>(null);

  

  const toggleEntryMode = () => {
    setIsManualEntry(!isManualEntry);
    setIsScanning(false);
  };

  const processScanComplete = (scannedSku: string) => {
    const updatedProducts = [...saleDetails.products];
    const existingProductIndex = updatedProducts.findIndex(p => p.sku === scannedSku);

    if (existingProductIndex >= 0) {
      updatedProducts[existingProductIndex].quantitySold += 1;
    } else {
      updatedProducts.push({
        sku: scannedSku,
        quantitySold: 1,
      });
    }

    setSaleDetails(prev => ({
      ...prev,
      products: updatedProducts,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
    field?: "products"
  ) => {
    const { name, value } = e.target;
    if (field === "products" && index !== undefined) {
      const updatedProducts = [...saleDetails.products];
      updatedProducts[index][name as keyof SaleProduct] =
        name === "quantitySold" ? parseInt(value) || 1 : value;
      setSaleDetails({ ...saleDetails, products: updatedProducts });
    } else {
      setSaleDetails({ ...saleDetails, [name]: value });
    }
  };

  const addProductField = () => {
    setSaleDetails({
      ...saleDetails,
      products: [...saleDetails.products, { sku: "", quantitySold: 1 }],
    });
  };

  const removeProductField = (index: number) => {
    if (saleDetails.products.length > 1) {
      const updatedProducts = saleDetails.products.filter((_, i) => i !== index);
      setSaleDetails({ ...saleDetails, products: updatedProducts });
    }
  };

  const printReceipt = async (saleData: any) => {
    try {
      const device = await navigator.usb.requestDevice({
        filters: [{ vendorId: 0x0483 }]
      });

      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);

      const receiptData = [
        '\x1B\x40',
        '\x1B\x61\x01',
        'MY STORE\n',
        'Address Line 1\n',
        'Address Line 2\n',
        `Phone: 1234567890\n`,
        '-'.repeat(32) + '\n',
        `Date: ${new Date().toLocaleString()}\n`,
        `Customer: ${saleData.customerName}\n`,
        `Contact: ${saleData.customerContact}\n`,
        '-'.repeat(32) + '\n',
        ...saleData.products.map((product: any) => 
          `${product.sku} x${product.quantitySold} - ₹${product.totalAmount.toFixed(2)}\n`
        ),
        '-'.repeat(32) + '\n',
        `Total: ₹${saleData.totalSaleAmount.toFixed(2)}\n`,
        `Payment: ${saleData.paymentMethod}\n`,
        '-'.repeat(32) + '\n',
        'Thank you for your purchase!\n',
        '\x1B\x61\x00',
        '\x1D\x56\x41',
      ].join('');

      const encoder = new TextEncoder();
      const data = encoder.encode(receiptData);
      await device.transferOut(1, data);
    } catch (error) {
      console.error('Error printing receipt:', error);
      alert('Failed to print receipt. Please check printer connection.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);

      // Validate products
      if (!saleDetails.products.some(p => p.sku && p.quantitySold > 0)) {
        throw new Error('Please add at least one valid product');
      }

      const salePayload = {
        products: saleDetails.products.filter(p => p.sku).map(product => ({
          sku: product.sku,
          quantitySold: product.quantitySold,
          totalAmount: 0,
          productId: "",
        })),
        paymentMethod: saleDetails.paymentMethod,
        customerName: saleDetails.customerName,
        customerContact: saleDetails.customerContact,
        totalSaleAmount: 0,
      };

      const response = await SalesService.createSale(salePayload);
      
      await printReceipt(response);
      
      // Reset form
      setSaleDetails({
        products: [{ sku: "", quantitySold: 1 }],
        paymentMethod: "",
        customerName: "",
        customerContact: "",
      });

      alert("Sale recorded successfully!");
    } catch (error) {
      console.error("Error recording sale:", error);
      alert(error instanceof Error ? error.message : "Failed to record the sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sell Products</h1>
      
      <div className="mb-4">
        <button
          type="button"
          onClick={toggleEntryMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            isManualEntry 
              ? 'bg-yellow-500 hover:bg-yellow-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isManualEntry ? (
            <>
              <Barcode size={20} />
              Switch to Scanner Mode
            </>
          ) : (
            <>
              <PenLine size={20} />
              Switch to Manual Entry
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {saleDetails.products.map((product, index) => (
            <div key={index} className="border border-gray-300 p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">Product {index + 1}</h3>
                {saleDetails.products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProductField(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor={`sku-${index}`}>
                  SKU {!isManualEntry && isScanning && index === saleDetails.products.length - 1 && "(Scanning...)"}
                </label>
                <input
                  type="text"
                  id={`sku-${index}`}
                  name="sku"
                  ref={index === saleDetails.products.length - 1 ? skuInputRef : null}
                  value={product.sku}
                  onChange={(e) => handleInputChange(e, index, "products")}
                  className="w-[45%] border border-gray-300 rounded-md p-2 mt-1"
                  readOnly={!isManualEntry && isScanning}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor={`quantitySold-${index}`}>
                  Quantity Sold
                </label>
                <input
                  type="number"
                  id={`quantitySold-${index}`}
                  name="quantitySold"
                  value={product.quantitySold}
                  onChange={(e) => handleInputChange(e, index, "products")}
                  className="w-[45%] border border-gray-300 rounded-md p-2 mt-1"
                  min="1"
                  required
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addProductField}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            <Plus size={20} />
            Add Another Product
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="paymentMethod">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={saleDetails.paymentMethod}
            onChange={(e) => handleInputChange(e)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
            required
          >
            <option value="">Select Payment Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="customerName">
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={saleDetails.customerName}
            onChange={(e) => handleInputChange(e)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="customerContact">
            Customer Contact
          </label>
          <input
            type="text"
            id="customerContact"
            name="customerContact"
            value={saleDetails.customerContact}
            onChange={(e) => handleInputChange(e)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white w-full justify-center`}
        >
          <Printer size={20} />
          {isSubmitting ? 'Processing...' : 'Submit Sale & Print Receipt'}
        </button>
      </form>
    </div>
  );
};

export default Selladd;
