import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { BOMState, CreateBomPayload, CreateBomResponse, FGBomDetailResponse, FGBomResponse, GetSkudetailResponse } from "./BOMType";
import { showToast } from "@/utils/toasterContext";
const initialState: BOMState = {
  skuData: null,
  getSkudetailLoading: false,
  createBomLoading: false,
  fgBomList: null,
  fgBomListLoading: false,
  changeStatusLoading: false,
  bomItemList: null,
  bomDetail: null,
  bomDetailLoading: false,
  updateBomLoading: false,
};

export const getskudeatilAsync = createAsyncThunk<AxiosResponse<GetSkudetailResponse>, string>("master/getSkudeatil", async (skucode) => {
  const response = await axiosInstance.get(`/product/bySku/${skucode}`);
  return response;
});
export const createBomAsync = createAsyncThunk<AxiosResponse<CreateBomResponse>, CreateBomPayload>("master/createbom", async (payload) => {
  const response = await axiosInstance.post(`/bom/add`, payload);
  return response;
});

export const getFGBomList = createAsyncThunk<AxiosResponse<FGBomResponse>, string>("bom/list", async (type: string) => {
  const response = await axiosInstance.get(`/bom/list/${type}`);
  return response;
});

export const changeBomStatus = createAsyncThunk<AxiosResponse<FGBomResponse>, { status: number; subject: string }>("bom/changeStatus", async ({ status, subject }) => {
  const response = await axiosInstance.put(`/bom/change/${status}/${subject}`);
  return response;
});

export const getBomItem = createAsyncThunk<AxiosResponse<FGBomResponse>, string>("bom/items", async (id: string) => {
  const response = await axiosInstance.get(`/bom/items/${id}`);
  return response;
});

export const fetchBomProduct = createAsyncThunk<AxiosResponse<FGBomResponse>, string>("bom/detail", async (id: string) => {
  const response = await axiosInstance.get(`/bom/${id}/detail`);
  return response;
});
export const fetchBomDetail = createAsyncThunk<AxiosResponse<FGBomDetailResponse>, string>("bom/fetchBomDetail", async (id: string) => {
  const response = await axiosInstance.get(`/bom/${id}/detail`);
  return response;
});
export const UpdateBom = createAsyncThunk<AxiosResponse<any>, any>("master/updateBom", async (payload) => {
  const response = await axiosInstance.put(`/bom/update/${payload.id}/${payload.sku}`, payload);
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
      .addCase(getFGBomList.pending, (state) => {
        state.fgBomListLoading = true;
      })
      .addCase(getFGBomList.fulfilled, (state, action) => {
        state.fgBomListLoading = false;
        if (action.payload.data.success) {
          state.fgBomList = action.payload.data.data;
        }
      })
      .addCase(getFGBomList.rejected, (state) => {
        state.fgBomListLoading = false;
      })
      .addCase(changeBomStatus.pending, (state) => {
        state.changeStatusLoading = true;
      })
      .addCase(changeBomStatus.fulfilled, (state, action) => {
        state.changeStatusLoading = false;
        showToast(action.payload.data?.message, "success");
      })
      .addCase(changeBomStatus.rejected, (state) => {
        state.changeStatusLoading = false;
      })
      .addCase(getBomItem.pending, (state) => {
        state.fgBomListLoading = true;
      })
      .addCase(getBomItem.fulfilled, (state, action) => {
        state.fgBomListLoading = false;
        state.bomItemList = action.payload.data.data;
      })
      .addCase(getBomItem.rejected, (state) => {
        state.fgBomListLoading = false;
      })
      .addCase(fetchBomProduct.pending, (state) => {
        state.fgBomListLoading = true;
      })
      .addCase(fetchBomProduct.fulfilled, (state) => {
        state.fgBomListLoading = false;
      })
      .addCase(fetchBomProduct.rejected, (state) => {
        state.fgBomListLoading = false;
      })
      .addCase(fetchBomDetail.pending, (state) => {
        state.bomDetailLoading = true;
      })
      .addCase(fetchBomDetail.fulfilled, (state, action) => {
        state.bomDetailLoading = false;
        state.bomDetail = action.payload.data;
      })
      .addCase(fetchBomDetail.rejected, (state) => {
        state.bomDetailLoading = false;
      })
      .addCase(UpdateBom.pending, (state) => {
        state.updateBomLoading = true;
      })
      .addCase(UpdateBom.fulfilled, (state) => {
        state.updateBomLoading = false;
      })
      .addCase(UpdateBom.rejected, (state) => {
        state.updateBomLoading = false;
      })
      .addCase(createBomAsync.pending, (state) => {
        state.createBomLoading = true;
      })
      .addCase(createBomAsync.fulfilled, (state, action) => {
        state.createBomLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data?.message, "success");
        }
      })
      .addCase(createBomAsync.rejected, (state) => {
        state.createBomLoading = false;
      });
  },
});

export default BOMSlice.reducer;
