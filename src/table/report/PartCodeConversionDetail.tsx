import React, { useMemo } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ColDef, ModuleRegistry } from "@ag-grid-community/core";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { MasterDetailModule } from "@ag-grid-enterprise/master-detail";
import { MenuModule } from "@ag-grid-enterprise/menu";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppSelector } from "@/hooks/useReduxHook";
ModuleRegistry.registerModules([ClientSideRowModelModule, ColumnsToolPanelModule, MasterDetailModule, MenuModule]);
const R2ReportDetail: React.FC = () => {
  const { partCodeConvDetailLoading, partCodeConvDetailData } = useAppSelector((state) => state.report);

 const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "srNo",
      sortable: true,
      filter: true,
      valueGetter: "node.rowIndex + 1",
      maxWidth: 80,
    },
    { headerName: "Part Code", field: "partNo_no", sortable: true, filter: true },
    { headerName: "Component Name", field: "partName", sortable: true, filter: true },
    { headerName: "Qty", field: "qty", sortable: true, filter: true },
    { headerName: "Pick Location", field: "pickLocation", sortable: true, filter: true },
    {
      headerName: "Date",
      field: "date",
      sortable: true,
      filter: true,
    },
    {
      headerName: "User Name",
      field: "userName",
      sortable: true,
      filter: true,
    },
  ];

 
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
          loading={partCodeConvDetailLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={partCodeConvDetailData }
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </div>
  );
};

export default R2ReportDetail;
