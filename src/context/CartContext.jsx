import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/cameraProducts';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('camerastore_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('camerastore_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('camerastore_orders');
      return saved ? JSON.parse(saved) : [
        {
          id: 'CAM-89421',
          date: '2026-08-20',
          totalAmount: 2248.20,
          total: 2248.20,
          status: 'Delivered',
          items: [
            {
              id: 'cam-1',
              name: 'Sony Alpha A7 IV Full-Frame Mirrorless Camera',
              price: 2498,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80'
            }
          ],
          shippingAddress: {
            fullName: 'Alex Vance',
            address: '402 Studio Boulevard, Creative District',
            city: 'San Francisco',
            state: 'California',
            pincode: '94107'
          }
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('camerastore_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Cart storage error', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('camerastore_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Wishlist storage error', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('camerastore_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Orders storage error', e);
    }
  }, [orders]);

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => String(item.id) === String(product.id));
      if (existing) {
        return prev.map(item =>
          String(item.id) === String(product.id) ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (String(item.id) === String(productId) ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => String(item.id) !== String(productId)));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => String(item.id) === String(product.id));
      if (exists) {
        return prev.filter(item => String(item.id) !== String(product.id));
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => String(item.id) !== String(productId)));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  // Add Product (for Admin)
  const addProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => String(p.id) === String(updatedProduct.id) ? updatedProduct : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => String(o.id) === String(orderId) ? { ...o, status: newStatus } : o));
  };

  return (
    <CartContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
