import { combineReducers } from "@reduxjs/toolkit";
import { parcelApiSlice } from "./slices/parcelApiSlice";
import { customerApiSlice } from "./slices/customerApiSlice";
import { exchangeRateApiSlice } from "./slices/exchangeRateApiSlice";
import { authApiSlice } from "./slices/authApiSlice";
import { bannerApiSlice } from "./slices/bannerApiSlice";
import { authSlice } from "./slices/authSlice";
import { orderSuccesApiSlice } from "./slices/orderSuccesApiSlice";
import { purchaseOrderApiSlice } from "./slices/purchaseOrderApiSlice";
import { officialGoodApiSlice } from "./slices/officialGoodApiSlice";

export const rootReducer = combineReducers({
  auth: authSlice.reducer,
  [parcelApiSlice.reducerPath]: parcelApiSlice.reducer,
  [customerApiSlice.reducerPath]: customerApiSlice.reducer,
  [exchangeRateApiSlice.reducerPath]: exchangeRateApiSlice.reducer,
  [authApiSlice.reducerPath]: authApiSlice.reducer,
  [bannerApiSlice.reducerPath]: bannerApiSlice.reducer,
  [orderSuccesApiSlice.reducerPath]:orderSuccesApiSlice.reducer,
  [purchaseOrderApiSlice.reducerPath]:purchaseOrderApiSlice.reducer,
  [officialGoodApiSlice.reducerPath]:officialGoodApiSlice.reducer
});
