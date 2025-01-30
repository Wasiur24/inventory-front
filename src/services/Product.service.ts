


// import apiClient from './api';

// const API_BASE_URL = '/product'; // Base path relative to apiClient's base URL

// export interface Category {
//   id: string;
//   name: string;
//   description: string;
//   gstnumber: number;
// }

// export interface Supplier {
//   id: string;
//   name: string;
//   contactInfo?: string; // Add fields based on your Supplier schema
// }

// export interface Product {
//   id: string;
//   name: string;
//   description?: string;
//   category: Category; // Updated to hold populated category details
//   mrpprice: number;
//   purchasePrice: number;
//   sellingPrice: number;
//   quantity: number;
//   supplier: Supplier; // Updated to hold populated supplier details
//   sku: string;
//   barcode?: string;
//   manufacturingDate?: string;
//   expiryDate?: string;
//   weight: number;
// }

// const ProductService = {
//   addProduct: async (data: Omit<Product, 'id' | 'barcode' | 'category' | 'supplier'> & { category: string; supplier: string }) => {
//     // For adding a product, the API expects category and supplier as IDs, not populated objects.
//     const response = await apiClient.post(`${API_BASE_URL}/add`, data);
//     return response.data;
//   },

//   updateProduct: async (id: string, data: Partial<Omit<Product, 'category' | 'supplier'>> & { category?: string; supplier?: string }) => {
//     // For updates, ensure category and supplier are sent as IDs if updated.
//     const response = await apiClient.patch(`${API_BASE_URL}/update/${id}`, data);
//     return response.data;
//   },

//   getAllProducts: async (): Promise<Product[]> => {
//     const response = await apiClient.get(API_BASE_URL);
//     return response.data.map((product: any) => ({
//       ...product,
//       category: {
//         id: product.category._id,
//         name: product.category.name,
//         description: product.category.description,
//         gstnumber: product.category.gstnumber,
//       },
//       supplier: product.supplier
//         ? {
//             id: product.supplier._id,
//             name: product.supplier.name,
//             contactInfo: product.supplier.contactInfo, // Adjust based on supplier fields
//           }
//         : undefined,
//     }));
//   },
//   getAllProductsCategory: async (): Promise<Product[]> => {
//     const response = await apiClient.get(`${API_BASE_URL}/getAllProductsCategory`); // Ensure proper URL concatenation
//     return response.data.map((product: any) => ({
//       ...product,
//       category: {
//         id: product?.category?._id,
//         name: product?.category?.name,
//         description: product?.category?.description,
//         gstnumber: product?.category?.gstnumber,
//       },
//       supplier: product.supplier
//         ? {
//             id: product?.supplier?._id,
//             name: product?.supplier?.name,
//             contactInfo: product?.supplier?.contactInfo, // Adjust based on supplier fields
//           }
//         : undefined,
//     }));
//   },
  
  

//   deleteProduct: async (id: string) => {
//     try {
//       // Update the API endpoint path to reflect the new route
//       const response = await apiClient.delete(`${API_BASE_URL}/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error deleting product:", error);
//       throw error; // Re-throw the error to handle it in the component if needed
//     }
//   },
// };

// export default ProductService;


import apiClient from './api';

const API_BASE_URL = '/product'; // Base path relative to apiClient's base URL

export interface Category {
  id: string;
  name: string;
  description?: string;  // Made optional
  gstnumber: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactInfo?: string; // Made optional
}

export interface Product {
  id: string;
  name: string;
  description?: string; // Made optional
  category: Category; // Updated to hold populated category details
  mrpprice: number;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  supplier: Supplier; // Updated to hold populated supplier details
  sku: string;
  barcode?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  weight: number;
}

const ProductService = {
  addProduct: async (data: Omit<Product, 'id' | 'barcode' | 'category' | 'supplier'> & { category: string; supplier: string }) => {
    // For adding a product, the API expects category and supplier as IDs, not populated objects.
    const response = await apiClient.post(`${API_BASE_URL}/add`, data);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<Omit<Product, 'category' | 'supplier'>> & { category?: string; supplier?: string }) => {
    // For updates, ensure category and supplier are sent as IDs if updated.
    const response = await apiClient.patch(`${API_BASE_URL}/update/${id}`, data);
    return response.data;
  },

  getAllProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get(API_BASE_URL);
    return response.data.map((product: any) => ({
      ...product,
      category: {
        id: product.category?._id,
        name: product.category?.name,
        description: product.category?.description ?? '',  // Default empty string if description is missing
        gstnumber: product.category?.gstnumber ?? 0,  // Default value if gstnumber is missing
      },
      supplier: product.supplier
        ? {
            id: product.supplier?._id,
            name: product.supplier?.name ?? '',  // Default empty string if name is missing
            contactInfo: product.supplier?.contactInfo ?? '', // Default empty string if contactInfo is missing
          }
        : undefined,
    }));
  },

  getAllProductsCategory: async (): Promise<Product[]> => {
    const response = await apiClient.get(`${API_BASE_URL}/getAllProductsCategory`); // Ensure proper URL concatenation
    return response.data.map((product: any) => ({
      ...product,
      category: {
        id: product?.category?._id ?? '',
        name: product?.category?.name ?? '',  // Default empty string if name is missing
        description: product?.category?.description ?? '',  // Default empty string if description is missing
        gstnumber: product?.category?.gstnumber ?? 0,  // Default value if gstnumber is missing
      },
      supplier: product?.supplier
        ? {
            id: product?.supplier?._id ?? '',
            name: product?.supplier?.name ?? '',  // Default empty string if name is missing
            contactInfo: product?.supplier?.contactInfo ?? '', // Default empty string if contactInfo is missing
          }
        : undefined,
    }));
  },

  deleteProduct: async (id: string) => {
    try {
      // Update the API endpoint path to reflect the new route
      const response = await apiClient.delete(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error; // Re-throw the error to handle it in the component if needed
    }
  },
};

export default ProductService;
