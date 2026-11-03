import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

type RangeArgs = {
  from: string;
  to: string;
};

type PagedRangeArgs = RangeArgs & {
  page: number;
  limit: number;
};

type SkuConsumptionState = {
  data: any;
  loading: boolean;
  rangeKey: string | null;
};

interface SwipeBillingState {
  dateRange: any;
  isData: boolean;
  summaryReportData: any;
  summaryReportLoading: boolean;
  summaryReportRangeKey: string | null;
  skuConsumption: Record<string, SkuConsumptionState>;
  dispatchData: any;
  dispatchLoading: boolean;
  dispatchRangeKey: string | null;
  purchaseData: any;
  purchaseLoading: boolean;
  purchaseRangeKey: string | null;
}

export const swipeRangeKey = (from: string, to: string): string =>
  `${from}_${to}`;

const initialState: SwipeBillingState = {
  dateRange: null,
  isData: false,
  summaryReportData: null,
  summaryReportLoading: false,
  summaryReportRangeKey: null,
  skuConsumption: {},
  dispatchData: null,
  dispatchLoading: false,
  dispatchRangeKey: null,
  purchaseData: null,
  purchaseLoading: false,
  purchaseRangeKey: null,
};

export const getSwipeSummaryReport = createAsyncThunk<
  AxiosResponse<any>,
  PagedRangeArgs
>("swipeBilling/summary-report", async (payload) => {
  const response = await axiosInstance.post(`/swipebill/summary-report`, {
    fromDate: payload.from,
    toDate: payload.to,
    page: payload.page,
    limit: payload.limit,
  });
  return response;
});

export const getSwipeSkuConsumption = createAsyncThunk<
  AxiosResponse<any>,
  PagedRangeArgs & { skuKey: string; skuId: string }
>("swipeBilling/sku-consumption", async (payload) => {
  const response = await axiosInstance.post(`/swipebill/sku-consumption`, {
    skus: [payload.skuId],
    fromDate: payload.from,
    toDate: payload.to,
    page: payload.page,
    limit: payload.limit,
  });
  return response;
});

export const getSwipeDispatched = createAsyncThunk<
  AxiosResponse<any>,
  PagedRangeArgs & { locOut: string }
>("swipeBilling/dispatched", async (payload) => {
  const response = await axiosInstance.get(
    `/swipebill/dispatched-swipeboxes?fromDate=${payload.from}&toDate=${payload.to}&page=${payload.page}&limit=${payload.limit}&loc_out=${payload.locOut}`,
  );
  return response;
});

export const getSwipePurchase = createAsyncThunk<AxiosResponse<any>, RangeArgs>(
  "swipeBilling/purchase",
  async (payload) => {
    const response = await axiosInstance.get(
      `/swipebill/purchase-component?fromDate=${payload.from}&toDate=${payload.to}`,
    );
    return response;
  },
);

const swipeBillingSlice = createSlice({
  name: "swipeBilling",
  initialState,
  reducers: {
    setSwipeDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setSwipeIsData: (state, action) => {
      state.isData = action.payload;
    },
    resetSwipeBilling: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSwipeSummaryReport.pending, (state) => {
        state.summaryReportLoading = true;
      })
      .addCase(getSwipeSummaryReport.fulfilled, (state, action) => {
        state.summaryReportLoading = false;
        if (action.payload.data.success) {
          state.summaryReportData = action.payload.data;
          state.summaryReportRangeKey = swipeRangeKey(
            action.meta.arg.from,
            action.meta.arg.to,
          );
        }
      })
      .addCase(getSwipeSummaryReport.rejected, (state) => {
        state.summaryReportLoading = false;
      })
      .addCase(getSwipeSkuConsumption.pending, (state, action) => {
        const { skuKey } = action.meta.arg;
        state.skuConsumption[skuKey] = {
          data: state.skuConsumption[skuKey]?.data ?? null,
          rangeKey: state.skuConsumption[skuKey]?.rangeKey ?? null,
          loading: true,
        };
      })
      .addCase(getSwipeSkuConsumption.fulfilled, (state, action) => {
        const { skuKey, from, to } = action.meta.arg;
        const entry = state.skuConsumption[skuKey];
        entry.loading = false;
        if (action.payload.data.success) {
          entry.data = action.payload.data;
          entry.rangeKey = swipeRangeKey(from, to);
        }
      })
      .addCase(getSwipeSkuConsumption.rejected, (state, action) => {
        const entry = state.skuConsumption[action.meta.arg.skuKey];
        if (entry) entry.loading = false;
      })
      .addCase(getSwipeDispatched.pending, (state) => {
        state.dispatchLoading = true;
      })
      .addCase(getSwipeDispatched.fulfilled, (state, action) => {
        state.dispatchLoading = false;
        if (action.payload.data.success) {
          state.dispatchData = action.payload.data;
          state.dispatchRangeKey = swipeRangeKey(
            action.meta.arg.from,
            action.meta.arg.to,
          );
        }
      })
      .addCase(getSwipeDispatched.rejected, (state) => {
        state.dispatchLoading = false;
      })
      .addCase(getSwipePurchase.pending, (state) => {
        state.purchaseLoading = true;
      })
      .addCase(getSwipePurchase.fulfilled, (state, action) => {
        state.purchaseLoading = false;
        if (action.payload.data.success) {
          state.purchaseData = action.payload.data;
          state.purchaseRangeKey = swipeRangeKey(
            action.meta.arg.from,
            action.meta.arg.to,
          );
        }
      })
      .addCase(getSwipePurchase.rejected, (state) => {
        state.purchaseLoading = false;
      });
  },
});

export const { setSwipeDateRange, setSwipeIsData, resetSwipeBilling } =
  swipeBillingSlice.actions;

export default swipeBillingSlice.reducer;
