import React, { memo, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import CustomPagination from "@/components/reusable/CustomPagination";
import { useAppSelector } from "@/hooks/useReduxHook";
import { flexCellStyle } from "@/utils/agGridSummaryCellUtils";

type Props = {
  handlePageChange: (page: number) => void;
  pageSize: number;
};

const columnDefs: ColDef[] = [
  { headerName: "#", colId: "index", width: 80, valueGetter: "node.rowIndex+1" },
  { headerName: "Serial No", field: "serial_number", width: 170 },
  { headerName: "IMEI No 1", field: "imei_no1", width: 160 },
  { headerName: "IMEI No 2", field: "imei_no2", width: 160 },
  { headerName: "Device Model", field: "device_model", width: 190 },
  { headerName: "SKU", field: "device_sku", width: 110 },
  { headerName: "Device Type", field: "device_type", width: 130 },
  { headerName: "Transaction ID", field: "transaction_id", width: 180 },
  { headerName: "From Branch", field: "from_branch", width: 150 },
  { headerName: "To Branch", field: "to_branch", width: 150 },
  { headerName: "Dispatch Date", field: "dispatch_date", width: 180 },
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

  const defaultColDef = useMemo<ColDef>(
    () => ({
      filter: true,
      sortable: true,
      resizable: true,
      cellStyle: flexCellStyle("left"),
    }),
    [],
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
