import React from "react";
import { ICellRendererParams } from "@ag-grid-community/core";

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

const TONE_CLASS: Record<StatusTone, string> = {
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-600",
  info: "bg-indigo-50 text-indigo-500",
  neutral: "bg-slate-100 text-slate-600",
};

// Known statuses (full words and single-letter codes) → tone
const STATUS_TONE: Record<string, StatusTone> = {
  APPROVED: "success",
  A: "success",
  RECEIVED: "success",
  COMPLETED: "success",
  CLOSED: "success",
  PENDING: "warning",
  P: "warning",
  ON_HOLD: "warning",
  H: "warning",
  ORDERED: "info",
  OPEN: "info",
  CANCELLED: "danger",
  CANCELED: "danger",
  C: "danger",
  REJECTED: "danger",
  R: "danger",
};

// Single-letter codes have no readable label of their own
const CODE_LABEL: Record<string, string> = {
  A: "Approved",
  P: "Pending",
  H: "On Hold",
  C: "Cancelled",
  R: "Rejected",
};

const toLabel = (key: string, raw: string) =>
  CODE_LABEL[key] ??
  raw
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

interface StatusChipProps {
  status?: string | null;
  // Override the tone picked from the status text
  tone?: StatusTone;
  label?: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ status, tone, label }) => {
  const raw = String(status ?? "").trim();
  if (!raw) return <span>-</span>;
  const key = raw.toUpperCase().replace(/\s+/g, "_");
  return (
    <span
      className={`inline-flex items-center px-[10px] py-[2px] rounded-md text-[13px] font-medium leading-[20px] ${
        TONE_CLASS[tone ?? STATUS_TONE[key] ?? "neutral"]
      }`}
    >
      {label ?? toLabel(key, raw)}
    </span>
  );
};

// AG Grid cell renderer: cellRenderer: StatusChipCellRenderer
export const StatusChipCellRenderer: React.FC<ICellRendererParams> = ({
  value,
}) => <StatusChip status={value} />;

export default React.memo(StatusChip);
