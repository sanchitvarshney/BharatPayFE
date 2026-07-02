import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";
import { AxiosResponse } from "axios";

interface UploadState {
  uploadLoading: boolean;
  uploadError: string | null;
  masterUploadLoading: boolean;
  masterUploadError: string | null;
}

const initialState: UploadState = {
  uploadLoading: false,
  uploadError: null,
  masterUploadLoading: false,
  masterUploadError: null,
};

export const uploadSwipeDeviceStatus = createAsyncThunk<
  AxiosResponse<{ success: boolean; message: string }>,
  FormData
>("upload/swipeDeviceStatus", async (formData, { rejectWithValue }) => {
  try {
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
  } catch (error: any) {
    // Handle error and return rejectWithValue for better error handling in slice
    if (error.response && error.response.data && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue(error.message || "Upload failed");
  }
});

export const uploadMasterData = createAsyncThunk<
  AxiosResponse<{ success: boolean; message: string }>,
  FormData
>("upload/masterData", async (formData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(
      "/bulkDeviceUpload/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error: any) {
    if (error.response?.data?.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue(error.message || "Upload failed");
  }
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
      })
      .addCase(uploadMasterData.pending, (state) => {
        state.masterUploadLoading = true;
        state.masterUploadError = null;
      })
      .addCase(uploadMasterData.fulfilled, (state) => {
        state.masterUploadLoading = false;
        state.masterUploadError = null;
      })
      .addCase(uploadMasterData.rejected, (state, action) => {
        state.masterUploadLoading = false;
        state.masterUploadError = action.error.message || "Upload failed";
      });
  },
});

export const { clearUploadError } = uploadSlice.actions;
export default uploadSlice.reducer;
