import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { ClientState, CraeteClientPayload } from "./clientType";
import { showToast } from "@/utils/toasterContext";

const initialState: ClientState = {
  createClientLoading: false,
};

export const createClient = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, CraeteClientPayload>("master/client/createClient", async (payload) => {
  const response = await axiosInstance.post(`/client/createclient`, payload);
  return response;
});

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createClient.pending, (state) => {
        state.createClientLoading = true;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.createClientLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(createClient.rejected, (state) => {
        state.createClientLoading = false;
      });
  },
});

export default clientSlice.reducer;
