import React, { memo, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import CustomPagination from "@/components/reusable/CustomPagination";
import { useAppSelector } from "@/hooks/useReduxHook";
import { centerAlignedColumn, leftAlignedColumn } from "@/utils/agGridAlignUtils";

type Props = {
  handlePageChange: (page: number) => void;
  pageSize: number;
};

const defaultColDef: ColDef = {
  filter: true,
  sortable: true,
  resizable: true,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: false,
  wrapText: true,
  autoHeight: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
};

const columnDefs: ColDef[] = [
  { headerName: "#", colId: "index", width: 80, valueGetter: "node.rowIndex+1", ...centerAlignedColumn },
  { headerName: "Serial No", field: "serial_number", width: 170, ...leftAlignedColumn },
  { headerName: "IMEI No 1", field: "imei_no1", width: 160, ...leftAlignedColumn },
  { headerName: "IMEI No 2", field: "imei_no2", width: 160, ...leftAlignedColumn },
  { headerName: "Device Model", field: "device_model", width: 190, ...leftAlignedColumn },
  { headerName: "SKU", field: "device_sku", width: 110, ...centerAlignedColumn },
  { headerName: "Device Type", field: "device_type", width: 130, ...leftAlignedColumn },
  { headerName: "Transaction ID", field: "transaction_id", width: 180, ...leftAlignedColumn },
  { headerName: "From Branch", field: "from_branch", width: 150, ...leftAlignedColumn },
  { headerName: "To Branch", field: "to_branch", width: 150, ...leftAlignedColumn },
  { headerName: "Dispatch Date", field: "dispatch_date", width: 180, ...leftAlignedColumn },
];

const EMPTY_ROWS: any[] = [];

const SwipeDispatchTable: React.FC<Props> = ({ handlePageChange, pageSize }) => {
  const { dispatchData, dispatchLoading } = useAppSelector(
    (state) => state.swipeBilling,
  );

  const rowData = useMemo(
    () => dispatchData?.data ?? EMPTY_ROWS,
    [dispatchData?.data],
  );

  const pagination = dispatchData?.pagination;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="relative ag-theme-quartz flex-1 min-h-0">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={dispatchLoading}
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
          currentPage={pagination.page || 0}
          totalPages={pagination.total_pages || 0}
          totalRecords={pagination.total_records || 0}
          onPageChange={handlePageChange}
          isLimit={false}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export default memo(SwipeDispatchTable);
