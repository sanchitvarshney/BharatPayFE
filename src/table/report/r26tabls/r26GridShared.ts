import { ColDef, ExcelStyle } from "@ag-grid-community/core";
import {
  leftAlignedColumn,
  rightAlignedCellStyle,
  rightAlignedColumn,
} from "@/utils/agGridAlignUtils";

export const TRC_FIXED_COLUMNS = ["empCode", "department", "total"];
export const DEPARTMENT_FIXED_COLUMNS = ["department", "total"];
export const QC_NUMERIC_COLUMNS = ["awb_scan", "inward", "outward", "partial_min"] as const;

export const R26_GRID_CLASS = "relative ag-theme-quartz r26-grid h-[560px] lg:h-full";

export const r26DefaultColDef: ColDef = {
  filter: false,
  suppressHeaderFilterButton: true,
  suppressHeaderMenuButton: true,
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

// Wrap long cell values and header labels instead of truncating them.
export const r26WrapColDef: ColDef = {
  ...r26DefaultColDef,
  wrapText: true,
  autoHeight: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
};

const wrapStyle = {
  lineHeight: "20px",
  paddingTop: 8,
  paddingBottom: 8,
  whiteSpace: "normal",
  wordBreak: "break-word",
} as const;

// Column-level cellStyle replaces the default one, so alignment + wrap are merged here.
export const r26WrapLeftCol = {
  ...leftAlignedColumn,
  cellStyle: { ...leftAlignedColumn.cellStyle, ...wrapStyle },
};

export const r26WrapRightCol = {
  ...rightAlignedColumn,
  cellStyle: { ...rightAlignedCellStyle, ...wrapStyle },
};
