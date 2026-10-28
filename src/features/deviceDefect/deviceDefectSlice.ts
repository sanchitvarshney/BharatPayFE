import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";
import publicAxiosInstance from "@/api/publicAxiosInstance";
import { showToast } from "@/utils/toasterContext";
import { getApiMessage } from "@/utils/getApiMessage";

export type RequestDeviceApprovalPayload = {
  device_type?: string;
  serial_no: string;
  remark?: string;
  images: File[];
};

type ApiResponse = {
  success: boolean;
  message?: unknown;
};

type RejectValue = {
  message: string;
  toasted: boolean;
};

export type DeviceApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "HOLD";
export type DeviceDecisionStatus = Exclude<DeviceApprovalStatus, "PENDING">;

export type DevicePhoto = {
  originalName?: string;
  uploadedAt?: string;
  size?: number;
  url?: string;
  presigned_url?: string;
};

export type DeviceApprovalItem = {
  id: number;
  // unique key per device row, sent back as unique_key on submit
  key: string;
  serial_no: string;
  device_type: string;
  status: DeviceApprovalStatus | string;
  action_by: string | null;
  action_date: string | null;
  remarks: string | null;
  next?: string | null;
  requested_by: string;
  created_at: string;
  photos?: Record<string, DevicePhoto | null> | null;
};

export type DeviceApprovalListResponse = ApiResponse & {
  status?: string;
  req_id?: string;
  total_devices?: number;
  data?: DeviceApprovalItem[];
};

export type DeviceNextAction = "scrap" | "repair";

export type DeviceApprovalAction = {
  unique_key: string;
  status: DeviceDecisionStatus;
  next: DeviceNextAction | "";
  remark: string;
};

export type SubmitDeviceApprovalPayload = {
  reqId: string;
  token: string;
  actions: DeviceApprovalAction[];
};

export type DeviceQualityReportRow = {
  serial_no: string;
  status: DeviceApprovalStatus | string;
  image_links: string[] | null;
  created_at: string;
  action_by?: string | null;
  requested_by?: string | null;
  remarks?: string | null;
  remark?: string | null;
};

type DeviceQualityReportResponse = ApiResponse & {
  data?: DeviceQualityReportRow[];
};

interface DeviceDefectState {
  requestApprovalLoading: boolean;
  requestApprovalError: string | null;

  approvalReqId: string | null;
  approvalDevices: DeviceApprovalItem[];
  approvalListLoading: boolean;
  approvalListError: string | null;

  decisionLoading: DeviceDecisionStatus | null;
  decisionError: string | null;

  reportList: DeviceQualityReportRow[];
  reportLoading: boolean;
  reportError: string | null;
}

const initialState: DeviceDefectState = {
  requestApprovalLoading: false,
  requestApprovalError: null,

  approvalReqId: null,
  approvalDevices: [],
  approvalListLoading: false,
  approvalListError: null,

  decisionLoading: null,
  decisionError: null,

  reportList: [],
  reportLoading: false,
  reportError: null,
};

const INVALID_LINK = "This approval link is invalid or has expired.";

export const requestDeviceApproval = createAsyncThunk<
  ApiResponse,
  RequestDeviceApprovalPayload,
  { rejectValue: RejectValue }
