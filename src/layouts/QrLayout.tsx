import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useNavigate, useLocation } from "react-router-dom";
import useMenuKey from "@/hooks/useMuneKey";
import { getMenuTab } from "@/features/menu/menuSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import Loader from "@/components/reusable/Loader";
import DynamicIcon from "@/components/reusable/DynamicIcon";

type Props = {
  children: React.ReactNode;
};

// Define tab routes and their respective icons/labels outside the component


const QrLayout: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const menuKey = useMenuKey();
  const {  menuTab,menuTabLoading } = useAppSelector((state) => state.menu);

  // Determine the active tab index based on the current route
  const currentTabIndex = menuTab?.findIndex((tab) => tab.url === location.pathname);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    if (menuTab) {
      navigate(menuTab[newValue].url);
    }
  };

  useEffect(() => {
    if (menuKey && !menuTab) {
      dispatch(getMenuTab(menuKey));
    }
  }, [menuKey]);

  if (menuTabLoading)
    return (
      <div className="h-[calc(100vh-50px)]">
        <Loader />
      </div>
    );
  return (
    <div className="h-full">
      <div className="w-full h-[50px] border-b border-neutral-300 bg-white">
        <Tabs
          selectionFollowsFocus
          value={currentTabIndex !== -1 ? currentTabIndex : 0}
          onChange={handleChange}
          TabIndicatorProps={{
            style: { height: "3px" }, // Thicker tab indicator
          }}
          sx={{ padding: 0, width: "max-content" }}
          centered
        >
          {menuTab?.map((tab, index) => (
            <Tab key={index} sx={{ fontWeight: 500 }} label={<div className="flex items-center gap-2"><DynamicIcon size="small" name={tab.icon} />{tab.name}</div>} />
          ))}
        </Tabs>
      </div>

      <Box sx={{ height: "calc(100vh - 100px)" }}>{children}</Box>
    </div>
  );
};

export default QrLayout;
