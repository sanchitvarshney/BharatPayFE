import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  ApproveDeviceRequestResponse,
  ApproveDeviceRequestType,
  ApproveItemsResponse,
  ApprovePayload,
  ItemDetailApiResponse,
  MaterialRejectPayload,
  MaterialRejectResponse,
  PendingMrRequestResponse,
  PendingMrRequestState,
  ProcessApiResponse,
  RequestDetail,
} from "./MrApprovalType";
import { showToast } from "@/utils/toastUtils";

const initialState: PendingMrRequestState = {
  pendingMrRequestData: null,
  getPendingMrRequestLoading: false,
  processRequestData: null,
  processMrRequestLoading: false,
  requestDetail: null,
  itemDetail: null,
  itemDetailLoading: false,
  approveItemLoading: false,
  rejectItemLoading: false,
  cancelItemLoading: false,
};

export const getPendingMaterialListsync = createAsyncThunk<AxiosResponse<PendingMrRequestResponse>>("master/getPendingMrrequst", async () => {
  const response = await axiosInstance.get("/req/data/list ");
  return response;
});
export const getProcessMrReqeustAsync = createAsyncThunk<AxiosResponse<ProcessApiResponse>, string>("master/getProcessMrrequst", async (id) => {
  const response = await axiosInstance.get(`/req/data/detail/${id}`);
  return response;
});
export const getItemDetailsAsync = createAsyncThunk<AxiosResponse<ItemDetailApiResponse>, { txnid: string; itemKey: string; picLocation: string }>("master/getItemDetails", async (params) => {
  const response = await axiosInstance.get(`/req/data/stock/${params.txnid}/${params.itemKey}/${params.picLocation}`);
  return response;
});

export const approveSelectedItemAsync = createAsyncThunk<AxiosResponse<ApproveItemsResponse>, ApprovePayload>("master/approveSelectedItem", async (params) => {
  const response = await axiosInstance.post(`/req/data/approve/${params.itemsCode}/${params.transactionId}`, params);
  return response;
});
export const approveDeviceRequest = createAsyncThunk<AxiosResponse<ApproveDeviceRequestResponse>, ApproveDeviceRequestType>("master/approveDeviceType", async (params) => {
  const response = await axiosInstance.post(`/req/data/approve/${params.itemCode}/${params.txnID}`, params);
  return response;
});
export const materialRequestReject = createAsyncThunk<AxiosResponse<MaterialRejectResponse>, MaterialRejectPayload>("master/materialRequestReject", async (params) => {
  const response = await axiosInstance.put(`/req/data/reject/${params.itemCode}/${params.txnId}`, { remarks: params.remarks });
  return response;
});
export const materialRequestCancel = createAsyncThunk<AxiosResponse<MaterialRejectResponse>, { txnID: string; remarks: string }>("master/materialRequestCancel", async (params) => {
  const response = await axiosInstance.put(`/req/data/cancel/${params.txnID}`, { remark: params.remarks });
  return response;
});

const MrApprovalSlice = createSlice({
  name: "mrapproval",
  initialState,
  reducers: {
    setRequestDetail: (state, action: PayloadAction<RequestDetail>) => {
      state.requestDetail = action.payload;
    },
    clearRequestDetail: (state) => {
      state.requestDetail = null;
    },
    clearItemdetail: (state) => {
      state.itemDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPendingMaterialListsync.pending, (state) => {
        state.getPendingMrRequestLoading = true;
      })
      .addCase(getPendingMaterialListsync.fulfilled, (state, action) => {
        state.getPendingMrRequestLoading = false;
        if (action.payload.data.success) {
          state.pendingMrRequestData = action.payload.data.data;
        }
      })
      .addCase(getPendingMaterialListsync.rejected, (state) => {
        state.getPendingMrRequestLoading = false;
        state.pendingMrRequestData = null;
      })
      .addCase(getProcessMrReqeustAsync.pending, (state) => {
        state.processMrRequestLoading = true;
      })
      .addCase(getProcessMrReqeustAsync.fulfilled, (state, action) => {
        state.processMrRequestLoading = false;
        if (action.payload.data.success) {
          state.processRequestData = action.payload.data.data;
        }
      })
      .addCase(getProcessMrReqeustAsync.rejected, (state) => {
        state.processMrRequestLoading = false;
        state.processRequestData = null;
      })
      .addCase(getItemDetailsAsync.pending, (state) => {
        state.itemDetailLoading = true;
      })
      .addCase(getItemDetailsAsync.fulfilled, (state, action) => {
        state.itemDetailLoading = false;
        if (action.payload.data.success) {
          state.itemDetail = action.payload.data.data;
        }
      })
      .addCase(getItemDetailsAsync.rejected, (state) => {
        state.itemDetailLoading = false;
      })
      .addCase(approveSelectedItemAsync.pending, (state) => {
        state.approveItemLoading = true;
      })
      .addCase(approveSelectedItemAsync.fulfilled, (state, action) => {
        state.approveItemLoading = false;
        if (action.payload.data.success) {
          showToast({
            description: action.payload?.data?.message,
            variant: "success",
          });
        } else {
          showToast({
            description: action.payload?.data?.message,
            variant: "destructive",
          });
        }
      })
      .addCase(approveSelectedItemAsync.rejected, (state) => {
        state.approveItemLoading = false;
      })
      .addCase(approveDeviceRequest.pending, (state) => {
        state.approveItemLoading = true;
      })
      .addCase(approveDeviceRequest.fulfilled, (state, action) => {
        state.approveItemLoading = false;
        if (action.payload.data.success) {
          showToast({
            description: action.payload?.data?.message,
            variant: "success",
          });
        } else {
          showToast({
            description: action.payload?.data?.message,
            variant: "destructive",
          });
        }
      })
      .addCase(approveDeviceRequest.rejected, (state) => {
        state.approveItemLoading = false;
      })
      .addCase(materialRequestReject.pending, (state) => {
        state.rejectItemLoading = true;
      })
      .addCase(materialRequestReject.fulfilled, (state, action) => {
        state.rejectItemLoading = false;
        if (action.payload.data.success) {
          showToast({
            description: action.payload?.data?.message,
            variant: "success",
          });
        } else {
          showToast({
            description: action.payload?.data?.message,
            variant: "destructive",
          });
        }
      })
      .addCase(materialRequestReject.rejected, (state) => {
        state.rejectItemLoading = false;
      })
      .addCase(materialRequestCancel.pending, (state) => {
        state.cancelItemLoading = true;
      })
      .addCase(materialRequestCancel.fulfilled, (state, action) => {
        state.cancelItemLoading = false;
        if (action.payload.data.success) {
          showToast({
            description: action.payload?.data?.message,
            variant: "success",
          });
        } else {
          showToast({
            description: action.payload?.data?.message,
            variant: "destructive",
          });
        }
      })
      .addCase(materialRequestCancel.rejected, (state) => {
        state.cancelItemLoading = false;
      });
  },
});

export const { setRequestDetail, clearRequestDetail, clearItemdetail } = MrApprovalSlice.actions;
export default MrApprovalSlice.reducer;
