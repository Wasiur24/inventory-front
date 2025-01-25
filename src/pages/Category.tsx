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
  TablePagination,
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
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Category>({
    name: '',
    description: '',
    gstnumber: undefined,
  });
  const [editing, setEditing] = useState<boolean>(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gstFilter, setGstFilter] = useState({ min: 0, max: 100 });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [categories, searchTerm, gstFilter]);

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

  const applyFilters = () => {
    const filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        category.gstnumber >= gstFilter.min &&
        category.gstnumber <= gstFilter.max
    );
    setFilteredCategories(filtered);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Category Management
      </Typography>

      {/* Filters */}
    

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
      <Grid container spacing={2} sx={{ marginBottom: 2 }} className='px-4 py-4 mt-7 border-b-2 border-gray-300'>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            
            placeholder='Search by name'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
      
         <Grid item xs={6} sm={4}>
          <TextField
            label="Min GST %"
            variant="outlined"
            fullWidth
            type="number"
            value={gstFilter.min}
            minRows={0}
            onChange={(e) => setGstFilter({ ...gstFilter, min: Number(e.target.value) })}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            label="Max GST %"
            variant="outlined"
            fullWidth
            type="number"
            value={gstFilter.max}
            onChange={(e) => setGstFilter({ ...gstFilter, max: Number(e.target.value) })}
          />
        </Grid> 
      </Grid>
        <Table>
          
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>GST %</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.gstnumber}%</TableCell>
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
        <TablePagination
          component="div"
          count={filteredCategories.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </TableContainer>
    </Box>
  );
};

export default CategoryPage;
