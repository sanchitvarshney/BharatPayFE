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
  formData:null
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
