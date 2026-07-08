import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError, AxiosResponse } from "axios";
import { buildCaptureFormData } from "./imageCapture.utils";
import {
  CapturePhotoCheckResponse,
  CapturePhotoResponse,
  EditCapturePhotosPayload,
  ImageCaptureState,
  SaveCapturePhotosPayload,
} from "./imageCaptureType";

const initialState: ImageCaptureState = {
  isSaving: false,
  isEditing: false,
  isChecking: false,
  saveError: null,
  editError: null,
  checkError: null,
};

const multipartConfig = {
  headers: { "Content-Type": "multipart/form-data" },
};

export const checkCapturePhoto = createAsyncThunk<
  AxiosResponse<CapturePhotoCheckResponse>,
  string
>("imageCapture/checkCapturePhoto", async (dsn) => {
  const response = await axiosInstance.get(
    `/capture/photo/check/${encodeURIComponent(dsn)}`
  );
  return response;
});

export const saveCapturePhotos = createAsyncThunk<
  AxiosResponse<CapturePhotoResponse>,
  SaveCapturePhotosPayload
>(
  "imageCapture/saveCapturePhotos",
  async ({ type, serialNo, images }, { rejectWithValue }) => {
    const formData = buildCaptureFormData(images, { serialNo, type });
    try {
      const response = await axiosInstance.post(
        `/capture/photo/save/new`,
        formData,
        multipartConfig
      );
      return response;
    } catch (err) {
      const axiosErr = err as AxiosError<CapturePhotoResponse>;
      return rejectWithValue(
        axiosErr.response?.data ?? { message: axiosErr.message }
      );
    }
  }
);

export const editCapturePhotos = createAsyncThunk<
  AxiosResponse<CapturePhotoResponse>,
  EditCapturePhotosPayload
>(
  "imageCapture/editCapturePhotos",
  async ({ module, dsn, images }, { rejectWithValue }) => {
    const formData = buildCaptureFormData(images);
    try {
      const response = await axiosInstance.put(
        `/capture/photo/edit/new/${encodeURIComponent(
          dsn
        )}/${encodeURIComponent(module)}`,
        formData,
        multipartConfig
      );
      return response;
    } catch (err) {
      const axiosErr = err as AxiosError<CapturePhotoResponse>;
      return rejectWithValue(
        axiosErr.response?.data ?? { message: axiosErr.message }
      );
    }
  }
);

const imageCaptureSlice = createSlice({
  name: "imageCapture",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkCapturePhoto.pending, (state) => {
        state.isChecking = true;
        state.checkError = null;
      })
      .addCase(checkCapturePhoto.fulfilled, (state) => {
        state.isChecking = false;
      })
      .addCase(checkCapturePhoto.rejected, (state, action) => {
        state.isChecking = false;
        state.checkError =
          action.error.message ?? "Failed to verify serial number.";
      })
      .addCase(saveCapturePhotos.pending, (state) => {
        state.isSaving = true;
        state.saveError = null;
      })
      .addCase(saveCapturePhotos.fulfilled, (state) => {
        state.isSaving = false;
      })
      .addCase(saveCapturePhotos.rejected, (state, action) => {
        state.isSaving = false;
        state.saveError = action.error.message ?? "Failed to save photos.";
      })
      .addCase(editCapturePhotos.pending, (state) => {
        state.isEditing = true;
        state.editError = null;
      })
      .addCase(editCapturePhotos.fulfilled, (state) => {
        state.isEditing = false;
      })
      .addCase(editCapturePhotos.rejected, (state, action) => {
        state.isEditing = false;
        state.editError = action.error.message ?? "Failed to edit photos.";
      });
  },
});

export default imageCaptureSlice.reducer;
