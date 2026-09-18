import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

export type ReportDateKey =
  | "awbscan"
  | "qcMinOutward"
  | "trcHourly"
  | "soundboxHourly"
  | "swipeHourly";

type ReportDateRange = { from: string | null; to: string | null };

const emptyDateRange: ReportDateRange = { from: null, to: null };

const initialState: any = {
  mode: "awb",
  awbscanreport: null,
  awbscanreportLoading: false,
  qcminreport: null,
  qcminreportLoading: false,
  trcHourlyReport: null,
  trcHourlyReportLoading: false,
  soundboxHourlyReport: null,
  soundboxHourlyReportLoading: false,
  swipeHourlyReport: null,
  swipeHourlyReportLoading: false,
  dateRanges: {
    awbscan: { ...emptyDateRange },
    qcMinOutward: { ...emptyDateRange },
    trcHourly: { ...emptyDateRange },
    soundboxHourly: { ...emptyDateRange },
    swipeHourly: { ...emptyDateRange },
  } as Record<ReportDateKey, ReportDateRange>,
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
  { from: string; to: string }
>("report/getTrcHourlyReport", async (payload) => {
  const response = await axiosInstance.get(
    `/report/workerHourlyPivotReport?start_date=${payload.from}&end_date=${payload.to}`,
  );
  return response;
});

export const getSoundboxHourlyReport = createAsyncThunk<
  AxiosResponse<any>,
  { from: string; to: string }
>("report/getSoundboxHourlyReport", async (payload) => {
  const response = await axiosInstance.get(
    `/report/soundboxHourlyReport?start_date=${payload.from}&end_date=${payload.to}`,
  );
  return response;
});

export const getSwipeHourlyReport = createAsyncThunk<
  AxiosResponse<any>,
  { from: string; to: string }
>("report/getSwipeHourlyReport", async (payload) => {
  const response = await axiosInstance.get(
    `/report/swipeHourlyReport?start_date=${payload.from}&end_date=${payload.to}`,
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
    setReportDateRange(
      state,
      action: {
        payload: { key: ReportDateKey; from: string | null; to: string | null };
      },
    ) {
      state.dateRanges[action.payload.key] = {
        from: action.payload.from,
        to: action.payload.to,
      };
    },
    resetReportDateRange(
      state,
      action: { payload: { key: ReportDateKey } },
    ) {
      state.dateRanges[action.payload.key] = { from: null, to: null };
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
      })
      .addCase(getSoundboxHourlyReport.pending, (state) => {
        state.soundboxHourlyReportLoading = true;
      })
      .addCase(getSoundboxHourlyReport.fulfilled, (state: any, action) => {
        state.soundboxHourlyReportLoading = false;
        if (action.payload.data.success) {
          state.soundboxHourlyReport = action.payload.data;
        }
      })
      .addCase(getSoundboxHourlyReport.rejected, (state) => {
        state.soundboxHourlyReportLoading = false;
      })
      .addCase(getSwipeHourlyReport.pending, (state) => {
        state.swipeHourlyReportLoading = true;
      })
      .addCase(getSwipeHourlyReport.fulfilled, (state: any, action) => {
        state.swipeHourlyReportLoading = false;
        if (action.payload.data.success) {
          state.swipeHourlyReport = action.payload.data;
        }
      })
      .addCase(getSwipeHourlyReport.rejected, (state) => {
        state.swipeHourlyReportLoading = false;
      });
  },
});

export const { setMode, setReportDateRange, resetReportDateRange } =
  reportSummarySlice.actions;

export default reportSummarySlice.reducer;
