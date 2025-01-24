// import apiClient from './api';

// const API_BASE_URL = '/sales'; // Base path relative to apiClient's base URL

// export interface SaleProduct {
//   productId: string;
//   sku: string;
//   quantitySold: number;
//   totalAmount: number;
// }


// export interface Sale {
//   id: string;
//   products: SaleProduct[];
//   totalSaleAmount: number;
//   saleDate: string;
//   paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'UPI' | 'Other';
//   customerName: string;
//   customerContact: string;
// }

// const SalesService = {
//   createSale: async (data: Omit<Sale, 'id' | 'saleDate'>) => {
//     const response = await apiClient.post(`${API_BASE_URL}/sales`, data);
//     return response.data;
//   },

//   getAllSales: async () => {
//     const response = await apiClient.get(`${API_BASE_URL}/sales`);
//     return response.data;
//   },

//   getSaleById: async (id: string) => {
//     const response = await apiClient.get(`${API_BASE_URL}/sales/${id}`);
//     return response.data;
//   },

//   getTotalSales: async (startDate?: string, endDate?: string) => {
//     const params = new URLSearchParams();
//     if (startDate) params.append('startDate', startDate);
//     if (endDate) params.append('endDate', endDate);

//     const response = await apiClient.get(`${API_BASE_URL}/total?${params.toString()}`);
//     return response.data;
//   },
// };

// export default SalesService;

import apiClient from './api';

const API_BASE_URL = '/sales'; // Base path relative to apiClient's base URL

export interface SaleProduct {
  productId: string;
  sku: string;
  quantitySold: number;
  totalAmount: number;
}

export interface Sale {
  id: string;
  products: SaleProduct[];
  totalSaleAmount: number;
  saleDate: string;
  paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'UPI' | 'Other';
  customerName: string;
  customerContact: string;
}

const SalesService = {
  createSale: async (data: Omit<Sale, 'id' | 'saleDate'>) => {
    const response = await apiClient.post(`${API_BASE_URL}/sales`, data);
    return response.data;
  },

  getAllSales: async () => {
    const response = await apiClient.get(`${API_BASE_URL}/sale`);
    return response.data;
  },

  getSaleById: async (id: string) => {
    const response = await apiClient.get(`${API_BASE_URL}/sales/${id}`);
    return response.data;
  },

  getTotalSales: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get(`${API_BASE_URL}/total?${params.toString()}`);
    return response.data;
  },

  updateSale: async (id: string, data: Partial<Omit<Sale, 'id'>>) => {
    // `Partial` allows for optional fields when updating
    const response = await apiClient.put(`${API_BASE_URL}/sales/${id}`, data);
    return response.data;
  },

  deleteSale: async (id: string) => {
    const response = await apiClient.delete(`${API_BASE_URL}/sales/${id}`);
    return response.data;
  },
};

export default SalesService;
