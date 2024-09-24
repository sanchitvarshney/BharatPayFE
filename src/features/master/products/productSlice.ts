import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { createProductdata, ProductsApiResponse, ProductState } from "./productType";
import { UomCreateApiresponse } from "../UOM/UOMType";

const initialState: ProductState = {
  products: [],
  getProductsLoading: false,
  createProductLoading: false,
};

export const getProductsAsync = createAsyncThunk<AxiosResponse<ProductsApiResponse>>("master/getproducts", async () => {
  const response = await axiosInstance.get("/product");
  return response;
});
export const createProductAsync = createAsyncThunk<AxiosResponse<UomCreateApiresponse>, createProductdata>("master/createuom", async (product) => {
  const response = await axiosInstance.post("/product/create_product", product);
  return response;
});

const componentSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // logout(state) {
    //   localStorage.clear();
    //   state.user = null;
    //   state.token = null;
    //   window.location.reload();
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductsAsync.pending, (state) => {
        state.getProductsLoading = true;
      })
      .addCase(getProductsAsync.fulfilled, (state, action) => {
        state.getProductsLoading = false;
        if (action.payload.data.success) {
          state.products = action.payload.data.data;
        }
      })
      .addCase(getProductsAsync.rejected, (state) => {
        state.getProductsLoading = false;
      })
      .addCase(createProductAsync.pending, (state) => {
        state.createProductLoading = true;
      })
      .addCase(createProductAsync.fulfilled, (state) => {
        state.createProductLoading = false;
      })
      .addCase(createProductAsync.rejected, (state) => {
        state.createProductLoading = false;
      })
  },
});

export default componentSlice.reducer;
