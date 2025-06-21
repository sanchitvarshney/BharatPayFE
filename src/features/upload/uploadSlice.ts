import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";
import { AxiosResponse } from "axios";

interface UploadState {
  uploadLoading: boolean;
  uploadError: string | null;
}

const initialState: UploadState = {
  uploadLoading: false,
  uploadError: null,
};

export const uploadSwipeDeviceStatus = createAsyncThunk<
  AxiosResponse<{ success: boolean; message: string }>,
  FormData
>("upload/swipeDeviceStatus", async (formData) => {
  const response = await axiosInstance.post(
    "/swipeMachine/uploadStatus",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
});

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    clearUploadError: (state) => {
      state.uploadError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadSwipeDeviceStatus.pending, (state) => {
        state.uploadLoading = true;
        state.uploadError = null;
      })
      .addCase(uploadSwipeDeviceStatus.fulfilled, (state) => {
        state.uploadLoading = false;
        state.uploadError = null;
      })
      .addCase(uploadSwipeDeviceStatus.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadError = action.error.message || "Upload failed";
      });
  },
});

export const { clearUploadError } = uploadSlice.actions;
export default uploadSlice.reducer;
