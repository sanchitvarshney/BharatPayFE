import React from "react";
import { useParams, NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Typography } from "@mui/material";

interface NavSliderData {
  path: string;
  name: string;
  content: React.ReactNode;
}

export const queryNavSliderData: NavSliderData[] = [
  { path: "#", name: "Q1", content: <p>SKU Statement</p> },
  { path: "#", name: "Q2", content: <p>Raw Material Statement</p> },
  { path: "#", name: "Q3", content: <p>Component Statement</p> },
];

const QueryNavSlider: React.FC = () => {
  const { id } = useParams();
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const index = queryNavSliderData.findIndex((link) => link.name === id);
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
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        aria-label="query navigation slider"
        sx={{
         
          [`& .${tabsClasses.scrollButtons}`]: {
            "&.Mui-disabled": { opacity: 0.3 },
          },
         
        }}
      >
        {queryNavSliderData.map((link, index) => (
          <Tab
         
            key={index}
            component={NavLink}
            to={`/queries/${link.name}`}
            label={
              <div className="flex items-center gap-[10px]">
                <Typography fontWeight={500}>{link.name}</Typography>
                {value === index && (
                  <Typography variant="inherit" className="text-slate-600">
                    {link.content}
                  </Typography>
                )}
              </div>
            }
            wrapped
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default QueryNavSlider;
