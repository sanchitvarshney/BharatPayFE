import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { Commonstate, UserApiResponse } from "./commonType";

const initialState: Commonstate = {
  getUserLoading: false,
  userData: null,
};

export const getUserAsync = createAsyncThunk<AxiosResponse<UserApiResponse>,string|null>("common/getuser", async (searchinput) => {
  const response = await axiosInstance.get(`backend/search/user/${searchinput}`);
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
      });
  },
});

export default commonSlice.reducer;
