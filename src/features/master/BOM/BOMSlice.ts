import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { BOMState, CreateBomPayload, CreateBomResponse, GetSkudetailResponse } from "./BOMType";
import { showToast } from "@/utils/toastUtils";

const initialState: BOMState = {
  skuData: null,
  getSkudetailLoading: false,
  createBomLoading: false,
};

export const getskudeatilAsync = createAsyncThunk<AxiosResponse<GetSkudetailResponse>, string>("master/getSkudeatil", async (skucode) => {
  const response = await axiosInstance.get(`/product/bySku/${skucode}`);
  return response;
});
export const createBomAsync = createAsyncThunk<AxiosResponse<CreateBomResponse>, CreateBomPayload>("master/createbom", async (payload) => {
  const response = await axiosInstance.post(`/bom/add`, payload);
  return response;
});
const BOMSlice = createSlice({
  name: "BOM",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getskudeatilAsync.pending, (state) => {
        state.getSkudetailLoading = true;
      })
      .addCase(getskudeatilAsync.fulfilled, (state, action) => {
        state.getSkudetailLoading = false;
        if (action.payload.data.success) {
          state.skuData = action.payload.data.data;
        }
      })
      .addCase(getskudeatilAsync.rejected, (state) => {
        state.getSkudetailLoading = false;
      })
      .addCase(createBomAsync.pending, (state) => {
        state.createBomLoading = true;
      })
      .addCase(createBomAsync.fulfilled, (state, action) => {
        state.createBomLoading = false;
        if (action.payload.data.success) {
          showToast({
            variant: "success",
            description: action.payload.data?.message,
          });
        }
      })
      .addCase(createBomAsync.rejected, (state) => {
        state.createBomLoading = false;
      });
  },
});

export default BOMSlice.reducer;
