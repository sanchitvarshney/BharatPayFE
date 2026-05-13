import { useEffect, useState } from "react";
import { useAppSelector } from "./useReduxHook";
import { getMenuKeyByUrl } from "@/utils/getMenuKey";

const useMenuKey = () => {
  const [menuKey, setMenuKey] = useState<string>("");
  const path = globalThis.window.location.pathname;
  const { menu } = useAppSelector((state) => state.menu);
  useEffect(() => {
    const resolvedMenuKey = getMenuKeyByUrl(menu || [], path) || "";
    setMenuKey(resolvedMenuKey);
    if (resolvedMenuKey) {
      sessionStorage.setItem("menuKey", resolvedMenuKey);
    } else {
      sessionStorage.removeItem("menuKey");
    }
  }, [path,menu]);
  return menuKey;
};

export default useMenuKey;
