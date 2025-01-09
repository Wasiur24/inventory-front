import apiClient from './api';

const API_BASE_URL = '/supplier'; // Base path relative to apiClient's base URL

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  productsSupplied: Array<{
    productId: string;
    productName: string;
  }>;
}

const SupplierService = {
  addSupplier: async (data: Omit<Supplier, 'id'>) => {
    const response = await apiClient.post(`${API_BASE_URL}/add`, data);
    return response.data;
  },

  updateSupplier: async (id: string, data: Partial<Supplier>) => {
    const response = await apiClient.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
  },

  getAllSuppliers: async () => {
    const response = await apiClient.get(API_BASE_URL);
    return response.data;
  },

  deleteSupplier: async (_id: string) => {
    const response = await apiClient.delete(`${API_BASE_URL}/delete/${_id}`);
    return response.data;
  },
};

export default SupplierService;
