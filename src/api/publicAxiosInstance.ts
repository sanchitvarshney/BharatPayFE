import axios from "axios";

const publicAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL || "https://klsklbz4-3004.inc1.devtunnels.ms/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicAxiosInstance;
