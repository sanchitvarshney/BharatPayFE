import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { LotListResponse, ManageProductionState } from "./QRCodeType";

const initialState: ManageProductionState = {
  getlotListLoading: false,
  lotListData: null,
};

export const getLotListData = createAsyncThunk<AxiosResponse<LotListResponse>, { from: string; to: string; id: string; type: string }>("production/getLotListData", async (payload) => {
  const response = await axiosInstance.get(payload.type === "DATE" ? `/dispatchDevicePrint/lotGenerateList/DATE?startDate=${payload.from}&endDate=${payload.to}` : `/dispatchDevicePrint/lotGenerateList/LOTID?lotId=${payload.id}`);
  return response;
});

const manageqrSlice = createSlice({
  name: "manageProduction",
  initialState,
  reducers: {
    clearLotList:(state)=>{
      state.lotListData = null
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(getLotListData.pending, (state) => {
        state.getlotListLoading = true;
        state.lotListData = null;
      })
      .addCase(getLotListData.fulfilled, (state, action) => {
        state.getlotListLoading = false;
        if (action.payload.data.status === "success") {
          state.lotListData = action.payload.data.data;
        }
      })
      .addCase(getLotListData.rejected, (state) => {
        state.getlotListLoading = false;
        state.lotListData = null;
      });
  },
});

export const {clearLotList} = manageqrSlice.actions
export default manageqrSlice.reducer;
