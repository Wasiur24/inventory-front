// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api/v1';

// const api = axios.create({
//   baseURL: API_BASE_URL,
// });

import axios, { AxiosInstance } from 'axios';

const API_BASE_URL: string = import.meta.env.VITE_BASE_URL || 'https://billingpos-backend.onrender.com/api/v1';


const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL || 'https://billingpos-backend.onrender.com',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;