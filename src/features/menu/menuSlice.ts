import axiosInstance from "@/api/axiosInstance";
import { augmentComponentMenu } from "@/utils/augmentComponentMenu";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { MenuResponse, MenuState, TabApiResponse } from "./menuType";

const initialState: MenuState = {
  menu: null,
  menuLoading: false,
  menuKey: null,
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
  reducers: {
    setMenuKey(state, action: { payload: string | null }) {
      if (state.menuKey !== action.payload) {
        // Clear stale tabs whenever the active menu changes
        state.menuKey = action.payload;
        state.menuTab = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMenuData.pending, (state) => {
        state.menuLoading = true;
      })
      .addCase(getMenuData.fulfilled, (state, action) => {
        state.menuLoading = false;
        if (action.payload.data.success) {
          state.menu = augmentComponentMenu(action.payload.data.menu);
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

export const { setMenuKey } = menuSlice.actions;
export default menuSlice.reducer;
