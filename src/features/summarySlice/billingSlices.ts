import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

interface initialStateType {
  speakerAssemblyData: any;
  speakerAssemblyLoading: boolean;
  trcData: any;
  trcLoading: boolean;
  dispatchedData: any;
  dispatchedLoading: boolean;
    materialData: any;
  materialLoading: boolean;
  dateRange: any;
  isData: boolean;
  trcAssemblyData: any
  trcAssemblyLoading: boolean
}

const initialState: initialStateType = {
  speakerAssemblyData: null,
  speakerAssemblyLoading: false,
  trcData: null,
  trcLoading: false,
  dateRange: null,
  dispatchedData: null,
  dispatchedLoading: false,
  materialData: null,
  materialLoading: false,
  isData: false,
  trcAssemblyData: null,
  trcAssemblyLoading: false
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

export const getAssembly = createAsyncThunk<
  AxiosResponse<any>,
  {
    from: string;
    to: string;
    page: number;
    limit: number;
  }
>("report/billing-assembly", async (payload) => {
  const response = await axiosInstance.get(
    `/bill/part-consumption/trc?fromDate=${payload.from}&toDate=${payload.to}&page=${payload.page}&limit=${payload.limit}`,
  );
  return response;
});

export const getDispatchedSummary = createAsyncThunk<
  AxiosResponse<any>,
  {
    from: string;
    to: string;
    page: number;
    limit: number;
  }
>("report/billing-dispatched", async (payload) => {
  const response = await axiosInstance.get(
    `/bill/dispatched-soundboxes?fromDate=${payload.from}&toDate=${payload.to}&page=${payload.page}&limit=${payload.limit}`,
  );
  return response;
});
export const getMaterialPurchased = createAsyncThunk<
  AxiosResponse<any>,
  {
    from: string;
    to: string;
  }
>("report/billing-material", async (payload) => {
  const response = await axiosInstance.get(
    `/bill/monthly-component?fromDate=${payload.from}&toDate=${payload.to}`,
  );
  return response;
});
export const getAssableAndTRC = createAsyncThunk<
  AxiosResponse<any>,
  {
      from: string;
    to: string;
    page: number;
    limit: number;
  }
>("report/billing-assable-trc", async (payload) => {
  const response = await axiosInstance.get(
    `/bill/trc&assembly/summary?fromDate=${payload.from}&toDate=${payload.to}&page=${payload.page}&limit=${payload.limit}`,
  );
  return response;
});

const billingSlices = createSlice({
  name: "billing",
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setIsData: (state, action) => {
      state.isData = action.payload;
    },
  },
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
      })
      .addCase(getDispatchedSummary.pending, (state) => {
        state.dispatchedLoading = true;
      })
      .addCase(getDispatchedSummary.fulfilled, (state, action) => {
        state.dispatchedLoading = false;

        if (action.payload.data.success) {
          state.dispatchedData = action.payload.data;
        }
      })
      .addCase(getDispatchedSummary.rejected, (state) => {
        state.dispatchedLoading = false;
      })
      .addCase(getMaterialPurchased.pending, (state) => {
        state.materialLoading = true;
      })
      .addCase(getMaterialPurchased.fulfilled, (state, action) => {
        state.materialLoading = false;

        if (action.payload.data.success) {
          state.materialData = action.payload.data;
        }
      })
      .addCase(getMaterialPurchased.rejected, (state) => {
        state.materialLoading = false;
      }) .addCase(getAssableAndTRC.pending, (state) => {
        state.trcAssemblyLoading = true;
      })
      .addCase(getAssableAndTRC.fulfilled, (state, action) => {
        state.trcAssemblyLoading = false;

        if (action.payload.data.success) {
          state.trcAssemblyData = action.payload.data;
        }
      })
      .addCase(getAssableAndTRC.rejected, (state) => {
        state.trcAssemblyLoading = false;
      });
  },
});

export const { setDateRange , setIsData} = billingSlices.actions;

export default billingSlices.reducer;
