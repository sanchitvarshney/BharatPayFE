import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";

export type CrmSerialRow = {
  serial_number: string;
  [key: string]: any;
};

interface CrmRemarkState {
  serials: CrmSerialRow[];
  loading: boolean;
  submitLoading: boolean;
}

const initialState: CrmRemarkState = {
  serials: [],
  loading: false,
  submitLoading: false,
};

export const fetchCrmSerials = createAsyncThunk(
  "crmRemark/fetchCrmSerials",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        "/deviceMinV2/fetchDeviceRemarkPending",
      );
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      return data as CrmSerialRow[];
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to load CRM serial numbers",
      );
    }
  },
);

export type SubmitCrmSerialsResponse = {
  success: boolean;
  message?: string;
  status?: string;
};

export const submitCrmSerials = createAsyncThunk(
  "crmRemark/submitCrmSerials",
  async (
    { serialNumbers, remark }: { serialNumbers: string[]; remark: string[] },
    { rejectWithValue },
  ) => {
    try {
      const res = await axiosInstance.post<SubmitCrmSerialsResponse>(
        "/deviceMinV2/changeRemarkStatus",
        { serial: serialNumbers,status: remark },
      );

      const data = res.data;

      if (data?.success === true) {
        return data;
      }

      return rejectWithValue(
        data?.message || "Failed to submit CRM serial numbers",
      );
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to submit CRM serial numbers",
      );
    }
  },
);

const crmRemarkSlice = createSlice({
  name: "crmRemark",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCrmSerials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCrmSerials.fulfilled, (state, action) => {
        state.loading = false;
        state.serials = action.payload;
      })
      .addCase(fetchCrmSerials.rejected, (state) => {
        state.loading = false;
        state.serials = [];
      })
      .addCase(submitCrmSerials.pending, (state) => {
        state.submitLoading = true;
      })
      .addCase(submitCrmSerials.fulfilled, (state) => {
        state.submitLoading = false;
      })
      .addCase(submitCrmSerials.rejected, (state) => {
        state.submitLoading = false;
      });
  },
});

export default crmRemarkSlice.reducer;
