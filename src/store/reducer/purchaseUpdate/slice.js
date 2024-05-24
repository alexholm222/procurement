import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	purchasesUpdate: [],
	purchaseNew: {},
	purchasesDelete: [],
	orderUpdate: [],
	orderNew: {},
    updateAction: 0,
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

		setOrderNew(state, action) {
			state.orderNew =  action.payload;
		},

		setUpdateAction(state) {
			state.updateAction =  state.updateAction + 1;
		},

		setOrderUpdate(state, action) {
			state.orderUpdate =  [...state.orderUpdate, action.payload];
		},
	},
});

export const {
	setPurchasesUpdate,
	setPurchaseNew,
	setPurchasesDelete,
	setOrderUpdate,
	setOrderNew,
	setUpdateAction
} = purchaseUpdateSlice.actions;

export default purchaseUpdateSlice.reducer;
