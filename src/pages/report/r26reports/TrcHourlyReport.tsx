import React, { useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { getTrcHourlyReport } from "@/features/report/report/reportSummarySlice";
import TrcHourlyTable from "@/table/report/r26tabls/TrcHourlyTable";
import ReportShell, { SummaryItem } from "@/components/report/r26/ReportShell";
import { TableSearch } from "@/components/report/r26/ReportBlocks";
import { useR26Report } from "@/components/report/r26/useR26Report";
import { formatNumber, toNumber } from "@/components/report/r26/reportUtils";

const TrcHourlyReport: React.FC = () => {
  const { trcHourlyReportLoading, trcHourlyReport } = useAppSelector(
    (state) => state.reportSummary,
  );
  const gridRef = useRef<AgGridReact<any>>(null);
  const [search, setSearch] = useState("");
  const { date, setRange, generate, meta, error, fileSuffix } = useR26Report(
    "trcHourly",
    getTrcHourlyReport,
  );

  const summary = trcHourlyReport?.summary;
  const trcIn = toNumber(summary?.trc_in);
  const totalOut = toNumber(summary?.totalout);
  const scrap = toNumber(summary?.scrapQTY);

  const summaryItems: SummaryItem[] = [
    { label: "BER Movement", value: formatNumber(scrap), highlight: true },
    {
      label: "Consumption",
      value: formatNumber(trcHourlyReport?.total?.Trc_consumption),
      highlight: true,
    },
    {
      label: "Current TRC Stock",
      value: formatNumber(totalOut - trcIn),
      highlight: true,
    },
  ];

  const handleExportExcel = () => {
    if (!trcHourlyReport?.data?.length) {
      showToast("No data to export", "error");
      return;
    }
    gridRef.current?.api.exportDataAsExcel({
      sheetName: "TRC Hourly Report",
      fileName: `TRC_Hourly_Report_${fileSuffix}.xlsx`,
    });
  };

  return (
    <ReportShell
      title="TRC Hourly Report"
      description="Total work done per employee."
      reportName="TRC report"
      date={date}
      onDateChange={setRange}
      onGenerate={generate}
      loading={trcHourlyReportLoading}
      meta={meta}
      error={error}
      hasReport={!!trcHourlyReport}
      onExport={handleExportExcel}
      canExport={!!trcHourlyReport?.data?.length}
      summary={summaryItems}
      toolbar={
        <TableSearch
          value={search}
          onChange={setSearch}
          placeholder="Search employee code…"
        />
      }
    >
      <TrcHourlyTable gridRef={gridRef} quickFilterText={search} />
    </ReportShell>
  );
};

export default TrcHourlyReport;
