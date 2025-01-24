
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import AddProduct from './components/productfrom/AddProduct';
import AddSupplier from './components/productfrom/AddSupplierForm';
import Selladd from './components/productfrom/Sell';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import Purchases from './pages/Purchases';
import Sales from './pages/Sales';
import RegistrationForm from './components/auth/RegistrationForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Categories from './pages/Category'
import UpdateSupplier from './pages/UpdateSuppliers';
import SalesUser from './pages/SalesUser';

const getToken = () => localStorage.getItem('token');
const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.role : null;
};

const ProtectedRoute = ({ allowedRoles }) => {
  const token = getToken();
  const role = getUserRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />

        <Route path="/" element={<DashboardLayout />}>
          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="categories" element={<Categories />} />
            <Route path="suppliers/add" element={<AddSupplier />} />
            <Route path="suppliers/update/:id" element={<UpdateSupplier />} />
            <Route path="purchases" element={<Purchases />} />
            <Route path="sales" element={<Sales />} />
            <Route path="addproduct" element={<AddProduct />} />
          </Route>

          {/* Common routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'user']} />}>
            <Route path="selladd" element={<Selladd />} />
            {/* <Route path="dashboard" element={<Dashboard />} /> */}
            <Route path="salesuser" element={<SalesUser />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
