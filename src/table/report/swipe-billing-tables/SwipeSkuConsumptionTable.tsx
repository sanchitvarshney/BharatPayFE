import React, { memo, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import CustomPagination from "@/components/reusable/CustomPagination";
import { formatNumber } from "@/utils/agGridSummaryCellUtils";
import {
  centerAlignedColumn,
  leftAlignedColumn,
  rightAlignedColumn,
} from "@/utils/agGridAlignUtils";

type Props = {
  data: any;
  loading: boolean;
  handlePageChange: (page: number) => void;
  pageSize: number;
};

// No header (three-dot) menu, no filters; cells and headers wrap instead of truncating.
const defaultColDef: ColDef = {
  filter: false,
  sortable: true,
  resizable: true,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
  wrapText: true,
  autoHeight: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
};

const baseColumnDefs: ColDef[] = [
  {
    headerName: "#",
    colId: "index",
    width: 80,
    pinned: "left",
    valueGetter: "node.rowIndex+1",
    ...centerAlignedColumn,
  },
  { headerName: "Serial No", field: "serial_no", width: 170, pinned: "left", ...leftAlignedColumn },
  { headerName: "SKU", field: "device_sku", width: 110, ...centerAlignedColumn },
  { headerName: "IMEI No 1", field: "imei_no1", width: 160, ...leftAlignedColumn },
  { headerName: "IMEI No 2", field: "imei_no2", width: 160, ...leftAlignedColumn },
  { headerName: "Issue Txn ID", field: "issue_txn_id", width: 170, ...leftAlignedColumn },
  { headerName: "MFG Txn ID", field: "mfg_txn_id", width: 140, ...leftAlignedColumn },
  { headerName: "Dispatch Date", field: "dispatch_date", width: 180, ...leftAlignedColumn },
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
      ...rightAlignedColumn,
      headerTooltip: header,
    }));
    return [...baseColumnDefs, ...componentCols];
  }, [data?.headers]);

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
