import axios from 'axios';
import { initialProducts, activeCoupons } from '../data/cameraProducts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 2000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Cache version key to ensure fresh images on client reload
const STORAGE_KEY = 'camerastore_products_v1002';

const getLocalData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length < fallback.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
};

const setLocalData = (key, data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
};

// API Services with automatic offline / standalone fallback
export const getProducts = async (params = {}) => {
  let local = getLocalData('products', initialProducts);
  try {
    const res = await api.get('/products', { params });
    if (res.data && res.data.length >= initialProducts.length) {
      local = res.data;
      setLocalData('products', local);
    }
  } catch {
    // Standalone fallback using fresh initialProducts
  }

  if (params.category) {
    local = local.filter(p => p.category?.toLowerCase() === params.category.toLowerCase());
  }
  return local;
};

export const getProductById = async (id) => {
  try {
    const res = await api.get(`/products/${id}`);
    if (res.data) return res.data;
  } catch {
    // Fallback
  }
  const products = getLocalData('products', initialProducts);
  return products.find(p => String(p.id) === String(id)) || initialProducts.find(p => String(p.id) === String(id));
};

export const createProduct = async (product) => {
  try {
    const res = await api.post('/products', product);
    return res.data;
  } catch {
    const products = getLocalData('products', initialProducts);
    const newProduct = { ...product, id: product.id || `custom-${Date.now()}` };
    products.unshift(newProduct);
    setLocalData('products', products);
    return newProduct;
  }
};

export const updateProduct = async (id, updates) => {
  try {
    const res = await api.patch(`/products/${id}`, updates);
    return res.data;
  } catch {
    const products = getLocalData('products', initialProducts);
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      setLocalData('products', products);
      return products[index];
    }
  }
};

export const deleteProduct = async (id) => {
  try {
    await api.delete(`/products/${id}`);
    return true;
  } catch {
    const products = getLocalData('products', initialProducts);
    const filtered = products.filter(p => String(p.id) !== String(id));
    setLocalData('products', filtered);
    return true;
  }
};

export const getCoupons = async () => {
  try {
    const res = await api.get('/coupons');
    if (res.data) return res.data;
  } catch {
    // Fallback
  }
  return activeCoupons;
};

export const getOrders = async () => {
  try {
    const res = await api.get('/orders');
    if (res.data) return res.data;
  } catch {
    // Fallback
  }
  try {
    const saved = localStorage.getItem('camerastore_orders');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const createOrder = async (orderData) => {
  try {
    const res = await api.post('/orders', orderData);
    return res.data;
  } catch {
    // Local fallback
    try {
      const saved = localStorage.getItem('camerastore_orders');
      const orders = saved ? JSON.parse(saved) : [];
      orders.unshift(orderData);
      localStorage.setItem('camerastore_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn(e);
    }
    return orderData;
  }
};
