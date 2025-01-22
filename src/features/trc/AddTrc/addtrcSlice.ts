import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { AddtrcPayloadType, AddtrcResponse, AddTrcState, AddtrcToStorePayloadType } from "./addtrcType";

const initialState: AddTrcState = {
  addTrcLoading: false,
};

export const addTrcAsync = createAsyncThunk<AxiosResponse<AddtrcResponse>, AddtrcPayloadType>("trc/add", async (payload) => {
  const response = await axiosInstance.post("/trc/addProductionToTrc", payload);
  return response;
});

export const addTrcToStoreAsync = createAsyncThunk<AxiosResponse<AddtrcResponse>, AddtrcToStorePayloadType>("trc/addToStore", async (payload) => {
  const response = await axiosInstance.post("/trc/addStoreToTrc", payload);
  return response;
});

const addTrcSlice = createSlice({
  name: "addTrcSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTrcAsync.pending, (state) => {
        state.addTrcLoading = true;
      })
      .addCase(addTrcAsync.fulfilled, (state) => {
        state.addTrcLoading = false;
      })
      .addCase(addTrcAsync.rejected, (state) => {
        state.addTrcLoading = false;
      })
      .addCase(addTrcToStoreAsync.pending, (state) => {
        state.addTrcLoading = true;
      })
      .addCase(addTrcToStoreAsync.fulfilled, (state) => {
        state.addTrcLoading = false;
      })
      .addCase(addTrcToStoreAsync.rejected, (state) => {
        state.addTrcLoading = false;
      });
  },
});

export default addTrcSlice.reducer;
