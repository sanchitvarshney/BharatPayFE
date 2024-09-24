import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { R1ApiResponse, ReportStateType } from "./reportType";

const initialState: ReportStateType = {
  r1Data: null,
  getR1DataLoading: false,
};

export const getR1Data = createAsyncThunk<AxiosResponse<R1ApiResponse>,string>("report/getR1", async (date) => {
  const response = await axiosInstance.get(`/report/r1/date?date=${date}`);
  return response;
});

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getR1Data.pending, (state) => {
        state.getR1DataLoading = true;
      })
      .addCase(getR1Data.fulfilled, (state, action) => {
        state.getR1DataLoading = false;
        if (action.payload.data.success) {
          state.r1Data = action.payload.data.data;
        }
      })
      .addCase(getR1Data.rejected, (state) => {
        state.getR1DataLoading = false;
      });
  },
});

export default reportSlice.reducer;
