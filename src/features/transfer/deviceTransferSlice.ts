import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

const initialState: any = {
  issueData: [],
  loadingissue: false,
  deviceDetails: [],
  deviceDetailsData: null,
  loadingDeviceDetails: false,
  costCenter: [],
  loadingCostCenter: false,
  isSubmitLoading: false,
  isImageLoading: false,
  isSubmitSwipeLoading: false,
  isCheckBoxLocationLoading: false,
};
type FetchDeviceDetailsArgs = {
  deviceCode: string;
  deviceModel: string;
};

export const fetchIssue = createAsyncThunk<AxiosResponse<any>>(
  "device/transfer/fetchReturnIssue",
  async () => {
    const response = await axiosInstance.get(`/device-movement/get/issue`);
    return response;
  },
);
export const fetchCostCenter = createAsyncThunk<AxiosResponse<any>>(
  "device/transfer/fetchCostCenter",
  async () => {
    const response = await axiosInstance.get(`/backend/costcenter`);
    return response;
  },
);

export const fetchDeviceDetails = createAsyncThunk<
  AxiosResponse<any>,
  FetchDeviceDetailsArgs
>("part/code/qty", async ({ deviceCode, deviceModel }) => {
  const response = await axiosInstance.get(
    `/backend/getDeviceDetail/${deviceCode}?device=${deviceModel}`,
  );

  return response.data;
});

export const fetchSwipeDeviceDetails = createAsyncThunk<
  AxiosResponse<any>,
  string
>("device/transfer/fetchSwipeDeviceBySerial", async (serialNo) => {
  const response = await axiosInstance.get(
    `/backend/getDeviceDetail/${serialNo}?type=swipe`,
  );
  return response.data;
});

export const submitTransferData = createAsyncThunk<AxiosResponse<any>>(
  "master/transfer/submit",
  async (payload: any) => {
    const response = await axiosInstance.post(
      `/device-movement/ber-device-transfer`,
      payload,
    );
    return response?.data;
  },
);

export type CheckBoxLocationPayload = {
  boxNo: string;
  serial: string[];
  fromLocation: string;
  sku: string;
};

export type CheckBoxLocationResponse = {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>[];
};

export const checkBoxLocation = createAsyncThunk<
  CheckBoxLocationResponse,
  CheckBoxLocationPayload
>(
  "device/transfer/checkBoxLocation",
  async (payload) => {
    const response = await axiosInstance.post<CheckBoxLocationResponse>(
      "/swipeMovement/checkBoxLocation",
      payload,
    );
    return response?.data ?? response;
  },
);

export const submitSwipeTransferData = createAsyncThunk<AxiosResponse<any>>(
  "master/swipe-transfer/submit",
  async (payload: any) => {
    const response = await axiosInstance.post(
      `/swipeMovement/deviceMovement`,
      payload,
    );
    return response?.data;
  },
);
export const submitImage = createAsyncThunk<AxiosResponse<any>>(
  "master/transfer/image-submit",
  async ({imei, body}:any) => {
    const response = await axiosInstance.post(
      `/device-movement/ber/uploadImages/${imei}`,
      body,
       {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  },
);

const transferSlice = createSlice({
  name: "transfer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchIssue.pending, (state) => {
        state.loadingissue = true;
      })
      .addCase(fetchIssue.fulfilled, (state, action: any) => {
        state.loadingissue = false;
        if (action.payload.data?.success) {
          state.issueData = action.payload.data?.data;
        }
      })
      .addCase(fetchIssue.rejected, (state) => {
        state.loadingissue = false;
      })
      .addCase(fetchDeviceDetails.pending, (state) => {
        state.loadingDeviceDetails = true;
      })
      .addCase(fetchDeviceDetails.fulfilled, (state, action: any) => {
        state.loadingDeviceDetails = false;
        if (action.payload?.success && action.payload?.data != null) {
          const data = action.payload.data;
          state.deviceDetailsData = Array.isArray(data) ? data[0] : data;
        }
      })
      .addCase(fetchDeviceDetails.rejected, (state) => {
        state.loadingDeviceDetails = false;
      })
      .addCase(fetchSwipeDeviceDetails.pending, (state) => {
        state.loadingDeviceDetails = true;
      })
      .addCase(fetchSwipeDeviceDetails.fulfilled, (state, action: any) => {
        state.loadingDeviceDetails = false;
        if (action.payload?.success) {
          state.deviceDetailsData = action.payload?.data?.[0];
        }
      })
      .addCase(fetchSwipeDeviceDetails.rejected, (state) => {
        state.loadingDeviceDetails = false;
      })
      .addCase(fetchCostCenter.pending, (state) => {
        state.loadingCostCenter = true;
      })
      .addCase(fetchCostCenter.fulfilled, (state, action) => {
        state.loadingCostCenter = false;
        if (action.payload.data.success) {
          state.costCenterData = action.payload.data.data;
        }
      })
      .addCase(fetchCostCenter.rejected, (state) => {
        state.loadingCostCenter = false;
      })   .addCase(submitTransferData.pending, (state) => {
        state.isSubmitLoading = true;
      })
      .addCase(submitTransferData.fulfilled, (state) => {
        state.isSubmitLoading = false;
       
      })
      .addCase(submitTransferData.rejected, (state) => {
        state.isSubmitLoading = false;
      })
       .addCase(submitImage.pending, (state) => {
        state.isImageLoading = true;
      })
      .addCase(submitImage.fulfilled, (state) => {
        state.isImageLoading = false;
       
      })
      .addCase(submitImage.rejected, (state) => {
        state.isImageLoading = false;
      })          .addCase(submitSwipeTransferData.pending, (state) => {
        state.isSubmitSwipeLoading = true;
      })
      .addCase(submitSwipeTransferData.fulfilled, (state) => {
        state.isSubmitSwipeLoading = false;
      })
      .addCase(submitSwipeTransferData.rejected, (state) => {
        state.isSubmitSwipeLoading = false;
      })
      .addCase(checkBoxLocation.pending, (state) => {
        state.isCheckBoxLocationLoading = true;
      })
      .addCase(checkBoxLocation.fulfilled, (state) => {
        state.isCheckBoxLocationLoading = false;
      })
      .addCase(checkBoxLocation.rejected, (state) => {
        state.isCheckBoxLocationLoading = false;
      });
  },
});

export default transferSlice.reducer;
