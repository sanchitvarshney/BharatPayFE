import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { AddtrcPayloadType, AddtrcResponse, AddTrcState } from "./addtrcType";

const initialState: AddTrcState = {
  addTrcLoading: false,
};

export const addTrcAsync = createAsyncThunk<AxiosResponse<AddtrcResponse>, AddtrcPayloadType>("trc/add", async (payload) => {
  const response = await axiosInstance.post("/trc/addProductionToTrc", payload);
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
      });
  },
});

export default addTrcSlice.reducer;
