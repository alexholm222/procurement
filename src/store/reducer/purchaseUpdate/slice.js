import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	purchasesUpdate: [],
	purchaseNew: {},
	purchasesDelete: [],

};
const purchaseUpdateSlice = createSlice({
	name: 'purchaseUpdate',
	initialState,

	reducers: {
		setPurchasesUpdate(state, action) {
			state.purchasesUpdate =  [...state.purchasesUpdate, action.payload];
		},

		setPurchaseNew(state, action) {
			state.purchaseNew =  action.payload;
		},

		setPurchasesDelete(state, action) {
			state.purchasesDelete =  [...state.purchasesDelete, action.payload];
		},
	},
});

export const {
	setPurchasesUpdate,
	setPurchaseNew,
	setPurchasesDelete,
} = purchaseUpdateSlice.actions;

export default purchaseUpdateSlice.reducer;
