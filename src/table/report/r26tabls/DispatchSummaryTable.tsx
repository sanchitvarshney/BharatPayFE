import React, { RefObject, useMemo } from "react";
import { ColDef, ColGroupDef, RowClassParams } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import {
  R26_GRID_CLASS,
  r26ExcelStyles,
  r26WrapColDef,
  r26WrapLeftCol as leftCol,
  r26WrapRightCol as rightCol,
  totalRowClass,
} from "./r26GridShared";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

type DispatchModel = {
  sku: string;
  model_name: string;
  total_qty: number;
  dispatched_qty: number;
  pending_qty: number;
};

type DispatchCategory = {
  models: DispatchModel[];
  total: number;
  dispatched: number;
  pending: number;
};

type Period = "range" | "month";
const PERIODS: Period[] = ["range", "month"];
const METRICS = [
  { suffix: "total", label: "Total", modelKey: "total_qty", catKey: "total" },
  { suffix: "dispatched", label: "Dispatched", modelKey: "dispatched_qty", catKey: "dispatched" },
  { suffix: "pending", label: "Pending", modelKey: "pending_qty", catKey: "pending" },
] as const;

const CATEGORIES = [
  { key: "speaker", label: "Soundbox" },
  { key: "swipe", label: "Swipe" },
] as const;

const toDisplayDate = (iso?: string) => (iso ? iso.split("-").reverse().join("-") : "");

const emptyMetrics = () =>
  Object.fromEntries(
    PERIODS.flatMap((p) => METRICS.map((m) => [`${p}_${m.suffix}`, 0])),
  ) as Record<string, number>;

// Merge selected-range and current-month models by SKU, add a subtotal row per
// category, and return the grand total for the pinned bottom row.
export const buildDispatchRows = (report: any) => {
  const rows: any[] = [];
  const grand: Record<string, any> = { category: "Grand Total", ...emptyMetrics() };

  CATEGORIES.forEach(({ key, label }) => {
    const sources: Record<Period, DispatchCategory | undefined> = {
      range: report?.selectedRange?.[key],
      month: report?.currentMonth?.[key],
    };
    const bySku = new Map<string, any>();

    PERIODS.forEach((period) => {
      sources[period]?.models?.forEach((model) => {
        const row =
          bySku.get(model.sku) ??
          { category: label, sku: model.sku, model_name: model.model_name, ...emptyMetrics() };
        METRICS.forEach((m) => {
          row[`${period}_${m.suffix}`] = Number(model[m.modelKey]) || 0;
        });
        bySku.set(model.sku, row);
      });
    });

    if (!bySku.size) return;

    const subtotal: Record<string, any> = {
      category: `${label} Total`,
      isSubtotal: true,
      ...emptyMetrics(),
    };
    PERIODS.forEach((period) =>
      METRICS.forEach((m) => {
        const field = `${period}_${m.suffix}`;
        subtotal[field] = Number(sources[period]?.[m.catKey]) || 0;
        grand[field] += subtotal[field];
      }),
    );

    rows.push(...bySku.values(), subtotal);
  });

  return { rows, grandTotal: rows.length ? [grand] : [] };
};

const metricCols = (period: Period): ColDef[] =>
  METRICS.map((m) => ({
    headerName: m.label,
    field: `${period}_${m.suffix}`,
    minWidth: 110,
    flex: 1,
    ...rightCol,
    cellStyle:
      m.suffix === "pending"
        ? (params: any) =>
            Number(params.value) > 0
              ? { ...rightCol.cellStyle, color: "#b45309", fontWeight: 600 }
              : rightCol.cellStyle
        : rightCol.cellStyle,
  }));

const getRowStyle = (params: RowClassParams) =>
  params.data?.isSubtotal ? { fontWeight: 600, background: "#f1f5f9" } : undefined;

const DispatchSummaryTable: React.FC<Props> = ({ gridRef }) => {
  const { dispatchSummaryReport, dispatchSummaryReportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );

  const { rows, grandTotal } = useMemo(
    () => buildDispatchRows(dispatchSummaryReport),
    [dispatchSummaryReport],
  );

  const columnDefs = useMemo<(ColDef | ColGroupDef)[]>(() => {
    const range = dispatchSummaryReport?.selectedRange;
    const from = toDisplayDate(range?.fromDate);
    const to = toDisplayDate(range?.toDate);
    const rangeLabel = from ? `Selected Range (${from === to ? from : `${from} to ${to}`})` : "Selected Range";
    const month = dispatchSummaryReport?.currentMonth?.month;

    return [
      { headerName: "Category", field: "category", pinned: "left", width: 140, ...leftCol },
      { headerName: "SKU", field: "sku", pinned: "left", width: 110, ...leftCol },
      { headerName: "Model Name", field: "model_name", pinned: "left", width: 200, ...leftCol },
      { headerName: rangeLabel, headerClass: "ag-center-aligned-header", children: metricCols("range") },
      {
        headerName: month ? `Current Month (${month})` : "Current Month",
        headerClass: "ag-center-aligned-header",
        children: metricCols("month"),
      },
    ];
  }, [dispatchSummaryReport]);

  return (
    <div className={R26_GRID_CLASS}>
      <AgGridReact
        ref={gridRef}
        loadingOverlayComponent={CustomLoadingOverlay}
        loading={dispatchSummaryReportLoading}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={rows}
        columnDefs={columnDefs}
        // Sorting is off so subtotal rows stay under their category.
        defaultColDef={{ ...r26WrapColDef, sortable: false }}
        excelStyles={r26ExcelStyles}
        pinnedBottomRowData={grandTotal}
        getRowClass={totalRowClass}
        getRowStyle={getRowStyle}
        pagination={false}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default DispatchSummaryTable;
