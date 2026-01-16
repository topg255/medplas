// appointmentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: {
    appointments: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    addAppointment(state, action) {
      state.appointments.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    setAppointmentLoading(state) {
      state.loading = true;
    },
    setAppointmentError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setAppointmentSuccess(state, action) {
      state.successMessage = action.payload;
    },
    resetAppointmentStatus(state) {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    }
  },
});

export const {
  addAppointment,
  setAppointmentLoading,
  setAppointmentError,
  setAppointmentSuccess,
  resetAppointmentStatus
} = appointmentSlice.actions;

export default appointmentSlice.reducer;