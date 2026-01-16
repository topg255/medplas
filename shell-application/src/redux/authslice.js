import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
    refreshTokenSuccess(state, action) {
      state.accessToken = action.payload.accessToken;
      state.loading = false;
      state.error = null;
    },
    refreshTokenFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.successMessage = null;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
    setLoading(state) {
      state.loading = true;
    },
    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setSuccessMessage(state, action) {
      state.loading = false;
      state.successMessage = action.payload;
    },
    resetStatus(state) {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const {
  setUser,
  refreshTokenSuccess,
  refreshTokenFailure,
  logout,
  setLoading,
  setError,
  setSuccessMessage,
  resetStatus,
} = authSlice.actions;

export default authSlice.reducer;