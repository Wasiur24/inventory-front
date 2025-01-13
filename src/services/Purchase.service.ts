import apiClient from './api';

const API_BASE_URL = '/purchases'; // Base path relative to apiClient's base URL

export interface Purchase {
  id: string;
  productId: string;
  supplierId: string;
  quantity: number;
  pricePerUnit: number;
  totalCost: number;
  purchaseDate: string;
}

const PurchaseService = {
  addPurchase: async (data: Omit<Purchase, 'id' | 'purchaseDate'>) => {
    const response = await apiClient.post(`${API_BASE_URL}/add`, data);
    return response.data;
  },

  updatePurchase: async (id: string, data: Partial<Purchase>) => {
    const response = await apiClient.put(`${API_BASE_URL}/update/${id}`, data);
    return response.data;
  },

  getAllPurchases: async () => {
    const response = await apiClient.get(`${API_BASE_URL}/all`);
    return response.data;
  },

  getPurchaseById: async (id: string) => {
    const response = await apiClient.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },
  deletePurchase: async (id: string) => {
    const response = await apiClient.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  },

};

export default PurchaseService;
