import * as React from "react";
import { memo, useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useLocation, useNavigate } from "react-router-dom";

import SummarizeIcon from "@mui/icons-material/Summarize";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useAppSelector } from "@/hooks/useReduxHook";
import { SWIPE_SKU_TABS } from "@/features/swipeBilling/swipeBillingConfig";

type Props = {
  children: React.ReactNode;
};

const tabs = [
  {
    label: "Billing Summary",
    route: "/swipe-billing",
    icon: <CreditScoreIcon />,
  },
  {
    label: "Summary",
    route: "/swipe-billing/summary",
    icon: <SummarizeIcon />,
  },
  ...SWIPE_SKU_TABS.map((sku) => ({
    label: sku.label,
    route: `/swipe-billing/sku/${sku.key}`,
    icon: <PointOfSaleIcon />,
  })),
  {
    label: "Dispatch",
    route: "/swipe-billing/dispatch",
    icon: <LocalShippingIcon />,
  },
  {
    label: "Purchase",
    route: "/swipe-billing/purchase",
    icon: <ShoppingCartIcon />,
  },
];

const SwipeBillingLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isData = useAppSelector((state) => state.swipeBilling.isData);

  const currentTabIndex = Math.max(
    tabs.findIndex((tab) => tab.route === location.pathname),
    0,
  );


  useEffect(() => {
    if (!isData && currentTabIndex > 0) {
      navigate("/swipe-billing", { replace: true });
    }
  }, [isData, currentTabIndex, navigate]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    const route = tabs[newValue]?.route;
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="h-full">
      <div className="w-full h-[50px] border-b border-neutral-300 bg-white">
        <Tabs
          sx={{
            padding: 0,
            maxWidth: "100%",
          }}
          TabIndicatorProps={{
            style: {
              height: "3px",
            },
          }}
          variant="scrollable"
          scrollButtons="auto"
          value={currentTabIndex}
          onChange={handleTabChange}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab.route}
              disabled={index !== 0 && !isData}
              sx={{ fontWeight: 500 }}
              label={
                <div className="flex items-center gap-[10px]">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
              }
            />
          ))}
        </Tabs>
      </div>

      <Box sx={{ height: "calc(100vh - 100px)" }}>{children}</Box>
    </div>
  );
};

export default memo(SwipeBillingLayout);
