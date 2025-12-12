import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { CreateGPDCPayload, GPDCChallanState } from "./GPDCChallanType";
import { showToast } from "@/utils/toasterContext";

const initialState: GPDCChallanState = {
  createGPDCLoading: false,
  gpdcList: null,
  getGPDCLoading: false,
  gpdcDetail: null,
  getGPDCDetailLoading: false,
};

export const createGPDC = createAsyncThunk<
  AxiosResponse<{ success: boolean; message: string }>,
  CreateGPDCPayload
>("gpdc/createGPDC", async (payload) => {
  const response = await axiosInstance.post(`/gpdc/create`, payload);
  return response;
});

export const getGPDCList = createAsyncThunk<
  AxiosResponse<{ success: boolean; message: string; data: any }>,
  { from?: string; to?: string }
>("gpdc/getGPDCList", async (query) => {
  const response = await axiosInstance.post(
    `/gpdc/fetch?fromDate=${query.from || ""}&toDate=${query.to || ""}`
  );
  return response;
});

export const getGPDCById = createAsyncThunk<
  AxiosResponse<{ success: boolean; message: string; data: any }>,
  { gpdcId: string }
>("gpdc/getGPDCById", async (data) => {
  const response = await axiosInstance.post(`/gpdc/fetchById`, data);
  return response;
});

const gpdcChallanSlice = createSlice({
  name: "gpdcChallan",
  initialState,
  reducers: {
    clearGPDCData: (state) => {
      state.gpdcDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGPDC.pending, (state) => {
        state.createGPDCLoading = true;
      })
      .addCase(createGPDC.fulfilled, (state, action) => {
        state.createGPDCLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(createGPDC.rejected, (state) => {
        state.createGPDCLoading = false;
      })
      .addCase(getGPDCList.pending, (state) => {
        state.getGPDCLoading = true;
      })
      .addCase(getGPDCList.fulfilled, (state, action) => {
        state.getGPDCLoading = false;
        if (action.payload.data.success) {
          state.gpdcList = action.payload.data.data;
        }
      })
      .addCase(getGPDCList.rejected, (state) => {
        state.getGPDCLoading = false;
      })
      .addCase(getGPDCById.pending, (state) => {
        state.getGPDCDetailLoading = true;
      })
      .addCase(getGPDCById.fulfilled, (state, action) => {
        state.getGPDCDetailLoading = false;
        if (action.payload.data.success) {
          state.gpdcDetail = action.payload.data.data;
        }
      })
      .addCase(getGPDCById.rejected, (state) => {
        state.getGPDCDetailLoading = false;
      });
  },
});

export const { clearGPDCData } = gpdcChallanSlice.actions;
export default gpdcChallanSlice.reducer;

