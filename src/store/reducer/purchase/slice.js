import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	purchase: {},
	payers: [],
	vendors: [],
	vendorsContracts: [],
	categories: [],
	items: [],
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

		setVendorsContracts(state, action) {
			state.vendorsContracts = action.payload;
		},

		setCategories(state, action) {
			state.categories = action.payload;
		},

		setItems(state, action) {
			state.items = action.payload;
		},
	},
});

export const {
	setPurchase,
	setPayers,
	setVendors,
	setVendorsContracts,
	setCategories,
	setItems
} = purchaseSlice.actions;

export default purchaseSlice.reducer;
