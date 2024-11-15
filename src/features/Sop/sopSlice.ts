import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { FolderDataResponse, SopState } from "./sopType";

const initialState: SopState = {
  folderData: null,
  folderDataLoading: false,
  createFolderLoading: false,
};

export const getFolderData = createAsyncThunk<AxiosResponse<FolderDataResponse>>("dispatch/getFolderData", async () => {
  const response = await axiosInstance.get(`/sop/getAllFolderList`);
  return response;
});
export const createFolder = createAsyncThunk<AxiosResponse<FolderDataResponse>, { id: string; name: string }>("dispatch/createFolder", async (payload) => {
  const response = await axiosInstance.post(`/sop/createFolder`,{parentFolder:payload.id,folderName:payload.name});
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
        }
      })
      .addCase(createFolder.rejected, (state) => {
        state.createFolderLoading = false;
      });
  },
});

export default sopSlice.reducer;
