
import React, { useState, useEffect, useRef } from "react";
import SalesService from "../../services/Sales.service";
import { Printer, Plus, Trash2, ArrowRight } from "lucide-react";
import TemplateRecipt from "./TemplateRecipt";
import ProductService from "../../services/Product.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useReactToPrint } from "react-to-print";

const Selladd: React.FC = () => {
  const [step, setStep] = useState(1);
  const [saleDetails, setSaleDetails] = useState({
    products: [
      {
        sku: "",
        quantitySold: 1,
        name: "",
        sellingPrice: 0,
        totalAmount: 0,
        gstnumber: 0,
        mrpprice: 0,
        discountPercentage: 0,
        originalSellingPrice: 0,
      },
    ],
    paymentMethod: "",
    customerName: "",
    customerContact: "",
    totalSaleAmount: 0,
    cashReceived: 0,
    changeAmount: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const skuInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const nameInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const receiptRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getAllProductsCategory();
        setProducts(data);
      } catch (err) {
        toast.error(`Error fetching products: ${err.message || "Unknown error"}`);
      }
    };
    fetchProducts();
  }, []);

  const calculateTotalAmount = (products) => {
    return products.reduce(
      (total, product) => total + product.sellingPrice * product.quantitySold,
      0
    );
  };

  const recalculatePrice = (product, newDiscountPercentage) => {
    const originalPrice = product.mrpprice;
    const newSellingPrice = originalPrice * (1 - newDiscountPercentage / 100);
    return parseFloat(newSellingPrice.toFixed(2));
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newDiscount = parseFloat(e.target.value) || 0;
    const updatedProducts = [...saleDetails.products];
    const product = updatedProducts[index];
    
    const newSellingPrice = recalculatePrice(product, newDiscount);
    
    updatedProducts[index] = {
      ...product,
      discountPercentage: newDiscount,
      sellingPrice: newSellingPrice,
      totalAmount: newSellingPrice * product.quantitySold
    };

    const totalSaleAmount = calculateTotalAmount(updatedProducts);
    console.log(updatedProducts,478);
    
    setSaleDetails(prev => ({
      ...prev,
      products: updatedProducts,
      totalSaleAmount
    }));
  };

  const handleSellingPriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newPrice = parseFloat(e.target.value) || 0;
    const updatedProducts = [...saleDetails.products];
    const product = updatedProducts[index];
    
    const originalPrice = product.mrpprice;
    const newDiscountPercentage = ((originalPrice - newPrice) / originalPrice) * 100;
    
    updatedProducts[index] = {
      ...product,
      sellingPrice: newPrice,
      discountPercentage: parseFloat(newDiscountPercentage.toFixed(2)),
      totalAmount: newPrice * product.quantitySold
    };

    const totalSaleAmount = calculateTotalAmount(updatedProducts);
    setSaleDetails(prev => ({
      ...prev,
      products: updatedProducts,
      totalSaleAmount
    }));
  };

  const addProductField = (callback?: () => void) => {
    setSaleDetails((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          sku: "",
          quantitySold: 1,
          name: "",
          sellingPrice: 0,
          totalAmount: 0,
          gstnumber: 0,
          mrpprice: 0,
          discountPercentage: 0,
          originalSellingPrice: 0,
        },
      ],
    }));

    if (callback) {
      setTimeout(callback, 0);
    }
  };

  // const handleSkuChange = async (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   index: number
  // ) => {
  //   const sku = e.target.value.trim();
  //   const updatedProducts = [...saleDetails.products];
  //   const product = products.find((p) => p.sku === sku);

  //   if (product) {
  //     const existingProductIndex = saleDetails.products.findIndex(
  //       (p, i) => i !== index && p.sku === sku
  //     );

  //     if (existingProductIndex !== -1) {
  //       updatedProducts[existingProductIndex] = {
  //         ...updatedProducts[existingProductIndex],
  //         quantitySold: updatedProducts[existingProductIndex].quantitySold + 1,
  //         totalAmount:
  //           (updatedProducts[existingProductIndex].quantitySold + 1) *
  //           updatedProducts[existingProductIndex].sellingPrice,
  //       };

  //       updatedProducts[index] = {
  //         sku: "",
  //         quantitySold: 1,
  //         name: "",
  //         sellingPrice: 0,
  //         totalAmount: 0,
  //         gstnumber: 0,
  //         mrpprice: 0,
  //       };

  //       const totalSaleAmount = calculateTotalAmount(updatedProducts);
  //       setSaleDetails((prev) => ({
  //         ...prev,
  //         products: updatedProducts,
  //         totalSaleAmount,
  //       }));
  //     } else {
  //       updatedProducts[index] = {
  //         ...updatedProducts[index],
  //         sku,
  //         name: product.name,
  //         sellingPrice: product.sellingPrice,
  //         mrpprice: product.mrpprice,
  //         gstnumber: product.category.gstnumber,
  //         discountPercentage: product.discountPercentage || 0,
  //         totalAmount:
  //           product.sellingPrice * updatedProducts[index].quantitySold,
  //       };

  //       const totalSaleAmount = calculateTotalAmount(updatedProducts);
  //       setSaleDetails((prev) => ({
  //         ...prev,
  //         products: updatedProducts,
  //         totalSaleAmount,
  //       }));

  //       if (index === saleDetails.products.length - 1) {
  //         addProductField(() => {
  //           setTimeout(() => {
  //             if (skuInputRefs.current[index + 1]) {
  //               skuInputRefs.current[index + 1]?.focus();
  //             }
  //           }, 100);
  //         });
  //       }
  //     }
  //   } else {
  //     updatedProducts[index] = {
  //       ...updatedProducts[index],
  //       sku,
  //       name: "",
  //       sellingPrice: 0,
  //       totalAmount: 0,
  //       mrpprice: 0,
  //       gstnumber: 0,
  //     };

  //     const totalSaleAmount = calculateTotalAmount(updatedProducts);
  //     setSaleDetails((prev) => ({
  //       ...prev,
  //       products: updatedProducts,
  //       totalSaleAmount,
  //     }));
  //   }
  // };
  const handleBarcodeScanner = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      const sku = input.value.trim();
      
      input.dataset.scanned = 'true';
      
      handleSkuChange({
        target: input,
        type: 'change'
      } as React.ChangeEvent<HTMLInputElement>, index);
    }
  };

  const handleSkuChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const sku = e.target.value.trim();
    console.log(sku, 478);
    if (!sku) return;

    const updatedProducts = [...saleDetails.products];
    const product = products.find((p) => p.sku === sku);

    if (product) {
      const existingProductIndex = updatedProducts.findIndex(
        (p, i) => i !== index && p.sku === sku
      );

      if (existingProductIndex !== -1) {
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          quantitySold: updatedProducts[existingProductIndex].quantitySold + 1,
          totalAmount: (updatedProducts[existingProductIndex].quantitySold + 1) * 
                      updatedProducts[existingProductIndex].sellingPrice
        };

        if (!e.target.dataset.scanned) {
          updatedProducts[index] = {
            ...updatedProducts[index],
            sku: ""
          };
        }

        setSaleDetails((prev) => ({
          ...prev,
          products: updatedProducts,
          totalSaleAmount: calculateTotalAmount(updatedProducts)
        }));

        setTimeout(() => {
          if (skuInputRefs.current[index]) {
            skuInputRefs.current[index].value = "";
            skuInputRefs.current[index].focus();
          }
        }, 100);
      } else {
        updatedProducts[index] = {
          sku,
          name: product.name,
          sellingPrice: product.sellingPrice,
          mrpprice: product.mrpprice,
          gstnumber: product.category?.gstnumber || 0,
          discountPercentage: product.discountPercentage || 0,
          quantitySold: 1,
          totalAmount: product.sellingPrice,
          originalSellingPrice: product.sellingPrice
        };

        setSaleDetails((prev) => ({
          ...prev,
          products: updatedProducts,
          totalSaleAmount: calculateTotalAmount(updatedProducts)
        }));

        if (index === saleDetails.products.length - 1) {
          addProductField(() => {
            setTimeout(() => {
              if (skuInputRefs.current[index + 1]) {
                skuInputRefs.current[index + 1].focus();
              }
            }, 100);
          });
        }
      }
    } else {
      toast.error(`Product with SKU ${sku} not found`);
      updatedProducts[index] = {
        ...updatedProducts[index],
        sku: ""
      };

      setSaleDetails((prev) => ({
        ...prev,
        products: updatedProducts
      }));

      setTimeout(() => {
        if (skuInputRefs.current[index]) {
          skuInputRefs.current[index].focus();
        }
      }, 100);
    }

    if (e.target.dataset.scanned) {
      delete e.target.dataset.scanned;
    }
  };
  
  

  
  
  
  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const name = e.target.value.trim();
    const updatedProducts = [...saleDetails.products];
    const product = products.find((p) => p.name.trim().toLowerCase() === name.toLowerCase());
  
    if (product) {
      const existingProductIndex = saleDetails.products.findIndex(
        (p, i) => i !== index && p.name.toLowerCase() === name.toLowerCase()
      );
  
      if (existingProductIndex !== -1) {
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          quantitySold: updatedProducts[existingProductIndex].quantitySold + 1,
          totalAmount:
            (updatedProducts[existingProductIndex].quantitySold + 1) *
            updatedProducts[existingProductIndex].sellingPrice,
        };
  
        updatedProducts[index] = {
          sku: "",
          quantitySold: 1,
          name: "",
          sellingPrice: 0,
          totalAmount: 0,
          gstnumber: 0,
          mrpprice: 0,
          discountPercentage: 0,
          originalSellingPrice: 0,
        };
  
        const totalSaleAmount = calculateTotalAmount(updatedProducts);
        setSaleDetails((prev) => ({
          ...prev,
          products: updatedProducts,
          totalSaleAmount,
        }));
  
        setTimeout(() => {
          if (nameInputRefs.current[index]) {
            nameInputRefs.current[index]?.focus();
          }
        }, 100);
      } else {
        updatedProducts[index] = {
          ...updatedProducts[index],
          name,
          sku: product.sku,
          sellingPrice: product.sellingPrice,
          mrpprice: product.mrpprice,
          gstnumber: product.category.gstnumber,
          discountPercentage: product.discountPercentage || 0,
          originalSellingPrice: product.sellingPrice,
          totalAmount: product.sellingPrice * updatedProducts[index].quantitySold,
        };
  
        const totalSaleAmount = calculateTotalAmount(updatedProducts);
        setSaleDetails((prev) => ({
          ...prev,
          products: updatedProducts,
          totalSaleAmount,
        }));
  
        if (index === saleDetails.products.length - 1) {
          addProductField(() => {
            setTimeout(() => {
              if (nameInputRefs.current[index + 1]) {
                nameInputRefs.current[index + 1]?.focus();
              }
            }, 100);
          });
        }
      }
    } else {
      updatedProducts[index] = {
        ...updatedProducts[index],
        name,
        sku: "",
        sellingPrice: 0,
        totalAmount: 0,
        mrpprice: 0,
        gstnumber: 0,
        discountPercentage: 0,
        originalSellingPrice: 0,
      };
  
      const totalSaleAmount = calculateTotalAmount(updatedProducts);
      setSaleDetails((prev) => ({
        ...prev,
        products: updatedProducts,
        totalSaleAmount,
      }));
    }
  };
  


  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const quantity = parseFloat(e.target.value) || 0; // Allow floating point numbers
    const updatedProducts = [...saleDetails.products];
  
    updatedProducts[index] = {
      ...updatedProducts[index],
      quantitySold: quantity,
      totalAmount: parseFloat((quantity * updatedProducts[index].sellingPrice).toFixed(2)), // Ensure two decimal places
    };
  
    setSaleDetails((prevDetails) => ({
      ...prevDetails,
      products: updatedProducts,
    }));
  };
  
  const removeProductField = (index: number) => {
    if (saleDetails.products.length > 1) {
      const updatedProducts = saleDetails.products.filter((_, i) => i !== index);
      const totalSaleAmount = calculateTotalAmount(updatedProducts);
      setSaleDetails((prev) => ({
        ...prev,
        products: updatedProducts,
        totalSaleAmount,
      }));
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSaleDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCashReceived = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cashReceived = parseFloat(e.target.value) || 0;
    const changeAmount = cashReceived - saleDetails.totalSaleAmount;
    
    setSaleDetails(prev => ({
      ...prev,
      cashReceived,
      changeAmount: changeAmount >= 0 ? changeAmount : 0
    }));
  };

  const printReceipt = useReactToPrint({
    contentRef: receiptRef,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      let totalCGST = 0;
      let totalSGST = 0;
      let savedAmount = 0;

      saleDetails.products
        ?.filter((i) => i.name)
        .forEach((product) => {
          if (product.gstnumber) {
            const gstRate = product.gstnumber / 2;
            const gstAmount = (product.totalAmount * gstRate) / 100;
            totalCGST += gstAmount;
            totalSGST += gstAmount;
          }
          savedAmount +=
            (product.mrpprice - product.sellingPrice) * product.quantitySold;
        });

      const { customerContact, cashReceived, changeAmount, ...restDetails } = {
        ...saleDetails,
        salesDetails: saleDetails.products.filter((i) => i.name),
      };
      
      const saleData = {
        ...restDetails,
        ...(customerContact ? { customerContact } : {}),
        ...(saleDetails.paymentMethod === 'Cash' ? { 
          cashReceived: cashReceived || 0,
          changeAmount: changeAmount || 0
        } : {}),
        cgstAmount: totalCGST,
        sgstAmount: totalSGST,
        savedAmount: savedAmount,
      };

      await SalesService.createSale({
        ...saleData,
        products: saleData.products?.filter((i) => i.name?.length),
      });

      printReceipt();

      setSaleDetails({
        products: [
          {
            sku: "",
            quantitySold: 1,
            name: "",
            sellingPrice: 0,
            totalAmount: 0,
            gstnumber: 0,
            mrpprice: 0,
            discountPercentage: 0,
            originalSellingPrice: 0,
          },
        ],
        paymentMethod: "",
        customerName: "",
        customerContact: "",
        totalSaleAmount: 0,
        cashReceived: 0,
        changeAmount: 0,
      });
      setStep(1);
      toast.success("Sale recorded successfully!");
    } catch (error: any) {
      console.error("Error submitting sale:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to record the sale"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (skuInputRefs.current[0]) {
      skuInputRefs.current[0]?.focus();
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">New Sale</h1>

      <div className="flex items-center mb-6">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 1 ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          1
        </div>
        <div className="h-1 w-16 bg-gray-300 mx-2"></div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 2 ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          2
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
                    <th className="px-4 py-2 border-b">MRP</th>
                    <th className="px-4 py-2 border-b">Discount %</th>
                    <th className="px-4 py-2 border-b">Selling Price</th>
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
          ref={(el) => (skuInputRefs.current[index] = el)}
          value={product.sku}
          onChange={(e) => handleSkuChange(e, index)}
          onKeyDown={(e) => handleBarcodeScanner(e, index)}
          className="w-full border rounded px-2 py-1"
          placeholder="Scan or Enter SKU"
          autoComplete="off"
        />
      </td>
                      <td className="px-4 py-2 border-b">
                        <input
                          type="text"
                          ref={(el) => (nameInputRefs.current[index] = el)}
                          value={product.name || ""}
                          onChange={(e) => handleNameChange(e, index)}
                          list={`product-options-${index}`}
                          className="w-full border rounded px-2 py-1"
                          placeholder="Select or Enter Product"
                        />
                        <datalist id={`product-options-${index}`}>
                          {products.map((item) => (
                            <option key={item.sku} value={item.name} />
                          ))}
                        </datalist>
                      </td>
                      <td className="px-4 py-2 border-b">₹{product.mrpprice}</td>
                      <td className="px-4 py-2 border-b">
                        <input
                          type="number"
                          value={product.discountPercentage}
                          onChange={(e) => handleDiscountChange(e, index)}
                          className="w-20 border rounded px-2 py-1"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </td>
                      <td className="px-4 py-2 border-b">
                        <input
                          type="number"
                          value={product.sellingPrice}
                          onChange={(e) => handleSellingPriceChange(e, index)}
                          className="w-24 border rounded px-2 py-1"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="px-4 py-2 border-b">
                        {/* <input
                          type="number"
                          value={product.quantitySold}
                          onChange={(e) => handleQuantityChange(e, index)}
                          min="1"
                          className="w-20 border rounded px-2 py-1"
                          
                        /> */}
                        <input
  type="number"
  value={product.quantitySold}
  onChange={(e) => handleQuantityChange(e, index)}
  min="0.1"
  step="any"
  className="w-20 border rounded px-2 py-1"
/>

                        
                      </td>
                      <td className="px-4 py-2 border-b">
                        {console.log(product.totalAmount,1234)}
                        ₹{product.totalAmount}
                      </td>
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
                    <td colSpan={6} className="px-4 py-2 text-right font-bold">
                      Total Amount:
                    </td>
                    <td className="px-4 py-2 font-bold">
                      ₹{saleDetails.totalSaleAmount.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => addProductField()}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                <Plus size={20} />
                Add Product
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                disabled={!saleDetails.products.some((p) => p.sku && p.quantitySold > 0)}
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
              <label className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
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

            {saleDetails.paymentMethod === 'Cash' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount Received
                  </label>
                  <input
                    type="number"
                    value={saleDetails.cashReceived}
                    onChange={handleCashReceived}
                    className="w-full border rounded-md p-2"
                    // min={saleDetails.totalSaleAmount}
                    placeholder="Enter amount received"
                    
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Change Amount
                  </label>
                  <input
                    type="number"
                    value={saleDetails.changeAmount}
                    className="w-full border rounded-md p-2 bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                value={saleDetails.customerName}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer Contact
              </label>
              <input
                type="text"
                name="customerContact"
                value={saleDetails.customerContact}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
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
                {isSubmitting ? "Processing..." : "Complete Sale & Print Receipt"}
              </button>
            </div>
          </div>
        )}
      </form>

      <div style={{ display: "none" }}>
        <TemplateRecipt componentref={receiptRef} saleDetails={saleDetails} />
      </div>
    </div>
  );
};

export default Selladd;