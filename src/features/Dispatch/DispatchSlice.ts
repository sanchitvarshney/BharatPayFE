import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { DispatchItemPayload, DispatchState, DispatchWrongItemPayload } from "./DispatchType";
import { showToast } from "@/utils/toasterContext";

const initialState: DispatchState = {
  dispatchCreateLoading: false,
  uploadFileLoading: false,
  file: null,
  clientList: null,
  clientLoading: false,
  clientBranchList: null,
  clientBranchLoading: false,
  wrongDispatchLoading:false,
  dispatchData: null,
  dispatchDataLoading: false,
  ewayBillDataLoading:false,
  stateCodeLoading:false,
  stateCode:null,
  challanList: null,
  getChallanLoading: false,
  createChallanLoading:false,
  updateChallanLoading:false,
  branchLoading:false,
  branchList:null,
};

export const CreateDispatch = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, DispatchItemPayload>("dispatch/CreateDispatch", async (payload) => {
  const response = await axiosInstance.post(`dispatchDivice/createDispatch`, payload);
  return response;
});

export const CreateChallan = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, DispatchItemPayload>("dispatch/CreateChallan", async (payload) => {
  const response = await axiosInstance.post(`challan/create`, payload);
  return response;
});

export const UpdateChallan = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, DispatchItemPayload>("dispatch/UpdateChallan", async (payload) => {
  const response = await axiosInstance.post(`challan/editPerforma`, payload);
  return response;
});

export const getChallan = createAsyncThunk<AxiosResponse<{ success: boolean; message: string,data: any }>, { from?: string; to?: string; type: string; device?: string }>("dispatch/getChallan", async (query) => {
  const response = await axiosInstance.post(`challan/fetchPerforma?fromDate=${query.from}&toDate=${query.to}`);
  return response;
});

export const getChallanById = createAsyncThunk<AxiosResponse<{ success: boolean; message: string,data: any }>, {challanId: string}>("dispatch/getChallanById", async (data) => {
  const response = await axiosInstance.post(`challan/fetchPerforma`, data);
  return response;
});

export const printChallan = createAsyncThunk<AxiosResponse<{ success: boolean; message: string,data: any }>, {challanId: string}>("dispatch/printChallan", async (data) => {
  const response = await axiosInstance.post(`challan/generatePerforma`, data);
  return response;
});
export const CreateSwipeDispatch = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, DispatchItemPayload>("dispatch/CreateSwipeDispatch", async (payload) => {
  const response = await axiosInstance.post(`dispatchDivice/createDispatchSwipe`, payload);
  return response;
});

export const wrongDeviceDispatch = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, DispatchWrongItemPayload>("dispatch/CreateWrongDispatch", async (payload) => {
  const response = await axiosInstance.post(`/wrongDevice/createWrongDispatch`, payload);
  return response;
});

export const uploadFile = createAsyncThunk<AxiosResponse<{ success: boolean; message: string; data: string }>, FormData>("dispatch/uploadFile", async (formdata) => {
  const response = await axiosInstance.post(`/dispatchDivice/upload`, formdata, { headers: { "Content-Type": "multipart/form-data" } });
  return response;
});
export const getClient = createAsyncThunk<AxiosResponse<any>>("master/client/getclient", async () => {
  const response = await axiosInstance.get(`/backend/client`);
  return response;
});

export const getClientBranch = createAsyncThunk<AxiosResponse<any>, string>("master/client/getClientBranch", async (id) => {
  const response = await axiosInstance.get(`/client/viewBranch?client=${id}`);
  return response;
});

export const getDispatchData = createAsyncThunk<AxiosResponse<any>, string>("dispatch/getDispatchData", async (id) => {
  const response = await axiosInstance.get(`/dispatchDivice/detail?txnId=${id}`);
  return response;
});

export const fillEwayBillData = createAsyncThunk<AxiosResponse<any>, any>('/ewayBill/submitDetail', async (payload) => {
  const response = await axiosInstance.post(`/ewayBill/submitDetail`, payload);
  return response;
});

export const createEwayBill = createAsyncThunk<AxiosResponse<any>, any>('/ewayBill/createEwayBill', async (payload) => {
  const response = await axiosInstance.post(`/ewayBill/createEWayBill`, payload);
  return response;
});

export const cancelEwayBill = createAsyncThunk<AxiosResponse<any>, any>('/ewayBill/cancelEwayBill', async (payload) => {
  const response = await axiosInstance.post(`/ewayBill/cancel`, payload);
  return response;
});

export const getStateCode = createAsyncThunk<AxiosResponse<any>>('/backend/stateCode', async () => {
  const response = await axiosInstance.get(`/backend/stateCode`);
  return response;
});

export const getAllBranch = createAsyncThunk<AxiosResponse<any>>('/backend/branch', async () => {
  const response = await axiosInstance.get(`/deviceBranchTransfer/getBranchList`);
  return response;
});

