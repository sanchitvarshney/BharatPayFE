import React from "react";
import { Skeleton } from "@mui/material";

const SkeletonCellRenderer: React.FC = () => {
  return <Skeleton variant="text" width="80%" height={20} />;
};

export default SkeletonCellRenderer;
