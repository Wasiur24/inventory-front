

import React, { useState, useEffect, useRef } from "react";
import { Plus, MoreVertical, Search, Filter, X } from "lucide-react";
import ProductService from "../services/Product.service";
import { useNavigate } from "react-router-dom";
import Barcode from "react-barcode";
import { getAllCategories } from "../services/Category.service";
import { useReactToPrint } from "react-to-print";
import SupplierService from "../services/Supplier.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface Category {
  _id: string;
  name: string;
  description: string;
  gstnumber: number;
}

export interface Supplier {
  _id: string;
  name: string;
  contactInfo?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: Category;
  mrpprice: number;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  supplier: Supplier;
  sku: string;
  barcode?: string;
  manufacturingDate: string;
  expiryDate?: string;
  weight: number;
  discountPercentage?: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const itemsPerPage = 10;
  const printRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const data = await SupplierService.getAllSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error("Failed to fetch suppliers:", error);
      }
    };

    fetchCategories();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await ProductService.getAllProductsCategory();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter(
        product =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    

    if (selectedCategory) {
      console.log(selectedCategory, "selectedCategory");
      
      result = result.filter(product => product.category?.name == selectedCategory);
      console.log(result, "result");
    }

    if (selectedStatus) {
      switch (selectedStatus) {
        case 'inStock':
          result = result.filter(product => product.quantity > 5);
          break;
        case 'nearlyOutOfStock':
          result = result.filter(product => product.quantity > 0 && product.quantity <= 5);
          break;
        case 'outOfStock':
          result = result.filter(product => product.quantity === 0);
          break;
      }
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus, products]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDeleteProduct = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const response = await ProductService.deleteProduct(id);
      if (response.message === "Product deleted successfully") {
        setProducts(prevProducts => prevProducts.filter(product => product._id !== id));
        setActiveDropdown(null);
        toast.success("Product deleted successfully");
        fetchProducts();
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Error occurred while deleting product");
    }
  };

  const handleSaveProduct = async () => {
    if (!editingProduct || !updatedProduct) return;

    try {
      await ProductService.updateProduct(editingProduct._id, updatedProduct);
      toast.success("Product updated successfully!");
      setIsModalOpen(false);
      setEditingProduct(null);
      setUpdatedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Failed to update product. Please try again.");
    }
  };

  // const handlePrint = useReactToPrint({
  //   content: () => printRef.current,
  //   onAfterPrint: () => {
  //     setIsViewModalOpen(false);
  //   },
  // });
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onAfterPrint: () => {
      setIsViewModalOpen(false);
    },
  });

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedStatus("");
    setSearchTerm("");
  };

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

      <div className="mb-6 flex items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="relative ml-4">
          <button
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>

          {isFilterDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-20 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Filters</h3>
                <button
                  onClick={() => setIsFilterDropdownOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">All Status</option>
                  <option value="inStock">In Stock</option>
                  <option value="nearlyOutOfStock">Nearly Out of Stock</option>
                  <option value="outOfStock">Out of Stock</option>
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                {currentItems.map((product, index) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {product.category?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{product.sellingPrice}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.quantity > 5
                            ? "bg-green-100 text-green-800"
                            : product.quantity > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.quantity > 5
                          ? "In Stock"
                          : product.quantity > 0
                          ? "Low Stock"
                          : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="relative ">
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
                        //  <div className="absolute right-[11vh] top-[-1vh] mt-2  w-50  flex flex-row bg-white rounded-md shadow-lg z-[999999999999]">
                        <div className="absolute right-[11vh] top-[-1vh] mt-2 w-50 flex flex-row bg-white rounded-md shadow-lg z-[999999999999] 
  border-4 border-transparent bg-clip-padding 
  hover:border-gradient-to-r hover:from-blue-500 hover:via-green-500 hover:to-red-500 transition-all duration-300">
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
                                setActiveDropdown(null);
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

          <div className="flex justify-between items-center mt-4 px-4">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredProducts.length)} of{" "}
              {filteredProducts.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Previous
              </button>
              {/* {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))} */}
              <button
  onClick={() => paginate(currentPage)}
  className="px-3 py-1 rounded bg-blue-600 text-white"
>
  {currentPage}
</button>
<input
  type="number"
  min="1"
  max={totalPages}
  value={currentPage}
  onChange={(e) => {
    const pageNumber = Math.min(Math.max(1, Number(e.target.value)), totalPages); // Ensure within range
    paginate(pageNumber);
  }}
  className="px-3 py-1 rounded border border-gray-300 text-center w-16"
/>



              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}


      {isModalOpen && updatedProduct && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Product</h2>
        <button
          onClick={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
            setUpdatedProduct(null);
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const payload = {
            ...updatedProduct,
            category: updatedProduct.category && updatedProduct.category._id 
                ? String(updatedProduct.category._id) 
                : null,
            supplier: updatedProduct.supplier && updatedProduct.supplier._id 
                ? String(updatedProduct.supplier._id) 
                : null,
        };
        

          handleSaveProduct(payload);
        }}
      >
        <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={updatedProduct.name}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    name: e.target.value,
                  })
                }
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={updatedProduct.category?._id || ''}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    category: { ...updatedProduct.category, _id: e.target.value },
                  })
                }
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Supplier</label>
              <select
                value={updatedProduct.supplier?._id || ''}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    supplier: { ...updatedProduct.supplier, _id: e.target.value },
                  })
                }
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                
              >
                <option value="" disabled>
                  Select a supplier
                </option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div> */}
            <div>
  <label className="block text-sm font-medium text-gray-700">Category</label>
  <select
    value={updatedProduct.category?._id || ''}
    onChange={(e) =>
      setUpdatedProduct({
        ...updatedProduct,
        category: categories.find(cat => cat._id === e.target.value) || {},
      })
    }
    className="mt-1 block w-full border rounded-md shadow-sm p-2"
  >
    <option value="" disabled>
      Select a category
    </option>
    {categories.map((category) => (
      <option key={category._id} value={category._id}>
        {category.name}
      </option>
    ))}
  </select>
