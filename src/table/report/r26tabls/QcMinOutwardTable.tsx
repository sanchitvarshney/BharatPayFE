import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { Typography } from "@mui/material";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

const columnDefs: ColDef[] = [
  {
    headerName: "#",
    field: "id",
    sortable: true,
    filter: true,
    width: 120,
    valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
  },
  {
    headerName: "Model",
    field: "model",
    sortable: true,
    filter: true,
    width: 180,
  },
  {
    headerName: "SKU",
    field: "sku",
    sortable: true,
    filter: true,
    width: 180,
  },
  {
    headerName: "Product Name",
    field: "product_name",
    sortable: true,
    filter: true,
    width: 260,
  },
   {
    headerName: "AWB Scan",
    field: "awb_scan",
    sortable: true,
    filter: true,
    width: 150,
         headerClass: "ag-right-aligned-header",
          cellStyle: { textAlign: "right" },
  },
  {
    headerName: "Inward",
    field: "inward",
    sortable: true,
    filter: true,
    width: 150,
         headerClass: "ag-right-aligned-header",
          cellStyle: { textAlign: "right" },
  },
  {
    headerName: "Outward",
    field: "outward",
    sortable: true,
    filter: true,
    width: 150,
         headerClass: "ag-right-aligned-header",
          cellStyle: { textAlign: "right" },
  },
  {
    headerName: "Partial MIN",
    field: "partial_min",
    sortable: true,
    filter: true,
    width: 180,
         headerClass: "ag-right-aligned-header",
          cellStyle: { textAlign: "right" },
  },
  {
    headerName: "Device Image",
    field: "device_img",
    sortable: false,
    filter: false,
    width: 160,
    cellRenderer: (params: any) => {
      if (!params.value) return "-";
      return (
       <Typography variant="body2" className="text-slate-500">
            {params.value}
       
        </Typography>
      );
    },
  },
];

const NUMERIC_COLUMNS = ["awb_scan", "inward", "outward", "partial_min"];

const QcMinOutwardTable: React.FC<Props> = ({ gridRef }) => {
  const { qcminreport, qcminreportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
      sortable: true,
      resizable: true,
    };
  }, []);

  const sideBar = useMemo(
    () => ({
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
          toolPanelParams: {
            suppressPivotMode: true,
            suppressPivots: true,
          },
        },
      ],
      defaultToolPanel: "",
    }),
    [],
  );

  const pinnedBottomRowData = useMemo(() => {
    const data: any[] = qcminreport?.data || [];
    if (!data.length) return [];

    const totals: Record<string, any> = { model: "Grand Total" };
    NUMERIC_COLUMNS.forEach((col) => {
      totals[col] = data.reduce((sum, row) => sum + (Number(row[col]) || 0), 0);
    });

    return [totals];
  }, [qcminreport]);

  return (
    <div>
      <div className="relative ag-theme-quartz workers-report-grid qc-report-grid h-[calc(100vh-150px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={qcminreportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          suppressMenuHide={true}
          rowData={qcminreport?.data || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          sideBar={sideBar}
          pinnedBottomRowData={pinnedBottomRowData}
          getRowClass={(params) =>
            params.node?.rowPinned === "bottom" ? "wr-total-row" : undefined
          }
          pagination={true}
          paginationPageSize={50}
          enableCellTextSelection={true}
        />
      </div>
    </div>
  );
};

export default QcMinOutwardTable;
