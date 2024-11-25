import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { MenuResponse, MenuState } from "./menuType";

const initialState: MenuState = {
  menu: null,
  menuLoading: false,
};

export const getMenuData = createAsyncThunk<AxiosResponse<MenuResponse>>("menu/getMenuData", async () => {
  const response = await axiosInstance.get(`/permission/getUserMenuPermission`);
  return response;
});

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMenuData.pending, (state) => {
        state.menuLoading = true;
      })
      .addCase(getMenuData.fulfilled, (state, action) => {
        state.menuLoading = false;
        if (action.payload.data.success) {
          state.menu = action.payload?.data?.menu;
        }
      })
      .addCase(getMenuData.rejected, (state) => {
        state.menuLoading = false;
        state.menu = null;
      });
  },
});

export default menuSlice.reducer;
