import React from "react";
import MuiTooltip from "../reusable/MuiTooltip";
import { Icons } from "../icons";
import { IconButton } from "@mui/material";

const Footernav: React.FC = () => {
  return (
    <div className="flex items-center justify-between w-full h-full">
      <div></div>
      <div>
        <MuiTooltip title="Chat" placement="top">
        <IconButton size="small">
        <Icons.chat fontSize="small" />
        </IconButton>
        </MuiTooltip>
      </div>
    </div>
  );
};

export default Footernav;
