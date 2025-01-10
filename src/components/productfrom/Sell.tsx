


// import React, { useState, useEffect, useRef } from "react";
// import SalesService, { SaleProduct } from "../../services/Sales.service";
// import { Printer, Barcode, PenLine, Plus, Trash2 } from 'lucide-react';
// import  Templatesellrecipt from "./TemplateRecipt";
// import { useReactToPrint } from "react-to-print";

// import { toast } from "react-toastify";
// import  ProductService from "../../services/Product.service";

// import "react-toastify/dist/ReactToastify.css";





// const Selladd: React.FC = () => {
//   const [saleDetails, setSaleDetails] = useState({
//     products: [{ sku: "", quantitySold: 1 }],
//     paymentMethod: "",
//     customerName: "",
//     customerContact: "",
//   });

//   const [isScanning, setIsScanning] = useState(false);
//   const [isManualEntry, setIsManualEntry] = useState(false);

//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const skuInputRef = useRef<HTMLInputElement>(null);

  

//   const toggleEntryMode = () => {
//     setIsManualEntry(!isManualEntry);
//     setIsScanning(false);
//   };


//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const data = await ProductService.getAllProducts();
//         setProducts(data); // Set fetched products
//         toast.success("Products fetched successfully!", {
//           position: toast.POSITION.TOP_RIGHT,
//         });
//       } catch (err) {
//         toast.error(`Error fetching products: ${err.message || "Unknown error"}`, {
//           position: toast.POSITION.TOP_RIGHT,
//         });
//       }
//     };

//     fetchProducts();
//   }, []);

//   const processScanComplete = (scannedSku: string) => {
//     const updatedProducts = [...saleDetails.products];
//     const existingProductIndex = updatedProducts.findIndex(p => p.sku === scannedSku);

//     if (existingProductIndex >= 0) {
//       updatedProducts[existingProductIndex].quantitySold += 1;
//     } else {
//       updatedProducts.push({
//         sku: scannedSku,
//         quantitySold: 1,
//       });
//     }

//     setSaleDetails(prev => ({
//       ...prev,
//       products: updatedProducts,
//     }));
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//     index?: number,
//     field?: "products"
//   ) => {
//     const { name, value } = e.target;
//     if (field === "products" && index !== undefined) {
//       const updatedProducts = [...saleDetails.products];
//       updatedProducts[index][name as keyof SaleProduct] =
//         name === "quantitySold" ? parseInt(value) || 1 : value;
//       setSaleDetails({ ...saleDetails, products: updatedProducts });
//     } else {
//       setSaleDetails({ ...saleDetails, [name]: value });
//     }
//   };

//   const addProductField = () => {
//     setSaleDetails({
//       ...saleDetails,
//       products: [...saleDetails.products, { sku: "", quantitySold: 1 }],
//     });
//   };

//   const removeProductField = (index: number) => {
//     if (saleDetails.products.length > 1) {
//       const updatedProducts = saleDetails.products.filter((_, i) => i !== index);
//       setSaleDetails({ ...saleDetails, products: updatedProducts });
//     }
//   };

//   const printReceipt = async (saleData: any) => {
//     try {
//       const device = await navigator.usb.requestDevice({
//         filters: [{ vendorId: 0x0483 }]
//       });

//       await device.open();
//       await device.selectConfiguration(1);
//       await device.claimInterface(0);

//       const receiptData = [
//         '\x1B\x40',
//         '\x1B\x61\x01',
//         'MY STORE\n',
//         'Address Line 1\n',
//         'Address Line 2\n',
//         `Phone: 1234567890\n`,
//         '-'.repeat(32) + '\n',
//         `Date: ${new Date().toLocaleString()}\n`,
//         `Customer: ${saleData.customerName}\n`,
//         `Contact: ${saleData.customerContact}\n`,
//         '-'.repeat(32) + '\n',
//         ...saleData.products.map((product: any) => 
//           `${product.sku} x${product.quantitySold} - ₹${product.totalAmount.toFixed(2)}\n`
//         ),
//         '-'.repeat(32) + '\n',
//         `Total: ₹${saleData.totalSaleAmount.toFixed(2)}\n`,
//         `Payment: ${saleData.paymentMethod}\n`,
//         '-'.repeat(32) + '\n',
//         'Thank you for your purchase!\n',
//         '\x1B\x61\x00',
//         '\x1D\x56\x41',
//       ].join('');

//       const encoder = new TextEncoder();
//       const data = encoder.encode(receiptData);
//       await device.transferOut(1, data);
//     } catch (error) {
//       console.error('Error printing receipt:', error);
//       alert('Failed to print receipt. Please check printer connection.');
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (isSubmitting) return;
    
//     try {
//       setIsSubmitting(true);

//       // Validate products
//       if (!saleDetails.products.some(p => p.sku && p.quantitySold > 0)) {
//         throw new Error('Please add at least one valid product');
//       }

