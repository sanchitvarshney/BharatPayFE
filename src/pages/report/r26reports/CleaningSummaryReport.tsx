import React, { useMemo, useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import axiosInstance from "@/api/axiosInstance";
import { getCleaningSummaryReport } from "@/features/report/report/reportSummarySlice";
import CleaningSummaryTable from "@/table/report/r26tabls/CleaningSummaryTable";
import ReportShell from "@/components/report/r26/ReportShell";
import { useR26Report } from "@/components/report/r26/useR26Report";

const CLEANING_PLACE_ID = "802a9280-dbfa-11f0-8300-04421aa8167c";

type DepartmentCount = { department: string; total: number };

const groupByDepartment = (workers: any[]): DepartmentCount[] => {
  const counts = new Map<string, number>();
  workers.forEach((w) => {
    const dept = String(w?.department ?? "").trim() || "Unassigned";
    counts.set(dept, (counts.get(dept) ?? 0) + 1);
  });
  return Array.from(counts, ([department, total]) => ({ department, total })).sort((a, b) =>
    a.department.localeCompare(b.department),
  );
};

const CleaningSummaryReport: React.FC = () => {
  const { cleaningSummaryReportLoading, cleaningSummaryReport } = useAppSelector(
    (state) => state.reportSummary,
  );
  const gridRef = useRef<AgGridReact<any>>(null);
  const { date, setRange, generate, meta, error, fileSuffix } = useR26Report(
    "cleaningSummary",
    getCleaningSummaryReport,
  );

  const [workers, setWorkers] = useState<any[] | null>(null);
  const [workersLoading, setWorkersLoading] = useState(false);

  const rows: any[] = cleaningSummaryReport?.data || [];
  const hasRows = rows.length > 0;

  const departmentCounts = useMemo(() => groupByDepartment(workers ?? []), [workers]);
  const totalWorkers = workers?.length ?? 0;

  const fetchWorkers = async () => {
    if (!date.from || !date.to) return;
    setWorkersLoading(true);
    try {
      const from = date.from.format("DD-MM-YYYY");
      const to = date.to.format("DD-MM-YYYY");
      const res = await axiosInstance.get(
        `/worker/viewData?from=${from}&to=${to}&place=${CLEANING_PLACE_ID}&department=ALL`,
      );
      setWorkers(res?.data?.success ? res.data.data ?? [] : []);
    } catch {
      setWorkers([]);
    } finally {
      setWorkersLoading(false);
    }
  };

  const handleGenerate = () => {
    generate();
    fetchWorkers();
  };

  const handleExportExcel = () => {
    if (!hasRows) {
      showToast("No data to export", "error");
      return;
    }
    gridRef.current?.api.exportDataAsExcel({
      sheetName: "Cleaning Summary",
      fileName: `Cleaning_Summary_Report_${fileSuffix}.xlsx`,
    });
  };

  const workerPanel =
    workers === null && !workersLoading ? null : (
      <>
        <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Workers by department
        </h3>
        {workersLoading ? (
          <p className="text-xs text-slate-500">Loading…</p>
        ) : departmentCounts.length === 0 ? (
          <p className="text-xs text-slate-500">No workers found for this period.</p>
        ) : (
          <table className="w-full overflow-hidden rounded-lg border border-slate-200 text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Department</th>
                <th className="px-3 py-2 text-right font-medium">Total Worker</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentCounts.map(({ department, total }) => (
                <tr key={department}>
                  <td className="px-3 py-2 text-slate-900">{department}</td>
                  <td className="px-3 py-2 text-right font-semibold tabular-nums text-slate-900">
                    {total}
                  </td>
                </tr>
              ))}
            </tbody>
            {departmentCounts.length > 1 && (
              <tfoot className="border-t border-slate-200 bg-slate-50">
                <tr>
                  <td className="px-3 py-2 font-semibold text-slate-900">Total</td>
                  <td className="px-3 py-2 text-right font-semibold tabular-nums text-slate-900">
                    {totalWorkers}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </>
    );

  return (
    <ReportShell
      title="Cleaning Summary Report"
      description="Part-wise stock across MSC, BPe and Greater Noida locations."
      reportName="Cleaning summary report"
      date={date}
      onDateChange={setRange}
      onGenerate={handleGenerate}
      loading={cleaningSummaryReportLoading}
      meta={meta}
      error={error}
      hasReport={!!cleaningSummaryReport}
      onExport={handleExportExcel}
      canExport={hasRows}
      sideContent={workerPanel}
    >
      <CleaningSummaryTable gridRef={gridRef} />
    </ReportShell>
  );
};

export default CleaningSummaryReport;
