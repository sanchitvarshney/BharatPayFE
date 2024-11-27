import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { MenuResponse, MenuState, TabApiResponse } from "./menuType";

const initialState: MenuState = {
  menu: null,
  menuLoading: false,
  menuTab: null,
  menuTabLoading: false,
};

export const getMenuData = createAsyncThunk<AxiosResponse<MenuResponse>>("menu/getMenuData", async () => {
  const response = await axiosInstance.get(`/permission/getUserMenuPermission`);
  return response;
});
export const getMenuTab = createAsyncThunk<AxiosResponse<TabApiResponse>,string>("menu/getMenuTab", async (menukey) => {
  const response = await axiosInstance.get(`/menuTab/list/${menukey}`);
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
      })
      .addCase(getMenuTab.pending, (state) => {
        state.menuTabLoading = true;
      })
      .addCase(getMenuTab.fulfilled, (state, action) => {
        state.menuTabLoading = false;
        if (action.payload.data.success) {
          state.menuTab = action.payload?.data?.data;
        }
      })
      .addCase(getMenuTab.rejected, (state) => {
        state.menuTabLoading = false;
        state.menu = null;
      });
  },
});

export default menuSlice.reducer;
