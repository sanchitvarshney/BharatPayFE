import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateRawMinPayloadType, CreateRawMinResponse, RawminState } from "./RawMinType";
import { AxiosResponse } from "axios";
import axiosInstance from "@/api/axiosInstance";

const initialState: RawminState = {
  documnetFileData: null,
  createminLoading: false,
};

export const createRawMin = createAsyncThunk<AxiosResponse<CreateRawMinResponse>, CreateRawMinPayloadType>("rawmin/createRawMin", async (payload) => {
  const response = await axiosInstance.post("/transaction/min_transaction", payload);
  return response;
});

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
  extraReducers: (builder) => {
    builder
      .addCase(createRawMin.pending, (state) => {
        state.createminLoading = true;
      })
      .addCase(createRawMin.fulfilled, (state) => {
        state.createminLoading = false;
      })
      .addCase(createRawMin.rejected, (state) => {
        state.createminLoading = false;
      });
  },
});

export const { storeDocumentFile, resetDocumentFile } = RawMinSlice.actions;
export default RawMinSlice.reducer;
