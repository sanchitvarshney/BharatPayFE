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
  const { r2ReportDetail, r2ReportDetailLoading } = useAppSelector((state) => state.report);

 const columnDefs: ColDef[] = [
    { headerName: "#", field: "id", sortable: true, filter: true, width: 100, valueGetter: "node.rowIndex+1" },
    { headerName: "Part Code", field: "partNo", sortable: true, filter: true, width:200 },
    { headerName: "Part Name", field: "name", sortable: true, filter: true, flex: 1 },
    { headerName: "Qty", field: "qty", sortable: true, filter: true, width:100 },
    { headerName: "Location", field: "consumelocation", sortable: true, filter: true, flex: 1 },
    { headerName: "Remark", field: "remark", sortable: true, filter: true, flex: 1 },
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
          loading={r2ReportDetailLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r2ReportDetail ? r2ReportDetail.data : []}
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
