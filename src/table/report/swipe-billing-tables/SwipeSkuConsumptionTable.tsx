import React, { memo, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import CustomPagination from "@/components/reusable/CustomPagination";
import { flexCellStyle, formatNumber } from "@/utils/agGridSummaryCellUtils";

type Props = {
  data: any;
  loading: boolean;
  handlePageChange: (page: number) => void;
  pageSize: number;
};

const numericCellStyle = flexCellStyle("right");

const baseColumnDefs: ColDef[] = [
  {
    headerName: "#",
    colId: "index",
    width: 80,
    pinned: "left",
    valueGetter: "node.rowIndex+1",
  },
  { headerName: "Serial No", field: "serial_no", width: 170, pinned: "left" },
  { headerName: "SKU", field: "device_sku", width: 110 },
  { headerName: "IMEI No 1", field: "imei_no1", width: 160 },
  { headerName: "IMEI No 2", field: "imei_no2", width: 160 },
  { headerName: "Issue Txn ID", field: "issue_txn_id", width: 170 },
  { headerName: "MFG Txn ID", field: "mfg_txn_id", width: 140 },
  { headerName: "Dispatch Date", field: "dispatch_date", width: 180 },
];

const EMPTY_ROWS: any[] = [];

const SwipeSkuConsumptionTable: React.FC<Props> = ({
  data,
  loading,
  handlePageChange,
  pageSize,
}) => {
  const rowData = useMemo(() => data?.data ?? EMPTY_ROWS, [data?.data]);

  const columnDefs = useMemo<ColDef[]>(() => {
    const headers: string[] = data?.headers ?? [];
    // Header names contain dots/quotes, so read them with valueGetter instead of `field`.
    const componentCols: ColDef[] = headers.map((header) => ({
      headerName: header,
      colId: header,
      width: 200,
      valueGetter: (params) => params.data?.[header],
      valueFormatter: (params) => formatNumber(params.value),
      cellStyle: numericCellStyle,
      headerClass: "ag-right-aligned-header",
      headerTooltip: header,
    }));
    return [...baseColumnDefs, ...componentCols];
  }, [data?.headers]);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      filter: true,
      sortable: true,
      resizable: true,
      cellStyle: flexCellStyle("left"),
    }),
    [],
  );

  const pagination = data?.pagination;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="relative ag-theme-quartz flex-1 min-h-0">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={loading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableCellTextSelection={true}
        />
      </div>
      {pagination && (
        <CustomPagination
          currentPage={pagination.currentPage ?? pagination.page ?? 0}
          totalPages={pagination.totalPages ?? pagination.total_pages ?? 0}
          totalRecords={
            pagination.totalRecords ?? pagination.total_records ?? 0
          }
          onPageChange={handlePageChange}
          isLimit={false}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export default memo(SwipeSkuConsumptionTable);
