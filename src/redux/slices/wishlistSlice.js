import { createSlice } from '@reduxjs/toolkit';
import { addToCart } from './cartSlice';

const loadWishlistFromStorage = () => {
  try {
    const saved = localStorage.getItem('camerastore_wishlist_v2');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (wishlist) => {
  try {
    localStorage.setItem('camerastore_wishlist_v2', JSON.stringify(wishlist));
  } catch (err) {
    console.warn('Could not persist wishlist', err);
  }
};

const initialState = {
  wishlistItems: loadWishlistFromStorage()
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.wishlistItems.some(item => String(item.id) === String(product.id));
      if (!exists) {
        state.wishlistItems.push(product);
        saveWishlistToStorage(state.wishlistItems);
      }
    },
    removeFromWishlist: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(item => String(item.id) !== String(action.payload));
      saveWishlistToStorage(state.wishlistItems);
    },
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const index = state.wishlistItems.findIndex(item => String(item.id) === String(product.id));
      if (index >= 0) {
        state.wishlistItems.splice(index, 1);
      } else {
        state.wishlistItems.push(product);
      }
      saveWishlistToStorage(state.wishlistItems);
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      saveWishlistToStorage([]);
    }
  }
});

export const moveToCart = (product) => (dispatch) => {
  dispatch(addToCart(product));
  dispatch(wishlistSlice.actions.removeFromWishlist(product.id));
};

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