const dispatchSlice = createSlice({
  name: "dispatch",
  initialState,
  reducers: {
    clearFile: (state) => {
      state.file = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CreateDispatch.pending, (state) => {
        state.dispatchCreateLoading = true;
      })
      .addCase(CreateDispatch.fulfilled, (state, action) => {
        state.dispatchCreateLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(CreateDispatch.rejected, (state) => {
        state.dispatchCreateLoading = false;
      })
      .addCase(CreateChallan.pending, (state) => {
        state.createChallanLoading = true;
      })
      .addCase(CreateChallan.fulfilled, (state) => {
        state.createChallanLoading = false;
      })
      .addCase(CreateChallan.rejected, (state) => {
        state.createChallanLoading = false;
      })
      .addCase(getChallan.pending, (state) => {
        state.getChallanLoading = true;
      })
      .addCase(getChallan.fulfilled, (state, action) => {
        state.getChallanLoading = false;
        if (action.payload.data.success) {
          state.challanList = action.payload.data.data;
        }
      })
      .addCase(getChallan.rejected, (state) => {
        state.getChallanLoading = false;
      })
      .addCase(printChallan.pending, (state) => {
        state.getChallanLoading = true;
      })
      .addCase(printChallan.fulfilled, (state) => {
        state.getChallanLoading = false;
      })
      .addCase(printChallan.rejected, (state) => {
        state.getChallanLoading = false;
      })
      .addCase(getChallanById.pending, (state) => {
        state.getChallanLoading = true;
      })
      .addCase(getChallanById.fulfilled, (state, action) => {
        state.getChallanLoading = false;
        if (action.payload.data.success) {
          state.challanList = action.payload.data.data;
        }
      })
      .addCase(getChallanById.rejected, (state) => {
        state.getChallanLoading = false;
      })

      .addCase(CreateSwipeDispatch.pending, (state) => {
        state.dispatchCreateLoading = true;
      })
      .addCase(CreateSwipeDispatch.fulfilled, (state, action) => {
        state.dispatchCreateLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(CreateSwipeDispatch.rejected, (state) => {
        state.dispatchCreateLoading = false;
      })
      .addCase(getStateCode.pending, (state) => {
        state.stateCodeLoading = true;
      })
      .addCase(getStateCode.fulfilled, (state, action) => {
        state.stateCodeLoading = false;
        if (action.payload.data.success) {
          state.stateCode = action.payload.data.data;
        }
      })
      .addCase(getStateCode.rejected, (state) => {
        state.stateCodeLoading = false;
      })
      .addCase(getDispatchData.rejected, (state) => {
        state.dispatchDataLoading = false;
      })
      .addCase(getDispatchData.pending, (state) => {
        state.dispatchDataLoading = true;
      })
      .addCase(getDispatchData.fulfilled, (state, action) => {
        state.dispatchDataLoading = false;
        if (action.payload.data.success) {
          state.dispatchData = action.payload.data.data;
        }
      })
      .addCase(createEwayBill.pending, (state) => {
        state.ewayBillDataLoading = true;
      })
      .addCase(createEwayBill.fulfilled, (state) => {
        state.ewayBillDataLoading = false;
      })
      .addCase(createEwayBill.rejected, (state) => {
        state.ewayBillDataLoading = false;
      })
      .addCase(getAllBranch.pending, (state) => {
        state.branchLoading = true;
      })
      .addCase(getAllBranch.fulfilled, (state, action) => {
        state.branchLoading = false;
        if (action.payload.data.success) {
          state.branchList = action.payload.data.data;
        }
      })
      .addCase(getAllBranch.rejected, (state) => {
        state.branchLoading = false;
      })
      .addCase(fillEwayBillData.pending, (state) => {
        state.ewayBillDataLoading = true;
      })
      .addCase(fillEwayBillData.fulfilled, (state) => {
        state.ewayBillDataLoading = false;
      })
      .addCase(fillEwayBillData.rejected, (state) => {
        state.ewayBillDataLoading = false;
      })
      .addCase(wrongDeviceDispatch.pending, (state) => {
        state.wrongDispatchLoading = true;
      })
      .addCase(wrongDeviceDispatch.fulfilled, (state) => {
        state.wrongDispatchLoading = false;
      })
      .addCase(wrongDeviceDispatch.rejected, (state) => {
        state.wrongDispatchLoading = false;
      })
      .addCase(UpdateChallan.pending, (state) => {
        state.updateChallanLoading = true;
      })
      .addCase(UpdateChallan.fulfilled, (state) => {
        state.updateChallanLoading = false;
      })
      .addCase(UpdateChallan.rejected, (state) => {
        state.updateChallanLoading = false;
      })
      .addCase(getClient.pending, (state) => {
        state.clientLoading = true;
      })
      .addCase(getClient.fulfilled, (state, action) => {
        state.clientLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(getClient.rejected, (state) => {
        state.clientLoading = false;
      })
      .addCase(getClientBranch.pending, (state) => {
        state.clientBranchLoading = true;
      })
      .addCase(getClientBranch.fulfilled, (state, action) => {
        state.clientBranchLoading = false;
        if (action.payload.data.success) {
          state.clientBranchList = action.payload.data.data;
        }
      })
      .addCase(getClientBranch.rejected, (state) => {
        state.clientBranchLoading = false;
      })
      .addCase(uploadFile.pending, (state) => {
        state.uploadFileLoading = true;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploadFileLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
          state.file = action.payload.data.data;
        }
      })
      .addCase(uploadFile.rejected, (state) => {
        state.uploadFileLoading = false;
      });
  },
});

export const { clearFile } = dispatchSlice.actions;
export default dispatchSlice.reducer;
