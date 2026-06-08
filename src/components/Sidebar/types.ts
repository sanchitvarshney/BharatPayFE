import React from "react";

export interface SidebarMenuItem {
  key: string;
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  path?: string;
  onClick?: () => void;
  isHeading?: boolean;
  isShown?: boolean;
  children?: SidebarMenuItem[];
}

export interface SidebarProps {
  showSideBar: boolean;
  setShowSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  items?: SidebarMenuItem[];
  items1?: SidebarMenuItem[];
  onWidthChange?: (width: number) => void;
  topOffset?: number;
  menuLoading?: boolean;
  onRefreshMenu?: () => void;
}
