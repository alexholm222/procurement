import { combineReducers, configureStore } from "@reduxjs/toolkit";
import purchaseSlice from "./reducer/purchase/slice";
import purchaseUpdateSlice from "./reducer/purchaseUpdate/slice";
import updateParametrsSlice from "./reducer/updateParametrs/slice";

export const rootReducer = combineReducers({
  purchaseSlice,
  purchaseUpdateSlice,
  updateParametrsSlice
});

export const store = configureStore({
  reducer: rootReducer,
});
