import React, { useEffect, useState } from "react";
import { useNavigate, useParams, NavLink, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Typography } from "@mui/material";

// Define the navigation slider data
interface NavSliderData {
  path: string;
  name: string;
  content: React.ReactNode;
}

export const navSliderData: NavSliderData[] = [
  { path: "/report/R1", name: "R1", content: <p>Device MIN Report</p> },
  { path: "/report/R2", name: "R2", content: <p>TRC Report</p> },
  { path: "/report/R3", name: "R3", content: <p>Battery QC Report</p> },
  { path: "/report/R4", name: "R4", content: <p>Production Report</p> },
  { path: "/report/R5", name: "R5", content: <p>Dispatch Report</p> },
  { path: "/report/R6", name: "R6", content: <p>Raw MIN Report</p> },
  { path: "/report/R7", name: "R7", content: <p>Date Wise RM Report</p> },
];

const NavSlider: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // State to manage the current tab index
  const [value, setValue] = useState<number>(0);

  // Determine the current tab index based on the current route
  const currentTabIndex = navSliderData.findIndex((tab) => tab.path === location.pathname);

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
          <Tab
            key={index}
            component={NavLink}
            to={link.path}
            label={
              <div className="flex items-center gap-[10px]">
                <Typography fontWeight={500}>{link.name}</Typography>
                {value === index && (
                  <Typography variant="body2" color="textSecondary">
                    {link.content}
                  </Typography>
                )}
              </div>
            }
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default NavSlider;
