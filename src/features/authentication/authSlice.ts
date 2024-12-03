import axiosInstance from "@/api/axiosInstance";
import { getToken, setToken } from "@/utils/tokenUtills";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { AuthState, LoginResponse, PasswordChangePayload } from "./authType";
import { showToast } from "@/utils/toasterContext";

export type LoginCredentials = {
  username: string;
  password: string;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  token: getToken(),
  changepasswordloading: false,
};

export const loginUserAsync = createAsyncThunk<AxiosResponse<LoginResponse>, LoginCredentials>("auth/loginUser", async (loginCredential) => {
  const response = await axiosInstance.post<LoginResponse>("/auth/signin", loginCredential);
  return response;
});
export const changePasswordAsync = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, PasswordChangePayload>("auth/changePassword", async (payload) => {
  const response = await axiosInstance.put("/user/change-my-password", payload);
  return response;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.clear();
      state.user = null;
      state.token = null;
      window.location.reload();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        if (action.payload.data.status) {
          setToken(action.payload.data.data?.token);
          localStorage.setItem("loggedinUser", JSON.stringify(action.payload.data.data));
        }
        state.loading = false;
      })
      .addCase(loginUserAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(changePasswordAsync.pending, (state) => {
        state.changepasswordloading = true;
      })
      .addCase(changePasswordAsync.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");

          state.changepasswordloading = false;
        }
      })
      .addCase(changePasswordAsync.rejected, (state) => {
        state.changepasswordloading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
