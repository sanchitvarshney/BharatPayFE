import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { componentApiResponse, Q1ApiResponse, QueryStateType } from "./queryType";

const initialState: QueryStateType = {
  getQ1DataLoading: false,
  q1Data: null,
  getComponentDataLoading: false,
  componentData: null,
};

export const getQ1Data = createAsyncThunk<AxiosResponse<Q1ApiResponse>, { date: string; value: string }>("query/getQ1", async (params) => {
  const response = await axiosInstance.get(`/query/log/DV?date=${params.date}&data=${params.value}`);
  return response;
});

export const getBothComponentData = createAsyncThunk<AxiosResponse<componentApiResponse>, string | null>("query/getComponentData", async (inputs) => {
  const response = await axiosInstance.get(`/backend/search/sku/${inputs}`);
  return response;
});

const querySlice = createSlice({
  name: "query",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getQ1Data.pending, (state) => {
        state.getQ1DataLoading = true;
      })
      .addCase(getQ1Data.fulfilled, (state, action) => {
        state.getQ1DataLoading = false;
        if (action.payload.data.success) {
          state.q1Data = action.payload.data.response;
        }
      })
      .addCase(getQ1Data.rejected, (state) => {
        state.getQ1DataLoading = false;
      })
      .addCase(getBothComponentData.pending, (state) => {
        state.getComponentDataLoading = true;
      })
      .addCase(getBothComponentData.fulfilled, (state, action) => {
        state.getComponentDataLoading = false;
        if (action.payload.data.success) {
          state.componentData = action.payload.data.data;
        }
      })
      .addCase(getBothComponentData.rejected, (state) => {
        state.getComponentDataLoading = false;
      });
  },
});

export default querySlice.reducer;
