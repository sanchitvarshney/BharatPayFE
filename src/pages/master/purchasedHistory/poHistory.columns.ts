import {
  ColDef,
  ValueGetterParams,
} from "@ag-grid-community/core";
import {
  PoHistoryFilterType,
  PoHistoryGroup,
  PoHistoryRecord,
} from "@/features/master/componentPercentage/componentPercentageType";
import StatusCellRenderer from "./StatusCellRenderer";
import { formatNumber, pendingCellStyle, rec, toNumber } from "./poHistory.utils";

// Right-align the cell AND the header (AG Grid ships both helper classes).
const rightAlign: Pick<ColDef, "headerClass" | "cellClass"> = {
  headerClass: "ag-right-aligned-header",
  cellClass: "ag-right-aligned-cell",
};

/** valueGetter from a record accessor, guarding the (rare) empty `data`. */
const get =
  (accessor: (r: PoHistoryRecord) => string | number, fallback: string | number = "-") =>
  (p: ValueGetterParams<PoHistoryRecord>) =>
    p.data ? accessor(p.data) : fallback;

const sumHistory = (
  params: ValueGetterParams<PoHistoryGroup>,
  accessor: (row: PoHistoryRecord) => string | number,
) =>
  (params.data?.purchase_history ?? []).reduce(
    (sum, row) => sum + toNumber(accessor(row)),
    0,
  );

const numberCol = (headerName: string, accessor: (r: PoHistoryRecord) => string | number): ColDef<PoHistoryRecord> => ({
  headerName,
  minWidth: 110,
  ...rightAlign,
  valueGetter: (p) => (p.data ? toNumber(accessor(p.data)) : 0),
  valueFormatter: (p) => formatNumber(p.value),
});

/* ---------------------------------- detail --------------------------------- */

const buildDetailColumns = (mode: PoHistoryFilterType): ColDef<PoHistoryRecord>[] => {
  const identity: ColDef<PoHistoryRecord>[] =
    mode === "vendor"
      ? [
          { headerName: "Part No.", minWidth: 120, valueGetter: get(rec.partNo) },
          { headerName: "Component", minWidth: 220, flex: 1, valueGetter: get(rec.componentName) },
        ]
      : [
          { headerName: "Vendor", minWidth: 200, flex: 1, valueGetter: get(rec.vendorName) },
          { headerName: "Vendor ID", minWidth: 120, valueGetter: get(rec.vendorId) },
        ];

  return [
    { headerName: "PO No.", minWidth: 180, cellClass: "font-semibold", valueGetter: get(rec.po) },
    ...identity,
    { headerName: "PO Date", minWidth: 120, valueGetter: get(rec.poDate) },
    { headerName: "Due Date", minWidth: 120, valueGetter: get(rec.dueDate) },
    { ...numberCol("Order Qty", rec.qty), minWidth: 120 },
    {
      ...numberCol("Pending Qty", rec.pendingQty),
      minWidth: 120,
      cellStyle: (p) => pendingCellStyle(p.value),
    },
    numberCol("Rate", rec.rate),
    {
      headerName: "GST %",
      minWidth: 90,
      ...rightAlign,
      valueGetter: get(rec.gstRate, ""),
      valueFormatter: (p) => (p.value ? `${p.value}%` : "-"),
    },
    { headerName: "HSN", minWidth: 110, valueGetter: get(rec.hsn) },
    {
      headerName: "Status",
      minWidth: 120,
      valueGetter: get(rec.status, ""),
      cellRenderer: StatusCellRenderer,
    },
  ];
};

/* ---------------------------------- master --------------------------------- */

const totalsColumns: ColDef<PoHistoryGroup>[] = [
  {
    headerName: "Total Ordered",
    minWidth: 140,
    ...rightAlign,
    valueGetter: (p) => sumHistory(p, rec.qty),
    valueFormatter: (p) => formatNumber(p.value),
  },
  {
    headerName: "Total Pending",
    minWidth: 140,
    ...rightAlign,
    valueGetter: (p) => sumHistory(p, rec.pendingQty),
    valueFormatter: (p) => formatNumber(p.value),
    cellStyle: (p) => ({ ...pendingCellStyle(p.value), textAlign: "right" }),
  },
];

const buildMasterColumns = (mode: PoHistoryFilterType): ColDef<PoHistoryGroup>[] => {
  if (mode === "vendor") {
    return [
      {
        headerName: "Vendor",
        cellRenderer: "agGroupCellRenderer",
        minWidth: 260,
        flex: 1,
        valueGetter: (p) => p.data?.vendor?.vendor_name ?? "-",
      },
      { headerName: "Vendor ID", minWidth: 140, valueGetter: (p) => p.data?.vendor?.vendor_id ?? "-" },
      ...totalsColumns,
    ];
  }

  return [
    {
      headerName: "Part No.",
      cellRenderer: "agGroupCellRenderer",
      minWidth: 170,
      cellClass: "font-semibold",
      valueGetter: (p) => p.data?.component?.part_no ?? "-",
    },
    { headerName: "Component", minWidth: 260, flex: 1, valueGetter: (p) => p.data?.component?.component_name ?? "-" },
    {
      headerName: "Status",
      minWidth: 120,
      valueGetter: (p) => (p.data?.component?.is_enabled === "Y" ? "Enabled" : "Disabled"),
      cellStyle: (p) => ({
        color: p.value === "Enabled" ? "#059669" : "#e11d48",
        fontWeight: 600,
      }),
    },
    ...totalsColumns,
  ];
};

// Column defs depend only on `mode` — build each variant once.
const masterCache = new Map<PoHistoryFilterType, ColDef<PoHistoryGroup>[]>();
const detailCache = new Map<PoHistoryFilterType, ColDef<PoHistoryRecord>[]>();

export const masterColumnDefs = (mode: PoHistoryFilterType) => {
  if (!masterCache.has(mode)) masterCache.set(mode, buildMasterColumns(mode));
  return masterCache.get(mode)!;
};

export const detailColumnDefs = (mode: PoHistoryFilterType) => {
  if (!detailCache.has(mode)) detailCache.set(mode, buildDetailColumns(mode));
  return detailCache.get(mode)!;
};

export const gridDefaultColDef: ColDef = { sortable: true, filter: true, resizable: true };
