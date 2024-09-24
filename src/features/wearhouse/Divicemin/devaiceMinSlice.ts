import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  CheckSerialPayload,
  CheckSerialResponse,
  CreateMinPayload,
  CreateMinResponse,
  DeviceMinSate,
  DeviceStatusResponse,
  LocationApiresponse,
  UomApiResponse,
  UpateMINpayload,
  UpdateMinResponse,
  UploadInvoiceFileApiResponse,
  UploadSerialFileResponse,
  VendorAddressApiResponse,
} from "./DeviceMinType";
import { showToast } from "@/utils/toastUtils";

const initialState: DeviceMinSate = {
  getLocationLoading: false,
  locationData: null,
  getVendorLoading: false,
  VendorData: null,
  getVendorBranchLoading: false,
  VendorBranchData: null,
  venderaddressloading: false,
  venderaddressdata: null,
  uploadSerialFileLoading: false,
  serialFiledata: null,
  uploadInvoiceFileLoading: false,
  invociceFiledata: null,
  skuLoading: false,
  skuData: null,
  getUomLoading: false,
  UomData: null,
  checkSerialLoading: false,
  checkserialData: null,
  createMinLoading: false,
  createMinData: null,
  updateMinLoading: false,
  getAllSubminInfo: null,
  getAllsubmitinfoLoading: false,
  finaSubmitLoading: false,
  updateMinData: null,
  storeStep1formData: null,
  storeSerialFiles: null,
  storeInvoiceFiles: null,
  storeDraftMinData: null,
  min_no: null,
};

export const getLocationAsync = createAsyncThunk<AxiosResponse<LocationApiresponse>, string | null>("wearhouse/getLocation", async (params) => {
  const response = await axiosInstance.get(`/backend/search/location/${params}`);
  return response;
});

export const getSkuAsync = createAsyncThunk<AxiosResponse<LocationApiresponse>, string | null>("wearhouse/sku", async (params) => {
  const response = await axiosInstance.get(`/product/bySku/${params}`);
  return response;
});

export const getVendorAsync = createAsyncThunk<AxiosResponse<LocationApiresponse>, string | null>("wearhouse/getVendor", async (params) => {
  const response = await axiosInstance.get(`/vendor/vendorOptions/${params}`);
  return response;
});
export const getVendorBranchAsync = createAsyncThunk<AxiosResponse<LocationApiresponse>, string>("wearhouse/getVendorBranch", async (params) => {
  const response = await axiosInstance.get(`/vendor/vendorBranchList?vendorcode=${params}`);
  return response;
});
export const getVendorAddress = createAsyncThunk<AxiosResponse<VendorAddressApiResponse>, string>("wearhouse/getVendoraddress", async (params) => {
  const response = await axiosInstance.get(`/vendor/vendorAddress?branchcode=${params}`);
  return response;
});
export const uploadSerialFile = createAsyncThunk<AxiosResponse<UploadSerialFileResponse>, FormData>("wearhouse/deviceMin/uploadSerial", async (params) => {
  const response = await axiosInstance.post(`/deviceMin/uploadSerial`, params, { headers: { "Content-Type": "multipart/form-data" } });
  return response;
});
export const uploadInvoiceFile = createAsyncThunk<AxiosResponse<UploadInvoiceFileApiResponse>, FormData>("wearhouse/deviceMin/upload-invoice", async (params) => {
  const response = await axiosInstance.post(`/deviceMin/upload-invoice`, params, { headers: { "Content-Type": "multipart/form-data" } });
  return response;
});

export const getUomBySku = createAsyncThunk<AxiosResponse<UomApiResponse>, string>("wearhouse/getuombysku", async (productkey) => {
  const response = await axiosInstance.get(`/product/fetchProductData?product_key=${productkey}`);
  return response;
});
export const checkSerial = createAsyncThunk<AxiosResponse<CheckSerialResponse>, CheckSerialPayload>("wearhouse/checkserail", async (serialdata) => {
  const response = await axiosInstance.get(`deviceMin/check/${serialdata.fileref}?serial=${serialdata.serials}`);
  return response;
});
export const UpdateDEviceMin = createAsyncThunk<AxiosResponse<UpdateMinResponse>, UpateMINpayload>("wearhouse/updatemin", async (minUpdatedata) => {
  const response = await axiosInstance.post(`/deviceMin/updateSerial`, minUpdatedata);
  return response;
});

