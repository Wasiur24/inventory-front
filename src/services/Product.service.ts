import apiClient from './api';

const API_BASE_URL = '/product'; // Base path relative to apiClient's base URL

export interface Product {
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

const ProductService = {
  addProduct: async (data: Omit<Product, 'id' | 'barcode'>) => {
    const response = await apiClient.post(`${API_BASE_URL}/add`, data);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<Product>) => {
    const response = await apiClient.patch(`${API_BASE_URL}/update/${id}`, data);
    return response.data;
  },

  getAllProducts: async () => {
    const response = await apiClient.get(API_BASE_URL);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await apiClient.delete(`${API_BASE_URL}/delete/${id}`);
    return response.data;
}

};



export default ProductService;
