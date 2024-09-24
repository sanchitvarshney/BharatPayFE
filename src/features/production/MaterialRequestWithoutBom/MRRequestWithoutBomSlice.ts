import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { CreateProductRequestResponse, CreateProductRequestType, LocationApiresponse, MrRequestWithoutBom, PartCodeDataresponse, SkuCodeDataresponse } from "./MRRequestWithoutBomType";

const initialState: MrRequestWithoutBom = {
  getPartCodeLoading: false,
  partCodeData: null,
  getSkuLoading: false,
  skuCodeData: null,
  type: "device",
  createProductRequestLoading: false,
  locationData: null,
  getLocationDataLoading: false,
  craeteRequestData: null,
};

export const getPertCodesync = createAsyncThunk<AxiosResponse<PartCodeDataresponse>, string | null>("master/getPertCode", async (value) => {
  const response = await axiosInstance.get(`/backend/search/item/${value}`);
  return response;
});
export const getSkuAsync = createAsyncThunk<AxiosResponse<SkuCodeDataresponse>, string | null>("master/getSkuCode", async (value) => {
  const response = await axiosInstance.get(`/backend/search/sku/${value}`);
  return response;
});
export const createProductRequest = createAsyncThunk<AxiosResponse<CreateProductRequestResponse>, CreateProductRequestType>("/req/without-bom", async (value) => {
  const response = await axiosInstance.post(`/req/without-bom/${value.reqType}`, value);
  return response;
});
export const getLocationAsync = createAsyncThunk<AxiosResponse<LocationApiresponse>, string | null>("wearhouse/getLocation", async (params) => {
  const response = await axiosInstance.get(`/backend/search/location/${params}`);
  return response;
});

const materialRequestSlice = createSlice({
  name: "mrrequestwithoutbom",
  initialState,
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getPertCodesync.pending, (state) => {
        state.getPartCodeLoading = true;
      })
      .addCase(getPertCodesync.fulfilled, (state, action) => {
        state.getPartCodeLoading = false;
        if (action.payload.data.success) {
          state.partCodeData = action.payload.data.data;
        }
      })
      .addCase(getPertCodesync.rejected, (state) => {
        state.getPartCodeLoading = false;
      })
      .addCase(getSkuAsync.pending, (state) => {
        state.getPartCodeLoading = true;
      })
      .addCase(getSkuAsync.fulfilled, (state, action) => {
        state.getPartCodeLoading = false;
        if (action.payload.data.success) {
          state.skuCodeData = action.payload.data.data;
        }
      })
      .addCase(getSkuAsync.rejected, (state) => {
        state.getPartCodeLoading = false;
      })
      .addCase(createProductRequest.pending, (state) => {
        state.createProductRequestLoading = true;
      })
      .addCase(createProductRequest.fulfilled, (state, action) => {
        state.createProductRequestLoading = false;
        if (action.payload.data.success) {
          state.craeteRequestData = action.payload.data;
        }
      })
      .addCase(createProductRequest.rejected, (state) => {
        state.createProductRequestLoading = false;
      })
      .addCase(getLocationAsync.pending, (state) => {
        state.getLocationDataLoading = true;
      })
      .addCase(getLocationAsync.fulfilled, (state, action) => {
        state.getLocationDataLoading = false;
        if (action.payload.data.success) {
          state.locationData = action.payload.data.data;
        }
      })
      .addCase(getLocationAsync.rejected, (state) => {
        state.getLocationDataLoading = false;
      })
  },
});

export const { setType } = materialRequestSlice.actions;
export default materialRequestSlice.reducer;