>(
  "deviceDefect/requestDeviceApproval",
  async (payload, { rejectWithValue }) => {
    try {
      // Backend expects serial_numbers as JSON text and each photo keyed as photos_<serial_number>
      // (one serial per submission)
      const formData = new FormData();
      if (payload.device_type) formData.append("device_type", payload.device_type);
      formData.append("serial_numbers", JSON.stringify([payload.serial_no]));
      if (payload.remark) formData.append("remark", payload.remark);
      payload.images.forEach((file) =>
        formData.append(`photos_${payload.serial_no}`, file),
      );

      const res = await axiosInstance.post<ApiResponse>(
        "approval/requestDeviceApproval",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      if (res.data?.success) return res.data;
      return rejectWithValue({
        message: getApiMessage(
          res.data?.message,
          "Failed to submit device quality check",
        ),
        toasted: false,
      });
    } catch (error: any) {
      return rejectWithValue({
        message: getApiMessage(
          error?.response?.data?.message,
          error?.message || "Failed to submit device quality check",
        ),
        toasted: true,
      });
    }
  },
);

export const fetchDeviceApprovalList = createAsyncThunk<
  DeviceApprovalListResponse,
  { reqId: string; token: string },
  { rejectValue: string }
>(
  "deviceDefect/fetchDeviceApprovalList",
  async ({ reqId, token }, { rejectWithValue }) => {
    try {
      const res = await publicAxiosInstance.get<DeviceApprovalListResponse>(
        "/approval/getDeviceApprovalDetails",
        {
          params: { req_id: reqId },
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data?.success) return res.data;
      return rejectWithValue(getApiMessage(res.data?.message, INVALID_LINK));
    } catch (error: any) {
      return rejectWithValue(
        getApiMessage(error?.response?.data?.message, INVALID_LINK),
      );
    }
  },
);

export const submitDeviceApproval = createAsyncThunk<
  ApiResponse,
  SubmitDeviceApprovalPayload,
  { rejectValue: string }
>(
  "deviceDefect/submitDeviceApproval",
  async ({ reqId, token, actions }, { rejectWithValue }) => {
    const verb = { APPROVED: "approve", REJECTED: "reject", HOLD: "hold" }[actions?.[0]?.status] ?? "update";
    const fallback = `Unable to ${verb} this device.`;
    try {
      const res = await publicAxiosInstance.post<ApiResponse>(
        "/approval/submitApproval",
        { req_id: reqId, actions },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data?.success) return res.data;
      return rejectWithValue(getApiMessage(res.data?.message, fallback));
    } catch (error: any) {
      return rejectWithValue(
        getApiMessage(
          error?.response?.data?.message,
          error?.message || fallback,
        ),
      );
    }
  },
);

export const fetchDeviceQualityReport = createAsyncThunk<
  DeviceQualityReportRow[],
  { from: string; to: string },
  { rejectValue: RejectValue }
>("deviceDefect/fetchDeviceQualityReport", async ({ from, to }, { rejectWithValue }) => {
  const fallback = "Failed to load device quality report";
  try {
    const res = await axiosInstance.get<DeviceQualityReportResponse>(
      "/approval/deviceApprovalList",
      { params: { fromDate:from, toDate:to } },
    );
    if (res.data?.success)
      return Array.isArray(res.data.data) ? res.data.data : [];
    return rejectWithValue({
      message: getApiMessage(res.data?.message, fallback),
      toasted: false,
    });
  } catch (error: any) {
    return rejectWithValue({
      message: getApiMessage(
        error?.response?.data?.message,
        error?.message || fallback,
      ),
      toasted: true,
    });
  }
});

const deviceDefectSlice = createSlice({
  name: "deviceDefect",
  initialState,
  reducers: {
    clearDecisionError: (state) => {
      state.decisionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestDeviceApproval.pending, (state) => {
        state.requestApprovalLoading = true;
        state.requestApprovalError = null;
      })
      .addCase(requestDeviceApproval.fulfilled, (state, action) => {
        state.requestApprovalLoading = false;
        showToast(
          getApiMessage(
            action.payload?.message,
            "Device quality check submitted",
          ),
          "success",
        );
      })
      .addCase(requestDeviceApproval.rejected, (state, action) => {
        state.requestApprovalLoading = false;
        state.requestApprovalError =
          action.payload?.message || "Failed to submit device quality check";
        if (!action.payload?.toasted)
          showToast(state.requestApprovalError, "error");
      })

      .addCase(fetchDeviceApprovalList.pending, (state) => {
        state.approvalListLoading = true;
        state.approvalListError = null;
      })
      .addCase(fetchDeviceApprovalList.fulfilled, (state, action) => {
        state.approvalListLoading = false;
        state.approvalReqId = action.payload.req_id ?? null;
        state.approvalDevices = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
      })
      .addCase(fetchDeviceApprovalList.rejected, (state, action) => {
        state.approvalListLoading = false;
        state.approvalDevices = [];
        state.approvalListError = action.payload || INVALID_LINK;
      })

      .addCase(submitDeviceApproval.pending, (state, action) => {
        state.decisionLoading = action.meta.arg.actions?.[0]?.status ?? null;
        state.decisionError = null;
      })
      .addCase(submitDeviceApproval.fulfilled, (state, action) => {
        state.decisionLoading = null;
        const actions = new Map(
          action.meta.arg.actions.map((a) => [a.unique_key, a]),
        );
        state.approvalDevices = state.approvalDevices.map((device) => {
          const decided = actions.get(device.key);
          return decided
            ? {
                ...device,
                status: decided.status,
                next: decided.next || device.next,
                remarks: decided.remark || device.remarks,
              }
            : device;
        });
        showToast(
          getApiMessage(
            action.payload?.message,
            "Decision submitted successfully",
          ),
          "success",
        );
      })
      .addCase(submitDeviceApproval.rejected, (state, action) => {
        state.decisionLoading = null;
        state.decisionError =
          action.payload || action.error?.message || "Unable to submit decision.";
      })

      .addCase(fetchDeviceQualityReport.pending, (state) => {
        state.reportLoading = true;
        state.reportError = null;
      })
      .addCase(fetchDeviceQualityReport.fulfilled, (state, action) => {
        state.reportLoading = false;
        state.reportList = action.payload;
      })
      .addCase(fetchDeviceQualityReport.rejected, (state, action) => {
        state.reportLoading = false;
        state.reportList = [];
        state.reportError =
          action.payload?.message || "Failed to load device quality report";
        if (!action.payload?.toasted) showToast(state.reportError, "error");
      });
  },
});

export const { clearDecisionError } = deviceDefectSlice.actions;
export default deviceDefectSlice.reducer;
