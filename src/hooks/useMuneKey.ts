import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./useReduxHook";
import { setMenuKey } from "@/features/menu/menuSlice";
import { getMenuKeyByUrl } from "@/utils/getMenuKey";

const useMenuKey = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const menu = useAppSelector((state) => state.menu.menu);
  const menuKey = useAppSelector((state) => state.menu.menuKey);

  useEffect(() => {
    const resolved = getMenuKeyByUrl(menu || [], pathname) ?? null;
    dispatch(setMenuKey(resolved));

    // sessionStorage is the bridge for axiosInstance (cannot use Redux outside React)
    if (resolved) {
      sessionStorage.setItem("menuKey", resolved);
    } else {
      sessionStorage.removeItem("menuKey");
    }
  }, [pathname, menu, dispatch]);

  return menuKey ?? "";
};

export default useMenuKey;
