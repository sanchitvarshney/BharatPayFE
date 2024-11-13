import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { bateryqcSavePayload, BatteryQcState, DeviceApiResponse } from "./BatteryQcType";
import { showToast } from "@/utils/toastUtils";

const initialState: BatteryQcState = {
  batteryQcSaveLoading: false,
  deviceDetailData: null,
  deviceDetailLoading: false,
};

export const getDeviceDetail = createAsyncThunk<AxiosResponse<DeviceApiResponse>, string>("batteryqc/getDeviceDetail", async (imei) => {
  const response = await axiosInstance.get(`/qc/battery/getDeviceDetail/${imei}`);
  return response;
});
export const batteryQcSave = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, bateryqcSavePayload>("batteryqc/batteryQcSave", async (payload) => {
  const response = await axiosInstance.post(`/qc/battery/saveBatteryQc`, payload);
  return response;
});

const batteryQcSlice = createSlice({
  name: "batteryQc",
  initialState,
  reducers: {
    clearDeviceDetail:(state) =>{
      state.deviceDetailData = null
    }
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
      .addCase(batteryQcSave.pending, (state) => {
        state.batteryQcSaveLoading = true;
      })
      .addCase(batteryQcSave.fulfilled, (state, action) => {
        state.batteryQcSaveLoading = false;
        if (action.payload.data.success) {
          showToast({
            variant: "success",
            description: action.payload.data?.message,
          });
        }
      })
      .addCase(batteryQcSave.rejected, (state) => {
        state.batteryQcSaveLoading = false;
      });
  },
});

export const { clearDeviceDetail } = batteryQcSlice.actions;
export default batteryQcSlice.reducer;
