import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  confirmPopUpOpened: false,
};

const managerSlice = createSlice({
  name: "managerSlice",
  initialState,
  reducers: {
    openConfirmPopUp: (state, action) => {
      state.confirmPopUpOpened = action.payload;
    },
  },
});

export default managerSlice.reducer;
export const { openConfirmPopUp } = managerSlice.actions;
