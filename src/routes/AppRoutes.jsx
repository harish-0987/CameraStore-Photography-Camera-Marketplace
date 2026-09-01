import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Public Pages (Section 10 of PDF)
import Home from '../pages/Home';
import Cameras from '../pages/Cameras';
import Lenses from '../pages/Lenses';
import Lighting from '../pages/Lighting';
import Tripods from '../pages/Tripods';
import Bags from '../pages/Bags';
import Accessories from '../pages/Accessories';
import ProductDetails from '../pages/ProductDetails';
import Wishlist from '../pages/Wishlist';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import OrderSuccess from '../pages/OrderSuccess';
import Orders from '../pages/Orders';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import BrandPage from '../pages/BrandPage';
import SearchPage from '../pages/Search';

// Admin Pages
import AdminLogin from '../admin/AdminLogin';
import AdminDashboard from '../admin/AdminDashboard';
import AdminProducts from '../admin/AdminProducts';
import AddProduct from '../admin/AddProduct';
import EditProduct from '../admin/EditProduct';
import AdminOrders from '../admin/AdminOrders';
import AdminUsers from '../admin/AdminUsers';

// Wrapper for Admin Routes: Displays AdminLogin if not logged in as Admin
const AdminWrapper = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <AdminLogin />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Core Marketplace Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/cameras" element={<Cameras />} />
      <Route path="/lenses" element={<Lenses />} />
      <Route path="/lighting" element={<Lighting />} />
      <Route path="/tripods" element={<Tripods />} />
      <Route path="/bags" element={<Bags />} />
      <Route path="/accessories" element={<Accessories />} />
      <Route path="/brand/:brandName" element={<BrandPage />} />
      <Route path="/brand" element={<BrandPage />} />
      <Route path="/brands/:brandName" element={<BrandPage />} />
      <Route path="/brands" element={<BrandPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/product/:id" element={<ProductDetails />} />

      {/* 2. E-Commerce Flow Routes */}
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/ordersuccess" element={<OrderSuccess />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/profile" element={<Profile />} />

      {/* 3. Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* 4. Admin Management Routes (renders AdminLogin directly when unauthenticated) */}
      <Route
        path="/admin"
        element={
          <AdminWrapper>
            <AdminDashboard />
          </AdminWrapper>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminWrapper>
            <AdminProducts />
          </AdminWrapper>
        }
      />
      <Route
        path="/admin/add-product"
        element={
          <AdminWrapper>
            <AddProduct />
          </AdminWrapper>
        }
      />
      <Route
        path="/admin/edit-product/:id"
        element={
          <AdminWrapper>
            <EditProduct />
          </AdminWrapper>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminWrapper>
            <AdminOrders />
          </AdminWrapper>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminWrapper>
            <AdminUsers />
          </AdminWrapper>
        }
      />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
