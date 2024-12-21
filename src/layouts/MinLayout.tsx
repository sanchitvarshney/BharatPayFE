import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useNavigate, useLocation } from "react-router-dom";
import { Icons } from "@/components/icons";
type Props = {
  children: React.ReactNode;
};

const MinLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the active tab based on the current route
  // const tabRoutes = ["/raw-min", "/raw-min-v2", "/sim-min"];
  const tabRoutes = [ "/raw-min", "/sim-min"];
  const currentTabIndex = tabRoutes.indexOf(location.pathname);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    // Navigate to the corresponding route when tab changes
    navigate(tabRoutes[newValue]);
  };

  return (
    <div className="h-full">
      <div className=" w-full h-[50px] border-b border-neutral-300 bg-white">
        <Tabs
          selectionFollowsFocus
          sx={{ padding: 0, width: "max-content" }}
          TabIndicatorProps={{
            style: {
              height: "3px", // Increase thickness of the indicator
            },
          }}
          value={currentTabIndex === -1 ? 0 : currentTabIndex}
          onChange={handleChange}
          centered
        >
          {/* <Tab
            sx={{ fontWeight: "500" }}
            label={
              <div className="flex items-center gap-[10px]">
                <Icons.grid fontSize="small" />
                RAW MIN
              </div>
            }
          /> */}
          {/* {import.meta.env.VITE_REACT_APP_ENVIRONMENT === "DEV" && ( */}
            <Tab
              sx={{ fontWeight: "500" }}
              label={
                <div className="flex items-center gap-[10px]">
                  <Icons.grid fontSize="small" />
                  RAW MIN 
                </div>
              }
            />
          {/* )} */}

          <Tab
            sx={{ fontWeight: "500" }}
            label={
              <div className="flex items-center gap-[10px]">
                <Icons.sim fontSize="small" />
                SIM MIN
              </div>
            }
          />
        </Tabs>
      </div>
      <Box sx={{ height: "calc(100vh - 100px)" }}>{children}</Box>
    </div>
  );
};

export default MinLayout;
