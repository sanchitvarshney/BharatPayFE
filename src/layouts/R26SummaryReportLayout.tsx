import React from "react";
import { Clock3, PackageCheck, ScanLine, Speaker, Wrench, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { setMode } from "@/features/report/report/reportSummarySlice";
import AwbscanReport from "@/pages/report/r26reports/AwbscanReport";
import QCMINQutwardReport from "@/pages/report/r26reports/QCMINQutwardReport";
import TrcHourlyReport from "@/pages/report/r26reports/TrcHourlyReport";
import SoundboxHourlyReport from "@/pages/report/r26reports/SoundboxHourlyReport";
import SwipeHourlyReport from "@/pages/report/r26reports/SwipeHourlyReport";

type ViewMode = "trc" | "awb" | "qc" | "soundbox" | "swipe";

const REPORTS: { value: ViewMode; label: string; icon: React.ElementType; render: () => React.ReactNode }[] = [
  { value: "awb", label: "AWB Scan", icon: ScanLine, render: () => <AwbscanReport /> },
  { value: "qc", label: "QC MIN Outward", icon: PackageCheck, render: () => <QCMINQutwardReport /> },
  { value: "trc", label: "TRC", icon: Wrench, render: () => <TrcHourlyReport /> },
  { value: "soundbox", label: "Soundbox Hourly", icon: Speaker, render: () => <SoundboxHourlyReport /> },
  { value: "swipe", label: "Swipe Hourly", icon: CreditCard, render: () => <SwipeHourlyReport /> },
];

const R26SummaryReportLayout = () => {
  const mode = useAppSelector((state) => state.reportSummary?.mode) as ViewMode;
  const dispatch = useAppDispatch();

  return (
    <Tabs
      value={mode}
      onValueChange={(value) => dispatch(setMode(value as ViewMode))}
      className="flex h-[calc(100vh-100px)] flex-col bg-slate-50"
    >
      <div className="border-b border-slate-200 bg-white px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 pt-3">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-cyan-50 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-cyan-700">
              R26
            </span>
            <span className="text-sm font-semibold text-slate-800">Operations Summary Reports</span>
          </div>
          <span className="hidden items-center gap-1.5 text-xs text-slate-500 md:flex">
            <Clock3 aria-hidden className="h-3.5 w-3.5" />
            Each report keeps its own period
          </span>
        </div>
        <div className="overflow-x-auto">
          <TabsList
            aria-label="Summary reports"
            className="h-auto justify-start gap-1 rounded-none bg-transparent p-0"
          >
            {REPORTS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="relative gap-2 rounded-none border-b-2 border-transparent px-3 py-3 text-[13px] font-medium text-slate-500 shadow-none hover:text-slate-800 data-[state=active]:border-cyan-600 data-[state=active]:bg-transparent data-[state=active]:text-cyan-800 data-[state=active]:shadow-none"
              >
                <Icon aria-hidden className="h-4 w-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto lg:overflow-hidden">
        {REPORTS.map(({ value, render }) => (
          <TabsContent
            key={value}
            value={value}
            className="mt-0 p-3 focus-visible:ring-0 focus-visible:ring-offset-0 lg:h-full"
          >
            {render()}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

export default R26SummaryReportLayout;
