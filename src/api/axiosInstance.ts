import axios from "axios";
import { getToken } from "@/utils/tokenUtills";
import { v4 as uuidv4 } from "uuid";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { getLocation } from "@/helper/getLocation";
import { showToast } from "@/utils/toasterContext";
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
  const savedSession = localStorage.getItem("session") || "25-26";
  const savedCompanyBranch = localStorage.getItem("companyBranch") || "BRMSC031";
 
  if (token) {
    const uniqueid = uuidv4();
    const fingerprint = await getFingerprint();
    const location = await getLocation();
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["authorization"] = token;
    config.headers["session"] = savedSession;
    config.headers["companyBranch"] = savedCompanyBranch;
    config.headers["x-click-token"] = uniqueid;
    config.headers["x-location"] = location ||"";
    config.headers["x-fingerprint"] = fingerprint || "unknown";
    config.headers["ngrok-skip-browser-warning"] = "69420";
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
   
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    showToast((error.response?.data?.message?.msg ? error.response?.data?.message?.msg : error.response?.data?.message) || "An unexpected error occurred", "error");

    return Promise.reject(error);
  }
);

export default axiosInstance;
