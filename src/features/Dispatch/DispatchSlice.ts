import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { DispatchItemPayload, DispatchState } from "./DispatchType";
import { showToast } from "@/utils/toasterContext";

const initialState: DispatchState = {
  dispatchCreateLoading: false,
  uploadFileLoading: false,
  file: null,
};

export const CreateDispatch = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, DispatchItemPayload>("dispatch/CreateDispatch", async (payload) => {
  const response = await axiosInstance.post(`dispatchDivice/createDispatch`, payload);
  return response;
});
export const uploadFile = createAsyncThunk<AxiosResponse<{ success: boolean; message: string; data: string }>, FormData>("dispatch/uploadFile", async (formdata) => {
  const response = await axiosInstance.post(`/dispatchDivice/upload`, formdata, { headers: { "Content-Type": "multipart/form-data" } });
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
