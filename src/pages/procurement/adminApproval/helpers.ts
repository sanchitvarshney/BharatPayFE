import dayjs from "dayjs";

export type ChipColor = "warning" | "success" | "error";

export const formatDateTime = (value?: string | null) =>
  value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "--";

export const formatRate = (value: string | number) => {
  const num = Number(value);
  return Number.isNaN(num)
    ? String(value)
    : num.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      });
};

const statusChipMap: Record<string, { label: string; color: ChipColor }> = {
  APPROVED: { label: "Approved", color: "success" },
  REJECTED: { label: "Rejected", color: "error" },
  PENDING: { label: "Pending", color: "warning" },
};

export const getStatusChip = (status?: string | null) =>
  statusChipMap[status?.toUpperCase() ?? ""] || statusChipMap.PENDING;

export const isPendingStatus = (status?: string | null) =>
  status?.toUpperCase() === "PENDING";
