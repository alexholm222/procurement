import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	purchase: /* JSON.parse(localStorage.getItem('purchase')) ||  */{},
	order: {},
	payers: JSON.parse(localStorage.getItem('payers')) || [],
	vendors: JSON.parse(localStorage.getItem('vendors')) || [],
	vendorsContracts: JSON.parse(localStorage.getItem('vendorsContracts')) || [],
	categories: JSON.parse(localStorage.getItem('categories')) || [],
	items: JSON.parse(localStorage.getItem('items')) || [],
};
const purchaseSlice = createSlice({
	name: 'purchase',
	initialState,

	reducers: {
		setPurchase(state, action) {
			state.purchase = action.payload;
		},

		setOrder(state, action) {
			state.order = action.payload;
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
	setOrder,
	setPayers,
	setVendors,
	setVendorsContracts,
	setCategories,
	setItems,
} = purchaseSlice.actions;

export default purchaseSlice.reducer;