export const createMinAsync = createAsyncThunk<AxiosResponse<CreateMinResponse>, CreateMinPayload>("wearhouse/deviceMin/device", async (minData) => {
  const response = await axiosInstance.post(`/deviceMin/device`, minData);
  return response;
});

export const getAllSubmitInfo = createAsyncThunk<AxiosResponse<DeviceStatusResponse>, string>("wearhouse/getAllsubmit", async (min) => {
  const response = await axiosInstance.get(`/deviceMin/fetchDeviceMinData?min_id=${min}`);
  return response;
});
export const submitFinalStage = createAsyncThunk<AxiosResponse<{ message: string; success: boolean;data:{min_no: string} }>, string>("/deviceMin/updateToFinal", async (min) => {
  const response = await axiosInstance.put(`/deviceMin/updateToFinal`, { min_id: min });
  return response;
});
const DeviceMinSlice = createSlice({
  name: "deviceMin",
  initialState,
  reducers: {
    storeStepFormdata: (state, action) => {
      if (action.payload) {
        state.storeStep1formData = action.payload;
      }
    },
    resetForm: (state) => {
      state.storeStep1formData = null;
    },
    storeSerialFile: (state, action) => {
      if (action.payload) {
        state.storeSerialFiles = action.payload;
      }
    },
    storeInvoiceFile: (state, action) => {
      if(state.storeInvoiceFiles){
        state.storeInvoiceFiles?.push(action.payload);
      }else{
        state.storeInvoiceFiles = [action.payload];
      }
      
    },
    resetInvoiceFile: (state) => {
      state.storeInvoiceFiles = null;
    },
    resetSerialFile: (state) => {
      state.storeSerialFiles = null;
    },
    storeDraftMin: (state, action) => {
      if (action.payload) {
        state.storeDraftMinData = action.payload;
      }
    },
    resetDraftMin: (state) => {
      state.storeDraftMinData = null;
    },
    resetAllSubmitInfo: (state) => {
      state.getAllSubminInfo = null;
    },
    reseAllupdateDeviceInfo: (state) => {
      state.updateMinData = null;
    },
    crearLocation: (state) => {
      state.locationData= null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLocationAsync.pending, (state) => {
        state.getLocationLoading = true;
      })
      .addCase(getLocationAsync.fulfilled, (state, action) => {
        state.getLocationLoading = false;
        if (action.payload.data.success) {
          state.locationData = action.payload.data.data;
        }
      })
      .addCase(getLocationAsync.rejected, (state) => {
        state.getLocationLoading = false;
      })
      .addCase(getSkuAsync.pending, (state) => {
        state.skuLoading = true;
      })
      .addCase(getSkuAsync.fulfilled, (state, action) => {
        state.skuLoading = false;
        if (action.payload.data.success) {
          state.skuData = action.payload.data.data;
        }
      })
      .addCase(getSkuAsync.rejected, (state) => {
        state.skuLoading = false;
      })
      .addCase(getVendorAsync.pending, (state) => {
        state.getVendorLoading = true;
      })
      .addCase(getVendorAsync.fulfilled, (state, action) => {
        state.getVendorLoading = false;
        if (action.payload.data.success) {
          state.VendorData = action.payload.data.data;
        }
      })
      .addCase(getVendorAsync.rejected, (state) => {
        state.getVendorLoading = false;
      })
      .addCase(getVendorBranchAsync.pending, (state) => {
        state.getVendorBranchLoading = true;
      })
      .addCase(getVendorBranchAsync.fulfilled, (state, action) => {
        state.getVendorBranchLoading = false;
        if (action.payload.data.success) {
          state.VendorBranchData = action.payload.data.data;
        }
      })
      .addCase(getVendorBranchAsync.rejected, (state) => {
        state.getVendorBranchLoading = false;
      })
      .addCase(getVendorAddress.pending, (state) => {
        state.venderaddressloading = true;
      })
      .addCase(getVendorAddress.fulfilled, (state, action) => {
        state.venderaddressloading = false;
        if (action.payload.data.success) {
          state.venderaddressdata = action.payload.data.data;
        }
      })
      .addCase(getVendorAddress.rejected, (state) => {
        state.venderaddressloading = false;
      })
      .addCase(uploadSerialFile.pending, (state) => {
        state.uploadSerialFileLoading = true;
      })
      .addCase(uploadSerialFile.fulfilled, (state, action) => {
        state.uploadSerialFileLoading = false;
        if (action.payload.data.success) {
          state.serialFiledata = action.payload.data.data;
        }
      })
      .addCase(uploadSerialFile.rejected, (state) => {
        state.uploadSerialFileLoading = false;
      })
      .addCase(uploadInvoiceFile.pending, (state) => {
        state.uploadInvoiceFileLoading = true;
      })
      .addCase(uploadInvoiceFile.fulfilled, (state, action) => {
        state.uploadInvoiceFileLoading = false;
        if (action.payload.data.success) {
          state.invociceFiledata = action.payload.data.data;
        }
      })
      .addCase(uploadInvoiceFile.rejected, (state) => {
        state.uploadInvoiceFileLoading = false;
      })
      .addCase(getUomBySku.pending, (state) => {
        state.getUomLoading = true;
      })
      .addCase(getUomBySku.fulfilled, (state, action) => {
        state.getUomLoading = false;
        if (action.payload.data.success) {
          state.UomData = action.payload.data?.data;
        }
      })
      .addCase(getUomBySku.rejected, (state) => {
        state.getUomLoading = false;
      })
      .addCase(checkSerial.pending, (state) => {
        state.checkSerialLoading = true;
      })
      .addCase(checkSerial.fulfilled, (state, action) => {
        state.checkSerialLoading = false;
        if (action.payload.data.success) {
          state.checkserialData = action.payload.data;
        }
      })
      .addCase(checkSerial.rejected, (state) => {
        state.checkSerialLoading = false;
      })
      .addCase(createMinAsync.pending, (state) => {
        state.createMinLoading = true;
      })
      .addCase(createMinAsync.fulfilled, (state, action) => {
        state.createMinLoading = false;
        if (action.payload.data.success) {
          
          state.createMinData = action.payload.data.data;
        }
      })
      .addCase(createMinAsync.rejected, (state) => {
        state.createMinLoading = false;
      })
      .addCase(UpdateDEviceMin.pending, (state) => {
        state.updateMinLoading = true;
      })
      .addCase(UpdateDEviceMin.fulfilled, (state, action) => {
        state.updateMinLoading = false;
        if (action.payload.data.success) {
          state.updateMinData = action.payload.data.data;
        
        }
      })
      .addCase(UpdateDEviceMin.rejected, (state) => {
        state.updateMinLoading = false;
      })
      .addCase(getAllSubmitInfo.pending, (state) => {
        state.getAllsubmitinfoLoading = true;
      })
      .addCase(getAllSubmitInfo.fulfilled, (state, action) => {
        state.getAllsubmitinfoLoading = false;
        if (action.payload.data.success) {
          state.getAllSubminInfo = action.payload.data;
        }
      })
      .addCase(getAllSubmitInfo.rejected, (state) => {
        state.getAllsubmitinfoLoading = false;
      })
      .addCase(submitFinalStage.pending, (state) => {
        state.finaSubmitLoading = true;
      })
      .addCase(submitFinalStage.fulfilled, (state, action) => {
        state.finaSubmitLoading = false;
        if (action.payload.data.success) {
          state.min_no = action.payload.data?.data?.min_no;
          showToast({
            description: action.payload.data?.message,
            variant: "success",
          });
        }
      })
      .addCase(submitFinalStage.rejected, (state) => {
        state.finaSubmitLoading = false;
      });
  },
});

export const { storeDraftMin, storeInvoiceFile, storeSerialFile, storeStepFormdata, resetDraftMin, resetInvoiceFile, resetSerialFile, resetForm,resetAllSubmitInfo,reseAllupdateDeviceInfo ,crearLocation} = DeviceMinSlice.actions;
export default DeviceMinSlice.reducer;
