

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import PurchaseService from '../services/Purchase.service';
import SupplierService from '../services/Supplier.service';
import ProductService from '../services/Product.service';
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
  const [formData, setFormData] = useState({
    productId: '',
    supplierId: '',
    quantity: 0,
    pricePerUnit: 0,
    totalCost: 0,
  });
 const [suppliers, setSuppliers] = useState<
    { id: string; name: string; email: string }[]
  >([]);
  const [products, setProducts] = useState<
  { id: string; name: string;  }[]
>([]);

const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch prodcuts:", error);
      }
    };

   

    fetchProducts();
   
  }, []);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await SupplierService.getAllSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error("Failed to fetch suppliers:", error);
      }
    };

   

    fetchProducts();
   
  }, []);


  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await PurchaseService.getAllPurchases();
        setPurchases(data);
      } catch (error) {
        console.error('Failed to fetch purchases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Update form data
    const updatedFormData = {
      ...formData,
      [name]: name === 'quantity' || name === 'pricePerUnit' ? parseFloat(value) : value,
    };

    // Calculate total cost when quantity or pricePerUnit changes
    if (name === 'quantity' || name === 'pricePerUnit') {
      updatedFormData.totalCost = updatedFormData.quantity * updatedFormData.pricePerUnit;
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPurchase = await PurchaseService.addPurchase(formData);
      setPurchases([...purchases, newPurchase]);
      setIsModalOpen(false); // Close modal on success
      navigate("/purchases");
    } catch (error) {
      console.error('Failed to add purchase:', error);
    }
  };
  const handleNavigateProduct = () => {
    navigate('/addproduct');
  };
  const handleNavigateSuppliers = () => {
    navigate('/suppliers/add');
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
                  S.NO:
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
              {purchases?.map((purchase, index) => (
                <tr key={purchase._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index+1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase?.supplierId?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase?.productId?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase?.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{purchase?.totalCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(purchase?.purchaseDate).toLocaleString()}
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
            <h2 className="text-lg font-medium text-gray-900 mb-4">New Purchase Order</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                  Product
                </label>
                <select
  name="productId"
  id="productId"
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


<button className='border-2 border-blue-400 hover:border-blue-500 text-slate-600 text-sm mt-1 font-sans py-1 px-2 rounded hover:scale-105' onClick={handleNavigateProduct}>Add Product</button>

              </div>

              <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                  Supplier
                </label>
                <select
  name="supplierId"
  id="supplierId"
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
<button className=' border-2 border-blue-400 hover:border-blue-500 text-slate-600 text-sm mt-1 font-sans py-1 px-2 rounded hover:scale-105' onClick={ handleNavigateSuppliers}>Add Suppliers</button>
              </div>

             

              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700">
                  Price Per Unit
                </label>
                <input
                  type="number"
                  name="pricePerUnit"
                  id="pricePerUnit"
                  value={formData.pricePerUnit}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="totalCost" className="block text-sm font-medium text-gray-700">
                  Total Cost
                </label>
                <input
                  type="number"
                  name="totalCost"
                  id="totalCost"
                  value={formData.totalCost}
                  readOnly
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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