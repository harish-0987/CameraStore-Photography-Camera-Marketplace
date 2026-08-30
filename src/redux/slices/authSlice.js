import { createSlice } from '@reduxjs/toolkit';

const loadUserFromStorage = () => {
  try {
    const saved = localStorage.getItem('camerastore_auth_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const savedUser = loadUserFromStorage();

const initialState = {
  user: savedUser || null,
  isAuthenticated: Boolean(savedUser),
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      try {
        localStorage.setItem('camerastore_auth_user', JSON.stringify(action.payload));
      } catch (err) {
        console.warn(err);
      }
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      try {
        localStorage.removeItem('camerastore_auth_user');
      } catch (err) {
        console.warn(err);
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      try {
        localStorage.setItem('camerastore_auth_user', JSON.stringify(state.user));
      } catch (err) {
        console.warn(err);
      }
    }
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser
} = authSlice.actions;

export default authSlice.reducer;
