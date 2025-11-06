import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { API } from "@/api/BaseApi";
const store = configureStore({
  reducer: {
    [API.reducerPath]: API.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(API.middleware),
});
export default store;
