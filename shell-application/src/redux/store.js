// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authslice';
import appointmentReducer from './appointmentSlice';

export const store = configureStore({
  reducer: {
    appointment: appointmentReducer,
    auth: authReducer,
  },
});