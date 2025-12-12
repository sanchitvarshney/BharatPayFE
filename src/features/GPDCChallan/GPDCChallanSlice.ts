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
  manageGPDCData: null,
  dateRange: null,
  printLoading: false,
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

export const getListofGPDC = createAsyncThunk<
  AxiosResponse<any>,
  { wise: "gpdcwise" | "datewise" | string; data: string; limit: number; page: number }
>("gpdc/getListofGPDC", async (payload) => {
  const response = await axiosInstance.get(
    payload.wise === "gpdcwise"
      ? `/gpdc/fetch?wise=gpdcwise&data=${payload.data}&limit=${payload.limit}&page=${payload.page}`
      : `/gpdc/fetch?wise=datewise&data=${payload.data}&limit=${payload.limit}&page=${payload.page}`
  );
  return response;
});

export const printGPDC = createAsyncThunk<AxiosResponse<any>, { id: string }>(
  "gpdc/printGPDC",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/gpdc/print?gpdcId=${data.id}`, {
        responseType: "blob",
      });

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `GP_DC_${data.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Return success response
      return {
        success: true,
        data: null,
        message: "PDF downloaded successfully",
      } as any;
    } catch (error: any) {
      // Return error response using rejectWithValue
      return rejectWithValue({
        success: false,
        data: null,
        message: error.message || "Failed to download PDF",
        error: error,
      } as any);
    }
  }
);

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
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
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
      })
      .addCase(getListofGPDC.pending, (state) => {
        state.getGPDCLoading = true;
      })
      .addCase(getListofGPDC.fulfilled, (state, action) => {
        state.getGPDCLoading = false;
        if (action.payload.data.success) {
          state.manageGPDCData = action.payload.data.data;
        }
      })
      .addCase(getListofGPDC.rejected, (state) => {
        state.getGPDCLoading = false;
      })
      .addCase(printGPDC.pending, (state) => {
        state.printLoading = true;
      })
      .addCase(printGPDC.fulfilled, (state) => {
        state.printLoading = false;
      })
      .addCase(printGPDC.rejected, (state) => {
        state.printLoading = false;
      });
  },
});

export const { clearGPDCData, setDateRange } = gpdcChallanSlice.actions;
export default gpdcChallanSlice.reducer;

