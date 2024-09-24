import axiosInstance from "@/api/axiosInstance";
import { getToken, setToken } from "@/utils/tokenUtills";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { AuthState, LoginResponse } from "./authType";

export type LoginCredentials = {
  username: string;
  password: string;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  token: getToken(),
};

export const loginUserAsync = createAsyncThunk<AxiosResponse<LoginResponse>, LoginCredentials>("auth/loginUser", async (loginCredential) => {
  const response = await axiosInstance.post<LoginResponse>("/auth/signin", loginCredential);
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
       if(action.payload.data.status){
      
        setToken(action.payload.data.data?.token);
        localStorage.setItem("loggedinUser", JSON.stringify(action.payload.data.data));
       }
       state.loading = false;
      })
      .addCase(loginUserAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
