import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	purchase: {},
	payers: [],
	vendors: [],
	categories: [],
};
const purchaseSlice = createSlice({
	name: 'purchase',
	initialState,

	reducers: {
		setPurchase(state, action) {
			state.purchase = action.payload;
		},

		setPayers(state, action) {
			state.payers = action.payload;
		},

		setVendors(state, action) {
			state.vendors = action.payload;
		},

		setCategories(state, action) {
			state.categories = action.payload;
		},
	},
});

export const {
	setPurchase,
	setPayers,
	setVendors,
	setCategories
} = purchaseSlice.actions;

export default purchaseSlice.reducer;
