import React from "react";
import { TextField } from "@mui/material";

export const SectionHeading = React.memo<{ icon: React.ReactNode; title: string }>(
  ({ icon, title }) => (
    <div className="flex items-center gap-[10px]">
      {icon}
      <h3 className="text-[15px] font-semibold text-slate-700">{title}</h3>
      <div className="h-[2px] flex-1 bg-amber-400/70" />
    </div>
  ),
);
SectionHeading.displayName = "SectionHeading";

export const SummaryRow = React.memo<{
  label: string;
  value?: React.ReactNode;
  strong?: boolean;
}>(({ label, value, strong }) => (
  <div className="flex items-start justify-between gap-[12px] text-[12.5px]">
    <span className="text-slate-500">{label}</span>
    <span className={`text-right ${strong ? "font-semibold text-slate-900" : "text-slate-700"}`}>
      {value === undefined || value === null || value === "" ? "—" : value}
    </span>
  </div>
));
SummaryRow.displayName = "SummaryRow";

export const NumCell = React.memo<{
  value: string;
  onChange: (v: string) => void;
  text?: boolean;
}>(({ value, onChange, text }) => (
  <TextField
    size="small"
    type={text ? "text" : "number"}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    inputProps={text ? undefined : { min: 0 }}
    fullWidth
  />
));
NumCell.displayName = "NumCell";
