import React, { useEffect, useState } from "react";
import { useNavigate, useParams, NavLink, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Tooltip, Typography } from "@mui/material";
import { useUser } from "@/hooks/useUser";
interface NavSliderData {
  path: string;
  name: string;
  title: string;
}

export const visibaleArr: any[] = [
  "CRN1245062",
  "CRN28960",
  "CRN2913859",
  "CRN103522",
  "CRN788880",
];

export const navSliderData: NavSliderData[] = [
  { path: "/report/R1", name: "R1", title: "Device MIN Report" },
  { path: "/report/R2", name: "R2", title: "TRC Report" },
  { path: "/report/R3", name: "R3", title: "Battery QC Report" },
  { path: "/report/R4", name: "R4", title: "Production Report" },
  { path: "/report/R5", name: "R5", title: "Dispatch Report" },
  { path: "/report/R6", name: "R6", title: "Raw MIN Report" },
  { path: "/report/R7", name: "R7", title: "Date Wise RM Report" },
  { path: "/report/R8", name: "R8", title: "Material Issue Report" },
  { path: "/report/R9", name: "R9", title: "Device MIN Report V2" },
  { path: "/report/R10", name: "R10", title: "MONO Report" },
  { path: "/report/R11", name: "R11", title: "BPe Issue Report" },
  { path: "/report/R12", name: "R12", title: "TRC Assembly Report" },
  { path: "/report/R13", name: "R13", title: "Device Analysis Report" },
  { path: "/report/R14", name: "R14", title: "BER Component Report" },
  {
    path: "/report/R15",
    name: "R15",
    title: "Physical Quantity Report",
  },
  { path: "/report/R16", name: "R16", title: "Swipe MIN Report" },
  {
    path: "/report/R17",
    name: "R17",
    title: "Swipe Machine Functional Report",
  },
  {
    path: "/report/R18",
    name: "R18",
    title: "Swipe Machine Rejection Report",
  },
  { path: "/report/R19", name: "R19", title: "Pre QC Report" },
  { path: "/report/R20", name: "R20", title: "AWB Scanning Report" },
  { path: "/report/R21", name: "R21", title: "AWB Scan SKU Report" },
  { path: "/report/R22", name: "R22", title: "Billing Report" },

  { path: "/report/R23", name: "R23", title: "TRC Report" },
  {
    path: "/report/R24",
    name: "R24",
    title: "Physical Inventory Report",
  },
  {
    path: "/report/R25",
    name: "R25",
    title: "XML Report",
  },
   {
    path: "/report/R26",
    name: "R26",
    title: "Summary Report",
  },
     {
    path: "/report/R27",
    name: "R27",
    content: <p>Reconsiliation Report</p>,
  },
     {
    path: "/report/R27",
    name: "R27",
    content: <p>Reconsiliation Report</p>,
  },
];

const NavSlider: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { user } = useUser();
  const canSeeR22 = visibaleArr.includes(user?.crn_id);
  // State to manage the current tab index
  const [value, setValue] = useState<number>(0);

  // Determine the current tab index based on the current route
  const currentTabIndex = navSliderData.findIndex(
    (tab) => tab.path === location.pathname,
  );

  // Handle tab change
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(navSliderData[newValue].path);
  };

  // Sync tab selection with route parameter
  useEffect(() => {
    const index = navSliderData.findIndex((link) => link.name === id);
    if (index !== -1) {
      setValue(index);
    }
  }, [id]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        borderBottom: "1px solid #ccc",
      }}
    >
      <Tabs
        selectionFollowsFocus
        value={currentTabIndex !== -1 ? currentTabIndex : 0}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="navigation slider"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            "&.Mui-disabled": { opacity: 0.3 },
          },
        }}
      >
        {navSliderData.map((link, index) => (
          <>
            {link.name === "R22" && !canSeeR22 ? null : (
              <>
                <Tab
                  key={index || link.path}
                  component={NavLink}
                  to={link.path}
                  label={
                    <Tooltip title={link.title} placement="top">
                      <div className="flex items-center gap-[10px]">
                        <Typography fontWeight={500}>{link.name}</Typography>
                        {value === index && (
                          <Typography variant="body2" color="textSecondary">
                            <p>{link.title}</p>
                          </Typography>
                        )}
                      </div>
                    </Tooltip>
                  }
                />
              </>
            )}
          </>
        ))}
      </Tabs>
    </Box>
  );
};

export default NavSlider;
