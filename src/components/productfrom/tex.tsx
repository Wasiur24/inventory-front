import React, { useState, useEffect, useRef } from "react";
import SalesService, { SaleProduct } from "../../services/Sales.service";
import { Printer, Plus, Trash2, ArrowRight } from 'lucide-react';

interface ProductDetails {
  sku: string;
  quantitySold: number;
  name?: string;
  sellingPrice?: number;
  totalAmount?: number;
}

const Selladd: React.FC = () => {
  const [step, setStep] = useState(1);
  const [saleDetails, setSaleDetails] = useState({
    products: [{ sku: "", quantitySold: 1 }] as ProductDetails[],
    paymentMethod: "",
    customerName: "",
    customerContact: "",
  });

  const [isScanning, setIsScanning] = useState(false);
  const [scanBuffer, setScanBuffer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skuInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only process if not in an input field
      if (!(e.target instanceof HTMLInputElement)) {
        if (!isScanning) {
          setIsScanning(true);
          setScanBuffer("");
        }

        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current);
        }

        if (e.key.length === 1 || e.key === "Enter") {
          setScanBuffer(prev => prev + e.key);
        }

        scanTimeoutRef.current = setTimeout(() => {
          if (scanBuffer) {
            processScanComplete(scanBuffer.replace("Enter", ""));
          }
          setIsScanning(false);
          setScanBuffer("");
        }, 100);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, [isScanning, scanBuffer]);

  const fetchProductDetails = async (sku: string) => {
    try {
      const response = await fetch(/api/products/sku/${sku});
      const data = await response.json();
      return {
        name: data.name,
        sellingPrice: data.sellingPrice,
      };
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  };

  const processScanComplete = async (scannedSku: string) => {
    const productDetails = await fetchProductDetails(scannedSku);
    if (!productDetails) {
      alert('Product not found!');
      return;
    }

    // Check if the product already exists
    const existingIndex = saleDetails.products.findIndex(p => p.sku === scannedSku);
    
    if (existingIndex >= 0) {
      // Update existing product quantity
      updateProductInList(scannedSku, 1, productDetails);
    } else {
      // Add new product
      const updatedProducts = [...saleDetails.products];
      
      // If the last product is empty, use that slot
      if (!updatedProducts[updatedProducts.length - 1].sku) {
        updatedProducts[updatedProducts.length - 1] = {
          sku: scannedSku,
          quantitySold: 1,
          name: productDetails.name,
          sellingPrice: productDetails.sellingPrice,
          totalAmount: productDetails.sellingPrice,
        };
      } else {
        // Add a new product row
        updatedProducts.push({
          sku: scannedSku,
          quantitySold: 1,
          name: productDetails.name,
          sellingPrice: productDetails.sellingPrice,
          totalAmount: productDetails.sellingPrice,
        });
      }

      // Add a new empty row for the next scan/entry
      updatedProducts.push({ sku: "", quantitySold: 1 });
      
      setSaleDetails(prev => ({
        ...prev,
        products: updatedProducts,
      }));

      calculateTotal(updatedProducts);
    }
  };

  const updateProductInList = (sku: string, quantity: number, productDetails: any) => {
    const updatedProducts = [...saleDetails.products];
    const existingProductIndex = updatedProducts.findIndex(p => p.sku === sku);

    if (existingProductIndex >= 0) {
      const newQuantity = updatedProducts[existingProductIndex].quantitySold + quantity;
      updatedProducts[existingProductIndex] = {
        ...updatedProducts[existingProductIndex],
        quantitySold: newQuantity,
        totalAmount: newQuantity * (productDetails.sellingPrice || 0),
      };
    }

    setSaleDetails(prev => ({
      ...prev,
      products: updatedProducts,
    }));

    calculateTotal(updatedProducts);
  };

  const calculateTotal = (products: ProductDetails[]) => {
    const total = products.reduce((sum, product) => sum + (product.totalAmount || 0), 0);
    setTotalAmount(total);
  };

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
    field?: "products"
  ) => {
    const { name, value } = e.target;
    
    if (field === "products" && index !== undefined) {
      const updatedProducts = [...saleDetails.products];
      
      if (name === "sku") {
        if (value === updatedProducts[index].sku) return;
        
        const productDetails = await fetchProductDetails(value);
        if (productDetails) {
          updatedProducts[index] = {
            ...updatedProducts[index],
            sku: value,
            name: productDetails.name,
            sellingPrice: productDetails.sellingPrice,
            totalAmount: productDetails.sellingPrice * updatedProducts[index].quantitySold,
          };

          // Add new empty row if this is the last row
          if (index === updatedProducts.length - 1) {
            updatedProducts.push({ sku: "", quantitySold: 1 });
          }
        }
      } else if (name === "quantitySold") {
        const quantity = parseInt(value) || 1;
        updatedProducts[index] = {
          ...updatedProducts[index],
          quantitySold: quantity,
          totalAmount: quantity * (updatedProducts[index].sellingPrice || 0),
        };
      }
      
      setSaleDetails({ ...saleDetails, products: updatedProducts });
      calculateTotal(updatedProducts);
    } else {
      setSaleDetails({ ...saleDetails, [name]: value });
    }
  };


  const handleSkuBlur = async (index: number) => {
    const product = saleDetails.products[index];
    if (product.sku && !product.name) {
      const productDetails = await fetchProductDetails(product.sku);
      if (productDetails) {
        const updatedProducts = [...saleDetails.products];
        updatedProducts[index] = {
          ...updatedProducts[index],
          name: productDetails.name,
          sellingPrice: productDetails.sellingPrice,
          totalAmount: productDetails.sellingPrice * updatedProducts[index].quantitySold,
        };

        // Add new empty row if this is the last row
        if (index === updatedProducts.length - 1) {
          updatedProducts.push({ sku: "", quantitySold: 1 });
        }

        setSaleDetails({ ...saleDetails, products: updatedProducts });
        calculateTotal(updatedProducts);
      }
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
      calculateTotal(updatedProducts);
    }
  };

  // ... Rest of the code remains the same (handleContinue, handleSubmit, and the JSX) ...

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sell Products</h1>
      
      {step === 1 ? (
        <>
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {isScanning ? 'Scanning...' : 'Ready to scan or enter SKU manually'}
            </div>
            <div className="text-xl font-bold">
              Total: ₹{totalAmount.toFixed(2)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {saleDetails.products.map((product, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        id={sku-${index}}
                        name="sku"
                        ref={index === saleDetails.products.length - 1 ? skuInputRef : null}
                        value={product.sku}
                        onChange={(e) => handleInputChange(e, index, "products")}
                        onBlur={() => handleSkuBlur(index)}
                        className="border border-gray-300 rounded-md p-2"
                        placeholder="Enter or scan SKU"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{product.sellingPrice?.toFixed(2) || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="quantitySold"
                        value={product.quantitySold}
                        onChange={(e) => handleInputChange(e, index, "products")}
                        className="border border-gray-300 rounded-md p-2 w-20"
                        min="1"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{product.totalAmount?.toFixed(2) || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {saleDetails.products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProductField(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rest of the JSX remains the same */}
        </>
      ) : (
        // Step 2 form remains the same
      )}
    </div>
  );
};

export default Selladd;