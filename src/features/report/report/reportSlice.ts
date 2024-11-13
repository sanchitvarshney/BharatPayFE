import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { DeviceRequestApiResponse, R1ApiResponse, R2Response, r3reportResponse, r4reportDetailDataResponse, R4ReportResponse, ReportStateType } from "./reportType";

const initialState: ReportStateType = {
  r1Data: null,
  getR1DataLoading: false,
  getR2DataLoading: false,
  r2Data: null,
  r2ReportDetail: null,
  r2ReportDetailLoading: false,
  refId: null,
  r3report: null,
  r3reportLoading: false,
  r4report: null,
  r4reportLoading: false,
  r4ReportDetail: null,
  r4ReportDetailLoading: false,
};

export const getR1Data = createAsyncThunk<AxiosResponse<R1ApiResponse>, { type: string; data: string }>("report/getR1", async (date) => {
  const response = await axiosInstance.get(`/report/r1?type=${date.type}&data=${date.data}`);
  return response;
});
export const getR2Data = createAsyncThunk<AxiosResponse<R2Response>, { from: string; to: string }>("report/getR2Data", async (date) => {
  const response = await axiosInstance.get(`report/r2?from=${date.from}&to=${date.to}`);
  return response;
});
export const getR2ReportDetail = createAsyncThunk<AxiosResponse<DeviceRequestApiResponse>, string>("report/getR2ReportDetail", async (refid) => {
  const response = await axiosInstance.get(`/report/r2/detail/${refid}`);
  return response;
});
export const getr3Report = createAsyncThunk<AxiosResponse<r3reportResponse>, { from: string; to: string }>("report/getr3Report", async (date) => {
  const response = await axiosInstance.get(`/report/r3BatteryQcReport?fromDate=${date.from}&toDate=${date.to}`);
  return response;
});
export const getr4Report = createAsyncThunk<AxiosResponse<R4ReportResponse>, { from?: string; to?: string; type: string; device?: string }>("report/getr4Report", async (query) => {
  const response = await axiosInstance.get(query.type === "DEVICE" ? `/report/r4/DEVICE?deviceId=${query.device}` : `/report/r4/DATE?from=${query.from}&to=${query.to}`);
  return response;
});
export const r4ReportDetail = createAsyncThunk<AxiosResponse<r4reportDetailDataResponse>, string>("report/r4ReportDetail", async (query) => {
  const response = await axiosInstance.get(`/report/r4/consumed/${query}`);
  return response;
});
const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setRefId(state, action) {
      state.refId = action.payload;
    },
    clearRefId(state) {
      state.refId = null;
    },
  },
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
      })
      .addCase(getR2Data.pending, (state) => {
        state.getR2DataLoading = true;
        state.r2Data = null;
      })
      .addCase(getR2Data.fulfilled, (state, action) => {
        state.getR2DataLoading = false;
        if (action.payload.data?.status === "success") {
          state.r2Data = action.payload.data.data;
        }
      })
      .addCase(getR2Data.rejected, (state) => {
        state.getR2DataLoading = false;
        state.r2Data = null;
      })
      .addCase(getR2ReportDetail.pending, (state) => {
        state.r2ReportDetailLoading = true;
        state.r2ReportDetail = null;
      })
      .addCase(getR2ReportDetail.fulfilled, (state, action) => {
        state.r2ReportDetailLoading = false;
        if (action.payload.data?.status === "success") {
          state.r2ReportDetail = action.payload.data;
        }
      })
      .addCase(getR2ReportDetail.rejected, (state) => {
        state.r2ReportDetailLoading = false;
        state.r2ReportDetail = null;
      })
      .addCase(getr3Report.pending, (state) => {
        state.r3reportLoading = true;
        state.r3report = null;
      })
      .addCase(getr3Report.fulfilled, (state, action) => {
        state.r3reportLoading = false;
        if (action.payload.data.success) {
          state.r3report = action.payload.data.data;
        }
      })
      .addCase(getr3Report.rejected, (state) => {
        state.r3reportLoading = false;
        state.r3report = null;
      })
      .addCase(getr4Report.pending, (state) => {
        state.r4reportLoading = true;
        state.r4report = null;
      })
      .addCase(getr4Report.fulfilled, (state, action) => {
        state.r4reportLoading = false;
        if (action.payload.data.success) {
          state.r4report = action.payload.data.data;
        }
      })
      .addCase(getr4Report.rejected, (state) => {
        state.r4reportLoading = false;
        state.r4report = null;
      })
      .addCase(r4ReportDetail.pending, (state) => {
        state.r4ReportDetailLoading = true;
        state.r4ReportDetail = null;
      })
      .addCase(r4ReportDetail.fulfilled, (state, action) => {
        state.r4ReportDetailLoading = false;
        if (action.payload.data.success) {
          state.r4ReportDetail = action.payload.data.data;
        }
      })
      .addCase(r4ReportDetail.rejected, (state) => {
        state.r4ReportDetailLoading = false;
        state.r4ReportDetail = null;
      });
  },
});

export const { setRefId, clearRefId } = reportSlice.actions;

export default reportSlice.reducer;
