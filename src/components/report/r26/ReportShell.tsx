import React, { useCallback, useEffect, useId, useState } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button } from "@mui/material";
import {
  AlertTriangle,
  CalendarRange,

  Download,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCw,
} from "lucide-react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { rangePresets } from "@/utils/rangePresets";
import { ReportMeta } from "@/features/report/report/reportSummarySlice";
import { ReportEmptyState, ReportErrorState, ReportLoadingState } from "./ReportBlocks";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

export type SummaryItem = { label: string; value: React.ReactNode; highlight?: boolean };

type ReportShellProps = {
  title: string;
  description: string;
  reportName: string;
  date: { from: Dayjs | null; to: Dayjs | null };
  onDateChange: (value: [Dayjs | null, Dayjs | null] | null) => void;
  onGenerate: () => void;
  loading: boolean;
  meta: ReportMeta | null;
  error?: string | null;
  hasReport: boolean;
  onExport?: () => void;
  canExport?: boolean;
  summary?: SummaryItem[];
  toolbar?: React.ReactNode;
  children: React.ReactNode;
};

const COLLAPSE_KEY = "r26.filterPanelCollapsed";

const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
};

const formatPeriod = (meta: ReportMeta) => {
  const from = dayjs(meta.from, "DD-MM-YYYY");
  const to = dayjs(meta.to, "DD-MM-YYYY");
  return from.isSame(to, "day")
    ? from.format("DD MMM YYYY")
    : `${from.format("DD MMM YYYY")} – ${to.format("DD MMM YYYY")}`;
};

const PanelHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
    {children}
  </h3>
);

const RailButton: React.FC<{
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ label, onClick, disabled, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={label}
    aria-label={label}
    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 disabled:pointer-events-none disabled:opacity-40"
  >
    {children}
  </button>
);

