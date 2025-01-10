import React, { useState, useEffect, useRef } from "react";
import ProductService from "../../services/Product.service";
import { getAllCategories } from "../../services/Category.service";
import SupplierService from "../../services/Supplier.service";
import { Printer, Barcode, PenLine, Plus, Trash2 } from "lucide-react";
import Template from "./Template";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Product = {
  name: string;
  description: string;
  category: string;
  price: number;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  email: string;
  sku: string;
  manufacturingDate: string;
  expiryDate: string;
  weight: number;
};

const AddProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([createEmptyProduct()]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<
    { id: string; name: string; email: string }[]
  >([]);
  const [productsData, setProductsData] = useState<any>([]);
  const templateRef = useRef(null);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const navigate = useNavigate();

  function createEmptyProduct(): Product {
    return {
      name: "",
      description: "",
      category: "",
      price: undefined,
      purchasePrice: undefined,
      sellingPrice: undefined,
      quantity: undefined,
      email: "",
      sku: "",
      manufacturingDate: "",
      expiryDate: "",
      weight: undefined,
    };
  }
  

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await SupplierService.getAllSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error("Failed to fetch suppliers:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.map((category: { name: string }) => category.name));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchSuppliers();
    fetchCategories();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: templateRef,
  });

  const printReceipt = async (products: any) => {
    try {
      // const device = await navigator.usb.requestDevice({
      //   filters: [{ vendorId: 0x0483 }],
      // });

      setProductsData(products);
      // setTimeout(() => {
      if (products.length) {
        setTimeout(() => {
          handlePrint();
        }, 2000);
      }
    } catch (error) {
      console.error("Error printing receipt:", error);
      alert("Failed to print receipt. Please check printer connection.");
    }
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedProducts = [...products];

    updatedProducts[index] = {
      ...updatedProducts[index],
      [name]: name.includes("Date") ? value : parseValue(value, name),
    };

    setProducts(updatedProducts);
  };

  const parseValue = (value: string, name: string): string | number => {
    if (
      // name === "price" ||

      name === "purchasePrice" ||
      name === "sellingPrice" ||
      name === "quantity" ||
      name === "weight"
    ) {
      return parseFloat(value) || 0;
    }
    return value;
  };

  const addProductField = () => {
    setProducts([...products, createEmptyProduct()]);
  };

  const removeProductField = (index: number) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const validateProducts = (): boolean => {
    for (const product of products) {
      if (product.purchasePrice <= 0 || product.sellingPrice <= 0) {
        alert("Price values must be greater than zero.");
        return false;
      }
      if (product.quantity < 0) {
        alert("Quantity cannot be negative.");
        return false;
      }
      if (
        product.manufacturingDate &&
        product.expiryDate &&
        new Date(product.manufacturingDate) >= new Date(product.expiryDate)
      ) {
        alert("Manufacturing date must be earlier than expiry date.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProducts()) return;

    setIsLoading(true);
    try {
      const response = await ProductService.addProduct(products);

      console.log(response.products);

      // printReceipt(response.products);
      printReceipt(
        response.products?.filter((product: any) => {
          const isexisted = products.find((p) => p.name === product.name)?.sku
            ? false
            : true;

          return isexisted;
        })
      );

      toast.success("Products added successfully!", {
        position: "top-right",
        autoClose: 2000, // Closes after 2 seconds
      });

      setProducts([createEmptyProduct()]);

      // Navigate after 2 seconds
      setTimeout(() => {
        navigate("/addproduct");
      }, 2000);
    } catch (error) {
      console.error("Error adding products:", error);

      toast.error("An error occurred while adding products.", {
        position: "top-right",
        autoClose: 3000, // Closes after 3 seconds
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Multiple Products</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {products.map((product, index) => (
          <div key={index} className="border border-gray-300 p-4 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium text-lg">Product {index + 1}</h2>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                SKU (Optional if not have)
              </label>
              <input
                type="text"
                name="sku"
                value={products[index]?.sku || ""}
                onChange={(e) => handleChange(index, e)}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Enter SKU value"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  name="name"
                  value={product.name}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={product.category}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Supplier
                </label>
                <select
                  name="email"
                  value={product.email}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.email}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  name="description"
                  value={product.description}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  name="price"
                  type="number"
                  value={product.price}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Purchase Price
                </label>
                <input
                  name="purchasePrice"
                  type="number"
                  value={product.purchasePrice}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Selling Price
                </label>
                <input
                  name="sellingPrice"
                  type="number"
                  value={product.sellingPrice}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  name="quantity"
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <input
                  name="weight"
                  type="number"
                  value={product.weight}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Manufacturing Date
                </label>
                <input
                  type="date"
                  name="manufacturingDate"
                  value={product.manufacturingDate}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={product.expiryDate}
                  onChange={(e) => handleChange(index, e)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
            </div>

            {products.length > 1 && (
              <button
                type="button"
                onClick={() => removeProductField(index)}
                className="mt-4 text-red-500 hover:text-red-700 flex items-center gap-2"
              >
                <Trash2 size={20} />
                Remove Product
              </button>
            )}
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addProductField}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            <Plus size={20} />
            Add Another Product
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            <Printer size={20} />
            {isLoading ? "Processing..." : "Submit & Print Labels"}
            onClick
          </button>
        </div>
      </form>
      {/* <div className="hidden"> */}
      <Template componentref={templateRef} products={productsData} />
      {/* </div> */}
    </div>
  );
};

export default AddProduct;