//       const salePayload = {
//         products: saleDetails.products.filter(p => p.sku).map(product => ({
//           sku: product.sku,
//           quantitySold: product.quantitySold,
//           totalAmount: 0,
//           productId: "",
//         })),
//         paymentMethod: saleDetails.paymentMethod,
//         customerName: saleDetails.customerName,
//         customerContact: saleDetails.customerContact,
//         totalSaleAmount: 0,
//       };

//       const response = await SalesService.createSale(salePayload);
      
//       await printReceipt(response);
      
//       // Reset form
//       setSaleDetails({
//         products: [{ sku: "", quantitySold: 1 }],
//         paymentMethod: "",
//         customerName: "",
//         customerContact: "",
//       });

//       alert("Sale recorded successfully!");
//     } catch (error) {
//       console.error("Error recording sale:", error);
//       alert(error instanceof Error ? error.message : "Failed to record the sale");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Sell Products</h1>
      
//       <div className="mb-4">
//         <button
//           type="button"
//           onClick={toggleEntryMode}
//           className={`flex items-center gap-2 px-4 py-2 rounded-md ${
//             isManualEntry 
//               ? 'bg-yellow-500 hover:bg-yellow-600' 
//               : 'bg-blue-500 hover:bg-blue-600'
//           } text-white`}
//         >
//           {isManualEntry ? (
//             <>
//               <Barcode size={20} />
//               Switch to Scanner Mode
//             </>
//           ) : (
//             <>
//               <PenLine size={20} />
//               Switch to Manual Entry
//             </>
//           )}
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="space-y-4">
//           {saleDetails.products.map((product, index) => (
//             <div key={index} className="border border-gray-300 p-4 rounded-md">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="font-medium text-lg">Product {index + 1}</h3>
//                 {saleDetails.products.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeProductField(index)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <Trash2 size={20} />
//                   </button>
//                 )}
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700" htmlFor={`sku-${index}`}>
//                   SKU {!isManualEntry && isScanning && index === saleDetails.products.length - 1 && "(Scanning...)"}
//                 </label>
//                 <input
//                   type="text"
//                   id={`sku-${index}`}
//                   name="sku"
//                   ref={index === saleDetails.products.length - 1 ? skuInputRef : null}
//                   value={product.sku}
//                   onChange={(e) => handleInputChange(e, index, "products")}
//                   className="w-[45%] border border-gray-300 rounded-md p-2 mt-1"
//                   readOnly={!isManualEntry && isScanning}
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700" htmlFor={`quantitySold-${index}`}>
//                   Quantity Sold
//                 </label>
//                 <input
//                   type="number"
//                   id={`quantitySold-${index}`}
//                   name="quantitySold"
//                   value={product.quantitySold}
//                   onChange={(e) => handleInputChange(e, index, "products")}
//                   className="w-[45%] border border-gray-300 rounded-md p-2 mt-1"
//                   min="1"
//                   required
//                 />
//               </div>
//             </div>
//           ))}

//           <button
//             type="button"
//             onClick={addProductField}
//             className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
//           >
//             <Plus size={20} />
//             Add Another Product
//           </button>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700" htmlFor="paymentMethod">
//             Payment Method
//           </label>
//           <select
//             id="paymentMethod"
//             name="paymentMethod"
//             value={saleDetails.paymentMethod}
//             onChange={(e) => handleInputChange(e)}
//             className="w-full border border-gray-300 rounded-md p-2 mt-1"
//             required
//           >
//             <option value="">Select Payment Method</option>
//             <option value="Credit Card">Credit Card</option>
//             <option value="Debit Card">Debit Card</option>
//             <option value="Cash">Cash</option>
//             <option value="UPI">UPI</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700" htmlFor="customerName">
//             Customer Name
//           </label>
//           <input
//             type="text"
//             id="customerName"
//             name="customerName"
//             value={saleDetails.customerName}
//             onChange={(e) => handleInputChange(e)}
//             className="w-full border border-gray-300 rounded-md p-2 mt-1"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700" htmlFor="customerContact">
//             Customer Contact
//           </label>
//           <input
//             type="text"
//             id="customerContact"
//             name="customerContact"
//             value={saleDetails.customerContact}
//             onChange={(e) => handleInputChange(e)}
//             className="w-full border border-gray-300 rounded-md p-2 mt-1"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className={`flex items-center gap-2 px-4 py-2 rounded-md ${
//             isSubmitting 
//               ? 'bg-gray-400 cursor-not-allowed' 
//               : 'bg-blue-500 hover:bg-blue-600'
//           } text-white w-full justify-center`}
//         >
//           <Printer size={20} />
//           {isSubmitting ? 'Processing...' : 'Submit Sale & Print Receipt'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Selladd;

