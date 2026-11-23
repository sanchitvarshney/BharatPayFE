import React from "react";
import { FileBarChart2 } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const MetaReportLayout: React.FC<Props> = ({ children }) => (
  <div className="flex h-[calc(100vh-50px)] flex-col bg-slate-50">
    <header className="border-b border-slate-200 bg-white px-4 py-3 md:px-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
          <FileBarChart2 aria-hidden className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-slate-900">Report Center</h1>
          <p className="text-xs text-slate-500">
            Pick a location, choose a report, set filters and generate.
          </p>
        </div>
      </div>
    </header>
    <div className="flex min-h-0 flex-1 flex-col">{children}</div>
  </div>
);

export default MetaReportLayout;
