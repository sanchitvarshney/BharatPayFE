import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { getApiMessage } from "@/utils/getApiMessage";
import { buildDeliveryFormData } from "./delivery.utils";
import { showToast } from "@/utils/toasterContext";
import {
  CourierReturnReportPayload,
  CourierReturnReportResponse,
  DeliveryState,
  DeliverySubmitResponse,
  SubmitDeliveryPayload,
} from "./deliveryType";

export const DELIVERY_ENDPOINTS = {
  submit: "/wrongDevice/addAwbReturn",
  courierReturnList: "/wrongDevice/getAwbReturns",
};

const initialState: DeliveryState = {
  isSubmitting: false,
  submitError: null,
  courierReturnList: null,
  courierReturnLoading: false,
};

const multipartConfig = {
  headers: { "Content-Type": "multipart/form-data" },
};

export const submitDelivery = createAsyncThunk<
  DeliverySubmitResponse | undefined,
  SubmitDeliveryPayload,
  { rejectValue: string }
>(
  "delivery/submitDelivery",
  async ({ onUploadProgress, ...payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<DeliverySubmitResponse>(
        DELIVERY_ENDPOINTS.submit,
        buildDeliveryFormData(payload),
        { ...multipartConfig, onUploadProgress }
      );
      return response.data;
    } catch (err) {
      const axiosErr = err as AxiosError<DeliverySubmitResponse>;
      return rejectWithValue(
        getApiMessage(
          axiosErr.response?.data?.message,
          axiosErr.message || "Failed to submit delivery details"
        )
      );
    }
  }
);

export const getCourierReturnReport = createAsyncThunk<
  CourierReturnReportResponse,
  CourierReturnReportPayload,
  { rejectValue: string }
>("delivery/getCourierReturnReport", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<CourierReturnReportResponse>(
      DELIVERY_ENDPOINTS.courierReturnList,
      { params: payload }
    );
    return response.data;
  } catch (err) {
    const axiosErr = err as AxiosError<CourierReturnReportResponse>;
    return rejectWithValue(
      getApiMessage(
        axiosErr.response?.data?.message,
        axiosErr.message || "Failed to fetch courier return report"
      )
    );
  }
});

const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    resetDeliveryState: (state) => {
      state.isSubmitting = false;
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitDelivery.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(submitDelivery.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(submitDelivery.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError =
          action.payload ?? action.error.message ?? "Failed to submit delivery details";
      })
      .addCase(getCourierReturnReport.pending, (state) => {
        state.courierReturnLoading = true;
      })
      .addCase(getCourierReturnReport.fulfilled, (state, action) => {
        state.courierReturnLoading = false;
        if (action.payload?.success === false) {
          showToast(getApiMessage(action.payload.message, "No data found"), "error");
        }
        state.courierReturnList = action.payload?.data ?? [];
      })
      .addCase(getCourierReturnReport.rejected, (state, action) => {
        state.courierReturnLoading = false;
        state.courierReturnList = [];
        showToast(action.payload ?? "Failed to fetch courier return report", "error");
      });
  },
});

export const { resetDeliveryState } = deliverySlice.actions;
export default deliverySlice.reducer;
