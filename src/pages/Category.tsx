


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
  Modal,
  Menu,
  MenuItem,
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
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);

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

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: name === 'gstnumber' ? Number(value) : value,
  //   });
  // };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    // If the input is empty, set it to an empty string; otherwise, convert to number
    setFormData({
      ...formData,
      [name]: name === 'gstnumber' ? (value === '' ? '' : Number(value)) : value,
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
      setModalOpen(false);
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
    setModalOpen(true);
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '30%' }}
        />
        <Box>
          <Button
            variant="outlined"
            sx={{ marginRight: 2 }}
            onClick={() => setShowFilter(!showFilter)}
          >
            {showFilter ? 'Hide Filter' : 'Show Filter'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setFormData({ name: '', description: '', gstnumber: undefined });
              setEditing(false);
              setModalOpen(true);
            }}
          >
            Add Category
          </Button>
        </Box>
      </Box>

      {showFilter && (
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Min GST %"
              variant="outlined"
              type="number"
              value={gstFilter.min}
              onChange={(e) => setGstFilter({ ...gstFilter, min: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Max GST %"
              variant="outlined"
              type="number"
              value={gstFilter.max}
              onChange={(e) => setGstFilter({ ...gstFilter, max: Number(e.target.value) })}
            />
          </Grid>
        </Grid>
      )}

      <TableContainer component={Paper}>
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
                  <TableCell>{category.description||"Not have Description"}</TableCell>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6" gutterBottom>
        {editing ? 'Edit Category' : 'Add Category'}
      </Typography>
      <Button
        onClick={() => setModalOpen(false)}
        variant="contained"
        color="secondary"
        size="small"
        sx={{ textTransform: 'none' }}
      >
        Close
      </Button>
    </Box>
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        required
        sx={{ marginBottom: 2 }}
      />
        <TextField
  label="GST %"
  variant="outlined"
  fullWidth
  name="gstnumber"
  type="number"
  value={formData.gstnumber ?? ''}
  onChange={(e) => {
    const value = e.target.value;
    if (value.length <= 2) {
      setFormData({
        ...formData,
        gstnumber: value === '' ? '' : Number(value),
      });
    }
  }}
  sx={{ marginBottom: 2 }}
/>

      <TextField
        label="Description (optional)"
        variant="outlined"
        fullWidth
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        
        sx={{ marginBottom: 2 }}
      />
  




      <Button type="submit" variant="contained" color="primary">
        {editing ? 'Update Category' : 'Create Category'}
      </Button>
    </form>
  </Box>
</Modal>

    </Box>
  );
};

export default CategoryPage;
