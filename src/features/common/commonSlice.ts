import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { Commonstate, CostCenterApiResponse, CurrencListResponse, UserApiResponse } from "./commonType";

// Add types for device images
export interface DeviceImage {
  image_id?: string;
  img_name?: string;
  img_url: string[];
  sim_no?: string;
  operator?: string;
  serial?: string;
  imei?: string;
  insertDt?: string;
}

export interface DeviceImageApiResponse {
  success: boolean;
  message: string;
  data: DeviceImage[];
}

export interface FqcImageFile {
  key: string;
  url: string;
  originalName: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
}

export interface FqcImageSet {
  refId: string;
  insertBy: string;
  insertDt: string;
  frontImage?: FqcImageFile;
  backImage?: FqcImageFile;
  leftSide?: FqcImageFile;
  rightSide?: FqcImageFile;
  topView?: FqcImageFile;
  bottomView?: FqcImageFile;
  deviceView?: FqcImageFile;
  boxView?: FqcImageFile;
}

export interface FqcDeviceRecord {
  dsn: string;
  type: string;
  images: FqcImageSet[];
}

export interface FqcDeviceImageApiResponse {
  success: boolean;
  status: string;
  data: FqcDeviceRecord[];
}

const initialState: Commonstate & {
  deviceImages: DeviceImage[] | null;
  deviceImagesLoading: boolean;
  deviceImagesError: string | null;
  fqcDeviceData: FqcDeviceRecord[] | null;
  fqcDeviceImagesLoading: boolean;
  fqcDeviceImagesError: string | null;
} = {
  getUserLoading: false,
  userData: null,
  isueeList: null,
  isueeListLoading: false,
  currencyLoaidng: false,
  currencyData: null,
  costCenterLoading: false,
  costCenterData: null,
  deviceImages: null,
  deviceImagesLoading: false,
  deviceImagesError: null,
  fqcDeviceData: null,
  fqcDeviceImagesLoading: false,
  fqcDeviceImagesError: null,
};

export const getUserAsync = createAsyncThunk<
  AxiosResponse<UserApiResponse>,
  string | null
>("common/getuser", async (searchinput) => {
  const response = await axiosInstance.get(
    `/backend/search/user/${searchinput}`
  );
  return response;
});
export const getIsueeList = createAsyncThunk<
  AxiosResponse<UserApiResponse>,
  string | null
>("common/getIsueeList", async (searchinput) => {
  const response = await axiosInstance.get(
    `/backend/search/issue/${searchinput}`
  );
  return response;
});
export const getCurrency = createAsyncThunk<AxiosResponse<CurrencListResponse>>(
  "common/getCurrency",
  async () => {
    const response = await axiosInstance.get(`/backend/currencies`);
    return response;
  }
);
export const getCostCenter = createAsyncThunk<
  AxiosResponse<CostCenterApiResponse>
>("common/getCostCenter", async () => {
  const response = await axiosInstance.get(`/backend/costcenter`);
  return response;
});

// Thunk for fetching device images
export const getDeviceImages = createAsyncThunk<
  AxiosResponse<DeviceImageApiResponse>,
  { deviceType: string; awbNumber: string; serialNo: string }
>("common/getDeviceImages", async ({ deviceType, awbNumber, serialNo }) => {
  const isBerDevice = deviceType === "ber";
  const query =
    isBerDevice
      ? `serialNo=${serialNo}`
      : `awbNumber=${awbNumber}&serialNo=${serialNo}`;
  const response = await axiosInstance.get(
    `/swipeMachine/delivery/getImages/${deviceType}?${query}`
  );
  return response;
});

export const getFqcDeviceImages = createAsyncThunk<
  AxiosResponse<FqcDeviceImageApiResponse>,
  { module: string; dsn: string; model?: string }
>("common/getFqcDeviceImages", async ({ module, dsn, model }) => {
  const modelQuery = model ? `&model=${encodeURIComponent(model)}` : "";
  const response = await axiosInstance.get(
    `/capture/photo/report/${encodeURIComponent(module)}/${encodeURIComponent(dsn)}${modelQuery}`
  );
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
      })
      .addCase(getCostCenter.pending, (state) => {
        state.costCenterLoading = true;
      })
      .addCase(getCostCenter.fulfilled, (state, action) => {
        state.costCenterLoading = false;
        if (action.payload.data.success) {
          state.costCenterData = action.payload.data.data;
        }
      })
      .addCase(getCostCenter.rejected, (state) => {
        state.costCenterLoading = false;
      })
      // Device Images
      .addCase(getDeviceImages.pending, (state) => {
        state.deviceImagesLoading = true;
        state.deviceImagesError = null;
        state.deviceImages = null;
      })
      .addCase(getDeviceImages.fulfilled, (state, action) => {
        state.deviceImagesLoading = false;
        if (
          action.payload.data.success &&
          action.payload.data.data.length > 0
        ) {
          state.deviceImages = action.payload.data.data;
        } else {
          state.deviceImages = [];
          state.deviceImagesError = "No images found for this device.";
        }
      })
      .addCase(getDeviceImages.rejected, (state) => {
        state.deviceImagesLoading = false;
        state.deviceImagesError = "Failed to fetch images. Please try again.";
        state.deviceImages = null;
      })
      .addCase(getFqcDeviceImages.pending, (state) => {
        state.fqcDeviceImagesLoading = true;
        state.fqcDeviceImagesError = null;
        state.fqcDeviceData = null;
      })
      .addCase(getFqcDeviceImages.fulfilled, (state, action) => {
        state.fqcDeviceImagesLoading = false;
        const records = action.payload.data.data ?? [];
        const hasImages = records.some((record) => record.images?.length > 0);
        if (action.payload.data.success && hasImages) {
          state.fqcDeviceData = records;
        } else {
          state.fqcDeviceData = [];
          state.fqcDeviceImagesError = "No images found for this device.";
        }
      })
      .addCase(getFqcDeviceImages.rejected, (state) => {
        state.fqcDeviceImagesLoading = false;
        state.fqcDeviceImagesError = "Failed to fetch images. Please try again.";
        state.fqcDeviceData = null;
      });
  },
});

export default commonSlice.reducer;
