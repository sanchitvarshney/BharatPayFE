import DynamicIcon from "@/components/reusable/DynamicIcon";
import { Menu } from "@/features/menu/menuType";
import { SidebarMenuItem } from "./types";
import { MdChecklistRtl } from "react-icons/md";

function renderMenuIcon(iconName: string) {
  if (iconName === "-") {
    return <MdChecklistRtl />;
  }
  return <DynamicIcon name={iconName} size="small" />;
}

function convertMenuItem(menu: Menu, depth: number): SidebarMenuItem {
  const children = menu.children?.length
    ? menu.children
        .filter((child) => child.is_active !== 0)
        .sort((a, b) => a.order - b.order)
        .map((child) => convertMenuItem(child, depth + 1))
    : undefined;

  const hasChildren = Boolean(children?.length);

  return {
    key: menu.menu_key,
    label: menu.name,
    icon: renderMenuIcon(menu.icon),
    path: menu.url || undefined,
    isHeading: depth > 0 && hasChildren,
    isShown: menu.is_active !== 0,
    children,
  };
}

export function convertMenuToSidebarItems(menus: Menu[] | null): SidebarMenuItem[] {
  if (!menus?.length) return [];

  return menus
    .filter((menu) => menu.is_active !== 0)
    .sort((a, b) => a.order - b.order)
    .map((menu) => convertMenuItem(menu, 0));
}
