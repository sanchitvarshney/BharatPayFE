import { Menu } from "@/features/menu/menuType";

const COMPONENT_URL = "/master-components";
const PERCENTAGE_URL = "/master-components/percentage";

const isComponentMenuNode = (item: Menu): boolean => {
  const normalizedName = item.name.trim().toLowerCase();
  return normalizedName === "component" || normalizedName === "components";
};

const createMaterialMenuItem = (parent: Menu, existing?: Menu): Menu => ({
  ...(existing ?? parent),
  menu_key: existing?.menu_key ?? `${parent.menu_key}_material`,
  name: "Material",
  parent_menu_key: parent.menu_key,
  url: COMPONENT_URL,
  order: existing?.order ?? parent.order,
  is_active: existing?.is_active ?? parent.is_active,
  icon: existing?.icon ?? parent.icon,
  description: existing?.description ?? parent.description,
  children: undefined,
});

const createPercentageMenuItem = (parent: Menu, existing?: Menu): Menu => ({
  ...(existing ?? parent),
  menu_key: existing?.menu_key ?? `${parent.menu_key}_percentage`,
  name: "Percentage Component",
  parent_menu_key: parent.menu_key,
  url: PERCENTAGE_URL,
  order: existing?.order ?? parent.order + 1,
  is_active: existing?.is_active ?? parent.is_active,
  icon: existing?.icon ?? parent.icon,
  description: existing?.description ?? "Component percentage master",
  children: undefined,
});

const findMenuItemByUrl = (items: Menu[] | undefined, url: string): Menu | undefined => {
  if (!items?.length) {
    return undefined;
  }

  for (const item of items) {
    if (item.url === url) {
      return item;
    }

    const nestedItem = findMenuItemByUrl(item.children, url);
    if (nestedItem) {
      return nestedItem;
    }
  }

  return undefined;
};

const normalizeComponentMenuNode = (item: Menu): Menu => {
  if (isComponentMenuNode(item)) {
    const materialItem = findMenuItemByUrl(item.children, COMPONENT_URL);
    const percentageItem = findMenuItemByUrl(item.children, PERCENTAGE_URL);

    return {
      ...item,
      url: null,
      children: [createMaterialMenuItem(item, materialItem), createPercentageMenuItem(item, percentageItem)],
    };
  }

  if (item.children?.length) {
    return {
      ...item,
      children: item.children.map(normalizeComponentMenuNode),
    };
  }

  return item;
};

export const augmentComponentMenu = (menu: Menu[]): Menu[] => menu.map(normalizeComponentMenuNode);
