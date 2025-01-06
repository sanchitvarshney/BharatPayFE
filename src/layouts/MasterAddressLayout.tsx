import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home"; // Example icons
import LocalShippingIcon from "@mui/icons-material/LocalShipping"; // Example icons

type Props = {
  children: React.ReactNode;
};

const MasterAddressLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define routes for the tabs
  const tabRoutes = ["/master-billing-address", "/master-shipping-address"];
  const currentTabIndex = tabRoutes.indexOf(location.pathname);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    navigate(tabRoutes[newValue]);
  };

  return (
    <div className="h-full">
      <div className="w-full h-[50px] border-b border-neutral-300 bg-white">
        <Tabs
          sx={{ padding: 0, width: "max-content" }}
          TabIndicatorProps={{
            style: {
              height: "3px", // Adjust indicator thickness
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
                <HomeIcon />
                Billing Address
              </div>
            }
          />
          <Tab
            sx={{ fontWeight: "500" }}
            label={
              <div className="flex items-center gap-[10px]">
                <LocalShippingIcon />
                Shipping Address
              </div>
            }
          />
        </Tabs>
      </div>
      <Box sx={{ height: "calc(100vh - 100px)", overflowY: "auto" }}>{children}</Box>
    </div>
  );
};

export default MasterAddressLayout;
