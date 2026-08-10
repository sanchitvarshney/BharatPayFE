import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
// import CustomPagination from "@/components/reusable/CustomPagination";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};
// Dummy data

const columnDefs: ColDef[] = [
  {
    headerName: "#",
    field: "id",
    sortable: true,
    filter: true,
    width: 100,
    valueGetter: "node.rowIndex+1",
  },
  {
    headerName: "IMEI",
    field: "IMEI",
    sortable: true,
    filter: true,
    width: 220,
  },
  {
    headerName: "Serial No",
    field: "SERIAL",
    sortable: true,
    filter: true,
    width: 220,
  },
  {
    headerName: "Model",
    field: "MODEL",
    sortable: true,
    filter: true,
    width: 290,
  },
  {
    headerName: "Created By",
    field: "insertBy",
    sortable: true,
    filter: true,
    width: 200,
  },
  {
    headerName: "Created Date",
    field: "insertDate",
    sortable: true,
    filter: true,
    width: 200,
  },
];

const R25ReportTable: React.FC<Props> = ({ gridRef }) => {
  const { r25reportLoading, r25report } = useAppSelector(
    (state) => state.report,
  );
  // Simulate data loading

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
          loading={r25reportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r25report?.data || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={false}
          paginationPageSize={20}
          enableCellTextSelection={true}
        />
      </div>
    </div>
  );
};

export default R25ReportTable;
