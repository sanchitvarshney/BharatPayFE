import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { CommonResponse, CreateProductionPayload, ManageProductionState } from "./QRCodeType";
import { showToast } from "@/utils/toasterContext";

const initialState: ManageProductionState = {
  createProductionLaoding: false,
};

export const createProduction = createAsyncThunk<AxiosResponse<CommonResponse>, CreateProductionPayload>("production/createProduction", async (payload) => {
  const response = await axiosInstance.post(`/production/createProduction`, payload);
  return response;
});

const manageProductionSlice = createSlice({
  name: "manageProduction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProduction.pending, (state) => {
        state.createProductionLaoding = true;
      })
      .addCase(createProduction.fulfilled, (state, action) => {
        state.createProductionLaoding = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(createProduction.rejected, (state) => {
        state.createProductionLaoding = false;
      });
  },
});

export default manageProductionSlice.reducer;
