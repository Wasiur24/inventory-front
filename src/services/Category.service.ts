import apiClient from './api';

export interface Category {
  _id?: string;
  name: string;
  description: string;
  gstnumber:number;
  createdAt?: string;
  updatedAt?: string;
}

// Create a new category
export const createCategory = async (category: Category) => {
  try {
    const response = await apiClient.post('/category', category);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Fetch all categories
export const getAllCategories = async () => {
  try {
    const response = await apiClient.get('/category');
    return response.data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Update a category by ID
export const updateCategory = async (id: string, category: Category) => {
  try {
    const response = await apiClient.put(`/category/${id}`, category);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Delete a category by ID
export const deleteCategory = async (id: string) => {
  try {
    const response = await apiClient.delete(`/category/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
