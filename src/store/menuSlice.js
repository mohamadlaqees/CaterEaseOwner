import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  confirmPopUpOpened: false,
};

const menuSlice = createSlice({
  name: "menuSlice",
  initialState,
  reducers: {
    setBranchCategories: (state, action) => {
      state.categories = action.payload;
    },
    openConfirmPopUp: (state, action) => {
      state.confirmPopUpOpened = action.payload;
    },
  },
});

export default menuSlice.reducer;
export const { setBranchCategories, openConfirmPopUp } = menuSlice.actions;
