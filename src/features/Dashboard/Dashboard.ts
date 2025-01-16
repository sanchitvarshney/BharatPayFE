import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { DashBoardType, DeviceApiResponse } from "./DashboardType";

const initialState: DashBoardType = {
  deviceData: null,
  devicedataLoading: false,
};

export const getDeviceDetail = createAsyncThunk<AxiosResponse<DeviceApiResponse>, { from: string; to: string }>("dashboard/getDeviceDetail", async (payload) => {
  const response = await axiosInstance.get(`dashboard/deviceLocation?startDate=${payload.from}&endDate=${payload.to}`);
  return response;
});

export const getRawMaterialDetail = createAsyncThunk<AxiosResponse<DeviceApiResponse>, { from: string; to: string }>("dashboard/rmLocation", async (payload) => {
  const response = await axiosInstance.get(`/dashboard/rmLocation?startDate=${payload.from}&endDate=${payload.to}`);
  return response;
});

const dashBoardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearStoredDeviceData: (state) => {
      state.deviceData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDeviceDetail.pending, (state) => {
        state.devicedataLoading = true;
        state.deviceData = null;
      })
      .addCase(getDeviceDetail.fulfilled, (state, action) => {
        state.devicedataLoading = false;
        if (action.payload.data.success) {
          state.deviceData = action.payload.data.data;
        }
      })
      .addCase(getDeviceDetail.rejected, (state) => {
        state.devicedataLoading = false;
        state.deviceData = null;
      })
      .addCase(getRawMaterialDetail.pending, (state) => {
        state.devicedataLoading = true;
        state.deviceData = null;
      })
      .addCase(getRawMaterialDetail.fulfilled, (state, action) => {
        state.devicedataLoading = false;
        if (action.payload.data.success) {
          state.deviceData = action.payload.data.data;
        }
      })
      .addCase(getRawMaterialDetail.rejected, (state) => {
        state.devicedataLoading = false;
        state.deviceData = null;
      });
  },
});

export const { clearStoredDeviceData } = dashBoardSlice.actions;
export default dashBoardSlice.reducer;
