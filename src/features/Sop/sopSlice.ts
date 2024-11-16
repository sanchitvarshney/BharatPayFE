import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { FileDataReponse, FolderDataResponse, SopState } from "./sopType";
import { showToast } from "@/utils/toasterContext";

const initialState: SopState = {
  folderData: null,
  folderDataLoading: false,
  createFolderLoading: false,
  deleteFolderLoading: false,
  uploadFileLoading: false,
  getFileLoading: false,
  fileData: null,
};

export const getFolderData = createAsyncThunk<AxiosResponse<FolderDataResponse>>("dispatch/getFolderData", async () => {
  const response = await axiosInstance.get(`/sop/getAllFolderList`);
  return response;
});
export const createFolder = createAsyncThunk<AxiosResponse<FolderDataResponse>, { id: string; name: string }>("dispatch/createFolder", async (payload) => {
  const response = await axiosInstance.post(`/sop/createFolder`, { parentFolder: payload.id, folderName: payload.name });
  return response;
});
export const deleteFolder = createAsyncThunk<AxiosResponse<FolderDataResponse>, string>("dispatch/deleteFolder", async (id) => {
  const response = await axiosInstance.delete(`/sop/delete/${id}`);
  return response;
});
export const uploadFileAsync = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, FormData>("dispatch/uploadFileAsync", async (data) => {
  const response = await axiosInstance.post(`/sop/uploadFile`, data, { headers: { "Content-Type": "multipart/form-data" } });
  return response;
});

export const getFileAsync = createAsyncThunk<AxiosResponse<FileDataReponse>, string>("dispatch/getFileAsync", async (id) => {
  const response = await axiosInstance.get(`/sop/getAllFileList/${id}`);
  return response;
});
const sopSlice = createSlice({
  name: "sop",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFolderData.pending, (state) => {
        state.folderDataLoading = true;
      })
      .addCase(getFolderData.fulfilled, (state, action) => {
        state.folderDataLoading = false;
        if (action.payload.data.success) {
          state.folderData = action.payload.data.data;
        }
      })
      .addCase(getFolderData.rejected, (state) => {
        state.folderDataLoading = false;
      })
      .addCase(createFolder.pending, (state) => {
        state.createFolderLoading = true;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.createFolderLoading = false;
        if (action.payload.data.success) {
          state.folderData = action.payload.data.data;
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(createFolder.rejected, (state) => {
        state.createFolderLoading = false;
      })
      .addCase(deleteFolder.pending, (state) => {
        state.deleteFolderLoading = true;
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.deleteFolderLoading = false;
        if (action.payload.data.success) {
          state.folderData = action.payload.data.data;
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(deleteFolder.rejected, (state) => {
        state.deleteFolderLoading = false;
      })
      .addCase(uploadFileAsync.pending, (state) => {
        state.uploadFileLoading = true;
      })
      .addCase(uploadFileAsync.fulfilled, (state, action) => {
        state.uploadFileLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(uploadFileAsync.rejected, (state) => {
        state.uploadFileLoading = false;
      })
      .addCase(getFileAsync.pending, (state) => {
        state.getFileLoading = true;
        state.fileData = null;
      })
      .addCase(getFileAsync.fulfilled, (state, action) => {
        state.getFileLoading = false;
        if (action.payload.data.success) {
          state.fileData = action.payload.data.data;
        }
      })
      .addCase(getFileAsync.rejected, (state) => {
        state.getFileLoading = false;
        state.fileData = null;
      });
  },
});

export default sopSlice.reducer;
