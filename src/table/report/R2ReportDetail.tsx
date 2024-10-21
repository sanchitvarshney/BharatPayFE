import React, { useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ColDef, IDetailCellRendererParams, ModuleRegistry } from "@ag-grid-community/core";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { MasterDetailModule } from "@ag-grid-enterprise/master-detail";
import { MenuModule } from "@ag-grid-enterprise/menu";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";

// Register required modules with ag-Grid
ModuleRegistry.registerModules([ClientSideRowModelModule, ColumnsToolPanelModule, MasterDetailModule, MenuModule]);

const R2ReportDetail: React.FC = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  // Master table data
  const [rowData] = useState<any[]>([
    {
      device: "Device A",
      imei: "123456789012345",
      model: "Model X",
      dropLocation: "Location 1",
      children: [
        {
          issueName: "Battery Issue",
          isIssueValid: "Yes",
          usedPartcode: "BP1234",
          partcodeQty: 2,
          remark: "Replaced battery",
        },
      ],
    },
    {
      device: "Device B",
      imei: "987654321098765",
      model: "Model Y",
      dropLocation: "Location 2",
      children: [
        {
          issueName: "Screen Crack",
          isIssueValid: "No",
          usedPartcode: "SC5678",
          partcodeQty: 1,
          remark: "Screen damaged, not replaced",
        },
      ],
    },
  ]);

  // Master table columns
  const [columnDefs] = useState<ColDef[]>([
    { field: "device", headerName: "Device", cellRenderer: "agGroupCellRenderer" },
    { field: "imei", headerName: "IMEI Number" },
    { field: "model", headerName: "Model Number" },
    { field: "dropLocation", headerName: "Drop Location" },
  ]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
    };
  }, []);

  // Detail (child) table columns and configuration
  const detailCellRendererParams = useMemo<any>(() => {
    return {
      // Level 2 grid options (child grid)
      detailGridOptions: {
        columnDefs: [
          { field: "issueName", headerName: "Issue Name" },
          { field: "isIssueValid", headerName: "Is Issue Valid" },
          { field: "usedPartcode", headerName: "Used Partcode" },
          { field: "partcodeQty", headerName: "Partcode Qty" },
          { field: "remark", headerName: "Remark" },
        ],
        defaultColDef: {
          flex: 1,
        },
      },
      // Function to retrieve the child row data
      getDetailRowData: (params) => {
        params.successCallback(params.data.children);
      },
    } as IDetailCellRendererParams;
  }, []);
  const rowClassRules = useMemo(() => {
    return {
      "row-opened": (params: any) => params.node.expanded, // Apply class if row is expanded
    };
  }, []);
  return (
    <div style={containerStyle}>
      <div style={gridStyle} className={"ag-theme-quartz"}>
        <AgGridReact
        loadingOverlayComponent={CustomLoadingOverlay}
          suppressCellFocus={true}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          groupDefaultExpanded={0} // Collapses all child rows by default
          masterDetail={true}
          detailCellRendererParams={detailCellRendererParams}
          pagination={true}
          rowClassRules={rowClassRules}
        />
      </div>
    </div>
  );
};

export default R2ReportDetail;
