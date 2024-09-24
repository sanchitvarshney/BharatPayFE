
import {  createSlice } from "@reduxjs/toolkit";

import { RawminState } from "./RawMinType";

const initialState: RawminState = {
  documnetFileData: null,
};

const RawMinSlice = createSlice({
  name: "rawmin",
  initialState,
  reducers: {
    storeDocumentFile: (state, action) => {
      if (state.documnetFileData) {
        state.documnetFileData?.push(action.payload);
      } else {
        state.documnetFileData = [action.payload];
      }
    },
    resetDocumentFile: (state) => {
      state.documnetFileData = null;
    },
  },
});

export const { storeDocumentFile, resetDocumentFile } = RawMinSlice.actions;
export default RawMinSlice.reducer;
