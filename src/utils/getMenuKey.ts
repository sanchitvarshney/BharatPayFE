import { Menu } from "@/features/menu/menuType";

// Routes not in the menu tree that still need a known menuKey.
// Suffix "*" means prefix match (e.g. "/report*" matches "/report/123").
const STATIC_MENU_KEY_MAP: Record<string, string> = {
  "/": "dashboard",
  "/profile": "profile",
  "/report*": "report",
  "/queries*": "report",
};

const resolveStaticKey = (targetUrl: string): string | null => {
  if (STATIC_MENU_KEY_MAP[targetUrl]) return STATIC_MENU_KEY_MAP[targetUrl];
  for (const [pattern, key] of Object.entries(STATIC_MENU_KEY_MAP)) {
    if (pattern.endsWith("*") && targetUrl.startsWith(pattern.slice(0, -1))) {
      return key;
    }
  }
  return null;
};

// Pass 1 — exact URL match anywhere in the tree.
const exactMatch = (menuList: Menu[], targetUrl: string): string | null => {
  for (const menu of menuList) {
    if (menu.url === targetUrl) return menu.menu_key;
    if (menu.children?.length) {
      const found = exactMatch(menu.children, targetUrl);
      if (found) return found;
    }
  }
  return null;
};

// Pass 2 — longest-prefix match for dynamic sub-paths like /master-fg-bom/:id.
// Collects ALL prefix candidates and returns the one whose URL is longest
// (most specific), so a deeper menu entry wins over a shallow parent.
const prefixMatch = (menuList: Menu[], targetUrl: string): string | null => {
  let bestUrl = "";
  let bestKey: string | null = null;

  const walk = (items: Menu[]) => {
    for (const menu of items) {
      if (
        menu.url &&
        targetUrl.startsWith(menu.url + "/") &&
        menu.url.length > bestUrl.length
      ) {
        bestUrl = menu.url;
        bestKey = menu.menu_key;
      }
      if (menu.children?.length) walk(menu.children);
    }
  };

  walk(menuList);
  return bestKey;
};

export const getMenuKeyByUrl = (menuList: Menu[], targetUrl: string): string | null => {
  return resolveStaticKey(targetUrl) ?? exactMatch(menuList, targetUrl) ?? prefixMatch(menuList, targetUrl);
};