</div>

<div>
  <label className="block text-sm font-medium text-gray-700">Supplier</label>
  <select
    value={updatedProduct.supplier?._id || updatedProduct.supplier || ''}
    onChange={(e) =>
      setUpdatedProduct({
        ...updatedProduct,
        supplier: suppliers.find(sup => sup._id === e.target.value) || {},
      })
    }
    className="mt-1 block w-full border rounded-md shadow-sm p-2"
  >
    <option value="" disabled>
      Select a supplier
    </option>
    {suppliers.map((supplier) => (
      <option key={supplier._id} value={supplier._id}>
        {supplier.name}
      </option>
    ))}
  </select>
</div>

          </div>
          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                value={updatedProduct.quantity}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    quantity: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
             
              <input
  type="number"
  min={0}
  max={100}
  step="0.01" // Allows decimal values
  value={updatedProduct.discountPercentage || 0}
  onChange={(e) => {
    const discount = parseFloat(e.target.value) || 0; // Handle NaN cases
    const newSellingPrice =
      updatedProduct.mrpprice - (updatedProduct.mrpprice * discount) / 100;
    setUpdatedProduct({
      ...updatedProduct,
      discountPercentage: discount,
      sellingPrice: newSellingPrice.toFixed(2),
    });
  }}
  className="border border-gray-300 rounded-md p-2 w-full"
  required
/>

              {editingProduct?.discountPercentage !== undefined && (
                <p className="text-sm text-gray-500">Previous: {editingProduct.discountPercentage}%</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Selling Price</label>
              <input
                type="number"
                value={updatedProduct.sellingPrice || 0}
                className="border border-gray-300 rounded-md p-2 w-full"
                required
                disabled
              />
              {editingProduct?.sellingPrice !== undefined && (
                <p className="text-sm text-gray-500">Previous: {editingProduct.sellingPrice}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">MRP Price</label>
              <input
                type="number"
                value={updatedProduct.mrpprice}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    mrpprice: parseFloat(e.target.value),
                  })
                }
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
              <input
                type="number"
                value={updatedProduct.purchasePrice}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    purchasePrice: parseFloat(e.target.value),
                  })
                }
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(false);
              setEditingProduct(null);
              setUpdatedProduct(null);
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}





      {/* View Modal */}
      {isViewModalOpen && viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Product Details</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Print
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{viewingProduct.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {viewingProduct.category?.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {viewingProduct.quantity}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                  Discount Percentage
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {viewingProduct.discountPercentage}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Selling Price
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    ₹{viewingProduct.sellingPrice}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    MRP Price
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    ₹{viewingProduct.mrpprice}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Purchase Price
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    ₹{viewingProduct.purchasePrice}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Supplier
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {viewingProduct.supplier?.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{viewingProduct.sku}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barcode
                </label>
                <div ref={printRef}  className="flex justify-center bg-white p-4">
                  <Barcode value={viewingProduct.sku} />
                  <h1 className="text-white py-2">jgjg</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}