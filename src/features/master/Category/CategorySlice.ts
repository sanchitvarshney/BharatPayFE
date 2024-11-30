import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { CategoryListApiResponse, CategoryState } from "./CategoryType";
import { showToast } from "@/utils/toasterContext";

const initialState: CategoryState = {
  categoryList: [],
  getCategoryLoading: false,
  createCategoryLoading: false,
  createSubCategoryLoading: false,
  getSubCategoryLoading: false,
  subCategoryList: [],
};

export const getCategoryList = createAsyncThunk<AxiosResponse<CategoryListApiResponse>>("master/category/getCAtegoryList", async () => {
  const response = await axiosInstance.get(`/component/category/categoryList`);
  return response;
});
export const createCategory = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, string>("master/category/createCategory", async (name) => {
  const response = await axiosInstance.post(`/component/category/createCategory`, { category: name });
  return response;
});
export const createSubCategory = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, { catId: string; subCategory: string }>("master/category/createSubCategory", async (paylaod) => {
  const response = await axiosInstance.post(`/component/category/createSubCategory`, paylaod);
  return response;
});
export const getSubCategoryList = createAsyncThunk<AxiosResponse<CategoryListApiResponse>, string>("master/category/getSubCategoryList", async (id) => {
  const response = await axiosInstance.get(`/component/category/subCategoryList/${id}`);
  return response;
});
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategoryList.pending, (state) => {
        state.getCategoryLoading = true;
      })
      .addCase(getCategoryList.fulfilled, (state, action) => {
        state.getCategoryLoading = false;
        if (action.payload.data.success) {
          state.categoryList = action.payload.data.data;
        }
      })
      .addCase(getCategoryList.rejected, (state) => {
        state.getCategoryLoading = false;
      })
      .addCase(getSubCategoryList.pending, (state) => {
        state.getSubCategoryLoading = true;
        state.subCategoryList = [];
      })
      .addCase(getSubCategoryList.fulfilled, (state, action) => {
        state.getSubCategoryLoading = false;
        if (action.payload.data.success) {
          state.subCategoryList = action.payload.data.data;
        }
      })
      .addCase(getSubCategoryList.rejected, (state) => {
        state.getSubCategoryLoading = false;
        state.subCategoryList = [];
      })
      .addCase(createCategory.pending, (state) => {
        state.createCategoryLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.createCategoryLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(createCategory.rejected, (state) => {
        state.createCategoryLoading = false;
      })
      .addCase(createSubCategory.pending, (state) => {
        state.createSubCategoryLoading = true;
      })
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.createSubCategoryLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(createSubCategory.rejected, (state) => {
        state.createSubCategoryLoading = false;
      });
  },
});

export default categorySlice.reducer;
