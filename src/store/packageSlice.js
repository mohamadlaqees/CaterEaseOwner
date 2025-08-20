import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  confirmPopUpOpened: false,
};

const packageSlice = createSlice({
  name: "packageSlice",
  initialState,
  reducers: {
    openConfirmPopUp: (state, action) => {
      state.confirmPopUpOpened = action.payload;
    },
  },
});

export default packageSlice.reducer;
export const { openConfirmPopUp } = packageSlice.actions;
