import React, { memo, RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import CustomPagination from "@/components/reusable/CustomPagination";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  pageSize: number;
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
    field: "serial_no",
    sortable: true,
    width: 180,
  },
  {
    headerName: "IMEI No",
    field: "imei_no",
    sortable: true,
    width: 450,
  },
  {
    headerName: "Date",
    field: "date",
    sortable: true,
    width: 180,
  },
  {
    headerName: "Device Type",
    field: "device_type",
    sortable: true,
    width: 250,
  },
];

const EMPTY_ROWS: unknown[] = [];

const DispatcedTable: React.FC<Props> = ({
  gridRef,
  handlePageChange,
  handlePageSizeChange,
  pageSize,
}) => {
  const r3reportLoading = useAppSelector((state) => state.report.r3reportLoading);
  const r3report = useAppSelector((state) => state.report.r3report);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  const rowData = useMemo(() => r3report?.data ?? EMPTY_ROWS, [r3report?.data]);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-160px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={r3reportLoading}
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
      {r3report && (
        <CustomPagination
          currentPage={r3report?.pagination?.currentPage}
          totalPages={r3report?.pagination?.totalPages}
          totalRecords={r3report?.pagination?.totalRecords}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export default memo(DispatcedTable);
