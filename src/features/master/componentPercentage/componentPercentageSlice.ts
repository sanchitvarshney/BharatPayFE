import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  ComponentPercentageState,
  ComponentPercentageReportPayload,
  ComponentPercentageReportResponse,
  FetchMasterComponentPercentagePayload,
  FetchMasterComponentPercentageResponse,
  InsertComponentPercentagePayload,
  InsertComponentPercentageResponse,
  PoHistoryPayload,
  PoHistoryResponse,
} from "./componentPercentageType";

const initialState: ComponentPercentageState = {
  components: null,
  reportData: null,
  reportHeaders: null,
  poHistoryData: null,
  poHistoryType: null,
  poHistoryLoading: false,
  fetchLoading: false,
  insertLoading: false,
  reportLoading: false,
};

export const fetchMasterComponentPercentageAsync = createAsyncThunk<
  AxiosResponse<FetchMasterComponentPercentageResponse>,
  FetchMasterComponentPercentagePayload
>("componentPercentage/fetchMasterComponent", async (payload) => {
  const response = await axiosInstance.get(
    `componentPercentage/fetchMasterComponent?deviceType=${encodeURIComponent(payload.deviceType)}`,
  );
  return response;
});

export const insertComponentPercentageAsync = createAsyncThunk<
  AxiosResponse<InsertComponentPercentageResponse>,
  InsertComponentPercentagePayload
>("componentPercentage/insert", async (payload) => {
  const response = await axiosInstance.post("componentPercentage/insert", payload);
  return response;
});

export const fetchComponentPercentageReportAsync = createAsyncThunk<
  AxiosResponse<ComponentPercentageReportResponse>,
  ComponentPercentageReportPayload
>("componentPercentage/report", async (payload) => {
  const params = new URLSearchParams({
    totalDevice: String(payload.totalDevice),
    deviceType: payload.deviceType,
    sku: payload.sku,
  });
  const response = await axiosInstance.get(`componentPercentage/report?${params.toString()}`);
  return response;
});

export const fetchPoHistoryAsync = createAsyncThunk<
  AxiosResponse<PoHistoryResponse>,
  PoHistoryPayload
>("componentPercentage/poHistory", async (payload) => {
  const response = await axiosInstance.post("componentPercentage/poHistory", payload);
  return response;
});

const componentPercentageSlice = createSlice({
  name: "componentPercentage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMasterComponentPercentageAsync.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchMasterComponentPercentageAsync.fulfilled, (state, action) => {
        state.fetchLoading = false;
        if (action.payload.data.success) {
          state.components = action.payload.data.data;
        }
      })
      .addCase(fetchMasterComponentPercentageAsync.rejected, (state) => {
        state.fetchLoading = false;
      })
      .addCase(insertComponentPercentageAsync.pending, (state) => {
        state.insertLoading = true;
      })
      .addCase(insertComponentPercentageAsync.fulfilled, (state) => {
        state.insertLoading = false;
      })
      .addCase(insertComponentPercentageAsync.rejected, (state) => {
        state.insertLoading = false;
      })
      .addCase(fetchComponentPercentageReportAsync.pending, (state) => {
        state.reportLoading = true;
      })
      .addCase(fetchComponentPercentageReportAsync.fulfilled, (state, action) => {
        state.reportLoading = false;
        if (action.payload.data.success) {
          state.reportHeaders = action.payload.data.headers ?? [];
          state.reportData = action.payload.data.data ?? [];
        }
      })
      .addCase(fetchComponentPercentageReportAsync.rejected, (state) => {
        state.reportLoading = false;
      })
      .addCase(fetchPoHistoryAsync.pending, (state) => {
        state.poHistoryLoading = true;
      })
      .addCase(fetchPoHistoryAsync.fulfilled, (state, action) => {
        state.poHistoryLoading = false;
        if (action.payload.data.success) {
          state.poHistoryData = action.payload.data.data ?? [];
          state.poHistoryType = action.payload.data.type ?? null;
        }
      })
      .addCase(fetchPoHistoryAsync.rejected, (state) => {
        state.poHistoryLoading = false;
      });
  },
});

export default componentPercentageSlice.reducer;
