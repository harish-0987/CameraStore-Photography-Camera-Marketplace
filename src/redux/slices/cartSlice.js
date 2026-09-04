import { createSlice } from '@reduxjs/toolkit';
import { activeCoupons } from '../../data/cameraProducts';

const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('camerastore_cart_v2');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('camerastore_cart_v2', JSON.stringify(cart));
  } catch (err) {
    console.warn('Could not persist cart', err);
  }
};

const calculateTotals = (items, appliedCoupon) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = (subtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountAmount) {
      discountAmount = Math.min(appliedCoupon.discountAmount, subtotal);
    }
  }

  // Free shipping over ₹100
  const deliveryCharges = subtotal === 0 ? 0 : (subtotal > 100 ? 0 : 15);
  const finalAmount = Math.max(0, subtotal - discountAmount + deliveryCharges);

  return {
    totalQuantity,
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    deliveryCharges: Number(deliveryCharges.toFixed(2)),
    finalAmount: Number(finalAmount.toFixed(2))
  };
};

const initialCartItems = loadCartFromStorage();
const initialTotals = calculateTotals(initialCartItems, null);

const initialState = {
  cartItems: initialCartItems,
  appliedCoupon: null,
  couponError: null,
  totalQuantity: initialTotals.totalQuantity,
  subtotal: initialTotals.subtotal,
  discountAmount: initialTotals.discountAmount,
  deliveryCharges: initialTotals.deliveryCharges,
  finalAmount: initialTotals.finalAmount
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const qtyToAdd = product.quantity || 1;
      const existing = state.cartItems.find(item => String(item.id) === String(product.id));

      if (existing) {
        existing.quantity += qtyToAdd;
      } else {
        state.cartItems.push({
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          image: product.image,
          stock: product.stock || 20,
          quantity: qtyToAdd
        });
      }

      saveCartToStorage(state.cartItems);
      const totals = calculateTotals(state.cartItems, state.appliedCoupon);
      Object.assign(state, totals);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => String(item.id) !== String(action.payload));
      saveCartToStorage(state.cartItems);
      const totals = calculateTotals(state.cartItems, state.appliedCoupon);
      Object.assign(state, totals);
    },
    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(item => String(item.id) === String(action.payload));
      if (item) {
        item.quantity += 1;
      }
      saveCartToStorage(state.cartItems);
      const totals = calculateTotals(state.cartItems, state.appliedCoupon);
      Object.assign(state, totals);
    },
    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(item => String(item.id) === String(action.payload));
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cartItems = state.cartItems.filter(i => String(i.id) !== String(action.payload));
        }
      }
      saveCartToStorage(state.cartItems);
      const totals = calculateTotals(state.cartItems, state.appliedCoupon);
      Object.assign(state, totals);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.appliedCoupon = null;
      state.couponError = null;
      saveCartToStorage([]);
      const totals = calculateTotals([], null);
      Object.assign(state, totals);
    },
    applyCoupon: (state, action) => {
      const code = action.payload.trim().toUpperCase();
      const found = activeCoupons.find(c => c.code.toUpperCase() === code);
      if (!found) {
        state.couponError = 'Invalid coupon code. Try CAM10 or FESTIVE20';
        return;
      }
      if (state.subtotal < (found.minSpend || 0)) {
        state.couponError = `Minimum order spend of ₹${found.minSpend} required for code ${code}`;
        return;
      }
      state.appliedCoupon = found;
      state.couponError = null;
      const totals = calculateTotals(state.cartItems, state.appliedCoupon);
      Object.assign(state, totals);
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.couponError = null;
      const totals = calculateTotals(state.cartItems, null);
      Object.assign(state, totals);
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  applyCoupon,
  removeCoupon
} = cartSlice.actions;

export default cartSlice.reducer;
