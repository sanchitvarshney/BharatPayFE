import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TrcFinalSubmitPayload, TrcfinalSubmitResponse, TrcListResponse, TRCRequestApiResponse, ViewTrcState } from "./viewTrcType";

const initialState: ViewTrcState = {
  getTrcListLoading: false,
  trcList: null,
  TRCDetail: null,
  trcRequestDetail: null,
  getTrcRequestDetailLoading: false,
  TrcFinalSubmitLoading: false,
};

export const getTrcList = createAsyncThunk<AxiosResponse<TrcListResponse>>("trc/list", async () => {
  const response = await axiosInstance.get("/trc/list");
  return response;
});
export const getTrcRequestDetail = createAsyncThunk<AxiosResponse<TRCRequestApiResponse>, string>("trc/getTrcRequestDetail", async (txnid) => {
  const response = await axiosInstance.get(`/trc/detail/${txnid}`);
  return response;
});
export const trcFinalSubmit = createAsyncThunk<AxiosResponse<TrcfinalSubmitResponse>, TrcFinalSubmitPayload>("trc/trcFinalSubmit", async (payload) => {
  const response = await axiosInstance.post(`/trc/submit`, payload);
  return response;
});

const viewTrcSlice = createSlice({
  name: "viewTrcSlice",
  initialState,
  reducers: {
    setTrcDetail(state, action) {
      state.TRCDetail = action.payload;
    },
    clearTrcDetail(state) {
      state.TRCDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTrcList.pending, (state) => {
        state.getTrcListLoading = true;
      })
      .addCase(getTrcList.fulfilled, (state, action) => {
        state.getTrcListLoading = false;
        if (action.payload.data.success) {
          state.trcList = action.payload.data.data;
        }
      })
      .addCase(getTrcList.rejected, (state) => {
        state.getTrcListLoading = false;
        state.trcList = null;
      })
      .addCase(getTrcRequestDetail.pending, (state) => {
        state.getTrcRequestDetailLoading = true;
      })
      .addCase(getTrcRequestDetail.fulfilled, (state, action) => {
        state.getTrcRequestDetailLoading = false;
        if (action.payload.data.success) {
          state.trcRequestDetail = action.payload.data.data;
        }
      })
      .addCase(getTrcRequestDetail.rejected, (state) => {
        state.getTrcRequestDetailLoading = false;
      })
      .addCase(trcFinalSubmit.pending, (state) => {
        state.TrcFinalSubmitLoading = true;
      })
      .addCase(trcFinalSubmit.fulfilled, (state) => {
        state.TrcFinalSubmitLoading = false;
      })
      .addCase(trcFinalSubmit.rejected, (state) => {
        state.TrcFinalSubmitLoading = false;
      });
  },
});

export const { setTrcDetail, clearTrcDetail } = viewTrcSlice.actions;
export default viewTrcSlice.reducer;
