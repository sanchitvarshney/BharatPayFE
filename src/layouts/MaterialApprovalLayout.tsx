import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useNavigate, useLocation } from "react-router-dom";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AppsOutageIcon from '@mui/icons-material/AppsOutage';
type Props = {
  children: React.ReactNode;
};

const MaterialApprovalLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the active tab based on the current route
  const tabRoutes = ["/pending-material-approval", "/material-requisition-request"];
  const currentTabIndex = tabRoutes.indexOf(location.pathname);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    // Navigate to the corresponding route when tab changes
    navigate(tabRoutes[newValue]);
  };

  return (
    <div className="h-full">
      <div className=" w-full h-[50px] border-b border-neutral-300 bg-white">
        <Tabs
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
          <Tab
            sx={{ fontWeight: "500" }}
            label={
              <div className="flex items-center gap-[10px]">
                <PendingActionsIcon />
                Pending MR(Approval)
              </div>
            }
          />
          <Tab
            sx={{ fontWeight: "500" }}
            label={
              <div className="flex items-center gap-[10px]">
                <AppsOutageIcon />
                Material Requisition Request
              </div>
            }
          />
        </Tabs>
      </div>
      <Box sx={{ height: "calc(100vh - 100px)" }}>{children}</Box>
    </div>
  );
};

export default MaterialApprovalLayout;
