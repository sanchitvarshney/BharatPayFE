import React, { useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { getQcMinReport } from "@/features/report/report/reportSummarySlice";
import QcMinOutwardTable from "@/table/report/r26tabls/QcMinOutwardTable";
import ReportShell from "@/components/report/r26/ReportShell";
import { TableSearch } from "@/components/report/r26/ReportBlocks";
import { useR26Report } from "@/components/report/r26/useR26Report";
import { formatNumber } from "@/components/report/r26/reportUtils";

const QCMINQutwardReport: React.FC = () => {
  const { qcminreportLoading, qcminreport } = useAppSelector((state) => state.reportSummary);
  const gridRef = useRef<AgGridReact<any>>(null);
  const [search, setSearch] = useState("");
  const { date, setRange, generate, meta, error, fileSuffix } = useR26Report(
    "qcMinOutward",
    getQcMinReport,
  );

  const handleExport = () => {
    if (!qcminreport?.data?.length) {
      showToast("No data to export", "error");
      return;
    }
    gridRef.current?.api.exportDataAsExcel({
      sheetName: "QC MIN Outward",
      fileName: `QC_MIN_Outward_Report_${fileSuffix}.xlsx`,
    });
  };

  return (
    <ReportShell
      title="QC MIN Outward Report"
      description="AWB scan, inward, outward and partial MIN by model and SKU."
      reportName="QC MIN outward report"
      date={date}
      onDateChange={setRange}
      onGenerate={generate}
      loading={qcminreportLoading}
      meta={meta}
      error={error}
      hasReport={!!qcminreport}
      onExport={handleExport}
      canExport={!!qcminreport?.data?.length}
      summary={[
        { label: "Image Capture", value: formatNumber(qcminreport?.device_img_count), highlight: true },
        { label: "Wrong Device MIN", value: formatNumber(qcminreport?.wrong_device?.total_min) },
           { label: "Pending Device MIN", value: formatNumber(qcminreport?.wrong_device?.pending_min) },
      ]}
      toolbar={<TableSearch value={search} onChange={setSearch} placeholder="Search model, SKU or product…" />}
    >
      <QcMinOutwardTable gridRef={gridRef} quickFilterText={search} />
    </ReportShell>
  );
};

export default QCMINQutwardReport;
