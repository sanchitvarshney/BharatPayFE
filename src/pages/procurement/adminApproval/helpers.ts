import dayjs from "dayjs";

export type ChipColor = "warning" | "success" | "error";

export const formatDateTime = (value?: string | null) => {
  if (!value) return "--";
  const date = dayjs(value);
  return date.isValid() ? date.format("DD MMM YYYY, hh:mm A") : value;
};

// Timestamp of a date-time string (0 when missing or invalid)
export const parseDateTime = (value?: string | null) => {
  const date = dayjs(value || "");
  return value && date.isValid() ? date.valueOf() : 0;
};

// Parses a "DD-MM-YYYY" date string into a timestamp (0 when invalid)
export const parseDmy = (value?: string | null) => {
  const [day, month, year] = (value || "").split("-").map(Number);
  if (!day || !month || !year) return 0;
  return new Date(year, month - 1, day).getTime();
};

export const formatDmy = (value?: string | null) => {
  const time = parseDmy(value);
  return time ? dayjs(time).format("DD MMM YYYY") : value || "--";
};

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
  HOLD: { label: "On Hold", color: "warning" },
};

export const getStatusChip = (status?: string | null) =>
  statusChipMap[status?.toUpperCase() ?? ""] || statusChipMap.PENDING;

export const isPendingStatus = (status?: string | null) =>
  status?.toUpperCase() === "PENDING";
