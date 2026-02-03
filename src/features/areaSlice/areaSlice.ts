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
  workingData: [],
  fromLocationLoading: false,
  fromLocationList: [],
  partCodeLoading: false,
  partCodeList: [],
  totalQty: 0,
  toLocationLoading: false,
  toLocationList: [],
  fieldLoading: false,
};

// for tranferPartCode

export const getFromFieldData = createAsyncThunk<AxiosResponse<any>>(
  "part/code/filed-data",
  async (payload:any) => {
    const response = await axiosInstance.get(`/wrongDevice/checkAwb?awbNo=${payload.awbNo}&partner=${payload.partner}`);
    return response;
  },
);

export const getAvailableQty = createAsyncThunk<AxiosResponse<any>>(
  "part/code/qty",
  async (payload: any) => {
    const response = await axiosInstance.get(
      `/rejectionTransfer/getQuantity/?itemKey=${encodeURIComponent(
        payload?.itemKey,
      )}&fromLocation=${encodeURIComponent(payload?.fromLocation)}`,
    );

    return response;
  },
);

export const getFromLocation = createAsyncThunk<AxiosResponse<any>>(
  "part/code/loc",
  async () => {
    const response = await axiosInstance.get(`/rejectionTransfer/pickLocation`);
    return response;
  },
);

export const getDropLocation = createAsyncThunk<AxiosResponse<any>>(
  "part/code/dropLocation",
  async () => {
    const response = await axiosInstance.get(`/rejectionTransfer/dropLocation`);
    return response;
  },
);

export const submitPartCodeTransfer = createAsyncThunk<AxiosResponse<any>, any>(
  "part/code/submit",
  async (payload) => {
    const response = await axiosInstance.post(
      `/rejectionTransfer/partRejectionTransfer`,
      payload,
    );
    return response;
  },
);
export const getPartCode = createAsyncThunk<
  AxiosResponse<any>,
  string | undefined
>("part/code", async (searchQuery: any) => {
  const url = `/rejectionTransfer/getAllPartCode?search=${encodeURIComponent(
    searchQuery,
  )}`;

  const response = await axiosInstance.get(url);
  return response;
});

export const getMasterPlace = createAsyncThunk<AxiosResponse<any>>(
  "master/place",
  async () => {
    const response = await axiosInstance.get(`/master/fetchMasterPlace`);
    return response;
  },
);

export const getDepartment = createAsyncThunk<AxiosResponse<any>>(
  "master/place/department",
  async (payload: any) => {
    const response = await axiosInstance.get(
      `/master/fetchDepartmentPlace/?place=${payload.place}`,
    );
    return response;
  },
);
export const getWorkingData = createAsyncThunk<AxiosResponse<any>>(
  "master/place/view-data",
  async (payload: any) => {
    const response = await axiosInstance.get(
      `/worker/viewData?from=${payload.from}&to=${payload.to}&place=${payload.place}&department=${payload.department}`,
    );
    return response;
  },
);
export const getEmployees = createAsyncThunk<AxiosResponse<any>>(
  "master/place/emp",
  async ({ date }: any) => {
    const response = await axiosInstance.get(
      `/hrms/fetchEmployees?date=${date}`,
    );
    return response;
  },
);

export const submitData = createAsyncThunk<AxiosResponse<any>>(
  "master/place/submit",
  async (payload: any) => {
    const response = await axiosInstance.post(
      `/worker/submitDailyData`,
      payload,
    );
    return response;
  },
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
      })
      //from part code
      .addCase(getFromLocation.pending, (state) => {
        state.fromLocationLoading = true;
      })
      .addCase(getFromLocation.fulfilled, (state, action) => {
        state.fromLocationLoading = false;
        if (action.payload.data.success) {
          state.fromLocationList = action.payload.data.data;
        }
      })
      .addCase(getFromLocation.rejected, (state) => {
        state.fromLocationLoading = false;
      })

      .addCase(getPartCode.pending, (state) => {
        state.partCodeLoading = true;
      })
      .addCase(getPartCode.fulfilled, (state, action) => {
        state.partCodeLoading = false;
        if (action.payload.data.success) {
          state.partCodeList = action.payload.data.data;
        }
      })
      .addCase(getPartCode.rejected, (state) => {
        state.partCodeLoading = false;
      })
      .addCase(getAvailableQty.pending, () => {})
      .addCase(getAvailableQty.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.totalQty = action.payload.data.data;
        }
      })
      .addCase(getAvailableQty.rejected, () => {})
      .addCase(getDropLocation.pending, (state) => {
        state.toLocationLoading = true;
      })
      .addCase(getDropLocation.fulfilled, (state, action) => {
        state.toLocationLoading = false;
        if (action.payload.data.success) {
          state.toLocationList = action.payload.data.data;
        }
      })
      .addCase(getDropLocation.rejected, (state) => {
        state.toLocationLoading = false;
      })
      .addCase(submitPartCodeTransfer.pending, (state) => {
        state.submitLoading = true;
      })
      .addCase(submitPartCodeTransfer.fulfilled, (state) => {
        state.submitLoading = false;
      })
      .addCase(submitPartCodeTransfer.rejected, (state) => {
        state.submitLoading = false;
      })
      .addCase(getFromFieldData.pending, (state) => {
        state.fieldLoading = true;
      })
      .addCase(getFromFieldData.fulfilled, (state) => {
        state.fieldLoading = false;
      })
      .addCase(getFromFieldData.rejected, (state) => {
        state.fieldLoading = false;
      });
  },
});

export default placeSlice.reducer;
