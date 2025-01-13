import React, { useState, useEffect, useRef } from "react";
import { Plus, MoreVertical } from "lucide-react";
import ProductService from "../services/Product.service";
import { useNavigate } from "react-router-dom";
import Barcode from "react-barcode";
import { getAllCategories } from "../services/Category.service";
import { useReactToPrint } from "react-to-print";
import SupplierService from "../services/Supplier.service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export interface Category {
  id: string;
  name: string;
  description: string;
  gstnumber: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactInfo?: string; // Add fields based on your Supplier schema
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category; // Updated to hold populated category details
  mrpprice: number;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  supplier: Supplier; // Updated to hold populated supplier details
  sku: string;
  barcode?: string;
  manufacturingDate: string;
  expiryDate?: string;
  weight: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const printRef = useRef(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const navigate = useNavigate();

 
  useEffect(() => {
    const fetchAllSuppliers = async () => {
      try {
        const data = await SupplierService.getAllSuppliers();
        setSuppliers(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllSuppliers();
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getAllProducts();
        setProducts(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle delete product
  const handleDeleteProduct = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    
    if (!confirmDelete) {
      return; // If user cancels, do nothing
    }
  
    try {
      console.log("Attempting to delete product with ID:", id);
  
      // Call the API to delete the product
      const response = await ProductService.deleteProduct(id);
  
      // Check if the response contains the success message
      if (response.message === 'Product deleted successfully') {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id)
        );
        setActiveDropdown(null); // Close dropdown after delete
        toast.success("Product deleted successfully");
        console.log("Product deleted successfully");
      } else {
        console.error("Failed to delete product, response:", response);
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Error occurred while deleting product");
    }
  };
  
  
  
  // Handle save product
  const handleSaveProduct = async () => {
    if (!editingProduct || !updatedProduct) return;
  
    try {
      // Call the update service
      await ProductService.updateProduct(editingProduct._id, updatedProduct);
  
      // Update the product list in state
      const updatedProducts = products.map((product) =>
        product._id === editingProduct._id
          ? { ...product, ...updatedProduct }
          : product
      );
      setProducts(updatedProducts);
  
      // Show success toast
      toast.success("Product updated successfully!");
  
      // Close the modal and reset state
      setIsModalOpen(false);
      setEditingProduct(null);
      setUpdatedProduct(null);
    } catch (error) {
      console.error("Failed to update product:", error);
  
      // Show error toast
      toast.error("Failed to update product. Please try again.");
    }
  };
  
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => navigate("/addproduct")}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.NO:
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products?.map((product, index) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {index + 1}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {product?.category?.name || "category not found"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product?.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ₹{product?.sellingPrice}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product?.quantity > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="relative">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === product._id ? null : product._id
                          )
                        }
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      {activeDropdown === product._id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
                          <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => {
                              setViewingProduct(product);
                              setIsViewModalOpen(true);
                              setActiveDropdown(null);
                            }}
                          >
                            View
                          </button>
                          <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => {
                              setEditingProduct(product);
                              setUpdatedProduct(product);
                              setIsModalOpen(true);
                              setActiveDropdown(null); // Close dropdown after Edit
                            }}
                          >
                            Edit
                          </button>
                          <button
  className="block px-4 py-2 text-sm text-red-700 hover:bg-red-100 w-full text-left"
  onClick={() => handleDeleteProduct(product._id)}
>
  Delete
</button>


                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && updatedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProduct();
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={updatedProduct.name}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      name: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mt-1 block w-full">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={updatedProduct.category} // Initially shows the product's category
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      category: e.target.value,
                    })
                  } // Update state with selected category ID
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                  required
                >
                  {/* Display product's current category name as the first option */}
                  <option value={updatedProduct.category} disabled>
                    {categories.find(
                      (category) => category._id === updatedProduct.category
                    )?.name || "Select a category"}
                  </option>

                  {/* Render all available categories */}
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-1 block w-full">
  <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
    Suppliers
  </label>
  <select
    id="supplier"
    value={updatedProduct.supplier} // Correcting the field name to singular
    onChange={(e) =>
      setUpdatedProduct({
        ...updatedProduct,
        supplier: e.target.value, // Setting the supplier ID
      })
    }
    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
    required
  >
    <option value={updatedProduct.supplier} disabled>
      {suppliers.find((supplier) => supplier._id === updatedProduct.supplier)?.name || "Select a supplier"}
    </option>

    {suppliers.map((supplier) => (
      <option key={supplier._id} value={supplier._id}> {/* Set value to supplier's _id */}
        {supplier.name}
      </option>
    ))}
  </select>
</div>


              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="text"
                  value={updatedProduct.quantity}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      quantity: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  value={updatedProduct.sellingPrice}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      sellingPrice: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                    setUpdatedProduct(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewModalOpen && viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <p>
              <strong>Name:</strong> {viewingProduct.name}
            </p>
            <p>
              <strong>Description:</strong> {viewingProduct.description}
            </p>
            <p>
              <strong>Category:</strong>{" "}
              {
                categories.find(
                  (category) => category._id === viewingProduct.category
                )?.name
              }
            </p>
            <p>
              <strong>Price:</strong> ₹{viewingProduct.sellingPrice}
            </p>
            <p>
              <strong>Quantity:</strong> {viewingProduct.quantity}
            </p>
            <button
              className="float-right text-xs bg-gray-600 text-white px-2 py-1 rounded-md"
              onClick={handlePrint}
            >
              Print
            </button>
            <div ref={printRef}>
              <Barcode value={viewingProduct.sku} />
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
