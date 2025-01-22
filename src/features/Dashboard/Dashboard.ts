import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { DashBoardType, DeviceApiResponse, RawMaterialResponseData } from "./DashboardType";

const initialState: DashBoardType = {
  deviceData: null,
  devicedataLoading: false,
  rawMaterialData: null,
  rawMaterialLoading: false,
  issuedataLoading: false,
  issuedata: null,
};

export const getDeviceDetail = createAsyncThunk<AxiosResponse<DeviceApiResponse>, { from: string; to: string }>("dashboard/getDeviceDetail", async (payload) => {
  const response = await axiosInstance.get(`/dashboard/deviceLocation?startDate=${payload.from}&endDate=${payload.to}`);
  return response;
});
export const getRawMaterialDetail = createAsyncThunk<AxiosResponse<RawMaterialResponseData>, { from: string; to: string }>("dashboard/getRawMaterialDetail", async (payload) => {
  const response = await axiosInstance.get(`/dashboard/rmLocation?startDate=${payload.from}&endDate=${payload.to}`);
  return response;
});
export const getIssueDetail = createAsyncThunk<AxiosResponse<RawMaterialResponseData>, { from: string; to: string }>("dashboard/getIssueDetail", async (payload) => {
  const response = await axiosInstance.get(`/dashboard/deviceIssue?startDate=${payload.from}&endDate=${payload.to}`);
  return response;
});
const dashBoardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearStoredDeviceData: (state) => {
      state.deviceData = null;
    },
    clearAllData: (state) => {
      state.deviceData = null;
      state.rawMaterialData = null;
      state.issuedata = null;
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
        state.rawMaterialLoading = true;
        state.rawMaterialData = null;
      })
      .addCase(getRawMaterialDetail.fulfilled, (state, action) => {
        state.rawMaterialLoading = false;
        if (action.payload.data.success) {
          state.rawMaterialData = action.payload.data.data;
        }
      })
      .addCase(getRawMaterialDetail.rejected, (state) => {
        state.rawMaterialLoading = false;
        state.rawMaterialData = null;
      })
      .addCase(getIssueDetail.pending, (state) => {
        state.issuedataLoading = true;
        state.issuedata = null;
      })
      .addCase(getIssueDetail.fulfilled, (state, action) => {
        state.issuedataLoading = false;
        if (action.payload.data.success) {
          state.issuedata = action.payload.data.data;
        }
      })
      .addCase(getIssueDetail.rejected, (state) => {
        state.issuedataLoading = false;
        state.issuedata = null;
      });
  },
});

export const { clearStoredDeviceData, clearAllData } = dashBoardSlice.actions;
export default dashBoardSlice.reducer;
