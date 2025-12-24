import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { InitialAreaType } from "./areaType";

const initialState: InitialAreaType = {
  placeLoading: false,
  departmentLoading: false,
  departmentList: [],
  placeList: [],
  empList: [],
  empLoading: false,
  submitLoading: false,
  workingDataLoading: false,
  workingData: []
};

export const getMasterPlace = createAsyncThunk<AxiosResponse<any>>(
  "master/place",
  async () => {
    const response = await axiosInstance.get(`/master/fetchMasterPlace`);
    return response;
  }
);
export const getDepartment = createAsyncThunk<AxiosResponse<any>>(
  "master/place/department",
  async (payload: any) => {
    const response = await axiosInstance.get(
      `/master/fetchDepartmentPlace/?place=${payload.place}`
    );
    return response;
  }
);
export const getWorkingData = createAsyncThunk<AxiosResponse<any>>(
  "master/place/view-data",
  async (payload: any) => {
    const response = await axiosInstance.get(`/worker/viewData?from=${payload.from}&to=${payload.to}&place=${payload.place}&department=${payload.department}`);
    return response;
  }
);
export const getEmployees = createAsyncThunk<AxiosResponse<any>>(
  "master/place/emp",
  async () => {
    const response = await axiosInstance.get(
      `/hrms/fetchEmployee`
    );
    return response;
  }
);



export const submitData = createAsyncThunk<AxiosResponse<any>>(
  "master/place/submit",
  async (payload: any) => {
    const response = await axiosInstance.post(
      `/worker/submitDailyData`,
      payload
    );
    return response;
  }
);

const placeSlice = createSlice({
  name: "place",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMasterPlace.pending, (state) => {
        state.placeLoading = true;
      })
      .addCase(getMasterPlace.fulfilled, (state, action) => {
        state.placeLoading = false;
        if (action.payload.data.success) {
          state.placeList = action.payload.data.data;
        }
      })
      .addCase(getMasterPlace.rejected, (state) => {
        state.placeLoading = false;
      })
      .addCase(getDepartment.pending, (state) => {
        state.departmentLoading = true;
      })
      .addCase(getDepartment.fulfilled, (state, action) => {
        state.departmentLoading = false;
        if (action.payload.data.success) {
          state.departmentList = action.payload.data.data;
        }
      })
      .addCase(getDepartment.rejected, (state) => {
        state.departmentLoading = false;
      })
      .addCase(getEmployees.pending, (state) => {
        state.empLoading = true;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.empLoading = false;
        if (action.payload.data.success) {
          state.empList = action.payload.data.data;
        }
      })
      .addCase(getEmployees.rejected, (state) => {
        state.empLoading = false;
      })
      .addCase(submitData.pending, (state) => {
        state.submitLoading = true;
      })
      .addCase(submitData.fulfilled, (state) => {
        state.submitLoading = false;
      })
      .addCase(submitData.rejected, (state) => {
        state.submitLoading = false;
      })
      .addCase(getWorkingData.pending, (state) => {
        state.workingDataLoading = true;
      })
      .addCase(getWorkingData.fulfilled, (state, action) => {
        state.workingDataLoading = false;
        if (action.payload.data.success) {
          state.workingData = action.payload.data.data;
        }
      })
      .addCase(getWorkingData.rejected, (state) => {
        state.workingDataLoading = false;
      });
  },
});

export default placeSlice.reducer;
