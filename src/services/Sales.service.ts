


// import apiClient from './api';

// const API_BASE_URL = '/sales';

// export interface SaleProduct {
//   productId?: string;
//   sku: string;
//   name: string;
//   quantitySold: number;
//   sellingPrice: number;
//   mrpprice: number;
//   gstnumber: number;
//   totalAmount: number;
// }

// export interface Sale {
//   id?: string;
//   products: SaleProduct[];
//   totalSaleAmount: number;
//   saleDate?: string;
//   paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'UPI' | 'Other';
//   customerName: string;
//   customerContact?: string; // Optional field
//   billNo?: number;
//   cgstAmount?: number;
//   sgstAmount?: number;
//   savedAmount?: number;
// }

// const SalesService = {
//   createSale: async (data: Omit<Sale, 'id' | 'saleDate'>) => {
//     let totalCGST = 0;
//     let totalSGST = 0;
//     let savedAmount = 0;
//     console.log(data.products);
//     data.products.forEach(product => {
//       if (product.gstnumber) {
//         const gstRate = product.gstnumber / 2;
//         const gstAmount = (product.totalAmount * gstRate) / 100;
//         totalCGST += gstAmount;
//         totalSGST += gstAmount;
//       }
//       savedAmount += (product.mrpprice - product.sellingPrice) * product.quantitySold;
//     });

//     const saleData = {
//       ...data,
//       cgstAmount: totalCGST,
//       sgstAmount: totalSGST,
//       savedAmount: savedAmount,
//     };
//     const response = await apiClient.post(`${API_BASE_URL}/sales`, saleData);
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

//   updateSale: async (id: string, data: Partial<Omit<Sale, 'id'>>) => {
//     const response = await apiClient.put(`${API_BASE_URL}/sales/${id}`, data);
//     return response.data;
//   },

//   deleteSale: async (id: string) => {
//     const response = await apiClient.delete(`${API_BASE_URL}/sales/${id}`);
//     return response.data;
//   },
// };


// export default SalesService;

import apiClient from './api';

const API_BASE_URL = '/sales';

export interface SaleProduct {
  productId?: string;
  sku: string;
  name: string;
  quantitySold: number;
  sellingPrice: number;
  mrpprice: number;
  gstnumber: number;
  totalAmount: number;
}

export interface Sale {
  id?: string;
  products: SaleProduct[];
  totalSaleAmount: number;
  saleDate?: string;
  paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'UPI' | 'Other';
  customerName: string;
  customerContact?: string;
  billNo?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  savedAmount?: number;
  cashReceived?: number;
  changeAmount?: number;
}

const SalesService = {
  createSale: async (data: Omit<Sale, 'id' | 'saleDate'>) => {
    let totalCGST = 0;
    let totalSGST = 0;
    let savedAmount = 0;
    
    data.products.forEach(product => {
      if (product.gstnumber) {
        const gstRate = product.gstnumber / 2;
        const gstAmount = (product.totalAmount * gstRate) / 100;
        totalCGST += gstAmount;
        totalSGST += gstAmount;
      }
      savedAmount += (product.mrpprice - product.sellingPrice) * product.quantitySold;
    });

    const saleData = {
      ...data,
      cgstAmount: totalCGST,
      sgstAmount: totalSGST,
      savedAmount: savedAmount,
    };
    const response = await apiClient.post(`${API_BASE_URL}/sales`, saleData);
    return response.data;
  },

  getAllSales: async () => {
    const response = await apiClient.get(`${API_BASE_URL}/sales`);
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
    const response = await apiClient.put(`${API_BASE_URL}/sales/${id}`, data);
    return response.data;
  },

  deleteSale: async (id: string) => {
    const response = await apiClient.delete(`${API_BASE_URL}/sales/${id}`);
    return response.data;
  },
};

export default SalesService;