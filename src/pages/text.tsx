import React, { useState, useEffect } from "react";
import { Plus, MoreVertical } from "lucide-react";
import PurchaseService from "../services/Purchase.service";
import SupplierService from "../services/Supplier.service";
import ProductService from "../services/Product.service";
import { useNavigate } from "react-router-dom";

interface Purchase {
  _id: string;
  productId: {
    _id: string;
    name: string;
  };
  supplierId: {
    _id: string;
    name: string;
  };
  quantity: number;
  pricePerUnit: number;
  totalCost: number;
  purchaseDate: string;
}

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<{ _id: string; name: string }[]>([]);
  const [products, setProducts] = useState<{ _id: string; name: string }[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
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

    const fetchPurchases = async () => {
      try {
        const data = await PurchaseService.getAllPurchases();
        setPurchases(data);
      } catch (error) {
        console.error("Failed to fetch purchases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchSuppliers();
    fetchPurchases();
  }, []);

  const handleSavePurchase = async () => {
    if (!editingPurchase) return;

    try {
      await PurchaseService.updatePurchase(editingPurchase._id, editingPurchase);

      setPurchases((prevPurchases) =>
        prevPurchases.map((purchase) =>
          purchase._id === editingPurchase._id ? { ...purchase, ...editingPurchase } : purchase
        )
      );

      setIsModalOpen(false);
      setEditingPurchase(null);
    } catch (error) {
      console.error("Failed to save purchase:", error);
    }
  };

  const handleInputChangeModal = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (editingPurchase) {
      const updatedPurchase = {
        ...editingPurchase,
        [name]: name === "quantity" || name === "pricePerUnit" ? parseFloat(value) : value,
      };

      if (name === "quantity" || name === "pricePerUnit") {
        updatedPurchase.totalCost = updatedPurchase.quantity * updatedPurchase.pricePerUnit;
      }

      setEditingPurchase(updatedPurchase);
    }
  };

  const handleViewDetails = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsDetailsModalOpen(true);
    setActiveDropdown(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Purchase Orders</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Purchase Order
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Purchases</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            ₹{purchases.reduce((total, purchase) => total + purchase.totalCost, 0).toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-gray-500">Last 30 days</p>
        </div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.supplierId.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.productId.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{purchase.totalCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(purchase.purchaseDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative inline-block">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() =>
                          setActiveDropdown(activeDropdown === purchase._id ? null : purchase._id)
                        }
                      >
                        <MoreVertical className="h-5 w-5 ml-5" />
                      </button>
                      {activeDropdown === purchase._id && (
                        <div className="absolute right-0 mt-1 bg-white shadow-md rounded-md z-10 w-32">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              setEditingPurchase(purchase);
                              setIsModalOpen(true);
                              setActiveDropdown(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleViewDetails(purchase)}
                          >
                            View Details
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

      {/* Edit Modal */}
      {isModalOpen && editingPurchase && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Edit Purchase</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSavePurchase(); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Product</label>
                <select
                  name="productId"
                  value={editingPurchase.productId._id}
                  onChange={handleInputChangeModal}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Supplier</label>
                <select
                  name="supplierId"
                  value={editingPurchase.supplierId._id}
                  onChange={handleInputChangeModal}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={editingPurchase.quantity}
                  onChange={handleInputChangeModal}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Price Per Unit</label>
                <input
                  type="number"
                  name="pricePerUnit"
                  value={editingPurchase.pricePerUnit}
                  onChange={handleInputChangeModal}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Total Cost</label>
                <input
                  type="number"
                  name="totalCost"
                  value={editingPurchase.totalCost}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && selectedPurchase && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Purchase Details</h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Product</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedPurchase.productId.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Supplier</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedPurchase.supplierId.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Quantity</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedPurchase.quantity}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Price Per Unit</h3>
                <p className="mt-1 text-sm text-gray-900">₹{selectedPurchase.pricePerUnit.toFixed(2)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Cost</h3>
                <p className="mt-1 text-sm text-gray-900">₹{selectedPurchase.totalCost.toFixed(2)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Purchase Date</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedPurchase.purchaseDate).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}