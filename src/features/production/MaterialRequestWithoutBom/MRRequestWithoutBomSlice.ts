import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { AvailbleQtyResponse, CreateProductRequestResponse, CreateProductRequestType, CreateSwipeDeviceRequestType, LocationApiresponse, MrRequestWithoutBom, PartCodeDataresponse, SkuCodeDataresponse } from "./MRRequestWithoutBomType";
import { showToast } from "@/utils/toasterContext";

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
  getAvailbleQtyLoading: false,
  availbleQtyData: null,  
  transferRequestLoading: false,
  preQcLocation: [],
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

export const createTransferRequest = createAsyncThunk<AxiosResponse<any>, any>("/req/branch-transfer", async (value) => {
  const response = await axiosInstance.post(`/deviceBranchTransfer/createChallan?type=${value.type}`, value);
  return response;
});


export const createSwipeDeviceRequest = createAsyncThunk<AxiosResponse<CreateProductRequestResponse>, CreateSwipeDeviceRequestType>("/req/swipe-device", async (value) => {
  const response = await axiosInstance.post(`/reqv2/createMaterialReqV2`, value);
  return response;
});

export const getLocationAsync = createAsyncThunk<AxiosResponse<LocationApiresponse>, string | null>("wearhouse/getLocation", async (params) => {
  const response = await axiosInstance.get(`/backend/search/location/${params}`);
  return response;
});

export const getPreQCLocationAsync = createAsyncThunk<AxiosResponse<LocationApiresponse>, string | null>("preQc/getLocation", async () => {
  const response = await axiosInstance.get(`/preQc/pickLocation`);
  return response;
});

export const getAvailbleQty = createAsyncThunk<AxiosResponse<AvailbleQtyResponse>, { type: string; itemCode: string; location: any }>("wearhouse/getAvailbleQty", async (params) => {
  const response = await axiosInstance.get(`/backend/stock/${params.type}/${params.itemCode}/${params.location.value ? params.location.value : params.location}`);
  return response;
});

export const getSwipeAvailbleQty = createAsyncThunk<AxiosResponse<AvailbleQtyResponse>, { type: string; itemCode: string; location: any }>("wearhouse/getAvailbleQty", async (params) => {
  const response = await axiosInstance.get(`/backend/stockv2/${params.type}/${params.itemCode}/${params.location.value ? params.location.value : params.location}`);
  return response;
});

const materialRequestSlice = createSlice({
  name: "mrrequestwithoutbom",
  initialState,
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    },
    clearAvaibleQtyData: (state) => {
      state.availbleQtyData = null;
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
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(createProductRequest.rejected, (state) => {
        state.createProductRequestLoading = false;
      })
      .addCase(createSwipeDeviceRequest.pending, (state) => {
        state.createProductRequestLoading = true;
      })
      .addCase(createSwipeDeviceRequest.fulfilled, (state, action) => {
        state.createProductRequestLoading = false;
        if (action.payload.data.success) {
          state.craeteRequestData = action.payload.data;
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(createSwipeDeviceRequest.rejected, (state) => {
        state.createProductRequestLoading = false;
      })
      .addCase(createTransferRequest.pending, (state) => {
        state.transferRequestLoading = true;
      })
      .addCase(createTransferRequest.fulfilled, (state) => {
        state.transferRequestLoading = false;
      })
      .addCase(createTransferRequest.rejected, (state) => {
        state.transferRequestLoading = false;
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
      .addCase(getPreQCLocationAsync.pending, (state) => {
        state.getLocationDataLoading = true;
      })
      .addCase(getPreQCLocationAsync.fulfilled, (state, action) => {
        state.getLocationDataLoading = false;
        if (action.payload.data.success) {
          state.preQcLocation = action.payload.data.data;
        }
      })
      .addCase(getPreQCLocationAsync.rejected, (state) => {
        state.getLocationDataLoading = false;
      })
      .addCase(getAvailbleQty.pending, (state) => {
        state.getAvailbleQtyLoading = true;
      })
      .addCase(getAvailbleQty.fulfilled, (state, action) => {
        state.getAvailbleQtyLoading = false;
        if (action.payload.data.success) {
          if (!state.availbleQtyData) {
            state.availbleQtyData = [action.payload.data.data];
          } else {
            state.availbleQtyData.push(action.payload.data.data);
          }
        }
      })
      .addCase(getAvailbleQty.rejected, (state) => {
        state.getAvailbleQtyLoading = false;
      });
  },
});

export const { setType } = materialRequestSlice.actions;
export default materialRequestSlice.reducer;
