import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { PoListResponse, PoStateType } from "./poTypes";

const initialState: PoStateType = {
  data: [],
  loading: false,
  error: null,
  managePoData: [],
  dateRange:null,
  formData:null,
  printLoading:false,
  cancelLoading:false
};
export const getListofPo = createAsyncThunk<
  AxiosResponse<PoListResponse>,
  { wise: "powise" | "datewise" | "vendorwise" | string ; data: string; limit: number; page: number }
>("po/fetchPendingData4PO", async (payload) => {
  console.log(payload.data,"list of po change page")
  const response = await axiosInstance.get(
    payload.wise === "powise"
      ? `/po/fetchPendingData4PO?wise=powise&data=${payload.data}&limit=${payload.limit}&page=${payload.page}`
      : `/po/fetchPendingData4PO?wise=datewise&data=${payload.data}&limit=${payload.limit}&page=${payload.page}`
  );

  return response;
});

export const createPO = createAsyncThunk<AxiosResponse<any>, any>("po/createPO", async (payload) => {
  const response = await axiosInstance.post("/po/createPO", payload);
  return response;
});

export const cancelPO = createAsyncThunk<AxiosResponse<any>, any>("po/cancelPO", async (payload) => {
  const response = await axiosInstance.post("/po/cancelPO", payload);
  return response;
});

export const poPrint = createAsyncThunk<AxiosResponse<any>, { id: string }>(
  "/poPrint",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/po/printPo?poid=${data.id}`, {
        responseType: "blob",
      });

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PO_${data.id}.pdf`;
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

const procurementPoSlice = createSlice({
  name: "procurementPo",
  initialState,
  reducers: {
    setDateRange(state, action: any) {
      state.dateRange = action.payload;
    },
    setFormData(state, action: any) {
      state.formData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListofPo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getListofPo.fulfilled, (state, action) => {
        state.loading = false;
 
        state.managePoData = action.payload.data;
      })
      .addCase(getListofPo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(poPrint.pending, (state) => {
        state.printLoading = true;
      })
      .addCase(poPrint.fulfilled, (state) => {
        state.printLoading = false;
       })
      .addCase(poPrint.rejected, (state, action) => {
        state.printLoading = false;
        state.error = action.error.message;
      })
      .addCase(cancelPO.pending, (state) => {
        state.cancelLoading = true;
      })
      .addCase(cancelPO.fulfilled, (state) => {
        state.cancelLoading = false;
      })
      .addCase(cancelPO.rejected, (state, action) => {
        state.cancelLoading = false;
        state.error = action.error.message;
      })
      .addCase(createPO.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPO.fulfilled, (state, action) => {
        state.loading = false;
 
        state.managePoData = action.payload.data;
      })
      .addCase(createPO.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setDateRange, setFormData } = procurementPoSlice.actions;

export default procurementPoSlice.reducer;
