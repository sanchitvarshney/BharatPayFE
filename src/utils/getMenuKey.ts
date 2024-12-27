import axiosInstance from "@/api/axiosInstance";
import { Menu } from "@/features/menu/menuType";

export const getMenuKeyByUrl = (menuList: Menu[], targetUrl: string): string | null => {
  if (targetUrl === "/") return "dashboard";
  if (targetUrl === "/profile") return "profile";
  if (targetUrl.startsWith("/report")) return "report";
  if (targetUrl.startsWith("/queries")) return "report";
  for (const menu of menuList) {
    if (menu.url === targetUrl) {
      axiosInstance.interceptors.request.use(async (config) => {
        config.headers["menuKey"] = menu.menu_key;
        return config;
      });
      return menu.menu_key;
      
    }

    if (menu.children && menu.children.length > 0) {
      const foundKey = getMenuKeyByUrl(menu.children, targetUrl);
      if (foundKey) {
        axiosInstance.interceptors.request.use(async (config) => {
          config.headers["menuKey"] = foundKey;
          return config;
        });
        return foundKey;
        
      }
    }
  }

  return null;
};
