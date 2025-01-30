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
      },
    ],
    paymentMethod: "",
    customerName: "",
    customerContact: "",
    totalSaleAmount: 0,
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
        toast.error(
          `Error fetching products: ${err.message || "Unknown error"}`
        );
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
        },
      ],
    }));

    if (callback) {
      setTimeout(callback, 0);
    }
  };

  const handleSkuChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const sku = e.target.value;
    const updatedProducts = [...saleDetails.products];
    const product = products.find((p) => p.sku === sku);

    if (product) {
      // Check if this SKU already exists in the products array
      const existingProductIndex = saleDetails.products.findIndex(
        (p, i) => i !== index && p.sku === sku
      );

      if (existingProductIndex !== -1) {
        // If SKU exists, increment quantity instead of adding new row
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          quantitySold: updatedProducts[existingProductIndex].quantitySold + 1,
          totalAmount:
            (updatedProducts[existingProductIndex].quantitySold + 1) *
            updatedProducts[existingProductIndex].sellingPrice,
        };

        // Clear the current input row if it's not the only row
        // if (saleDetails.products.length > 1) {
        //   updatedProducts.splice(index, 1);
        // } else {
        // If it's the only row, just clear it
        updatedProducts[index] = {
          sku: "",
          quantitySold: 1,
          name: "",
          sellingPrice: 0,
          totalAmount: 0,
          gstnumber: 0,
          mrpprice: 0,
          // };
        };

        const totalSaleAmount = calculateTotalAmount(updatedProducts);
        setSaleDetails((prev) => ({
          ...prev,
          products: updatedProducts,
          totalSaleAmount,
        }));

        // Focus back on the input
        // setTimeout(() => {
        //   if (skuInputRefs.current[0]) {
        //     skuInputRefs.current[0]?.focus();
        //   }
        // }, 100);
      } else {
        // If SKU doesn't exist, add as new product
        updatedProducts[index] = {
          ...updatedProducts[index],
          sku,
          name: product.name,
          sellingPrice: product.sellingPrice,
          mrpprice: product.mrpprice,
          gstnumber: product.category.gstnumber,
          discountPercentage: product.discountPercentage || 0,
          totalAmount:
            product.sellingPrice * updatedProducts[index].quantitySold,
        };

        const totalSaleAmount = calculateTotalAmount(updatedProducts);
        setSaleDetails((prev) => ({
          ...prev,
          products: updatedProducts,
          totalSaleAmount,
        }));

        // Add new row and focus on SKU input if this is the last row
        if (index === saleDetails.products.length - 1) {
          addProductField(() => {
            setTimeout(() => {
              if (skuInputRefs.current[index + 1]) {
                skuInputRefs.current[index + 1]?.focus();
              }
            }, 100);
          });
        }
      }
    } else {
      updatedProducts[index] = {
        ...updatedProducts[index],
        sku,
        name: "",
        sellingPrice: 0,
        totalAmount: 0,
        mrpprice: 0,
        gstnumber: 0,
      };

      const totalSaleAmount = calculateTotalAmount(updatedProducts);
      setSaleDetails((prev) => ({
        ...prev,
        products: updatedProducts,
        totalSaleAmount,
      }));
    }
  };

  const handleNameChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const name = e.target.value;
    const updatedProducts = [...saleDetails.products];
    const product = products.find((p) => p.name === name);

    if (product) {
      // Check if this product name already exists in the products array
      const existingProductIndex = saleDetails.products.findIndex(
        (p, i) => i !== index && p.name === name
      );

      if (existingProductIndex !== -1) {
        // If product exists, increment quantity instead of adding new row
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          quantitySold: updatedProducts[existingProductIndex].quantitySold + 1,
          totalAmount:
            (updatedProducts[existingProductIndex].quantitySold + 1) *
            updatedProducts[existingProductIndex].sellingPrice,
        };

        // Clear the current input row if it's not the only row
        if (saleDetails.products.length > 1) {
          updatedProducts.splice(index, 1);
        } else {
          // If it's the only row, just clear it
          updatedProducts[index] = {
            sku: "",
            quantitySold: 1,
            name: "",
            sellingPrice: 0,
            totalAmount: 0,
            gstnumber: 0,
            mrpprice: 0,
          };
        }

        const totalSaleAmount = calculateTotalAmount(updatedProducts);
        setSaleDetails((prev) => ({
          ...prev,
          products: updatedProducts,
          totalSaleAmount,
        }));

        // Focus back on the input
        setTimeout(() => {
          if (nameInputRefs.current[0]) {
            nameInputRefs.current[0]?.focus();
          }
        }, 100);
      } else {
        // If product doesn't exist, add as new product
        updatedProducts[index] = {
          ...updatedProducts[index],
          name,
          sku: product.sku,
          sellingPrice: product.sellingPrice,
          mrpprice: product.mrpprice,
          gstnumber: product.category.gstnumber,
          discountPercentage: product.discountPercentage || 0,
          totalAmount:
            product.sellingPrice * updatedProducts[index].quantitySold,
        };

        const totalSaleAmount = calculateTotalAmount(updatedProducts);
        setSaleDetails((prev) => ({
          ...prev,
          products: updatedProducts,
          totalSaleAmount,
        }));

        // Add new row and focus on name input if this is the last row
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
      };

      const totalSaleAmount = calculateTotalAmount(updatedProducts);
      setSaleDetails((prev) => ({
        ...prev,
        products: updatedProducts,
        totalSaleAmount,
      }));
    }
  };

  const handleQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const quantity = parseInt(e.target.value) || 0;
    const updatedProducts = [...saleDetails.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      quantitySold: quantity,
      totalAmount: quantity * updatedProducts[index].sellingPrice,
    };

    const totalSaleAmount = calculateTotalAmount(updatedProducts);
    setSaleDetails((prev) => ({
      ...prev,
      products: updatedProducts,
      totalSaleAmount,
    }));
  };

  const removeProductField = (index: number) => {
    if (saleDetails.products.length > 1) {
      const updatedProducts = saleDetails.products.filter(
        (_, i) => i !== index
      );
      const totalSaleAmount = calculateTotalAmount(updatedProducts);
      setSaleDetails((prev) => ({
        ...prev,
        products: updatedProducts,
        totalSaleAmount,
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSaleDetails((prev) => ({
      ...prev,
      [name]: value,
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

      const { customerContact, ...restDetails } = {
        ...saleDetails,
        salesDetails: saleDetails.products.filter((i) => i.name),
      };
      const saleData = {
        ...restDetails,
        ...(customerContact ? { customerContact } : {}),
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
          },
        ],
        paymentMethod: "",
        customerName: "",
        customerContact: "",
        totalSaleAmount: 0,
      });
      setStep(1);
      toast.success("Sale recorded successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to record the sale"
      );
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

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              1
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 2 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              2
            </div>
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
                          ref={(el) => (skuInputRefs.current[index] = el)}
                          value={product.sku}
                          onChange={(e) => handleSkuChange(e, index)}
                          className="w-full border rounded px-2 py-1"
                          placeholder="Enter SKU"
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
                      <td className="px-4 py-2 border-b">
                        ₹{product.sellingPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <input
                          type="number"
                          value={product.quantitySold}
                          onChange={(e) => handleQuantityChange(e, index)}
                          min="1"
                          className="w-20 border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-2 border-b">
                        ₹{product.totalAmount.toFixed(2)}
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
                    <td colSpan={4} className="px-4 py-2 text-right font-bold">
                      Grand Total:
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
                disabled={
                  !saleDetails.products.some((p) => p.sku && p.quantitySold > 0)
                }
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
              >
                <option value="">Select Payment Method</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

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
                {isSubmitting
                  ? "Processing..."
                  : "Complete Sale & Print Receipt"}
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
