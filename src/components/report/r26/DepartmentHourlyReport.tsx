import React, { useRef } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ReportDateKey } from "@/features/report/report/reportSummarySlice";
import DepartmentHourlyTable from "@/table/report/r26tabls/DepartmentHourlyTable";
import { showToast } from "@/utils/toasterContext";
import ReportShell from "./ReportShell";
import { useR26Report } from "./useR26Report";

type Props = {
  title: string;
  description: string;
  reportName: string;
  dateKey: ReportDateKey;
  thunk: Parameters<typeof useR26Report>[1];
  report: { columns?: string[]; data?: any[] } | null;
  loading: boolean;
  sheetName: string;
  filePrefix: string;
};

const DepartmentHourlyReport: React.FC<Props> = ({
  title,
  description,
  reportName,
  dateKey,
  thunk,
  report,
  loading,
  sheetName,
  filePrefix,
}) => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const { date, setRange, generate, meta, error, fileSuffix } = useR26Report(
    dateKey,
    thunk,
  );

  const hasRows = !!report?.data?.length;

  const handleExport = () => {
    if (!hasRows) {
      showToast("No data to export", "error");
      return;
    }
    gridRef.current?.api.exportDataAsExcel({
      sheetName,
      fileName: `${filePrefix}_${fileSuffix}.xlsx`,
    });
  };

  return (
    <ReportShell
      title={title}
      description={description}
      reportName={reportName}
      date={date}
      onDateChange={setRange}
      onGenerate={generate}
      loading={loading}
      meta={meta}
      error={error}
      hasReport={!!report}
      onExport={handleExport}

      canExport={hasRows}
    >
      <DepartmentHourlyTable
        gridRef={gridRef}
        report={report}
        loading={loading}
      />
    </ReportShell>
  );
};

export default DepartmentHourlyReport;
