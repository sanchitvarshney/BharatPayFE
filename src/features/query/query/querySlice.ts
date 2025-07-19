import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { componentApiResponse, Q1ApiResponse, Q3ApiResponse, Q4Apiresponse, Q5Apiresponse, QueryStateType, R6ApiResponse } from "./queryType";

const initialState: QueryStateType = {
  getQ1DataLoading: false,
  q1Data: null,
  getComponentDataLoading: false,
  componentData: null,
  getQ2DataLading: false,
  q2Data: null,
  q3data: null,
  q3DataLoading: false,
  q4Data: null,
  q4DataLoading: false,
  q5Data: null,
  q5DataLoading: false,
  q6StatementLoading: false,
  q6Statement: null,
  q4DownloadLoading: false
};

export const getQ1Data = createAsyncThunk<AxiosResponse<Q1ApiResponse>, { date: string | null; value: string; location: string | null }>("query/getQ1", async (params) => {
  const response = await axiosInstance.get(params.location ? `/query/log/DV?data=${params.value}&location=${params.location}` : `/query/log/DV?date=${params.date}&data=${params.value}`);
  return response;
});
export const getQ2Data = createAsyncThunk<AxiosResponse<Q1ApiResponse>, { date: string | null; value: string; location: string | null }>("query/getQ2", async (params) => {
  const response = await axiosInstance.get(params.location ? `/query/q2/log/RM?data=${params.value}&location=${params.location}&type=location` : `/query/q2/log/RM?date=${params.date}&data=${params.value}&type=date`);
  return response;
});

export const getBothComponentData = createAsyncThunk<AxiosResponse<componentApiResponse>, string | null>("query/getComponentData", async (inputs) => {
  const response = await axiosInstance.get(`/backend/search/sku/${inputs}`);
  return response;
});
export const getQ3DatA = createAsyncThunk<AxiosResponse<Q3ApiResponse>, { date: string; comp: string }>("query/getQ3DatA", async (payload) => {
  const response = await axiosInstance.get(`/query/q3/${payload.comp}/${payload.date}`);
  return response;
});
export const getQ4DatA = createAsyncThunk<AxiosResponse<Q4Apiresponse>, { id: string; type: string }>(
  "query/getQ4DatA",
  async (payload) => {
    const response = await axiosInstance.get(`/query/q4/${payload.id}/${payload.type}`);
    return response;
  }
);
export const getQ5Data = createAsyncThunk<AxiosResponse<Q5Apiresponse>, { type: string; data: string }>("query/getQ5Data", async (payload) => {
  const response = await axiosInstance.get(`/query/q5/sim/report?type=${payload.type}&data=${payload.data}`);
  return response;
});
export const getQ6Data = createAsyncThunk<AxiosResponse<R6ApiResponse>, { id: string; type: string }>("query/getQ6Data", async (payload) => {
  const response = await axiosInstance.get(`/query/q6/${payload.type === "swipe" ? `swipeMachineDetail?srlOrImei=${payload.id}` : `devicetimeline?srlOrImei=${payload.id}`}`);
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
        state.q2Data = null;
      })
      .addCase(getQ3DatA.pending, (state) => {
        state.q3DataLoading = true;
      })
      .addCase(getQ3DatA.fulfilled, (state, action) => {
        state.q3DataLoading = false;
        if (action.payload.data.success) {
          state.q3data = action.payload.data.data;
        }
      })
      .addCase(getQ3DatA.rejected, (state) => {
        state.q3DataLoading = false;
        state.q3data = null;
      })
      .addCase(getQ4DatA.pending, (state) => {
        state.q4DataLoading = true;
        state.q4Data = null;
      })
      .addCase(getQ4DatA.fulfilled, (state, action) => {
        state.q4DataLoading = false;
        if (action.payload.data.success) {
          state.q4Data = action.payload.data.data;
        }
      })
      .addCase(getQ4DatA.rejected, (state) => {
        state.q4DataLoading = false;
        state.q4Data = null;
      })
      // .addCase(downloadQ4Data.pending, (state) => {
      //   state.q4DownloadLoading = true;
      // })
      // .addCase(downloadQ4Data.fulfilled, (state) => {
      //   state.q4DownloadLoading = false;
      // })
      // .addCase(downloadQ4Data.rejected, (state) => {
      //   state.q4DownloadLoading = false;
      // })
      .addCase(getQ5Data.pending, (state) => {
        state.q5DataLoading = true;
        state.q5Data = null;
      })
      .addCase(getQ5Data.fulfilled, (state, action) => {
        state.q5DataLoading = false;
        if (action.payload.data.success) {
          state.q5Data = action.payload.data.data;
        }
      })
      .addCase(getQ5Data.rejected, (state) => {
        state.q5DataLoading = false;
        state.q5Data = null;
      })
      .addCase(getQ6Data.pending, (state) => {
        state.q6StatementLoading = true;
        state.q6Statement = null;
      })
      .addCase(getQ6Data.fulfilled, (state, action) => {
        state.q6StatementLoading = false;
        if (action.payload.data.success) {
          state.q6Statement = action.payload.data.data;
        }
      })
      .addCase(getQ6Data.rejected, (state) => {
        state.q6StatementLoading = false;
        state.q6Statement = null;
      });
  },
});

export default querySlice.reducer;
