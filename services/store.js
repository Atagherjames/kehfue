import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
// import authReducer from './redux/authSlice'
// import vaultReducer from './redux/vaultSlice'

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // vault: vaultReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
