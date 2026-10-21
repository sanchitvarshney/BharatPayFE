import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Approve/reject remarks entered by the admin, keyed by approval item id
type AdminApprovalRemarkState = {
  remarks: Record<number, string>;
};

const initialState: AdminApprovalRemarkState = {
  remarks: {},
};

const adminApprovalRemarkSlice = createSlice({
  name: "adminApprovalRemark",
  initialState,
  reducers: {
    setApprovalRemark: (
      state,
      action: PayloadAction<{ id: number; value: string }>,
    ) => {
      state.remarks[action.payload.id] = action.payload.value;
    },
    clearApprovalRemarks: (state) => {
      state.remarks = {};
    },
  },
});

export const { setApprovalRemark, clearApprovalRemarks } =
  adminApprovalRemarkSlice.actions;
export default adminApprovalRemarkSlice.reducer;
