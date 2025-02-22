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
  emailOtpLoading: false,
  updateEmailLoading: false,
  verifyMailLoading: false,
  otpLoading: false,
  qrStatus: null,
  qrCodeLoading: false
};

export const loginUserAsync = createAsyncThunk<AxiosResponse<LoginResponse>, LoginCredentials>("auth/loginUser", async (loginCredential) => {
  const response = await axiosInstance.post<LoginResponse>("/auth/signin", loginCredential);
  return response;
});
export const changePasswordAsync = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, PasswordChangePayload>("auth/changePassword", async (payload) => {
  const response = await axiosInstance.put("/user/change-my-password", payload);
  return response;
});
export const getEmailOtpAsync = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>>("auth/getEmailOtpAsycn", async () => {
  const response = await axiosInstance.get("/user/get-email-otp");
  return response;
});

export const updateEmailAsync = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, { emailId: string; otp: string }>("auth/updateEmailAsync", async (paylaod) => {
  const response = await axiosInstance.put("/user/verify-email-otp", paylaod);
  return response;
});

export const getQRStatus = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, { crnId: string }>("auth/getQRStatus", async (paylaod) => {
  const response = await axiosInstance.get(`auth/qrCode?custId=${paylaod.crnId}`);
  return response;
});

export const getPasswordOtp = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, { emailId: string }>(
  "auth/getPasswordOtp", 
  async (payload) => {
    const response = await axiosInstance.get("/user/get-password-otp/", {
      params: {
        emailId: payload.emailId, // Send emailId as a query param
      }
    });
    return response;
  }
);

export const updatePassword = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, PasswordChangePayload>("auth/updatePassword", async (paylaod) => {
  const response = await axiosInstance.put("/user/update-password", paylaod);
  return response;
});

export const verifyMailAsync = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, { otp: string }>("auth/verifyMailAsync", async (paylaod) => {
  const response = await axiosInstance.put("/user/verify-mail", paylaod);
  return response;
});
export const verifyOtpAsync = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, { otp: string,custId:string }>("auth/verifyOtpAsync", async (paylaod) => {
  const response = await axiosInstance.post("/auth/verify", paylaod);
  return response;
})

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
        if (action.payload.data.success) {
          setToken(action.payload.data.data?.token);

          localStorage.setItem("loggedinUser", btoa(JSON.stringify(action.payload.data.data)));
        }
        if(!action.payload.data.data){
          state.qrStatus = action.payload.data;
        }
        state.loading = false;
      })
      .addCase(loginUserAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtpAsync.pending, (state) => {
        state.qrCodeLoading = true;
      })
      .addCase(verifyOtpAsync.fulfilled, (state) => {
        state.qrCodeLoading = false;
      })
      .addCase(verifyOtpAsync.rejected, (state) => {
        state.qrCodeLoading = false;
      })
      .addCase(changePasswordAsync.pending, (state) => {
        state.changepasswordloading = true;
      })
      .addCase(changePasswordAsync.fulfilled, (state, action) => {
        state.changepasswordloading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(changePasswordAsync.rejected, (state) => {
        state.changepasswordloading = false;
      })
      .addCase(getEmailOtpAsync.pending, (state) => {
        state.emailOtpLoading = true;
      })
      .addCase(getEmailOtpAsync.fulfilled, (state, action) => {
        state.emailOtpLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(getEmailOtpAsync.rejected, (state) => {
        state.emailOtpLoading = false;
      })
      .addCase(updateEmailAsync.pending, (state) => {
        state.updateEmailLoading = true;
      })
      .addCase(updateEmailAsync.fulfilled, (state, action) => {
        state.updateEmailLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(updateEmailAsync.rejected, (state) => {
        state.updateEmailLoading = false;
      })
      .addCase(getPasswordOtp.pending, (state) => {
        state.otpLoading = true;
      })
      .addCase(getPasswordOtp.fulfilled, (state, action) => {
        state.otpLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(getPasswordOtp.rejected, (state) => {
        state.otpLoading = false;
      })
      .addCase(updatePassword.pending, (state) => {
        state.otpLoading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.otpLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(updatePassword.rejected, (state) => {
        state.otpLoading = false;
      })
      .addCase(verifyMailAsync.pending, (state) => {
        state.verifyMailLoading = true;
      })
      .addCase(verifyMailAsync.fulfilled, (state, action) => {
        state.verifyMailLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(verifyMailAsync.rejected, (state) => {
        state.verifyMailLoading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
