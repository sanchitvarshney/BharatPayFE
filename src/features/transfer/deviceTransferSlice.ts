import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

const initialState: any = {
  issueData: [],
  loadingissue: false,
  deviceDetails: [],
  loadingDeviceDetails: false,
  costCenter: [],
  loadingCostCenter: false,
  isSubmitLoading: false,
  isImageLoading: false,
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

export const submitTransferData = createAsyncThunk<AxiosResponse<any>>(
  "master/transfer/submit",
  async (payload: any) => {
    const response = await axiosInstance.post(
      `/device-movement/device-transfer`,
      payload,
    );
    return response;
  },
);
export const submitImage = createAsyncThunk<AxiosResponse<any>>(
  "master/transfer/image-submit",
  async (payload: any) => {
    const response = await axiosInstance.post(
      `/device-movement/ber/uploadImages/${payload.imei}`,
      payload.data,
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

        if (action.payload.success) {
          state.deviceDetailsData = action.payload.data?.[0];
        }
      })
      .addCase(fetchDeviceDetails.rejected, (state) => {
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
      });
  },
});

export default transferSlice.reducer;
