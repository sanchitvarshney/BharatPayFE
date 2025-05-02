import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { DeviceRequestApiResponse, MainR1ReportResponse, R11ReportDataApiResponse, R12ReportDataApiResponse, R1ApiResponse, R2Response, r3reportResponse, r4reportDetailDataResponse, R4ReportResponse, R5reportResponse, r6reportApiResponse, R8ReportDataApiResponse, R9reportResponse, ReportStateType } from "./reportType";

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
  r5report: null,
  r5reportLoading: false,
  r5reportDetailLoading: false,
  r5reportDetail: null,
  mainR1Report: null,
  mainR1ReportLoading: false,
  r6Report: null,
  wrongDeviceReport: null,
  r6ReportLoading: false,
  r8ReportLoading: false,
  r8Report: null,
  r9report: null,
  r9ReportLoading: false,
  wrongDeviceReportLoading: false,
  r11ReportLoading: false,
  r11Report: null,
  r12Report: null,
  r12ReportLoading: false,
  r13Report: null,
  r13ReportLoading: false,
  r15Report: null,
  r15ReportLoading: false,
  updatePhysicalQuantityLoading: false,
  r16Report: null,
  r16ReportLoading: false,
  r16ReportDateRange: {
    from: null,
    to: null,
  },
  r16ReportPartner: null,
};