import React, { useState, useEffect, useRef } from "react";
import SalesService, { SaleProduct } from "../../services/Sales.service";
import { Printer, Barcode, PenLine, Plus, Trash2, ArrowRight } from 'lucide-react';
import TemplateRecipt from "./TemplateRecipt";
import ProductService from "../../services/Product.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Selladd: React.FC = () => {
  const [step, setStep] = useState(1);
  const [saleDetails, setSaleDetails] = useState({
    products: [{ sku: "", quantitySold: 1, name: "", sellingPrice: 0, totalAmount: 0 }],
    paymentMethod: "",
    customerName: "",
    customerContact: "",
    totalSaleAmount: 0
  });
  const [isScanning, setIsScanning] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const skuInputRef = useRef<HTMLInputElement>(null);
  const receiptRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getAllProducts();
        setProducts(data);
      } catch (err) {
        toast.error(`Error fetching products: ${err.message || "Unknown error"}`);
      }
    };
    fetchProducts();
  }, []);

  const calculateTotalAmount = (products) => {
    return products.reduce((total, product) => total + (product.sellingPrice * product.quantitySold), 0);
  };

  const handleSkuChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const sku = e.target.value;
    const updatedProducts = [...saleDetails.products];
    const product = products.find(p => p.sku === sku);

    if (product) {
      updatedProducts[index] = {
        ...updatedProducts[index],
        sku,
        name: product.name,
        sellingPrice: product.sellingPrice,
        totalAmount: product.sellingPrice * updatedProducts[index].quantitySold
      };
    } else {
      updatedProducts[index] = {
        ...updatedProducts[index],
        sku,
        name: "",
        sellingPrice: 0,
        totalAmount: 0
      };
    }

    const totalSaleAmount = calculateTotalAmount(updatedProducts);
    setSaleDetails(prev => ({
      ...prev,
      products: updatedProducts,
      totalSaleAmount
    }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const quantity = parseInt(e.target.value) || 0;
    const updatedProducts = [...saleDetails.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      quantitySold: quantity,
      totalAmount: quantity * updatedProducts[index].sellingPrice
    };

    const totalSaleAmount = calculateTotalAmount(updatedProducts);
    setSaleDetails(prev => ({
      ...prev,
      products: updatedProducts,
      totalSaleAmount
    }));
  };

  const addProductField = () => {
    setSaleDetails(prev => ({
      ...prev,
      products: [...prev.products, { sku: "", quantitySold: 1, name: "", sellingPrice: 0, totalAmount: 0 }]
    }));
  };

  const removeProductField = (index: number) => {
    if (saleDetails.products.length > 1) {
      const updatedProducts = saleDetails.products.filter((_, i) => i !== index);
      const totalSaleAmount = calculateTotalAmount(updatedProducts);
      setSaleDetails(prev => ({
        ...prev,
        products: updatedProducts,
        totalSaleAmount
      }));
    }
  };

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSaleDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const response = await SalesService.createSale(saleDetails);
      
      // Reset form and go back to step 1
      setSaleDetails({
        products: [{ sku: "", quantitySold: 1, name: "", sellingPrice: 0, totalAmount: 0 }],
        paymentMethod: "",
        customerName: "",
        customerContact: "",
        totalSaleAmount: 0
      });
      setStep(1);
      toast.success("Sale recorded successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to record the sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">New Sale</h1>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}>1</div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}>2</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">SKU</th>
                    <th className="px-4 py-2 border-b">Product Name</th>
                    <th className="px-4 py-2 border-b">Unit Price</th>
                    <th className="px-4 py-2 border-b">Quantity</th>
                    <th className="px-4 py-2 border-b">Total</th>
                    <th className="px-4 py-2 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {saleDetails.products.map((product, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border-b">
                        <input
                          type="text"
                          value={product.sku}
                          onChange={(e) => handleSkuChange(e, index)}
                          className="w-full border rounded px-2 py-1"
                          placeholder="Enter SKU"
                        />
                      </td>
                      <td className="px-4 py-2 border-b">{product.name || '-'}</td>
                      <td className="px-4 py-2 border-b">₹{product.sellingPrice.toFixed(2)}</td>
                      <td className="px-4 py-2 border-b">
                        <input
                          type="number"
                          value={product.quantitySold}
                          onChange={(e) => handleQuantityChange(e, index)}
                          min="1"
                          className="w-20 border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-2 border-b">₹{product.totalAmount.toFixed(2)}</td>
                      <td className="px-4 py-2 border-b">
                        {saleDetails.products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProductField(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-right font-bold">Grand Total:</td>
                    <td className="px-4 py-2 font-bold">₹{saleDetails.totalSaleAmount.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={addProductField}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                <Plus size={20} />
                Add Product
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                disabled={!saleDetails.products.some(p => p.sku && p.quantitySold > 0)}
              >
                Next
                <ArrowRight size={20} />
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                name="paymentMethod"
                value={saleDetails.paymentMethod}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
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
              <label className="block text-sm font-medium text-gray-700">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={saleDetails.customerName}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Contact</label>
              <input
                type="text"
                name="customerContact"
                value={saleDetails.customerContact}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              >
                <Printer size={20} />
                {isSubmitting ? 'Processing...' : 'Complete Sale & Print Receipt'}
              </button>
            </div>
          </div>
        )}
      </form>

      <div style={{ display: 'block' }}>
        <TemplateRecipt componentref={receiptRef} saleDetails={saleDetails} />
      </div>
    </div>
  );
};

export default Selladd;