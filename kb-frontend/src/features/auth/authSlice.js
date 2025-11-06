import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  loading: true,
  isAuthenticated: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { success, user } = action.payload;
      state.user = success ? user : null;
      state.isAuthenticated = !!success;
      state.loading = false;
    },
    logouts: (state) => {
      state.user = null;
      //   state.accessToken = null;
      state.loading = false;
      state.isAuthenticated = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});
export const { setCredentials, setLoading, logouts } = authSlice.actions;
export default authSlice.reducer;
