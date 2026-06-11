import { Dispatch, SetStateAction, RefObject } from "react";

export interface MainUIStateType {
  sheetOpen: boolean;
  setSheetOpen: Dispatch<SetStateAction<boolean>>;
  notificationSheet: boolean;
  setNotificationSheet: Dispatch<SetStateAction<boolean>>;
  logotAlert: boolean;
  setLogotAlert: Dispatch<SetStateAction<boolean>>;
  modalRef: RefObject<HTMLDivElement>;
  sidebarWidth: number;
}

export interface Props {
  uiState: MainUIStateType;
  menu?:SidebarMenuLinkType;
  headerHeight?: number;
}

export  interface SidebarMenuLinkType {
  name: string;
  path?: string;
  subMenu?: SidebarMenuLinkType[];
}