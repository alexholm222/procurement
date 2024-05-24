import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	update: 0,
	

};
const updateParametrsSlice = createSlice({
	name: 'updateParametrs',
	initialState,

	reducers: {
		setParametrsUpdate(state) {
			state.update = state.update + 1;
		},

	
	},
});

export const {
	setParametrsUpdate
} = updateParametrsSlice.actions;

export default updateParametrsSlice.reducer;
