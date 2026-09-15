import React, { memo, RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import CustomPagination from "@/components/reusable/CustomPagination";
import { flexCellStyle } from "@/utils/agGridSummaryCellUtils";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
  handlePageChange: (page: number) => void;
};
// Dummy data

const columnDefs: ColDef[] = [
  {
    headerName: "#",
    field: "id",
    sortable: true,
    width: 100,
    valueGetter: "node.rowIndex+1",
  },
  {
    headerName: "Serial No",
    field: "serial_number",
    sortable: true,
    width: 180,
  },
  {
    headerName: "IMEI No",
    field: "imei_number",
    sortable: true,
    width: 450,
  },
  {
    headerName: "Date",
    field: "dispatch_date",
    sortable: true,
    width: 180,
  },
];

const EMPTY_ROWS: unknown[] = [];

const DispatcedTable: React.FC<Props> = ({ gridRef, handlePageChange }) => {
  const { dispatchedData, dispatchedLoading } = useAppSelector(
    (state) => state.summary,
  );

  const tabValue = useAppSelector((state) => state.summary?.tabValue);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      cellStyle: flexCellStyle("left"),
    };
  }, []);

  const rowData = useMemo(
    () => dispatchedData?.data ?? EMPTY_ROWS,
    [dispatchedData?.data],
  );

  return (
    <div>
      <div
        className={`relative ag-theme-quartz ${tabValue === "preview" ? "h-[calc(100vh-210px)]" : "h-[calc(100vh-260px)]"}`}
      >
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={dispatchedLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={false}
          paginationPageSize={20}
          enableCellTextSelection={true}
        />
      </div>

      {dispatchedData?.pagination && (
        <CustomPagination
          currentPage={dispatchedData?.pagination?.page || 0}
          totalPages={dispatchedData?.pagination?.total_pages || 0}
          totalRecords={dispatchedData?.pagination?.total_records || 0}
          onPageChange={handlePageChange}
          isLimit={false}
          pageSize={10}
        />
      )}
    </div>
  );
};

export default memo(DispatcedTable);
