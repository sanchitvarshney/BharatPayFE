import React,{ useRef } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { getCleaningSummaryReport } from "@/features/report/report/reportSummarySlice";
import CleaningSummaryTable from "@/table/report/r26tabls/CleaningSummaryTable";
import ReportShell from "@/components/report/r26/ReportShell";
import { useR26Report } from "@/components/report/r26/useR26Report";

const CleaningSummaryReport: React.FC = () => {
  const { cleaningSummaryReportLoading, cleaningSummaryReport } = useAppSelector(
    (state) => state.reportSummary,
  );
  const gridRef = useRef<AgGridReact<any>>(null);
  const { date, setRange, generate, meta, error, fileSuffix } = useR26Report(
    "cleaningSummary",
    getCleaningSummaryReport,
  );

  const rows: any[] = cleaningSummaryReport?.data || [];
  const hasRows = rows.length > 0;



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

  return (
    <ReportShell
      title="Cleaning Summary Report"
      description="Part-wise stock across MSC, BPe and Greater Noida locations."
      reportName="Cleaning summary report"
      date={date}
      onDateChange={setRange}
      onGenerate={generate}
      loading={cleaningSummaryReportLoading}
      meta={meta}
      error={error}
      hasReport={!!cleaningSummaryReport}
      onExport={handleExportExcel}
      canExport={hasRows}
    >
      <CleaningSummaryTable gridRef={gridRef} />
    </ReportShell>
  );
};

export default CleaningSummaryReport;
