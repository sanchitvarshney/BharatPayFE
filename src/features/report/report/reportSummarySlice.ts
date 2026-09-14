import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

const initialState: any = {
  mode: "awb",
  awbscanreport: null,
  awbscanreportLoading: false,
  qcminreport: null,
  qcminreportLoading: false,
  trcHourlyReport: null,
  trcHourlyReportLoading: false,
};

export const getawbscanReport = createAsyncThunk<
  AxiosResponse<any>,
  { from: string; to: string }
>("report/getawbscanReport", async (date) => {
  const response = await axiosInstance.get(
    `/report/scanSKUSummaryReport?start_date=${date.from}&end_date=${date.to}`,
  );
  return response;
});

export const getQcMinReport = createAsyncThunk<
  AxiosResponse<any>,
  { from: string; to: string }
>("report/getQcMinReport", async (date) => {
  const response = await axiosInstance.get(
    `/report/qcMinReport?start_date=${date.from}&end_date=${date.to}`,
  );
  return response;
});

export const getTrcHourlyReport = createAsyncThunk<
  AxiosResponse<any>,
  { date: string }
>("report/getTrcHourlyReport", async (payload) => {
  const response = await axiosInstance.get(
    `/report/workerHourlyPivotReport?date=${payload.date}`,
  );
  return response;
});



const reportSummarySlice = createSlice({
  name: "reportsummary",
  initialState,
  reducers: {
    setMode(state, action) {
      state.mode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getawbscanReport.pending, (state) => {
        state.awbscanreportLoading = true;
      })
      .addCase(getawbscanReport.fulfilled, (state: any, action) => {
        state.awbscanreportLoading = false;
        if (action.payload.data.success) {
          state.awbscanreport = action.payload.data;
        }
      })
      .addCase(getawbscanReport.rejected, (state) => {
        state.awbscanreportLoading = false;
      })
      .addCase(getQcMinReport.pending, (state) => {
        state.qcminreportLoading = true;
      })
      .addCase(getQcMinReport.fulfilled, (state: any, action) => {
        state.qcminreportLoading = false;
        if (action.payload.data.success) {
          state.qcminreport = action.payload.data;
        }
      })
      .addCase(getQcMinReport.rejected, (state) => {
        state.qcminreportLoading = false;
      })
      .addCase(getTrcHourlyReport.pending, (state) => {
        state.trcHourlyReportLoading = true;
      })
      .addCase(getTrcHourlyReport.fulfilled, (state: any, action) => {
        state.trcHourlyReportLoading = false;
        if (action.payload.data.success) {
          state.trcHourlyReport = action.payload.data;
        }
      })
      .addCase(getTrcHourlyReport.rejected, (state) => {
        state.trcHourlyReportLoading = false;
      });
  },
});

export const { setMode } = reportSummarySlice.actions;

export default reportSummarySlice.reducer;
