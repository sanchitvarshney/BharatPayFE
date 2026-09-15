
export const API_URL_KEY = "currentUrl";
export const API_URLS_KEY = "baseUrls";
export const SOCKET_URL_KEY = "currentSocketUrl";
export const SOCKET_URLS_KEY = "socketUrls";

const readList = (key: string): string[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
};

const addToList = (key: string, value: string) => {
  const updated = Array.from(new Set([...readList(key), value]));
  localStorage.setItem(key, JSON.stringify(updated));
};

export const getApiBaseUrl = (): string =>
  localStorage.getItem(API_URL_KEY) || import.meta.env.VITE_REACT_APP_API_BASE_URL;

export const getSocketUrl = (): string =>
  localStorage.getItem(SOCKET_URL_KEY) || import.meta.env.VITE_SOKET_URL;

export const getSavedApiUrls = (): string[] => readList(API_URLS_KEY);
export const getSavedSocketUrls = (): string[] => readList(SOCKET_URLS_KEY);

export const setApiBaseUrl = (url: string) => {
  localStorage.setItem(API_URL_KEY, url);
  addToList(API_URLS_KEY, url);
};

export const setSocketUrl = (url: string) => {
  localStorage.setItem(SOCKET_URL_KEY, url);
  addToList(SOCKET_URLS_KEY, url);
};
