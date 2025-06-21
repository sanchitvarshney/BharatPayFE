import React, { RefObject, useMemo } from "react";
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

const columnDefs: ColDef[] = [
  {
    headerName: "#",
    field: "id",
    valueGetter: "node.rowIndex+1",
    maxWidth: 100,
  },
  {
    headerName: "IMEI",
    field: "imei",
    sortable: true,
    filter: true,
    width: 150,
  },
  { headerName: "Serial", field: "serial", sortable: true, filter: true },
  { headerName: "Issue", field: "issue", sortable: true, filter: true },
  {
    headerName: "Resolve Status",
    field: "resolveStatus",
    sortable: true,
    filter: true,
  },
  {
    headerName: "Submit Date",
    field: "submitDt",
    sortable: true,
    filter: true,
  },
  {
    headerName: "Submit Remark",
    field: "submitRemark",
    sortable: true,
    filter: true,
  },
  {
    headerName: "Resolution Date",
    field: "resDt",
    sortable: true,
    filter: true,
  },
  {
    headerName: "Resolution Remark",
    field: "resRemark",
    sortable: true,
    filter: true,
  },
];

const R11ReportTable: React.FC<Props> = ({
  gridRef,
  handlePageChange,
  handlePageSizeChange,
  pageSize,
}) => {
  const { r11Report, r11ReportLoading } = useAppSelector(
    (state) => state.report
  );
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-160px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={r11ReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r11Report?.data || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={false}
          enableCellTextSelection
        />
      </div>
      {r11Report && (
        <CustomPagination
          currentPage={r11Report?.pagination?.currentPage as any}
          totalPages={r11Report?.pagination?.totalPages as any}
          totalRecords={r11Report?.pagination?.totalRecords as any}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export default R11ReportTable;
