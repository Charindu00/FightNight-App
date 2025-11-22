import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login action - stores user data and token
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    
    // Logout action - clears all auth data
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    
    // Update user profile (optional - for future features)
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

// Export actions for use in components
export const { login, logout, updateUser } = authSlice.actions;

// Selectors - easy access to auth state
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;

// Export reducer for store configuration
export default authSlice.reducer;
