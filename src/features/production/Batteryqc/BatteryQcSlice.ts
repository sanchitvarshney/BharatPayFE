import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { bateryqcSavePayload, BatteryQcState, DeviceApiResponse } from "./BatteryQcType";
import { showToast } from "@/utils/toasterContext";

const initialState: BatteryQcState = {
  batteryQcSaveLoading: false,
  deviceDetailData: null,
  deviceDetailLoading: false,
};

export const getDeviceDetail = createAsyncThunk<AxiosResponse<DeviceApiResponse>, string>("batteryqc/getDeviceDetail", async (imei) => {
  const response = await axiosInstance.get(`/qc/battery/getDeviceDetail/${imei}`);
  return response;
});

export const getQcDeviceDetail = createAsyncThunk<AxiosResponse<DeviceApiResponse>, string>("batteryqc/getQcDeviceDetail", async (imei) => {
  const response = await axiosInstance.get(`/backend/getDeviceDetail/${imei}`);
  return response;
});
export const batteryQcSave = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, bateryqcSavePayload>("batteryqc/batteryQcSave", async (payload) => {
  const response = await axiosInstance.post(`/qc/battery/saveBatteryQc`, payload);
  return response;
});

export const getDeviceDetails = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, {}>("dispatch/getDeviceDetails", async (payload) => {
  const response = await axiosInstance.post(`/backend/getDeviceDetails`, payload);
  return response;
});

const batteryQcSlice = createSlice({
  name: "batteryQc",
  initialState,
  reducers: {
    clearDeviceDetail: (state) => {
      state.deviceDetailData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDeviceDetail.pending, (state) => {
        state.deviceDetailLoading = true;
      })
      .addCase(getDeviceDetail.fulfilled, (state, action) => {
        state.deviceDetailLoading = false;
        if (action.payload.data.success) {
          state.deviceDetailData = action.payload?.data?.data[0];
        }
      })
      .addCase(getDeviceDetail.rejected, (state) => {
        state.deviceDetailLoading = false;
      })
      .addCase(getQcDeviceDetail.pending, (state) => {
        state.deviceDetailLoading = true;
      })
      .addCase(getQcDeviceDetail.fulfilled, (state, action) => {
        state.deviceDetailLoading = false;
        if (action.payload.data.success) {
          state.deviceDetailData = action.payload?.data?.data[0];
        }
      })
      .addCase(getQcDeviceDetail.rejected, (state) => {
        state.deviceDetailLoading = false;
      })
      .addCase(getDeviceDetails.pending, (state) => {
        state.deviceDetailLoading = true;
      })
      .addCase(getDeviceDetails.fulfilled, (state) => {
        state.deviceDetailLoading = false;
      })
      .addCase(getDeviceDetails.rejected, (state) => {
        state.deviceDetailLoading = false;
      })
      .addCase(batteryQcSave.pending, (state) => {
        state.batteryQcSaveLoading = true;
      })
      .addCase(batteryQcSave.fulfilled, (state, action) => {
        state.batteryQcSaveLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data?.message, "success");
        }
      })
      .addCase(batteryQcSave.rejected, (state) => {
        state.batteryQcSaveLoading = false;
      });
  },
});

export const { clearDeviceDetail } = batteryQcSlice.actions;
export default batteryQcSlice.reducer;
