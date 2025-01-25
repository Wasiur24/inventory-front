import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SupplierService from '../services/Supplier.service';

export default function UpdateSupplier() {
    const navigate = useNavigate();
    const location = useLocation();
    const { supplier } = location.state || {}; // Get the supplier data passed from the previous page

    const [updatedSupplier, setUpdatedSupplier] = useState(supplier || {
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
    });

    const [isEditing, setIsEditing] = useState(false); // State to toggle edit/view mode

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUpdatedSupplier({ ...updatedSupplier, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await SupplierService.updateSupplier(updatedSupplier._id, updatedSupplier); // Update the supplier
            navigate('/suppliers'); // Redirect back to the suppliers list
        } catch (error) {
            console.error('Failed to update supplier:', error);
        }
    };

    const handleDelete = async () => {
        // Confirm the deletion action
        const isConfirmed = window.confirm('Are you sure you want to delete this supplier?');
        if (isConfirmed) {
            try {
                await SupplierService.deleteSupplier(updatedSupplier._id); // Call delete service
                navigate('/suppliers'); // Redirect back to suppliers list after deletion
            } catch (error) {
                console.error('Failed to delete supplier:', error);
            }
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Update Supplier</h1>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder='Company Name'
                      value={updatedSupplier.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={updatedSupplier.contactPerson}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={updatedSupplier.email.toLowerCase()}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={updatedSupplier.phone}
                      onChange={handleChange}
                      maxLength={10}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={updatedSupplier.address}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={updatedSupplier.city}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      name="state"
                      value={updatedSupplier.state}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={updatedSupplier.pincode}
                      maxLength={6}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={updatedSupplier.country}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                </div>
              
                <div className="mt-6 flex justify-between">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </form>
              
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Name</td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{updatedSupplier.name}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Contact Person</td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{updatedSupplier.contactPerson}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Email</td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{updatedSupplier.email}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Phone</td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{updatedSupplier.phone}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Address</td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{updatedSupplier.address}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">City</td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{updatedSupplier.city}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">State</td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{updatedSupplier.state}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Pincode</td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{updatedSupplier.pincode}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Country</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{updatedSupplier.country}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div
                        className='flex '>
                        <button
                            type="button"
                            className="mt-6 mr-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            onClick={() => setIsEditing(true)} // Toggle to edit mode
                        >
                            Edit Supplier
                        </button>
                        <button
                            type="button"
                            className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            onClick={handleDelete} // Handle delete action
                        >
                            Delete
                        </button>
                    </div>


                </div>

            )}
        </div>
    );
}
