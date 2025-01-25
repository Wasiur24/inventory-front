// import React, { useState, useEffect } from 'react';
// import { TextField, Button, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
// import { createCategory, getAllCategories, updateCategory, deleteCategory, Category } from '../services/Category.service';

// const CategoryPage = () => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [formData, setFormData] = useState<Category>({
//     name: '',
//     description: '',
//     gstnumber: undefined,
//   });
//   const [editing, setEditing] = useState<boolean>(false);
//   const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const data = await getAllCategories();
//       setCategories(data);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editing && currentCategoryId) {
//       await updateCategory(currentCategoryId, formData);
//     } else {
//       await createCategory(formData);
//     }
//     setFormData({
//       name: '',
//       description: '',
//       gstnumber: undefined,
//     });
//     setEditing(false);
//     fetchCategories();
//   };

//   const handleEdit = (category: Category) => {
//     setFormData({
//       name: category.name,
//       description: category.description,
//       gstnumber: category.gstnumber,
//     });
//     setEditing(true);
//     setCurrentCategoryId(category._id);
    
//   };

//   const handleDelete = async (id: string) => {
//     await deleteCategory(id);
//     fetchCategories();
//   };

//   return (
//     <Box sx={{ padding: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Category Management
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               label="Name"
//               variant="outlined"
//               fullWidth
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               required
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               label="Description"
//               variant="outlined"
//               fullWidth
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               required
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               label="GST % "
//               variant="outlined"
//               fullWidth
//               name="gstnumber"
//               value={formData.gstnumber}
//               onChange={handleInputChange}
//               required
//             />
//           </Grid>
//         </Grid>
//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           sx={{ marginTop: 2 }}
//         >
//           {editing ? 'Update Category' : 'Create Category'}
//         </Button>
//       </form>

//       <TableContainer component={Paper} sx={{ marginTop: 4 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Description</TableCell>
//               <TableCell>GST Number</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {categories.map((category) => (
//               <TableRow key={category._id}>
//                 <TableCell>{category.name}</TableCell>
//                 <TableCell>{category.description}</TableCell>
//                 <TableCell>{category.gstnumber}</TableCell>
//                 <TableCell>
//                   <Button variant="outlined" color="primary" onClick={() => handleEdit(category)}>
//                     Edit
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     color="secondary"
//                     sx={{ marginLeft: 1 }}
//                     onClick={() => handleDelete(category._id)}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default CategoryPage;


import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  Category,
} from '../services/Category.service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Category>({
    name: '',
    description: '',
    gstnumber: undefined,
  });
  const [editing, setEditing] = useState<boolean>(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'gstnumber' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editing && currentCategoryId) {
        await updateCategory(currentCategoryId, formData);
        toast.success('Category updated successfully!');
      } else {
        await createCategory(formData);
        toast.success('Category created successfully!');
      }

      // Reset the form
      setFormData({
        name: '',
        description: '',
        gstnumber: undefined,
      });
      setEditing(false);
      setCurrentCategoryId(null);
      fetchCategories();
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || 'Category name already exists');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description,
      gstnumber: category.gstnumber,
    });
    setEditing(true);
    setCurrentCategoryId(category._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success('Category deleted successfully!');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category. Please try again.');
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Category Management
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="GST %"
              variant="outlined"
              fullWidth
              name="gstnumber"
              type="number"
              value={formData.gstnumber || ''}
              onChange={handleInputChange}
              required
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          {editing ? 'Update Category' : 'Create Category'}
        </Button>
      </form>

      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>GST Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.gstnumber}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ marginLeft: 1 }}
                    onClick={() => handleDelete(category._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CategoryPage;
