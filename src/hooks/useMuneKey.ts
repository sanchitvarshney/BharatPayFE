import { useEffect, useState } from "react";
import { useAppSelector } from "./useReduxHook";
import { getMenuKeyByUrl } from "@/utils/getMenuKey";

const useMenuKey = () => {
  const [menuKey, setMenuKey] = useState<string>("");
  const path = window.location.pathname;
  const { menu } = useAppSelector((state) => state.menu);
  useEffect(() => {
    setMenuKey(getMenuKeyByUrl(menu || [], path) || "");
  }, [path,menu]);
  return menuKey;
};

export default useMenuKey;
