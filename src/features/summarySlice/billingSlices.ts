import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

interface initialStateType {
  speakerAssemblyData: any;
  speakerAssemblyLoading: boolean;
  speakerAssemblyRangeKey: string | null;
  trcData: any;
  trcLoading: boolean;
  trcRangeKey: string | null;
  dispatchedData: any;
  dispatchedLoading: boolean;
  dispatchedRangeKey: string | null;
    materialData: any;
  materialLoading: boolean;
  materialRangeKey: string | null;
  dateRange: any;
  isData: boolean;
  trcAssemblyData: any
  trcAssemblyLoading: boolean
  trcAssemblyRangeKey: string | null;
  billingSummaryData: any;
  billingSummaryLoading: boolean;
}

export const rangeKey = (from: string, to: string): string => `${from}_${to}`;

const initialState: initialStateType = {
  speakerAssemblyData: null,
  speakerAssemblyLoading: false,
  speakerAssemblyRangeKey: null,
  trcData: null,
  trcLoading: false,
  trcRangeKey: null,
  dateRange: null,
  dispatchedData: null,
  dispatchedLoading: false,
  dispatchedRangeKey: null,
  materialData: null,
  materialLoading: false,
  materialRangeKey: null,
  isData: false,
  trcAssemblyData: null,
  trcAssemblyLoading: false,
  trcAssemblyRangeKey: null,
  billingSummaryData: null,
  billingSummaryLoading: false,
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

export const getBillingSummary = createAsyncThunk<
  AxiosResponse<any>,
  {
    from: string;
    to: string;
  }
>("report/billing-full-summary", async (payload) => {
  const response = await axiosInstance.get(
    `/bill/billing/summary?fromDate=${payload.from}&toDate=${payload.to}`,
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
          state.speakerAssemblyRangeKey = rangeKey(
            action.meta.arg.from,
            action.meta.arg.to,
          );
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
          state.trcRangeKey = rangeKey(action.meta.arg.from, action.meta.arg.to);
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
          state.dispatchedRangeKey = rangeKey(
            action.meta.arg.from,
            action.meta.arg.to,
          );
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
          state.materialRangeKey = rangeKey(
            action.meta.arg.from,
            action.meta.arg.to,
          );
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
          state.trcAssemblyRangeKey = rangeKey(
            action.meta.arg.from,
            action.meta.arg.to,
          );
        }
      })
      .addCase(getAssableAndTRC.rejected, (state) => {
        state.trcAssemblyLoading = false;
      })
      .addCase(getBillingSummary.pending, (state) => {
        state.billingSummaryLoading = true;
      })
      .addCase(getBillingSummary.fulfilled, (state, action) => {
        state.billingSummaryLoading = false;

        if (action.payload.data.success) {
          state.billingSummaryData = action.payload.data;
        }
      })
      .addCase(getBillingSummary.rejected, (state) => {
        state.billingSummaryLoading = false;
      });
  },
});

export const { setDateRange , setIsData} = billingSlices.actions;

export default billingSlices.reducer;
