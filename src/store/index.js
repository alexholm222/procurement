import { combineReducers, configureStore } from "@reduxjs/toolkit";
import purchaseSlice from "./reducer/purchase/slice";


export const rootReducer = combineReducers({
  purchaseSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});
