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

const R19ReportTable: React.FC<R18ReportTableProps> = ({
  onPageChange,
  onPageSizeChange,
  pageSize,
}) => {
  const { r19Report, getR19DataLoading } = useAppSelector(
    (state) => state.report
  );
  const gridRef = useRef<AgGridReact>(null);

  const qaKeys = useMemo(() => {
    const keys = new Set<string>();
    (r19Report?.data || []).forEach((row: any) => {
      (row.qA || []).forEach((qaObj: any) => {
        Object.keys(qaObj).forEach((key) => keys.add(key));
      });
    });
    return Array.from(keys);
  }, [r19Report?.data]);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "#",
        field: "id",
        valueGetter: "node.rowIndex+1",
        maxWidth: 100,
      },
      {
        field: "imei",
        headerName: "IMEI",
        minWidth: 180,
      },
      {
        field: "serial",
        headerName: "Serial No.",
        minWidth: 180,
      },
      {
        field: "insert_dt",
        headerName: "Insert Date",
        minWidth: 180,
        valueFormatter: (params) => {
          if (!params.value) return "--";
          const date = new Date(params.value);
          return date.toLocaleString();
        },
      },
       {
        field: "insert_by",
        headerName: "Insert By",
        minWidth: 200,
      },
      {
        field: "remark",
        headerName: "Remark",
        minWidth: 180,
      },
      {
        field: "txnId",
        headerName: "Txn ID",
        minWidth: 180,
      },
      ...(qaKeys || []).map((qaKey: string) => ({
        field: `qa_${qaKey}`,
        headerName: qaKey,
        minWidth: 170,
        valueGetter: (params: any) => {
          const qA = params.data.qA || [];
          const found = qA.find((qaObj: any) => qaObj.hasOwnProperty(qaKey));
          return found ? found[qaKey] : "No";
        },
      })),
    ],
    [qaKeys]
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
        <div className="relative ag-theme-quartz h-[calc(100vh-160px)]">
          <AgGridReact
            ref={gridRef}
            loadingOverlayComponent={CustomLoadingOverlay}
            loading={getR19DataLoading}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            suppressCellFocus={true}
            rowData={r19Report?.data || []}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            enableCellTextSelection={true}
            tooltipShowDelay={0}
            tooltipHideDelay={2000}
          />
        </div>
      </div>
      {r19Report && (
        <CustomPagination
          currentPage={r19Report?.pagination?.currentPage}
          totalPages={r19Report?.pagination?.totalPages}
          totalRecords={r19Report?.pagination?.totalItems}
          onPageChange={onPageChange}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
};

export default R19ReportTable;
