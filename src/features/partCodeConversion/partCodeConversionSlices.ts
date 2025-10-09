import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";

interface ComponentInfo {
  id: string;
  text: string;
  value: string;
}

interface LocationInfo {
  code: string;
  text: string;
  value: string;
}

interface StockInfo {
  component: string;
  location: string;
  balance: number;
  uom?: string;
}

// Async thunks
export const submitPartCodeConversion = createAsyncThunk(
  "partCodeConversion/submitPartCodeConversion",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/conversion/saveConversion",
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchComponents = createAsyncThunk(
  "partCodeConversion/fetchComponents",
  async (searchQuery: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/backend/search/item?search=${searchQuery}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPickLocations = createAsyncThunk(
  "partCodeConversion/fetchPickLocations",
  async (searchQuery: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/partConversion/pickLocation",
        { searchTerm: searchQuery }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDropLocations = createAsyncThunk(
  "partCodeConversion/fetchDropLocations",
  async (searchQuery: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/partConversion/dropLocation",
        { searchTerm: searchQuery }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchComponentStock = createAsyncThunk(
  "partCodeConversion/fetchComponentStock",
  async (
    params: { component: string; location: string },
    { rejectWithValue }
  ) => {
    try {
      // Using the same pattern as other stock APIs in the project
      const response = await axiosInstance.get(
        `/partConversion/stock/${params.location}/${params.component}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
interface PartCodeConversionState {
  loading: boolean;
  submitLoading: boolean;
  componentsLoading: boolean;
  pickLocationsLoading: boolean;
  dropLocationsLoading: boolean;
  stockLoading: boolean;
  error: string | null;
  components: ComponentInfo[];
  pickLocations: LocationInfo[];
  dropLocations: LocationInfo[];
  stockInfo: StockInfo | null;
  pickLocation: LocationInfo | null;
  dropLocation: LocationInfo | null;
}

const initialState: PartCodeConversionState = {
  loading: false,
  submitLoading: false,
  componentsLoading: false,
  pickLocationsLoading: false,
  dropLocationsLoading: false,
  stockLoading: false,
  error: null,
  components: [],
  pickLocations: [],
  dropLocations: [],
  stockInfo: null,
  pickLocation: null,
  dropLocation: null,
};

// Slice
const partCodeConversionSlice = createSlice({
  name: "partCodeConversion",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearComponents: (state) => {
      state.components = [];
    },
    clearPickLocations: (state) => {
      state.pickLocations = [];
    },
    clearDropLocations: (state) => {
      state.dropLocations = [];
    },
    clearStockInfo: (state) => {
      state.stockInfo = null;
    },
    setpickLcn: (state, action) => {
      state.pickLocation = action.payload;
    },
    setDropLcn: (state, action) => {
      state.dropLocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Submit Part Code Conversion
    builder
      .addCase(submitPartCodeConversion.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(submitPartCodeConversion.fulfilled, (state) => {
        state.submitLoading = false;
        state.error = null;
      })
      .addCase(submitPartCodeConversion.rejected, (state, action) => {
        state.submitLoading = false;
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

    // Fetch Pick Locations
    builder
      .addCase(fetchPickLocations.pending, (state) => {
        state.pickLocationsLoading = true;
        state.error = null;
      })
      .addCase(fetchPickLocations.fulfilled, (state, action) => {
        state.pickLocationsLoading = false;
        state.pickLocations = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchPickLocations.rejected, (state, action) => {
        state.pickLocationsLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Drop Locations
    builder
      .addCase(fetchDropLocations.pending, (state) => {
        state.dropLocationsLoading = true;
        state.error = null;
      })
      .addCase(fetchDropLocations.fulfilled, (state, action) => {
        state.dropLocationsLoading = false;
        state.dropLocations = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchDropLocations.rejected, (state, action) => {
        state.dropLocationsLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Component Stock
    builder
      .addCase(fetchComponentStock.pending, (state) => {
        state.stockLoading = true;
        state.error = null;
      })
      .addCase(fetchComponentStock.fulfilled, (state, action) => {
        state.stockLoading = false;
        state.stockInfo = action.payload.data;
        state.error = null;
      })
      .addCase(fetchComponentStock.rejected, (state, action) => {
        state.stockLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearComponents,
  clearPickLocations,
  clearDropLocations,
  clearStockInfo,
  setpickLcn,
  setDropLcn,
} = partCodeConversionSlice.actions;
export default partCodeConversionSlice.reducer;
