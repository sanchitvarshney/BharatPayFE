import axios from "axios";
import { getToken, removeToken } from "@/utils/tokenUtills";
import { showToast } from "@/utils/toastUtils";
import { v4 as uuidv4 } from "uuid";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { getLocation } from "@/helper/getLocation";
const getFingerprint = async () => {
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  } catch (error) {
    console.error("Failed to get fingerprint", error);
    return null;
  }
};

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    const uniqueid = uuidv4();
    const fingerprint = await getFingerprint();
    const location = await getLocation();
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["authorization"] = token;
    config.headers["session"] = "2024-2025";
    config.headers["x-click-token"] = uniqueid;
    config.headers["x-location"] = location ||"";
    config.headers["x-fingerprint"] = fingerprint || "unknown";
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    showToast({
      description: (error.response?.data?.message ? error.response?.data?.message : error.response?.data?.message?.msg) || "An unexpected error occurred",
      variant: "destructive",
    });

    return Promise.reject(error);
  }
);

export default axiosInstance;
