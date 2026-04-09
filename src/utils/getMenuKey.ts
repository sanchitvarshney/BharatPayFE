import { Menu } from "@/features/menu/menuType";

export const getMenuKeyByUrl = (menuList: Menu[], targetUrl: string): string | null => {
  if (targetUrl === "/") return "dashboard";
  if (targetUrl === "/profile") return "profile";
  if (targetUrl.startsWith("/report")) return "report";
  if (targetUrl.startsWith("/queries")) return "report";
  for (const menu of menuList) {
    if (menu.url === targetUrl) {
      return menu.menu_key;
      
    }

    if (menu.children && menu.children.length > 0) {
      const foundKey = getMenuKeyByUrl(menu.children, targetUrl);
      if (foundKey) {
        return foundKey;
        
      }
    }
  }

  return null;
};