export const getR1Data = createAsyncThunk<AxiosResponse<R1ApiResponse>, { type: string; data: string }>("report/getR1", async (date) => {
  const response = await axiosInstance.get(`/report/r1/detail?type=${date.type}&data=${date.data}`);
  return response;
});
export const getMainR1Data = createAsyncThunk<AxiosResponse<MainR1ReportResponse>, { type: "min" | "date"; data: string; from: string; to: string }>("report/mainR1Data", async (payload) => {
  const response = await axiosInstance.get(payload.type === "min" ? `/report/r1?type=min&data=${payload.data}` : `/report/r1?type=date&from=${payload.from}&to=${payload.to}`);
  return response;
});
export const getR2Data = createAsyncThunk<AxiosResponse<R2Response>, { from: string; to: string }>("report/getR2Data", async (date) => {
  const response = await axiosInstance.get(`report/r2?from=${date.from}&to=${date.to}`);
  return response;
});
export const getR2ReportDetail = createAsyncThunk<AxiosResponse<DeviceRequestApiResponse>, any>("report/getR2ReportDetail", async (payload) => {
  const response = await axiosInstance.get(`/report/r2/detail/${payload.refId}/${payload.srlno}`);
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

export const getr5Report = createAsyncThunk<AxiosResponse<R5reportResponse>, { from?: string; to?: string; type: string; device?: string }>("report/getr5Report", async (query) => {
  const response = await axiosInstance.get(query.type === "DEVICE" ? `/report/r5/DEVICE?deviceId=${query.device}` : `/report/r5/DATE?from=${query.from}&to=${query.to}`);
  return response;
});
export const getr5ReportDetail = createAsyncThunk<
  AxiosResponse<{
    data: {
      slNo: string;
      insert_dt: string;
      shipLabel: string;
      shipToCity: string;
      p_name: string;
      imei: string;
      nfc_enable: string | null;
      iccid: string | null;
      qr_url: string | null;
    }[];
    success: boolean;
    message: string;
  }>,
  string
>("report/getr5ReportDetail", async (query) => {
  const response = await axiosInstance.post(`/report/r5/deviceSerial`, { txnId: query });
  return response;
});
export const getr6Report = createAsyncThunk<AxiosResponse<r6reportApiResponse>, { type: "MINNO" | "DATE"; data: string; from: string; to: string }>("report/getr6Report", async (payload) => {
  const response = await axiosInstance.get(payload.type === "MINNO" ? `/report/r6/MINNO?data=${payload.data}` : `/report/r6/DATE?startDate=${payload.from}&endDate=${payload.to}`);
  return response;
});
export const getWrongDeviceReport = createAsyncThunk<AxiosResponse<r6reportApiResponse>, { type: string; from: string; to: string }>("report/getWrongDeviceReport", async (payload) => {
  const response = await axiosInstance.get(`/wrongDevice/fetch/?fromDate=${payload.from}&toDate=${payload.to}&deliveryPartner=${payload.type}`);
  return response;
});
export const getr8Report = createAsyncThunk<AxiosResponse<R8ReportDataApiResponse>, { from: string; to: string }>("report/getr8Report", async (payload) => {
  const response = await axiosInstance.get(`/report/r8?type=RANGE&data=${payload.from}-${payload.to}`);
  return response;
});

export const getR11Report = createAsyncThunk<AxiosResponse<R11ReportDataApiResponse>, { from: string; to: string }>("report/getR11Report", async (payload) => {
  const response = await axiosInstance.get(`/bpeIssue/report?startDate=${payload.from}&endDate=${payload.to}`);
  return response;
});

export const getR13Report = createAsyncThunk<AxiosResponse<R11ReportDataApiResponse>, { from: string; to: string }>("report/getR13Report", async (payload) => {
  const response = await axiosInstance.get(`/analytics/device/report?fromDate=${payload.from}&toDate=${payload.to}`);
  return response;
});

export const getR12Report = createAsyncThunk<AxiosResponse<R12ReportDataApiResponse>, { from: string; to: string }>("report/getR12Report", async (payload) => {
  const response = await axiosInstance.get(`/report/v1/trc_assembly?from=${payload.from}&to=${payload.to}`);
  return response;
});

export const getr9Report = createAsyncThunk<AxiosResponse<R9reportResponse>, { from: string; to: string; partner: string }>("report/getr9Report", async (payload) => {
  const response = await axiosInstance.get(`/deviceMinV2/deviceInwardReport?fromDt=${payload.from}&toDt=${payload.to}&partner=${payload.partner}`);
  return response;
});

export const getR15Report = createAsyncThunk<AxiosResponse<any>, { from: string; to: string; location: string }>("report/getr15Report", async (payload) => {
  const response = await axiosInstance.get(`/report/physicalReport?fromDate=${payload.from}&toDate=${payload.to}&location=${payload.location}`);
  return response;
});

export const updatePhysicalQuantity = createAsyncThunk<AxiosResponse<any>, { txnId: string; qty: number }>("report/updatePhysicalQuantity", async (payload) => {
  const response = await axiosInstance.put(`/report/addAbnormalQty`, { txnID: payload.txnId, qty: payload.qty });
  return response;
});

export const getR16Report = createAsyncThunk(
  "report/getR16Report",
  async (params: {
    from: string;
    to: string;
    partner: string;
    page: number;
    limit: number;
  }) => {
    const response = await axiosInstance.get(
      `/swipeMachine/report/${params.partner}?fromDate=${params.from}&toDate=${params.to}&page=${params.page}&limit=${params.limit}`
    );
    return response.data;
  }
);

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
    clearR1data(state) {
      state.r1Data = null;
    },
    clearR6data(state) {
      state.r6Report = null;
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
      .addCase(getMainR1Data.pending, (state) => {
        state.mainR1ReportLoading = true;
      })
      .addCase(getMainR1Data.fulfilled, (state, action) => {
        state.mainR1ReportLoading = false;
        if (action.payload.data.success) {
          state.mainR1Report = action.payload.data.data;
        }
      })
      .addCase(updatePhysicalQuantity.pending, (state) => {
        state.updatePhysicalQuantityLoading = true;
      })
      .addCase(updatePhysicalQuantity.fulfilled, (state) => {
        state.updatePhysicalQuantityLoading = false;
      })
      .addCase(updatePhysicalQuantity.rejected, (state) => {
        state.updatePhysicalQuantityLoading = false;
      })
      
      .addCase(getMainR1Data.rejected, (state) => {
        state.mainR1ReportLoading = false;
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
      })
      .addCase(getr5Report.pending, (state) => {
        state.r5reportLoading = true;
        state.r5report = null;
      })
      .addCase(getr5Report.fulfilled, (state, action) => {
        state.r5reportLoading = false;
        if (action.payload.data.success) {
          state.r5report = action.payload.data.data;
        }
      })
      .addCase(getr5Report.rejected, (state) => {
        state.r5reportLoading = false;
        state.r5report = null;
      })
      .addCase(getr5ReportDetail.pending, (state) => {
        state.r5reportDetailLoading = true;
        state.r5reportDetail = null;
      })
      .addCase(getr5ReportDetail.fulfilled, (state, action) => {
        state.r5reportDetailLoading = false;
        if (action.payload.data.success) {
          state.r5reportDetail = action.payload.data.data;
        }
      })
      .addCase(getr5ReportDetail.rejected, (state) => {
        state.r5reportDetailLoading = false;
        state.r5reportDetail = null;
      })
      .addCase(getr6Report.pending, (state) => {
        state.r6ReportLoading = true;
        state.r6Report = null;
      })
      .addCase(getr6Report.fulfilled, (state, action) => {
        state.r6ReportLoading = false;
        if (action.payload.data.success) {
          state.r6Report = action.payload.data.data;
        }
      })
      .addCase(getr6Report.rejected, (state) => {
        state.r6ReportLoading = false;
        state.r6Report = null;
      })
      .addCase(getWrongDeviceReport.pending, (state) => {
        state.wrongDeviceReportLoading = true;
        state.wrongDeviceReport = null;
      })
      .addCase(getWrongDeviceReport.fulfilled, (state, action) => {
        state.wrongDeviceReportLoading = false;
        if (action.payload.data.success) {
          state.wrongDeviceReport = action.payload.data.data;
        }
      })
      .addCase(getWrongDeviceReport.rejected, (state) => {
        state.wrongDeviceReportLoading = false;
        state.wrongDeviceReport = null;
      })
      .addCase(getr8Report.pending, (state) => {
        state.r8ReportLoading = true;
        state.r8Report = null;
      })
      .addCase(getr8Report.fulfilled, (state, action) => {
        state.r8ReportLoading = false;
        if (action.payload.data.success) {
          state.r8Report = action.payload.data.data;
        }
      })
      .addCase(getr8Report.rejected, (state) => {
        state.r8ReportLoading = false;
        state.r8Report = null;
      })
      .addCase(getR11Report.pending, (state) => {
        state.r11ReportLoading = true;
        state.r11Report = null;
      })
      .addCase(getR11Report.fulfilled, (state, action) => {
        state.r11ReportLoading = false;
        if (action.payload.data.success) {
          state.r11Report = action.payload.data;
        }
      })
      .addCase(getR11Report.rejected, (state) => {
        state.r11ReportLoading = false;
        state.r11Report = null;
      })
      .addCase(getR13Report.pending, (state) => {
        state.r13ReportLoading = true;
        state.r13Report = null;
      })
      .addCase(getR13Report.fulfilled, (state, action) => {
        state.r13ReportLoading = false;
        if (action.payload.data.success) {
          state.r13Report = action.payload.data;
        }
      })
      .addCase(getR13Report.rejected, (state) => {
        state.r13ReportLoading = false;
        state.r13Report = null;
      })
      .addCase(getR12Report.pending, (state) => {
        state.r12ReportLoading = true;
        state.r12Report = null;
      })
      .addCase(getR12Report.fulfilled, (state, action) => {
        state.r12ReportLoading = false;
        if (action.payload.data.success) {
          state.r12Report = action.payload.data;
        }
      })
      .addCase(getR12Report.rejected, (state) => {
        state.r12ReportLoading = false;
        state.r12Report = null;
      })
      .addCase(getR15Report.pending, (state) => {
        state.r15ReportLoading = true;
        state.r15Report = null;
      })
      .addCase(getR15Report.fulfilled, (state, action) => {
        state.r15ReportLoading = false;
        if (action.payload.data.success) {
          state.r15Report = action.payload.data;
        }
      })
      .addCase(getR15Report.rejected, (state) => {
        state.r15ReportLoading = false;
        state.r15Report = null;
      })
      .addCase(getr9Report.pending, (state) => {
        state.r9ReportLoading = true;
        state.r9report = null;
      })
      .addCase(getr9Report.fulfilled, (state, action) => {
        state.r9ReportLoading = false;
        if (action.payload.data.success) {
          state.r9report = action.payload.data.data;
        }
      })
      .addCase(getr9Report.rejected, (state) => {
        state.r9ReportLoading = false;
        state.r9report = null;
      })
      .addCase(getR16Report.pending, (state) => {
        state.r16ReportLoading = true;
      })
      .addCase(getR16Report.fulfilled, (state, action) => {
        state.r16ReportLoading = false;
        state.r16Report = action.payload;
        state.r16ReportDateRange = {
          from: action.meta.arg.from,
          to: action.meta.arg.to,
        };
        state.r16ReportPartner = action.meta.arg.partner;
      })
      .addCase(getR16Report.rejected, (state) => {
        state.r16ReportLoading = false;
      });
  },
});

export const { setRefId, clearRefId, clearR1data, clearR6data } =
  reportSlice.actions;

export default reportSlice.reducer;
