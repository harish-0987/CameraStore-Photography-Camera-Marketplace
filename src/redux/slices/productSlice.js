import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts } from '../../services/api';
import { initialProducts } from '../../data/cameraProducts';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const data = await getProducts(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  products: initialProducts,
  filteredProducts: initialProducts,
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: 'all',
  selectedBrand: 'all',
  priceRange: 6000,
  sortBy: 'featured'
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    addProductLocal: (state, action) => {
      state.products.unshift(action.payload);
    },
    updateProductLocal: (state, action) => {
      const index = state.products.findIndex(p => String(p.id) === String(action.payload.id));
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...action.payload };
      }
    },
    deleteProductLocal: (state, action) => {
      state.products = state.products.filter(p => String(p.id) !== String(action.payload));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          state.products = action.payload;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setProducts,
  setSearchTerm,
  setSelectedCategory,
  setSelectedBrand,
  setPriceRange,
  setSortBy,
  addProductLocal,
  updateProductLocal,
  deleteProductLocal
} = productSlice.actions;

export default productSlice.reducer;
