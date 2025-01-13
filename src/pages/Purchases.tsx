import React, { useState, useEffect, useRef } from 'react';
import { Plus, MoreVertical } from 'lucide-react';
import Barcode from 'react-barcode';
import PurchaseService from '../services/Purchase.service';
import SupplierService from '../services/Supplier.service';
import ProductService from '../services/Product.service';
import { useNavigate } from "react-router-dom";

interface Purchase {
  _id: string;
  productId: {
    _id: string;
    name: string;
    sku: string;
  };
  supplierId: {
    _id: string;
    name: string;
    email: string;
  };
  quantity: number;
  pricePerUnit: number;
  totalCost: number;
  purchaseDate: string;
}

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [formData, setFormData] = useState({
    productId: '',
    supplierId: '',
    quantity: 0,
    pricePerUnit: 0,
    totalCost: 0,
  });
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPurchase, setViewingPurchase] = useState<Purchase | null>(null);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, suppliersData, purchasesData] = await Promise.all([
          ProductService.getAllProducts(),
          SupplierService.getAllSuppliers(),
          PurchaseService.getAllPurchases(),
        ]);
        setProducts(productsData);
        setSuppliers(suppliersData);
        setPurchases(purchasesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeletePurchase = async (id: string) => {
    try {
      const response = await PurchaseService.deletePurchase(id);
      if (response.status === 200) {
        setPurchases((prevPurchases) =>
          prevPurchases.filter((purchase) => purchase._id !== id)
        );
        setActiveDropdown(null);
      }
    } catch (error) {
      console.error("Failed to delete purchase:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === 'quantity' || name === 'pricePerUnit' ? parseFloat(value) || 0 : value;

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: parsedValue,
      };
      if (name === 'quantity' || name === 'pricePerUnit') {
        updatedData.totalCost = updatedData.quantity * updatedData.pricePerUnit;
      }
      return updatedData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPurchase) {
        const updatedPurchase = await PurchaseService.updatePurchase(editingPurchase._id, formData);
        setPurchases((prevPurchases) =>
          prevPurchases.map((purchase) =>
            purchase._id === editingPurchase._id ? updatedPurchase : purchase
          )
        );
      } else {
        const newPurchase = await PurchaseService.addPurchase(formData);
        setPurchases((prevPurchases) => [...prevPurchases, newPurchase]);
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save purchase:', error);
    }
  };

  const openEditModal = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setFormData({
      productId: purchase.productId._id,
      supplierId: purchase.supplierId._id,
      quantity: purchase.quantity,
      pricePerUnit: purchase.pricePerUnit,
      totalCost: purchase.totalCost,
    });
    setIsModalOpen(true);
  };

  const openNewPurchaseModal = () => {
    setEditingPurchase(null);
    setFormData({
      productId: '',
      supplierId: '',
      quantity: 0,
      pricePerUnit: 0,
      totalCost: 0,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPurchase(null);
    setFormData({
      productId: '',
      supplierId: '',
      quantity: 0,
      pricePerUnit: 0,
      totalCost: 0,
    });
  };

  const handleNavigateProduct = () => {
    navigate('/products');
  };

  const handleNavigateSuppliers = () => {
    navigate('/suppliers');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Purchase Orders</h1>
        <button
          onClick={openNewPurchaseModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Purchase Order
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
                  S.NO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {purchases.map((purchase, index) => (
                <tr key={purchase._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase?.supplierId?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase?.productId?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase?.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{purchase?.totalCost?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(purchase?.purchaseDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="relative">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setActiveDropdown(activeDropdown === purchase._id ? null : purchase._id)}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      {activeDropdown === purchase._id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
                          <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => {
                              setViewingPurchase(purchase);
                              setIsViewModalOpen(true);
                            }}
                          >
                            View
                          </button>
                          <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => openEditModal(purchase)}
                          >
                            Edit
                          </button>
                          <button
                            className="block px-4 py-2 text-sm text-red-700 hover:bg-red-100 w-full text-left"
                            onClick={() => handleDeletePurchase(purchase._id)}
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingPurchase ? 'Edit Purchase Order' : 'New Purchase Order'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Product</label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleNavigateProduct}
                  className="border-2 border-blue-400 hover:border-blue-500 text-slate-600 text-sm mt-1 font-sans py-1 px-2 rounded hover:scale-105"
                >
                  Add Product
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Supplier</label>
                <select
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleNavigateSuppliers}
                  className="border-2 border-blue-400 hover:border-blue-500 text-slate-600 text-sm mt-1 font-sans py-1 px-2 rounded hover:scale-105"
                >
                  Add Supplier
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Price per Unit</label>
                <input
                  type="number"
                  name="pricePerUnit"
                  value={formData.pricePerUnit}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Total Cost</label>
                <input
                  type="number"
                  name="totalCost"
                  value={formData.totalCost}
                  readOnly
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 mr-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingPurchase ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}