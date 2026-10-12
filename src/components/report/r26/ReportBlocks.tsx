import React from "react";
import { CalendarRange, PanelLeftOpen, RotateCw, Search, X, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type TableSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const TableSearch: React.FC<TableSearchProps> = ({ value, onChange, placeholder }) => (
  <div className="relative w-full sm:w-60">
    <Search aria-hidden className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Search rows…"}
      aria-label={placeholder ?? "Search rows"}
      className="h-9 w-full rounded-lg border border-slate-300 bg-white pl-8 pr-8 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 [&::-webkit-search-cancel-button]:hidden"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        aria-label="Clear search"
        className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
);

export const ReportEmptyState: React.FC<{ reportName: string; onOpenFilters?: () => void }> = ({
  reportName,
  onOpenFilters,
}) => (
  <div className="flex max-w-md flex-col items-center text-center">
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50 text-cyan-700">
      <CalendarRange aria-hidden className="h-6 w-6" />
    </span>
    <h2 className="mt-4 text-base font-semibold text-slate-900">Choose a report period</h2>
    <p className="mt-1 text-sm text-slate-500">
      Select a date range in the left panel and click{" "}
      <strong className="font-medium text-slate-700">Generate report</strong> to load the {reportName}.
    </p>
    {onOpenFilters && (
      <button
        type="button"
        onClick={onOpenFilters}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
      >
        <PanelLeftOpen aria-hidden className="h-4 w-4" />
        Open filters
      </button>
    )}
  </div>
);

export const ReportErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
    <XCircle aria-hidden className="h-5 w-5 shrink-0 text-red-600" />
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold text-red-800">The report couldn't be loaded</p>
      <p className="text-sm text-red-700">{message}</p>
    </div>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <RotateCw aria-hidden className="h-4 w-4" />
        Try again
      </button>
    )}
  </div>
);

export const ReportLoadingState: React.FC = () => (
  <div aria-busy="true" aria-label="Loading report" className="flex flex-col gap-2">
    <Skeleton className="h-9 w-full bg-slate-200" />
    {Array.from({ length: 10 }).map((_, i) => (
      <Skeleton key={i} className="h-7 w-full bg-slate-100" />
    ))}
  </div>
);
