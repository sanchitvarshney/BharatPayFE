import { ColDef, ExcelStyle } from "@ag-grid-community/core";

export const TRC_FIXED_COLUMNS = ["empCode", "department", "total"];
export const DEPARTMENT_FIXED_COLUMNS = ["department", "total"];
export const QC_NUMERIC_COLUMNS = ["awb_scan", "inward", "outward", "partial_min"] as const;

export const R26_GRID_CLASS = "relative ag-theme-quartz r26-grid h-[560px] lg:h-full";

export const r26DefaultColDef: ColDef = {
  filter: false,
  suppressHeaderFilterButton: true,
  sortable: true,
  resizable: true,
  
  cellClassRules: {
    "grand-total-cell": (params) => params.node.rowPinned === "bottom",
  },
};

export const r26SideBar = {
  toolPanels: [
    {
      id: "columns",
      labelDefault: "Columns",
      labelKey: "columns",
      iconKey: "columns",
      toolPanel: "agColumnsToolPanel",
      toolPanelParams: { suppressPivotMode: true, suppressPivots: true },
    },
  ],
  defaultToolPanel: "",
};

export const r26ExcelStyles: ExcelStyle[] = [
  {
    id: "header",
    interior: { color: "#305496", pattern: "Solid" },
    font: { color: "#FFFFFF", bold: true },
    alignment: { horizontal: "Center" },
  },
  {
    id: "grand-total-cell",
    interior: { color: "#FFFF00", pattern: "Solid" },
    font: { bold: true },
  },
];

export const numericCol = (
  headerName: string,
  field: string,
  width = 140,
  bold = false,
): ColDef => ({
  headerName,
  field,
  width,
  headerClass: "ag-right-aligned-header",
  cellStyle: { textAlign: "right", fontWeight: bold ? 600 : 400 },
});

export const rowIndexCol: ColDef = {
  headerName: "#",
  sortable: false,
  filter: false,
  width: 70,
  valueGetter: (params) =>
    params.node?.rowPinned ? "" : (params.node?.rowIndex ?? 0) + 1,
};

export const totalRowClass = (params: { node?: { rowPinned?: string | null } }) =>
  params.node?.rowPinned === "bottom" ? "r26-total-row" : undefined;
