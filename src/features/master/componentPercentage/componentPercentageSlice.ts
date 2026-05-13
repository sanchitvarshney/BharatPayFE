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
} from "./componentPercentageType";

const initialState: ComponentPercentageState = {
  components: null,
  reportData: null,
  reportHeaders: null,
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
  const response = await axiosInstance.get(
    `componentPercentage/report?totalDevice=${encodeURIComponent(payload.totalDevice)}`,
  );
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
      });
  },
});

export default componentPercentageSlice.reducer;
