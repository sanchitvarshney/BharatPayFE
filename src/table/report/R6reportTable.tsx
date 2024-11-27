import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";

type Props = {
  gridRef?: RefObject<AgGridReact<any>>;
};

const R6reportTable: React.FC<Props> = ({ gridRef }) => {
  const { r6Report, r6ReportLoading } = useAppSelector((state) => state.report);
  const columnDefs: ColDef[] = [
    { field: "#", headerName: "#", sortable: true, filter: true,valueGetter: "node.rowIndex+1", width: 70 },
    { field: "partCode", headerName: "Part Code", sortable: true, filter: true },
    { field: "componentName", headerName: "Component Name", sortable: true, filter: true },
    { field: "uom", headerName: "Unit", sortable: true, filter: true },
    { field: "qty", headerName: "QTY", sortable: true, filter: true },
    { field: "location", headerName: "Location", sortable: true, filter: true },
    { field: "rate", headerName: "Rate", sortable: true, filter: true },
    { field: "hsn", headerName: "HSN", sortable: true, filter: true },
    { field: "vendorCode", headerName: "Vendor Code", sortable: true, filter: true },
    { field: "vendorName", headerName: "Vendor Name", sortable: true, filter: true, minWidth: 300 },
    {
      field: "vendorAddress",
      headerName: "Vendor Address",
      sortable: true,
      filter: true,

      autoHeight: true,
      minWidth: 400,
    },
    {
      field: "insertDt",
      headerName: "Insert Date",
      sortable: true,
    },
    { field: "insertby", headerName: "Inserted By", sortable: true, filter: true },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);
  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-90px)]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          ref={gridRef}
          loading={r6ReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r6Report ? r6Report : []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </div>
  );
};

export default R6reportTable;
