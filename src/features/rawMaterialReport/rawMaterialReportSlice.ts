import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

export type RawMaterialLocationType = {
  code?: string;
  name?: string;
  text?: string;
  sku?: string;
};

export interface RawMaterialLocationStock {
  opening: number;
  inward: number;
  outward: number;
  closing: number;
}

export interface RawMaterialReportItem {
  component_key: string;
  part_code: string;
  item: string;
  locations: Record<string, RawMaterialLocationStock>;
}

export interface RawMaterialReportResponse {
  status: boolean;
  fromDate: string;
  toDate: string;
  locations: string[];
  data: RawMaterialReportItem[];
}

interface RawMaterialReportState {
  locationList: RawMaterialLocationType[];
  locationListLoading: boolean;
  reportData: RawMaterialReportResponse | null;
  reportLoading: boolean;
}

const initialState: RawMaterialReportState = {
  locationList: [],
  locationListLoading: false,
  reportData: null,
  reportLoading: false,
};

export const fetchRawMaterialLocations = createAsyncThunk<AxiosResponse<any>>(
  "rawMaterialReport/pickLocation",
  async () => {
    const response = await axiosInstance.get(`/rawMaterialReport/pickLocation`);
    return response;
  },
);

export const getRawMaterialReport = createAsyncThunk<
  AxiosResponse<any>, 
  {
    fromDate: string;
    toDate: string;
    locations: string[];
    components: string[];
  }
>("rawMaterialReport/report", async (payload) => {
  const response = await axiosInstance.get(`/rawMaterialReport?components=${payload.components}&locations=${payload.locations}&fromDate=${payload.fromDate}&toDate=${payload.toDate}`,);
  return response;
});

const rawMaterialReportSlice = createSlice({
  name: "rawMaterialReport",
  initialState,
  reducers: {
    resetRawMaterialReport: (state) => {
      state.reportData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRawMaterialLocations.pending, (state) => {
        state.locationListLoading = true;
      })
      .addCase(fetchRawMaterialLocations.fulfilled, (state, action) => {
        state.locationListLoading = false;
        state.locationList = action.payload.data?.data ?? action.payload.data ?? [];
      })
      .addCase(fetchRawMaterialLocations.rejected, (state) => {
        state.locationListLoading = false;
      })
      .addCase(getRawMaterialReport.pending, (state) => {
        state.reportLoading = true;
      })
      .addCase(getRawMaterialReport.fulfilled, (state, action) => {
        state.reportLoading = false;
        if (action.payload.data?.status) {
          state.reportData = action.payload.data;
        }
      })
      .addCase(getRawMaterialReport.rejected, (state) => {
        state.reportLoading = false;
      });
  },
});

export const { resetRawMaterialReport } = rawMaterialReportSlice.actions;
export default rawMaterialReportSlice.reducer;
