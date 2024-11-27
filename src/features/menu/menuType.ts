export type Menu = {
  menu_key: string;
  name: string;
  parent_menu_key: string | null;
  url: string | null;
  order: number;
  is_active: number;
  icon: string;
  description: string;
  children?: Menu[];
  can_add?: boolean | null;
  can_view?: boolean | null;
  can_edit?: boolean | null;
  can_delete?: boolean | null;
};

export type MenuResponse = {
  success: boolean;
  menu: Menu[];
};

type Tab = {
  tabId: string;
  name: string;
  url: string;
  order: string;
  icon: string;
  description: string;
  status: number;
};

export type TabApiResponse = {
  success: boolean;
  data: Tab[];
  code: number;
};

export type MenuState = {
  menu: Menu[] | null;
  menuLoading: boolean;
  menuTab: Tab[] | null;
  menuTabLoading: boolean;
};
