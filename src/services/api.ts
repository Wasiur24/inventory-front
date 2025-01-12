// Importing axios
import axios, { AxiosInstance } from 'axios';

// Define the base URL for the API
// const API_BASE_URL: string = import.meta.env.VITE_BASE_URL || 'https://billingpos-backend.onrender.com/api/v1';

// Create an Axios instance with the base URL
const apiClient: AxiosInstance = axios.create({
  // baseURL: 'https://billingpos-backend.onrender.com/api/v1',
   baseURL: 'http://localhost:5000/api/v1',

});

// Add an interceptor to include the token in the Authorization header for every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add an interceptor to handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors by clearing local storage and redirecting to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Export the API client for use in UserService
export default apiClient;
