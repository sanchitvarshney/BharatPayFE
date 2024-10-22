import React, { useMemo, useState, useEffect } from "react";
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

// Register required modules with ag-Grid
ModuleRegistry.registerModules([ClientSideRowModelModule, ColumnsToolPanelModule, MasterDetailModule, MenuModule]);

const R2ReportDetail: React.FC = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const { r2ReportDetail, r2ReportDetailLoading } = useAppSelector((state) => state.report);
  // State for rowData
  const [rowData, setRowData] = useState<any[]>([]);

  useEffect(() => {
    if (r2ReportDetail) {
      const transformedData = r2ReportDetail.data.map((item: any) => ({
        device: item.device,
        imei: item.device, // You might need to adjust this if IMEI is not directly provided
        model: item.deviceModel,
        dropLocation: item.putLocation,
        children: item.deviceIssues.map((issue: any) => ({
          issueName: issue.issueLabel,
          isIssueValid: issue.name || "No", // or however you want to determine validity
          usedPartcode: issue.partNo || "--",
          partcodeQty: issue.qty || 0,
          remark: issue.remark || "--",
        })),
      }));
      setRowData(transformedData);
    }
  }, [r2ReportDetail]);

  // Master table columns
  const [columnDefs] = useState<ColDef[]>([
    { field: "device", headerName: "Device", cellRenderer: "agGroupCellRenderer" },
    { field: "imei", headerName: "IMEI Number" },
    { field: "model", headerName: "Model Number" },
    { field: "dropLocation", headerName: "Drop Location" },
  ]);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
    }),
    []
  );

  // Detail (child) table columns and configuration
  const detailCellRendererParams = useMemo<any>(
    () => ({
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
      getDetailRowData: (params: any) => {
        params.successCallback(params.data.children);
      },
    }),
    []
  );

  const rowClassRules = useMemo(
    () => ({
      "row-opened": (params: any) => params.node.expanded, // Apply class if row is expanded
    }),
    []
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className={"ag-theme-quartz"}>
        <AgGridReact
          loading={r2ReportDetailLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
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
