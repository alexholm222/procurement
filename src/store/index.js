import { combineReducers, configureStore } from "@reduxjs/toolkit";
import purchaseSlice from "./reducer/purchase/slice";
import purchaseUpdateSlice from "./reducer/purchaseUpdate/slice";

export const rootReducer = combineReducers({
  purchaseSlice,
  purchaseUpdateSlice
});

export const store = configureStore({
  reducer: rootReducer,
});
