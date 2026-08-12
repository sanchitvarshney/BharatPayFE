import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

interface initialStateType {
  speakerAssemblyData: any;
  speakerAssemblyLoading: boolean;
  trcData: any;
  trcLoading: boolean;
}

const initialState: initialStateType = {
  speakerAssemblyData: null,
  speakerAssemblyLoading: false,
  trcData: null,
  trcLoading: false,
};

export const getSpeakerAssembly = createAsyncThunk<
  AxiosResponse<any>,
  {
    from: string;
    to: string;
    page: number;
    limit: number;
  }
>("report/billing-summary", async (payload) => {
  const response = await axiosInstance.get(
    `/bill/part-consumption/assembly?fromDate=${payload.from}&toDate=${payload.to}&page=${payload.page}&limit=${payload.limit}`,
  );
  return response;
});
export const getTRC = createAsyncThunk<
  AxiosResponse<any>,
  {
    from: string;
    to: string;
    page: number;
    limit: number;
  }
>("report/billing-trc", async (payload) => {
  const response = await axiosInstance.get(
    `/bill/part-consumption/trc?fromDate=${payload.from}&toDate=${payload.to}&page=${payload.page}&limit=${payload.limit}`,
  );
  return response;
});

const billingSlices = createSlice({
  name: "billing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getSpeakerAssembly.pending, (state) => {
        state.speakerAssemblyLoading = true;
      })
      .addCase(getSpeakerAssembly.fulfilled, (state, action) => {
        state.speakerAssemblyLoading = false;

        if (action.payload.data.success) {
          state.speakerAssemblyData = action.payload.data;
        }
      })
      .addCase(getSpeakerAssembly.rejected, (state) => {
        state.speakerAssemblyLoading = false;
      })
      .addCase(getTRC.pending, (state) => {
        state.trcLoading = true;
      })
      .addCase(getTRC.fulfilled, (state, action) => {
        state.trcLoading = false;

        if (action.payload.data.success) {
          state.trcData = action.payload.data;
        }
      })
      .addCase(getTRC.rejected, (state) => {
        state.trcLoading = false;
      });
  },
});

// export const {  } =
//   billingSlices.actions;

export default billingSlices.reducer;
