import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";

// Types
interface MaterialTransferRequest {
  fromLocation: string;
  toLocation: string;
  fromCostCenter: string;
  toCostCenter: string;
  remarks: string;
  directlyMoveToTRC: boolean;
  components: {
    componentKey: string;
    quantity: number;
    remarks: string;
  }[];
}

interface ComponentInfo {
  componentKey: string;
  componentName: string;
  partNumber: string;
  uom: string;
}

// Async thunks
export const submitMaterialTransfer = createAsyncThunk(
  "materialManagement/submitMaterialTransfer",
  async (data: MaterialTransferRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/material-movement/materialMovement",
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchStockQuantity = createAsyncThunk(
  "materialManagement/fetchStockQuantity",
  async (
    params: { location: string; component: string; costCenter: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/material-movement/stock/${params.location}/${params.component}/${params.costCenter}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchComponents = createAsyncThunk(
  "materialManagement/fetchComponents",
  async (searchQuery: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/backend/search/component?search=${searchQuery}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
interface StockQuantityData {
  location: string;
  component: string;
  costCenter: string;
  balance: number;
}

interface MaterialManagementState {
  loading: boolean;
  submitLoading: boolean;
  stockQuantityLoading: boolean;
  componentsLoading: boolean;
  error: string | null;
  stockQuantityData: StockQuantityData | null;
  components: ComponentInfo[];
  fromCC: { text: string; id: string } | null;
  fromLoc: { name: string; code: string } | null;
}

const initialState: MaterialManagementState = {
  loading: false,
  submitLoading: false,
  stockQuantityLoading: false,
  componentsLoading: false,
  error: null,
  stockQuantityData: null,
  components: [],
  fromCC: null,
  fromLoc: null,
};

// Slice
const materialManagementSlice = createSlice({
  name: "materialManagement",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearStockQuantityData: (state) => {
      state.stockQuantityData = null;
    },
    clearComponents: (state) => {
      state.components = [];
    },
    setFromLoc: (state, action) => {
      state.fromLoc = action.payload;
    },
    setFromCC: (state, action) => {
      state.fromCC = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Submit Material Transfer
    builder
      .addCase(submitMaterialTransfer.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(submitMaterialTransfer.fulfilled, (state) => {
        state.submitLoading = false;
        state.error = null;
      })
      .addCase(submitMaterialTransfer.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Stock Quantity
    builder
      .addCase(fetchStockQuantity.pending, (state) => {
        state.stockQuantityLoading = true;
        state.error = null;
      })
      .addCase(fetchStockQuantity.fulfilled, (state, action) => {
        state.stockQuantityLoading = false;
        state.stockQuantityData = action.payload.data;
        state.error = null;
      })
      .addCase(fetchStockQuantity.rejected, (state, action) => {
        state.stockQuantityLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Components
    builder
      .addCase(fetchComponents.pending, (state) => {
        state.componentsLoading = true;
        state.error = null;
      })
      .addCase(fetchComponents.fulfilled, (state, action) => {
        state.componentsLoading = false;
        state.components = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchComponents.rejected, (state, action) => {
        state.componentsLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearStockQuantityData,
  clearComponents,
  setFromLoc,
  setFromCC,
} = materialManagementSlice.actions;
export default materialManagementSlice.reducer;
