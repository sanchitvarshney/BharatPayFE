import React, { useRef } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { getPreQcReport } from "@/features/report/report/reportSummarySlice";
import PreQcTable from "@/table/report/r26tabls/PreQcTable";
import ReportShell, { SummaryItem } from "@/components/report/r26/ReportShell";
import { useR26Report } from "@/components/report/r26/useR26Report";
import { formatNumber } from "@/components/report/r26/reportUtils";

const PreQcReport: React.FC = () => {
  const { preQcReportLoading, preQcReport } = useAppSelector(
    (state) => state.reportSummary,
  );
  const gridRef = useRef<AgGridReact<any>>(null);
  const { date, setRange, generate, meta, error, fileSuffix } = useR26Report(
    "preQc",
    getPreQcReport,
  );

  const summary = preQcReport?.summary;
  const hasRows = !!preQcReport?.hourly_report?.length;

  const summaryItems: SummaryItem[] = [
    { label: "Opening Balance", value: formatNumber(summary?.opening_balance) },
    { label: "Total In", value: formatNumber(summary?.total_in), highlight: true },
    { label: "Total Out", value: formatNumber(summary?.total_out), highlight: true },
    { label: "Closing Balance", value: formatNumber(summary?.closing_balance) },
  ];

  const handleExportExcel = () => {
    if (!hasRows) {
      showToast("No data to export", "error");
      return;
    }
    gridRef.current?.api.exportDataAsExcel({
      sheetName: "Pre-QC Movement Report",
      fileName: `PreQC_Movement_Report_${fileSuffix}.xlsx`,
    });
  };

  return (
    <ReportShell
      title="Pre-QC Movement Report"
      description="Hourly Pre-QC movement for assembly and TRC."
      reportName="Pre-QC report"
      date={date}
      onDateChange={setRange}
      onGenerate={generate}
      loading={preQcReportLoading}
      meta={meta}
      error={error}
      hasReport={!!preQcReport}
      onExport={handleExportExcel}
      canExport={hasRows}
      summary={summaryItems}
    >
      <PreQcTable gridRef={gridRef} />
    </ReportShell>
  );
};

export default PreQcReport;
