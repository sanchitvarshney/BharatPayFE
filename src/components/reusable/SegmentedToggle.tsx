import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export type SegmentedToggleOption = {
  value: string;
  label: React.ReactNode;
  minWidth?: number | string;
};

type Props = {
  value: string;
  options: SegmentedToggleOption[];
  onChange: (value: string) => void;
  size?: "small" | "medium";
};

const SegmentedToggle: React.FC<Props> = ({
  value,
  options,
  onChange,
  size = "small",
}) => {
  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: string | null,
  ) => {
    if (newValue) {
      onChange(newValue);
    }
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      size={size}
      sx={{
        backgroundColor: "#f1f5f9",
        borderRadius: "999px",
        padding: "3px",
        gap: "2px",
        "& .MuiToggleButtonGroup-grouped": {
          border: 0,
          borderRadius: "999px !important",
          margin: 0,
        },
      }}
    >
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          disableRipple
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "13px",
            minWidth: option.minWidth ?? "100px",
            py: 0.6,
            color: "#64748b",
            transition: "background-color 0.15s ease, color 0.15s ease",
            "&:hover": { backgroundColor: "#e2e8f0" },
            "&.Mui-selected": {
              backgroundColor: "#0891b2",
              color: "#fff",
              boxShadow: "0 1px 4px rgba(8,145,178,0.45)",
            },
            "&.Mui-selected:hover": {
              backgroundColor: "#0e7490",
            },
          }}
        >
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default SegmentedToggle;
