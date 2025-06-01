import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { parcelApiSlice } from "./slices/parcelApiSlice";
import { customerApiSlice } from "./slices/customerApiSlice";
import { exchangeRateApiSlice } from "./slices/exchangeRateApiSlice";
import { authApiSlice } from "./slices/authApiSlice";
import { bannerApiSlice } from "./slices/bannerApiSlice";
import { orderSuccesApiSlice } from "./slices/orderSuccesApiSlice";
import { purchaseOrderApiSlice } from "./slices/purchaseOrderApiSlice";
import { officialGoodApiSlice } from "./slices/officialGoodApiSlice";
const persistedToken = localStorage.getItem("token");
const persistedUser = localStorage.getItem("user");
const preloadedState = {
  auth: {
    user: persistedUser ? JSON.parse(persistedUser) : null,
    token: persistedToken || null,
  },
};
export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      parcelApiSlice.middleware,
      customerApiSlice.middleware,
      exchangeRateApiSlice.middleware,
      authApiSlice.middleware,
      bannerApiSlice.middleware,
      orderSuccesApiSlice.middleware,
      purchaseOrderApiSlice.middleware,
      officialGoodApiSlice.middleware
    ),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
