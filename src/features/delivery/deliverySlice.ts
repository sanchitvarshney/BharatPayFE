import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { getApiMessage } from "@/utils/getApiMessage";
import { buildDeliveryFormData } from "./delivery.utils";
import {
  DeliveryState,
  DeliverySubmitResponse,
  SubmitDeliveryPayload,
} from "./deliveryType";

export const DELIVERY_ENDPOINTS = {
  submit: "/delivery/submit",
};

const initialState: DeliveryState = {
  isSubmitting: false,
  submitError: null,
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

const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    resetDeliveryState: () => initialState,
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
      });
  },
});

export const { resetDeliveryState } = deliverySlice.actions;
export default deliverySlice.reducer;
