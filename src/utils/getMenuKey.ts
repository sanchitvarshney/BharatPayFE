import { Menu } from "@/features/menu/menuType";

export const getMenuKeyByUrl = (menuList: Menu[], targetUrl: string): string | null => {
  for (const menu of menuList) {
    // Check if the current menu matches the target URL
    if (menu.url === targetUrl) {
      return menu.menu_key;
    }

    // Recursively check children menus
    if (menu.children && menu.children.length > 0) {
      const foundKey = getMenuKeyByUrl(menu.children, targetUrl);
      if (foundKey) {
        return foundKey;
      }
    }
  }

  // Return null if no match is found
  return null;
};
