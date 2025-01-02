import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { ClientState, CraeteClientPayload, CustomerApiResponse } from "./clientType";
import { showToast } from "@/utils/toasterContext";

const initialState: ClientState = {
  createClientLoading: false,
  clientdata: null,
  getClientLoading: false,
};

export const createClient = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, CraeteClientPayload>("master/client/createClient", async (payload) => {
  const response = await axiosInstance.post(`/client/createclient`, payload);
  return response;
});
export const getClient = createAsyncThunk<AxiosResponse<CustomerApiResponse>>("master/client/getclient", async () => {
  const response = await axiosInstance.get(`/client/viewclients`);
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
      })
      .addCase(getClient.pending, (state) => {
        state.getClientLoading = true;
        state.clientdata = null;
      })
      .addCase(getClient.fulfilled, (state, action) => {
        state.getClientLoading = false;
        if (action.payload.data.success) {
          state.clientdata = action.payload.data.data;
        }
      })
      .addCase(getClient.rejected, (state) => {
        state.getClientLoading = false;
        state.clientdata = null;
      });
  },
});

export default clientSlice.reducer;
