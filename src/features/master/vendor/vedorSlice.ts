import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { VendorBarnchResponse, VendorCreatePayload, VendorResponse, VendorState } from "./vendorType";
import { showToast } from "@/utils/toasterContext";

const initialState: VendorState = {
  vendor: null,
  getvendorLoading: false,
  createVendorLoading: false,
  files: null,
  uploadfileloading: false,
  vendorDetail: null,
  getVendorDetailLoading: false,
};

export const getVendor = createAsyncThunk<AxiosResponse<VendorResponse>>("master/vendor/getVendor", async () => {
  const response = await axiosInstance.get(`/vendor/vendorList`);
  return response;
});
export const getVendorBranch = createAsyncThunk<AxiosResponse<VendorBarnchResponse>, string>("master/vendor/getVendorBranch", async (id) => {
  const response = await axiosInstance.get(`/vendor/vendorDetail/${id}`);
  return response;
});
export const createVendor = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, VendorCreatePayload>("master/vendor/createVendor", async (payload) => {
  const response = await axiosInstance.post(`/vendor/addVendor`, payload);
  return response;
});
export const uploadFile = createAsyncThunk<AxiosResponse<{ success: boolean; message: string; data: { name: string } }>, FormData>("master/vendor/uploadFile", async (file) => {
  const response = await axiosInstance.post(`/vendor/uploadFiles`, file, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
});
const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVendor.pending, (state) => {
        state.getvendorLoading = true;
      })
      .addCase(getVendor.fulfilled, (state, action) => {
        state.getvendorLoading = false;
        if (action.payload.data.success) {
          state.vendor = action.payload.data.data;
        }
      })
      .addCase(getVendor.rejected, (state) => {
        state.getvendorLoading = false;
      })
      .addCase(getVendorBranch.pending, (state) => {
        state.getVendorDetailLoading = true;
      })
      .addCase(getVendorBranch.fulfilled, (state, action) => {
        state.getVendorDetailLoading = false;
        if (action.payload.data.success) {
          state.vendorDetail = action.payload.data.data;
        }
      })
      .addCase(getVendorBranch.rejected, (state) => {
        state.getVendorDetailLoading = false;
      })
      .addCase(createVendor.pending, (state) => {
        state.createVendorLoading = true;
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.createVendorLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(createVendor.rejected, (state) => {
        state.createVendorLoading = false;
      })
      .addCase(uploadFile.pending, (state) => {
        state.uploadfileloading = true;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploadfileloading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
          if (state.files) {
            state.files.push(action.payload.data.data.name);
          } else {
            state.files = [action.payload.data.data.name];
          }
        }
      })
      .addCase(uploadFile.rejected, (state) => {
        state.uploadfileloading = false;
      });
  },
});

export default vendorSlice.reducer;
