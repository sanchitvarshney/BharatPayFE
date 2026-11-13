import React, { useMemo, useRef } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { getDispatchSummaryReport } from "@/features/report/report/reportSummarySlice";
import DispatchSummaryTable, {
  buildDispatchRows,
} from "@/table/report/r26tabls/DispatchSummaryTable";
import ReportShell from "@/components/report/r26/ReportShell";
import { useR26Report } from "@/components/report/r26/useR26Report";

const DispatchSummaryReport: React.FC = () => {
  const { dispatchSummaryReportLoading, dispatchSummaryReport } = useAppSelector(
    (state) => state.reportSummary,
  );
  const gridRef = useRef<AgGridReact<any>>(null);
  const { date, setRange, generate, meta, error, fileSuffix } = useR26Report(
    "dispatchSummary",
    getDispatchSummaryReport,
  );

  const hasRows = useMemo(
    () => buildDispatchRows(dispatchSummaryReport).rows.length > 0,
    [dispatchSummaryReport],
  );

  const handleExportExcel = () => {
    if (!hasRows) {
      showToast("No data to export", "error");
      return;
    }
    gridRef.current?.api.exportDataAsExcel({
      sheetName: "Dispatch Summary",
      fileName: `Dispatch_Summary_Report_${fileSuffix}.xlsx`,
    });
  };

  return (
    <ReportShell
      title="Dispatch Summary Report"
      description="Model-wise total, dispatched and pending quantity for the selected range and current month."
      reportName="Dispatch summary report"
      date={date}
      onDateChange={setRange}
      onGenerate={generate}
      loading={dispatchSummaryReportLoading}
      meta={meta}
      error={error}
      hasReport={!!dispatchSummaryReport}
      onExport={handleExportExcel}
      canExport={hasRows}
    >
      <DispatchSummaryTable gridRef={gridRef} />
    </ReportShell>
  );
};

export default DispatchSummaryReport;
