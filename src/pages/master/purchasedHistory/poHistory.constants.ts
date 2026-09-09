import { PoHistoryFilterType } from "@/features/master/componentPercentage/componentPercentageType";

export const filterTypeOptions: { label: string; value: PoHistoryFilterType }[] = [
  { label: "Component Wise", value: "component" },
  { label: "Vendor Wise", value: "vendor" },
];

type StatusSx = { color: string; backgroundColor: string; borderColor: string };

export const STATUS_TONE_SX: Record<string, StatusSx> = {
  success: { color: "#047857", backgroundColor: "#ecfdf5", borderColor: "#a7f3d0" },
  warning: { color: "#b45309", backgroundColor: "#fffbeb", borderColor: "#fde68a" },
  danger: { color: "#b91c1c", backgroundColor: "#fef2f2", borderColor: "#fecaca" },
  neutral: { color: "#475569", backgroundColor: "#f8fafc", borderColor: "#e2e8f0" },
};

export const PO_STATUS: Record<
  string,
  { label: string; tone: keyof typeof STATUS_TONE_SX }
> = {
  A: { label: "Approved", tone: "success" },
  P: { label: "Pending", tone: "warning" },
  H: { label: "On Hold", tone: "warning" },
  C: { label: "Cancelled", tone: "danger" },
  R: { label: "Rejected", tone: "danger" },
};

/** Detail row height: header + capped visible rows + breathing room. */
export const DETAIL_ROW_HEIGHT = 36;
export const detailRowHeight = (count: number) =>
  40 + Math.min(Math.max(count, 1), 8) * DETAIL_ROW_HEIGHT + 12;