const ReportShell: React.FC<ReportShellProps> = ({
  title,
  description,
  reportName,
  date,
  onDateChange,
  onGenerate,
  loading,
  meta,
  error,
  hasReport,
  onExport,
  canExport,
  summary = [],
  toolbar,
  children,
}) => {
  const panelId = useId();
  const [collapsed, setCollapsed] = useState(readCollapsed);

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
    } catch {
      /* storage unavailable */
    }
  }, [collapsed]);

  const toggle = useCallback(() => setCollapsed((c) => !c), []);

  const pickerChanged =
    !!meta &&
    !!date.from &&
    !!date.to &&
    (date.from.format("DD-MM-YYYY") !== meta.from || date.to.format("DD-MM-YYYY") !== meta.to);

  return (
    <div className="flex flex-col gap-3 lg:h-full lg:flex-row">
      {/* Left: filters + summary */}
      <aside
        id={panelId}
        aria-label="Report filters and summary"
        className={cn(
          "shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-[width] duration-200 ease-out lg:flex lg:flex-col",
          collapsed ? "lg:w-14" : "lg:w-[320px]",
        )}
      >
        {collapsed ? (
          <div className="flex items-center gap-1 p-2 lg:h-full lg:flex-col lg:py-3">
            <RailButton label="Expand filters panel" onClick={toggle}>
              <PanelLeftOpen className="h-[18px] w-[18px]" />
            </RailButton>
            <span className="mx-1 h-5 w-px bg-slate-200 lg:mx-0 lg:my-1 lg:h-px lg:w-6" />
            <RailButton label="Change date range" onClick={toggle}>
              <CalendarRange className="h-[18px] w-[18px]" />
            </RailButton>
            <RailButton label="Regenerate report" onClick={onGenerate} disabled={loading}>
              <RotateCw className={cn("h-[18px] w-[18px]", loading && "animate-spin")} />
            </RailButton>
            {onExport && (
              <RailButton label="Export to Excel" onClick={onExport} disabled={!canExport}>
                <Download className="h-[18px] w-[18px]" />
              </RailButton>
            )}
            <span className="ml-2 text-xs font-medium text-slate-500 lg:ml-0 lg:mt-4 lg:[writing-mode:vertical-rl] lg:rotate-180">
              Filters &amp; summary
            </span>
          </div>
        ) : (
          <div className="flex flex-col lg:h-full lg:min-h-0">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <span className="text-sm font-semibold text-slate-900">Filters &amp; summary</span>
              <RailButton label="Collapse filters panel" onClick={toggle}>
                <PanelLeftClose className="h-[18px] w-[18px]" />
              </RailButton>
            </div>

            <div className="flex flex-col divide-y divide-slate-100 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
              <section className="px-4 py-4">
                <PanelHeading>Report period</PanelHeading>
                <RangePicker
                  className="h-10 w-full"
                  presets={rangePresets}
                  onChange={onDateChange}
                  disabledDate={(current) => current && current > dayjs()}
                  placeholder={["Start date", "End date"]}
                  value={date.from && date.to ? [date.from, date.to] : null}
                  format="DD/MM/YYYY"
                  aria-label="Report period"
                />
                <div className="mt-3 flex flex-col gap-2">
                  <LoadingButton
                    fullWidth
                    variant="contained"
                    disableElevation
                    startIcon={<Icons.search fontSize="small" />}
                    loadingPosition="start"
                    loading={loading}
                    onClick={onGenerate}
                    sx={{ textTransform: "none", fontWeight: 600, height: 40 }}
                  >
                    Generate report
                  </LoadingButton>
                  {onExport && (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Download className="h-4 w-4" />}
                      onClick={onExport}
                      disabled={!canExport}
                      sx={{ textTransform: "none", fontWeight: 600, height: 40 }}
                    >
                      Export to Excel
                    </Button>
                  )}
                </div>
                {pickerChanged && (
                  <p
                    role="status"
                    className="mt-3 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-2 text-xs text-amber-800"
                  >
                    <AlertTriangle aria-hidden className="mt-px h-3.5 w-3.5 shrink-0" />
                    Period changed. Click Generate report to refresh the data.
                  </p>
                )}
              </section>

            

              {hasReport && summary.length > 0 && (
                <section className="px-4 py-4">
                  <PanelHeading>Summary</PanelHeading>
                  <dl className="flex flex-col gap-2">
                    {summary.map((item) => (
                      <div
                        key={item.label}
                        className={cn(
                          "rounded-lg border px-3 py-2.5",
                          item.highlight
                            ? "border-cyan-200 bg-cyan-50/60"
                            : "border-slate-200 bg-slate-50/60",
                        )}
                      >
                        <dt className="text-xs font-medium text-slate-500">{item.label}</dt>
                        <dd
                          className={cn(
                            "mt-0.5 text-[22px] font-semibold leading-tight tabular-nums",
                            item.highlight ? "text-cyan-800" : "text-slate-900",
                          )}
                        >
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Right: report */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:min-h-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-slate-900">{title}</h1>
            <p className="text-xs text-slate-500">
              {description}
              {meta && collapsed && <span className="text-slate-400"> · {formatPeriod(meta)}</span>}
            </p>
          </div>
          {hasReport && toolbar && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}
        </div>

        {collapsed && hasReport && summary.length > 0 && (
          <dl className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50/60 px-4 py-2.5">
            {summary.map((item) => (
              <div
                key={item.label}
                className="flex items-baseline gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1"
              >
                <dt className="text-xs text-slate-500">{item.label}</dt>
                <dd className="text-sm font-semibold tabular-nums text-slate-900">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {error && !loading && (
          <div className="border-b border-slate-200 p-3">
            <ReportErrorState message={error} onRetry={onGenerate} />
          </div>
        )}

        <div className="relative flex-1 lg:min-h-0">
          {hasReport ? (
            <div className="lg:absolute lg:inset-0">{children}</div>
          ) : loading ? (
            <div className="p-4">
              <ReportLoadingState />
            </div>
          ) : (
            !error && (
              <div className="flex h-full items-center justify-center p-6">
                <ReportEmptyState
                  reportName={reportName}
                  onOpenFilters={collapsed ? toggle : undefined}
                />
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default ReportShell;
