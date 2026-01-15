import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    successMessage: null, // Pour afficher un message de succès
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.loading = false;  // On arrête le loading après avoir set l'utilisateur
      state.error = null;     // On réinitialise l'erreur
    },
    logout(state) {
      state.user = null;
      state.loading = false;  // On arrête le loading lors de la déconnexion
      state.error = null;     // On réinitialise l'erreur
      state.successMessage = null; // Réinitialisation du succès
    },
    setLoading(state) {
      state.loading = true;  // Action pour activer le loading
    },
    setError(state, action) {
      state.loading = false; // On arrête le loading quand il y a une erreur
      state.error = action.payload; // On stocke l'erreur
    },
    setSuccessMessage(state, action) {
      state.successMessage = action.payload; // On stocke le message de succès
    },
    resetStatus(state) {
      state.loading = false;
      state.error = null;
      state.successMessage = null;  // On réinitialise aussi le message de succès
    }
  },
});

export const {
  setUser,
  logout,
  setLoading,
  setError,
  setSuccessMessage,
  resetStatus
} = authSlice.actions;

export default authSlice.reducer;
