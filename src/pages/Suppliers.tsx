import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import SupplierService from '../services/Supplier.service'; // Assuming SupplierService is in this path
import { useNavigate } from 'react-router-dom';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  productsSupplied: { productId: string; productName: string }[];
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch suppliers from API
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await SupplierService.getAllSuppliers(); // Make sure this function is implemented in your service
        setSuppliers(data);
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);
  
  const navigate = useNavigate(); // Get the navigate function

  const handleClick = () => {
    navigate('/suppliers/add'); // Navigate to the /suppliers/add route
  };

  const handleEdit = (supplier: Supplier) => {
    navigate(`/suppliers/update/${supplier._id}`, { state: { supplier } }); // Pass data via state
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Suppliers</h1>
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={handleClick} // Handle click event
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Supplier
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
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.map((supplier, index) => (
                <tr key={supplier.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.contactPerson}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.phone}</td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(supplier)} // Pass supplier data to the edit page
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
