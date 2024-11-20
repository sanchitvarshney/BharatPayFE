import React, { useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";

// Define new column definitions

// Generate dummy data according to pagination needs
const R5ReportDetail: React.FC = () => {
  const columnDefs: ColDef[] = [
    { headerName: "#", field: "id", sortable: false, filter: false, width: 100, valueGetter: "node.rowIndex+1" },

    { headerName: "IMEI/SR No.", field: "slNo", sortable: false, filter: false ,flex:1},
  ];
  const { r5reportDetail, r5reportDetailLoading } = useAppSelector((state) => state.report);

  const paginationPageSize = 20; // Define page size

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      sortable: true,
    };
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-50px)]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={r5reportDetailLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r5reportDetail ? r5reportDetail : []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={paginationPageSize}
        />
      </div>
    </div>
  );
};

export default R5ReportDetail;
