import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { ComponentDetails, ComponentsApiResponse, ComponnetState, GroupApiResponse } from "./componentType";
import { UomCreateApiresponse } from "../UOM/UOMType";

const initialState: ComponnetState = {
  component: null,
  getComponentLoading: false,
  createComponentLoading: false,
  groupList: null,
  getGroupListLoading: false,
};

export const getComponentsAsync = createAsyncThunk<AxiosResponse<ComponentsApiResponse>>("master/getcomponents", async () => {
  const response = await axiosInstance.get("/component");
  return response;
});
export const createComponentAsync = createAsyncThunk<AxiosResponse<UomCreateApiresponse>, ComponentDetails>("master/create_component", async (component) => {
  const response = await axiosInstance.post("/component/create_component", component);
  return response;
});
export const getGroupsAsync = createAsyncThunk<AxiosResponse<GroupApiResponse>>("group/groupSelect2", async () => {
  const response = await axiosInstance.get("/group/groupSelect2");
  return response;
});

const componentSlice = createSlice({
  name: "component",
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
      .addCase(getComponentsAsync.pending, (state) => {
        state.getComponentLoading = true;
      })
      .addCase(getComponentsAsync.fulfilled, (state, action) => {
        state.getComponentLoading = false;
        if (action.payload.data.success) {
          state.component = action.payload.data.data;
        }
      })
      .addCase(getComponentsAsync.rejected, (state) => {
        state.getComponentLoading = false;
      })
      .addCase(createComponentAsync.pending, (state) => {
        state.createComponentLoading = true;
      })
      .addCase(createComponentAsync.fulfilled, (state) => {
        state.createComponentLoading = false;
       
      })
      .addCase(createComponentAsync.rejected, (state) => {
        state.createComponentLoading = false;
      })
      .addCase(getGroupsAsync.pending, (state) => {
        state.getGroupListLoading = true;
      })
      .addCase(getGroupsAsync.fulfilled, (state, action) => {
        state.getGroupListLoading = false;
        if (action.payload.data.success) {
          state.groupList = action.payload.data.data;
        }
      })
      .addCase(getGroupsAsync.rejected, (state) => {
        state.getGroupListLoading = false;
      })
  },
});

export default componentSlice.reducer;
