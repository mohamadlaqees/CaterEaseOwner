import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  branchInfo: {},
};

const restaurantSlice = createSlice({
  name: "restaurantSlice",
  initialState,
  reducers: {
    setBranchInfo: (state, action) => {
      state.branchInfo = action.payload;
    },
  },
});

export default restaurantSlice.reducer;
export const { setBranchInfo } = restaurantSlice.actions;
