import * as React from "react";
import { memo, useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useLocation, useNavigate } from "react-router-dom";

import SummarizeIcon from "@mui/icons-material/Summarize";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import { useAppSelector } from "@/hooks/useReduxHook";
import { useDispatch } from "react-redux";
import { setTabValue } from "@/features/summarySlice/billingSlices";

type Props = {
  children: React.ReactNode;
};

const tabRoutes = [
  "/billing",
  "/billing/assembly-and-trc",
  "/billing/speaker-assembly",
  "/billing/trc",
  "/billing/dispatch",
  "/billing/material-purchase",
];

const tabData = [
  {
    label: "Billing Summary",
    icon: <CreditScoreIcon />,
  },
  {
    label: "Assembly and TRC",
    icon: <AssignmentTurnedInIcon />,
  },
  {
    label: "Speaker Assembly",
    icon: <AssignmentTurnedInIcon />,
  },
  {
    label: "TRC",
    icon: <SummarizeIcon />,
  },
  {
    label: "Dispatch",
    icon: <SummarizeIcon />,
  },
  {
    label: "Material Purchase",
    icon: <SummarizeIcon />,
  },
];

const SummaryLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isData = useAppSelector((state) => state.summary.isData);
  const tabValue = useAppSelector((state) => state.summary.tabValue);

  const isPreviousBilling =
    location.pathname === "/previous-billing";

  const currentTabIndex = Math.max(
    tabRoutes.indexOf(location.pathname),
    0
  );

  /**
   * Keep Redux tab state in sync with the URL.
   */
  useEffect(() => {
    const nextTabValue = isPreviousBilling ? "preview" : "create";

    if (tabValue !== nextTabValue) {
      dispatch(setTabValue(nextTabValue));
    }
  }, [isPreviousBilling, tabValue, dispatch]);

  /**
   * If there is no billing data, only the main Summary page
   * should be accessible.
   */
  useEffect(() => {
    if (!isData && currentTabIndex > 0) {
      navigate("/billing", { replace: true });
    }
  }, [isData, currentTabIndex, navigate]);

  /**
   * Create / Previous Billing tabs.
   */
  const handleMainTabChange = (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    if (newValue === 0) {
      dispatch(setTabValue("create"));
      navigate("/billing");
      return;
    }

    if (newValue === 1) {
      dispatch(setTabValue("preview"));
      navigate("/previous-billing");
    }
  };

  /**
   * Summary child tabs.
   */
  const handleSummaryTabChange = (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    const route = tabRoutes[newValue];

    if (!route) {
      return;
    }

    navigate(route);
  };

  return (
    <div className="h-full">
      {/* Main tabs */}
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
          value={isPreviousBilling ? 1 : 0}
          onChange={handleMainTabChange}
          centered
        >
          <Tab
            sx={{ fontWeight: 500 }}
            label={
              <div className="flex items-center gap-[10px]">
                <CreditScoreIcon />
                <span>Billing</span>
              </div>
            }
          />

          <Tab
            sx={{ fontWeight: 500 }}
            label={
              <div className="flex items-center gap-[10px]">
                <span>Previous Billing</span>
              </div>
            }
          />
        </Tabs>
      </div>

      {/* Summary child tabs */}
      {!isPreviousBilling && (
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
            onChange={handleSummaryTabChange}
            centered
          >
            {tabData.map((tab, index) => (
              <Tab
                key={index}
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
      )}

      {/* Page content */}
      <Box
        sx={{
          height: isPreviousBilling
            ? "calc(100vh - 100px)"
            : "calc(100vh - 150px)",
        }}
      >
        {children}
      </Box>
    </div>
  );
};

export default memo(SummaryLayout);