import React, { useMemo, useRef } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppSelector } from "@/hooks/useReduxHook";
import { ColDef } from "@ag-grid-community/core";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomPagination from "@/components/reusable/CustomPagination";

interface R18ReportTableProps {
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSize: number;
}

const R18ReportTable: React.FC<R18ReportTableProps> = ({
  onPageChange,
  onPageSizeChange,
  pageSize,
}) => {
  const { r18Report, getR18DataLoading } = useAppSelector(
    (state) => state.report
  );
  const gridRef = useRef<AgGridReact>(null);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "#",
        field: "id",
        valueGetter: "node.rowIndex+1",
        maxWidth: 100,
      },
      {
        field: "serial",
        headerName: "Serial Number",
        flex: 1,
        minWidth: 180,
      },
      {
        field: "insert_dt",
        headerName: "Date",
        flex: 1,
        minWidth: 180,
        valueFormatter: (params) => {
          if (!params.value) return "--";
          const date = new Date(params.value);
          return date.toLocaleString();
        },
      },
      {
        field: "remark",
        headerName: "Remark",
        flex: 1,
        minWidth: 180,
      },
      ...(r18Report?.question || []).map((question: string, index: number) => ({
        field: `question_${index + 1}`,
        headerName: question,
        flex: 1,
        minWidth: 120,
        valueGetter: (params: any) => {
          const qA = params.data.qA || [];
          return qA.includes(question) ? "YES" : "NO";
        },
      })),
    ],
    [r18Report?.question]
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="relative ag-theme-quartz h-[calc(100vh-150px)]">
          <AgGridReact
            ref={gridRef}
            loadingOverlayComponent={CustomLoadingOverlay}
            loading={getR18DataLoading}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            suppressCellFocus={true}
            rowData={r18Report?.data || []}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            enableCellTextSelection={true}
            tooltipShowDelay={0}
            tooltipHideDelay={2000}
          />
        </div>
      </div>
      {r18Report && (
        <CustomPagination
          currentPage={r18Report.page}
          totalPages={r18Report.totalPages}
          totalRecords={r18Report.totalRecords}
          onPageChange={onPageChange}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
};

export default R18ReportTable;
