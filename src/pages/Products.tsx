import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical } from 'lucide-react';
import ProductService from '../services/Product.service';
import { useNavigate } from 'react-router-dom';
import {
  getAllCategories,
 
} from '../services/Category.service';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  supplier: string;
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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
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
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle delete product
  const handleDeleteProduct = async (id: string) => {
    try {
      console.log('Attempting to delete product with ID:', id);
      await ProductService.deleteProduct(id);
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
      setActiveDropdown(null); // Close dropdown after delete
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };


  
  // Handle save product
  const handleSaveProduct = async () => {
    if (!editingProduct || !updatedProduct) return;

    try {
      await ProductService.updateProduct(editingProduct._id, updatedProduct);
      const updatedProducts = products.map((product) =>
        product._id === editingProduct._id ? { ...product, ...updatedProduct } : product
      );
      setProducts(updatedProducts);
      setIsModalOpen(false);
      setEditingProduct(null);
      setUpdatedProduct(null);
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => navigate('/addproduct')}
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
              {products.map((product, index) => (
                console.log(product,"dsksdkdkfjkjfkljkljfjlk"),
                <tr key={product._id}>
                   <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{index+1}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">

                

                    <div className="text-sm text-gray-500">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{product.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="relative">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() =>
                          setActiveDropdown(activeDropdown === product._id ? null : product._id)
                        }
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      {activeDropdown === product._id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
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
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={updatedProduct.name}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, name: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={updatedProduct.category}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, category: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="text"
                  value={updatedProduct.quantity}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, quantity: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>


              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  value={updatedProduct.price}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, price: Number(e.target.value) })
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
    </div>
  );
}
