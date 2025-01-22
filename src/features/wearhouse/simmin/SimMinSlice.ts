import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateSimMINPayload, MINInformationResponse, SimMinStateType } from "./SimMinType";
import { AxiosResponse } from "axios";
import axiosInstance from "@/api/axiosInstance";
import { showToast } from "@/utils/toasterContext";

const initialState: SimMinStateType = {
  minInfo: null,
  getMinInfoLoading: false,
  createSimMinLoading: false,
};

export const getMinInfo = createAsyncThunk<AxiosResponse<MINInformationResponse>, string>("simmin/getMinInfo", async (min) => {
  const response = await axiosInstance.get(`/backend/min/info?minTxn=${min}`);
  return response;
});
export const createSiMMIN = createAsyncThunk<AxiosResponse<{ message: string; success: boolean; data: { txnID: string } }>, CreateSimMINPayload>("simmin/CreateSiMMIN", async (payload) => {
  const response = await axiosInstance.post(`/transaction/save/sim`, payload);
  return response;
});

const SimMinSlice = createSlice({
  name: "simmin",
  initialState,
  reducers: {
    clearMinInfo(state) {
      state.minInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMinInfo.pending, (state) => {
        state.getMinInfoLoading = true;
      })
      .addCase(getMinInfo.fulfilled, (state, action) => {
        state.getMinInfoLoading = false;
        if (action.payload.data.success) {
          state.minInfo = action.payload.data.data;
        }
      })
      .addCase(getMinInfo.rejected, (state) => {
        state.getMinInfoLoading = false;
      })
      .addCase(createSiMMIN.pending, (state) => {
        state.createSimMinLoading = true;
      })
      .addCase(createSiMMIN.fulfilled, (state, action) => {
        state.createSimMinLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(createSiMMIN.rejected, (state) => {
        state.createSimMinLoading = false;
      });
  },
});

export const { clearMinInfo } = SimMinSlice.actions;
export default SimMinSlice.reducer;
