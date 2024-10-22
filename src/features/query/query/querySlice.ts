import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { componentApiResponse, Q1ApiResponse, QueryStateType } from "./queryType";

const initialState: QueryStateType = {
  getQ1DataLoading: false,
  q1Data: null,
  getComponentDataLoading: false,
  componentData: null,
  getQ2DataLading: false,
  q2Data: null,
};

export const getQ1Data = createAsyncThunk<AxiosResponse<Q1ApiResponse>, { date: string|null; value: string;location:string|null }>("query/getQ1", async (params) => {
  const response = await axiosInstance.get(params.location?`/query/log/DV?data=${params.value}&location=${params.location}`:`/query/log/DV?date=${params.date}&data=${params.value}`);
  return response;
});
export const getQ2Data = createAsyncThunk<AxiosResponse<Q1ApiResponse>, { date: string|null; value: string;location:string|null }>("query/getQ2", async (params) => {
  const response = await axiosInstance.get(params.location?`/query/q2/log/RM?data=${params.value}$location=${params.location}`:`/query/q2/log/RM?date=${params.date}&data=${params.value}`);
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
        state.q1Data = null;
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
      })
      .addCase(getQ2Data.pending, (state) => {
        state.getQ2DataLading = true;
      })
      .addCase(getQ2Data.fulfilled, (state, action) => {
        state.getQ2DataLading = false;
        if (action.payload.data.success) {
          state.q2Data = action.payload.data.response;
        }
      })
      .addCase(getQ2Data.rejected, (state) => {
        state.getQ2DataLading = false;
        state.q2Data = null
      });
  },
});

export default querySlice.reducer;
