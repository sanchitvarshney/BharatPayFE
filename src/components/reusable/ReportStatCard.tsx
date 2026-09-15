import React from "react";
import { cn } from "@/lib/utils";

type StatColor = "primary" | "success" | "error" | "warning" | "info";

const colorClasses: Record<StatColor, string> = {
  primary: "border-l-blue-500 text-blue-700",
  success: "border-l-emerald-500 text-emerald-700",
  error: "border-l-red-500 text-red-700",
  warning: "border-l-amber-500 text-amber-700",
  info: "border-l-sky-500 text-sky-700",
};

interface ReportStatCardProps {
  label: string;
  value: React.ReactNode;
  color?: StatColor;
  className?: string;
}

const ReportStatCard: React.FC<ReportStatCardProps> = ({
  label,
  value,
  color = "primary",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-[2px] rounded-md border border-neutral-200 bg-neutral-50 border-l-4 px-3 py-2",
        colorClasses[color],
        className,
      )}
    >
      <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </span>
      <span className="text-xl font-bold leading-tight">{value}</span>
    </div>
  );
};

export default ReportStatCard;
