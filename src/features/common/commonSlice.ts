import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { Commonstate, CurrencListResponse, UserApiResponse } from "./commonType";

const initialState: Commonstate = {
  getUserLoading: false,
  userData: null,
  isueeList: null,
  isueeListLoading: false,
  currencyLoaidng: false,
  currencyData: null,
};


export const getUserAsync = createAsyncThunk<AxiosResponse<UserApiResponse>, string | null>("common/getuser", async (searchinput) => {
  const response = await axiosInstance.get(`/backend/search/user/${searchinput}`);
  return response;
});
export const getIsueeList = createAsyncThunk<AxiosResponse<UserApiResponse>, string | null>("common/getIsueeList", async (searchinput) => {
  const response = await axiosInstance.get(`/backend/search/issue/${searchinput}`);
  return response;
});
export const getCurrency = createAsyncThunk<AxiosResponse<CurrencListResponse>>("common/getCurrency", async () => {
  const response = await axiosInstance.get(`/backend/currencies`);
  return response;
});
const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserAsync.pending, (state) => {
        state.getUserLoading = true;
      })
      .addCase(getUserAsync.fulfilled, (state, action) => {
        state.getUserLoading = false;
        if (action.payload.data.success) {
          state.userData = action.payload.data.data;
        }
      })
      .addCase(getUserAsync.rejected, (state) => {
        state.getUserLoading = false;
      })
      .addCase(getIsueeList.pending, (state) => {
        state.isueeListLoading = true;
      })
      .addCase(getIsueeList.fulfilled, (state, action) => {
        state.isueeListLoading = false;
        if (action.payload.data.success) {
          state.isueeList = action.payload.data.data;
        }
      })
      .addCase(getIsueeList.rejected, (state) => {
        state.isueeListLoading = false;
      })
      .addCase(getCurrency.pending, (state) => {
        state.currencyLoaidng = true;
      })
      .addCase(getCurrency.fulfilled, (state, action) => {
        state.currencyLoaidng = false;
        if (action.payload.data.success) {
          state.currencyData = action.payload.data.data;
        }
      })
      .addCase(getCurrency.rejected, (state) => {
        state.currencyLoaidng = false;
      });
  },
});

export default commonSlice.reducer;
