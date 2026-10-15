import React from "react";
import { Chip } from "@mui/material";
import { ICellRendererParams } from "@ag-grid-community/core";
import { PO_STATUS, STATUS_TONE_SX } from "./poHistory.constants";

const StatusCellRenderer: React.FC<ICellRendererParams> = ({ value }) => {
  const status = PO_STATUS[String(value ?? "")] ?? {
    label: String(value || "-"),
    tone: "neutral" as const,
  };
  return (
    <Chip
      label={status.label}
      size="small"
      variant="outlined"
      sx={{
        height: 22,
        fontSize: 12,
        fontWeight: 600,
        borderRadius: "999px",
        border: "1px solid",
        textTransform: "capitalize",
        "& .MuiChip-label": { pl: 0.75, pr: 1 },
        "& .MuiChip-icon": { mr: 0 },
        ...STATUS_TONE_SX[status.tone],
      }}
    />
  );
};

export default React.memo(StatusCellRenderer);
