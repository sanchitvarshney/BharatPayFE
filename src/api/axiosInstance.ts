import axios from "axios";
import { getToken } from "@/utils/tokenUtills";
import { v4 as uuidv4 } from "uuid";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { getLocation } from "@/helper/getLocation";
import { showToast } from "@/utils/toasterContext";
import { getIndianFYSessionKeyForDate, isPlausibleFYSessionKey } from "@/utils/indianFinancialYear";
import { setReturnTo } from "@/utils/returnTo";

let cachedFingerprint = "unknown";
let fingerprintLoading: Promise<void> | null = null;
let cachedLocation = "";
let locationLastUpdatedAt = 0;
const LOCATION_CACHE_TTL_MS = 5 * 60 * 1000;

const warmFingerprint = () => {
  if (fingerprintLoading) return fingerprintLoading;
  fingerprintLoading = (async () => {
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      cachedFingerprint = result.visitorId || "unknown";
    } catch (error) {
      console.error("Failed to get fingerprint", error);
    }
  })();
  return fingerprintLoading;
};

const warmLocation = () => {
  const now = Date.now();
  if (now - locationLastUpdatedAt < LOCATION_CACHE_TTL_MS) return;
  locationLastUpdatedAt = now;
  getLocation()
    .then((location) => {
      cachedLocation = location || "";
    })
    .catch(() => {
      cachedLocation = "";
    });
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
  const rawSession = localStorage.getItem("session");
  const savedSession =
    rawSession && isPlausibleFYSessionKey(rawSession)
      ? rawSession
      : getIndianFYSessionKeyForDate();
  const savedCompanyBranch = localStorage.getItem("companyBranch") || "BRMSC031";
 
  if (token) {
    const uniqueid = uuidv4();
    // Keep request path fast: use cached telemetry, refresh it in background.
    warmFingerprint();
    warmLocation();
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["authorization"] = token;
    config.headers["session"] = savedSession;
    config.headers["companyBranch"] = savedCompanyBranch;
    config.headers["x-click-token"] = uniqueid;
    config.headers["x-location"] = cachedLocation;
    config.headers["x-fingerprint"] = cachedFingerprint;
    config.headers["menuKey"] = sessionStorage.getItem("menuKey") || "";
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
      if (globalThis.window !== undefined) {
        setReturnTo(`${globalThis.window.location.pathname}${globalThis.window.location.search}`);
      }
      localStorage.clear();
      globalThis.window.location.href = "/login";
    }
  
    showToast(error.response?.data?.message ?? error.message ?? error.response?.data ?? error?.response?.data?.message?.msg ?? "An unexpected error occurred", "error");

    return Promise.reject(error);
  }
 
);

export default axiosInstance;
