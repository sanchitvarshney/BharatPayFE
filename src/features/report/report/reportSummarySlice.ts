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

export type ReportMeta = { from: string; to: string; generatedAt: string };

const emptyDateRange: ReportDateRange = { from: null, to: null };

const emptyByKey = <T,>(value: T) =>
  ({
    awbscan: value,
    qcMinOutward: value,
    trcHourly: value,
    soundboxHourly: value,
    swipeHourly: value,
  }) as Record<ReportDateKey, T>;

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
  reportMeta: emptyByKey<ReportMeta | null>(null),
  reportErrors: emptyByKey<string | null>(null),
};

const markPending = (state: any, key: ReportDateKey) => {
  state.reportErrors[key] = null;
};

const markFulfilled = (state: any, key: ReportDateKey, action: any) => {
  if (action.payload.data.success) {
    state.reportErrors[key] = null;
    state.reportMeta[key] = {
      from: action.meta.arg.from,
      to: action.meta.arg.to,
      generatedAt: new Date().toISOString(),
    };
  } else {
    state.reportErrors[key] =
      action.payload.data?.message || "The report could not be generated.";
  }
};

const markRejected = (state: any, key: ReportDateKey, action: any) => {
  state.reportErrors[key] =
    action.error?.message || "Something went wrong while loading the report.";
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
        markPending(state, "awbscan");
      })
      .addCase(getawbscanReport.fulfilled, (state: any, action) => {
        state.awbscanreportLoading = false;
        if (action.payload.data.success) {
          state.awbscanreport = action.payload.data;
        }
        markFulfilled(state, "awbscan", action);
      })
      .addCase(getawbscanReport.rejected, (state, action) => {
        state.awbscanreportLoading = false;
        markRejected(state, "awbscan", action);
      })
      .addCase(getQcMinReport.pending, (state) => {
        state.qcminreportLoading = true;
        markPending(state, "qcMinOutward");
      })
      .addCase(getQcMinReport.fulfilled, (state: any, action) => {
        state.qcminreportLoading = false;
        if (action.payload.data.success) {
          state.qcminreport = action.payload.data;
        }
        markFulfilled(state, "qcMinOutward", action);
      })
      .addCase(getQcMinReport.rejected, (state, action) => {
        state.qcminreportLoading = false;
        markRejected(state, "qcMinOutward", action);
      })
      .addCase(getTrcHourlyReport.pending, (state) => {
        state.trcHourlyReportLoading = true;
        markPending(state, "trcHourly");
      })
      .addCase(getTrcHourlyReport.fulfilled, (state: any, action) => {
        state.trcHourlyReportLoading = false;
        if (action.payload.data.success) {
          state.trcHourlyReport = action.payload.data;
        }
        markFulfilled(state, "trcHourly", action);
      })
      .addCase(getTrcHourlyReport.rejected, (state, action) => {
        state.trcHourlyReportLoading = false;
        markRejected(state, "trcHourly", action);
      })
      .addCase(getSoundboxHourlyReport.pending, (state) => {
        state.soundboxHourlyReportLoading = true;
        markPending(state, "soundboxHourly");
      })
      .addCase(getSoundboxHourlyReport.fulfilled, (state: any, action) => {
        state.soundboxHourlyReportLoading = false;
        if (action.payload.data.success) {
          state.soundboxHourlyReport = action.payload.data;
        }
        markFulfilled(state, "soundboxHourly", action);
      })
      .addCase(getSoundboxHourlyReport.rejected, (state, action) => {
        state.soundboxHourlyReportLoading = false;
        markRejected(state, "soundboxHourly", action);
      })
      .addCase(getSwipeHourlyReport.pending, (state) => {
        state.swipeHourlyReportLoading = true;
        markPending(state, "swipeHourly");
      })
      .addCase(getSwipeHourlyReport.fulfilled, (state: any, action) => {
        state.swipeHourlyReportLoading = false;
        if (action.payload.data.success) {
          state.swipeHourlyReport = action.payload.data;
        }
        markFulfilled(state, "swipeHourly", action);
      })
      .addCase(getSwipeHourlyReport.rejected, (state, action) => {
        state.swipeHourlyReportLoading = false;
        markRejected(state, "swipeHourly", action);
      });
  },
});

export const { setMode, setReportDateRange, resetReportDateRange } =
  reportSummarySlice.actions;

export default reportSummarySlice.reducer;
