import * as React from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useNavigate, useLocation } from "react-router-dom";
import SummarizeIcon from "@mui/icons-material/Summarize";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import { memo } from "react";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { useAppSelector } from "@/hooks/useReduxHook";
import { useDispatch } from "react-redux";
import { setTabValue } from "@/features/summarySlice/billingSlices";
type Props = {
  children: React.ReactNode;
};

const SummaryLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const tabValue = useAppSelector((state) => state.summary.tabValue);
  const isData = useAppSelector((state) => state.summary.isData);

  const tabRoutes = [
    "/summary",
    "/summary/assembly-and-trc",
    "/summary/speaker-assembly",
    "/summary/trc",
    "/summary/dispatch",
    "/summary/material-purchase",
  ];
  const currentTabIndex = tabRoutes.indexOf(location.pathname);

  useEffect(() => {
    if (!isData && currentTabIndex > 0) {
      navigate(tabRoutes[0]);
    }
  }, [isData, currentTabIndex]);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    navigate(tabRoutes[newValue]);
  };

  const tabData = [
    { key: 0, label: "Billing Summary", icon: <CreditScoreIcon /> },
    {
      key: 1,
      label: "Assembly and TRC",
      icon: <AssignmentTurnedInIcon />,
    },
    {
      key: 2,
      label: "Speaker Assembly",
      icon: <AssignmentTurnedInIcon />,
    },
    {
      key: 3,
      label: "TRC",
      icon: <SummarizeIcon />,
    },
    {
      key: 4,
      label: "Dispatch",
      icon: <SummarizeIcon />,
    },
    {
      key: 5,
      label: "Material Purchase",
      icon: <SummarizeIcon />,
    },
  ];

  return (
    <div className="h-full">
      <div className=" w-full h-[50px] border-b border-neutral-300 bg-white">
        <Tabs
          sx={{ padding: 0, maxWidth: "100%" }}
          TabIndicatorProps={{
            style: {
              height: "3px",
            },
          }}
          variant="scrollable"
          scrollButtons="auto"
          value={tabValue === "create" ? 0 : 1}
          onChange={(_, newValue) => {
            if (newValue === 0) {
              navigate("/summary");
              dispatch(setTabValue("create"));
            } else if (newValue === 1) {
              navigate("/previous-billing");
            
              dispatch(setTabValue("preview"));
            }
          }}
          centered
        >
          <Tab
            disabled={tabValue !== "preview"}
            sx={{ fontWeight: "500" }}
            label={
              <div className="flex items-center gap-[10px]">
                <span>{"Billing Summary"}</span>
              </div>
            }
            key={"create"}
          />
          <Tab
            disabled={tabValue !== "create"}
            sx={{ fontWeight: "500" }}
            label={
              <div className="flex items-center gap-[10px]">
                <span>{"Previous Billing"}</span>
              </div>
            }
            key={"preview"}
          />
        </Tabs>
      </div>
      {tabValue !== "preview" && (
        <div className=" w-full h-[50px] border-b border-neutral-300 bg-white">
          <Tabs
            sx={{ padding: 0, maxWidth: "100%" }}
            TabIndicatorProps={{
              style: {
                height: "3px",
              },
            }}
            variant="scrollable"
            scrollButtons="auto"
            value={currentTabIndex === -1 ? 0 : currentTabIndex}
            onChange={handleChange}
            centered
          >
            {tabData.map((tab) => (
              <Tab
                disabled={tab.key !== 0 && !isData}
                sx={{ fontWeight: "500" }}
                label={
                  <div className="flex items-center gap-[10px]">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                }
                key={tab.key}
              />
            ))}
          </Tabs>
        </div>
      )}
      <Box sx={{ height: `${tabValue === "preview" ? "calc(100vh - 100px)" : "calc(100vh - 150px)"}` }}>{children}</Box>
    </div>
  );
};

export default memo(SummaryLayout);
