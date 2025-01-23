import React, { useState } from 'react';
import { toast } from 'react-toastify';
import SupplierService from '../../services/Supplier.service';
import { useNavigate } from "react-router-dom";
const AddSupplier: React.FC = () => {
  const [supplierData, setSupplierData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
  });
  
const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSupplierData({ ...supplierData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await SupplierService.addSupplier(supplierData);
      toast.success('Supplier added successfully!');
      setSupplierData({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
      });
      navigate("/suppliers")

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error adding supplier');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Add Supplier</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Company Name"
          value={supplierData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="contactPerson"
          placeholder="Contact Person"
          value={supplierData.contactPerson}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={supplierData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={supplierData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          name="address"
          placeholder="Address"
          value={supplierData.address}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={supplierData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={supplierData.state}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={supplierData.pincode}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={supplierData.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Supplier
        </button>
      </form>
    </div>
  );
};

export default AddSupplier;
