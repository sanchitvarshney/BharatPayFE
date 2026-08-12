import * as React from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useNavigate, useLocation } from "react-router-dom";
import SummarizeIcon from '@mui/icons-material/Summarize';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import { memo } from "react";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useAppSelector } from "@/hooks/useReduxHook";
type Props = {
  children: React.ReactNode;
};

const SummaryLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isData = useAppSelector((state) => state.summary.isData);


  const tabRoutes = ["/summary", "/summary/assembly-and-trc", "/summary/speaker-assembly", "/summary/trc", "/summary/dispatch", "/summary/material-purchase"];
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
        {   key: 0,
            label: "Billing Summary",
            icon: <CreditScoreIcon />,
        },
        {
            key: 1,
            label: "Assembly and TRC",
            icon: <AssignmentTurnedInIcon />
        },{
            key: 2,
            label: "Speaker Assembly",
            icon: <AssignmentTurnedInIcon />
        },
        {
            key: 3,
            label: "TRC",
            icon: <SummarizeIcon />
        },
        {
            key: 4,
            label: "Dispatch",
            icon: <SummarizeIcon />
        },
        {
            key: 5,
            label: "Material Purchase",
            icon: <SummarizeIcon />
        }
  ]

  return (
    <div className="h-full">
      <div className=" w-full h-[50px] border-b border-neutral-300 bg-white">
        <Tabs
          sx={{ padding: 0, width: "max-content" }}
          TabIndicatorProps={{
            style: {
              height: "3px",
            },
          }}
          value={currentTabIndex === -1 ? 0 : currentTabIndex}
          onChange={handleChange}
          centered
        >
         {  
          tabData.map((tab) => (
            <Tab
            disabled={ tab.key !== 0 && !isData}
              sx={{ fontWeight: "500" }}
              label={
                <div className="flex items-center gap-[10px]">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
              }
              key={tab.key}
            />
          ))
         }
        
        </Tabs>
      </div>
      <Box sx={{ height: "calc(100vh - 100px)" }}>{children}</Box>
    </div>
  );
};

export default memo(SummaryLayout);
