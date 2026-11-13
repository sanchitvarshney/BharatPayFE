import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import {
  leftAlignedColumn,
  rightAlignedCellStyle,
  rightAlignedColumn,
} from "@/utils/agGridAlignUtils";
import {
  R26_GRID_CLASS,
  r26DefaultColDef,
  r26ExcelStyles,
  totalRowClass,
} from "./r26GridShared";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

type ApiColumn = { key: string; label: string };

export const CLEANING_TEXT_COLUMNS = ["part_no", "part_name"];

export const getCleaningQtyKeys = (columns: ApiColumn[] = []) =>
  columns.map((c) => c.key).filter((key) => !CLEANING_TEXT_COLUMNS.includes(key));

// Wrap long cell values and header labels instead of truncating them.
const defaultColDef: ColDef = {
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

const leftCol = { ...leftAlignedColumn, cellStyle: { ...leftAlignedColumn.cellStyle, ...wrapStyle } };
const rightCol = { ...rightAlignedColumn, cellStyle: { ...rightAlignedCellStyle, ...wrapStyle } };

const rowTotal =(row: any, qtyKeys: string[]) =>
  qtyKeys.reduce((sum, key) => sum + (Number(row?.[key]) || 0), 0);

const CleaningSummaryTable: React.FC<Props> = ({ gridRef }) => {
  const { cleaningSummaryReport, cleaningSummaryReportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );
  const columns: ApiColumn[] = cleaningSummaryReport?.columns || [];
  const rows: any[] = cleaningSummaryReport?.data || [];

  const qtyKeys = useMemo(() => getCleaningQtyKeys(columns), [columns]);

  const columnDefs = useMemo<ColDef[]>(() => {
    const defs: ColDef[] = columns.map(({ key, label }) => {
      if (key === "part_no") {
        return { headerName: label, field: key, pinned: "left", width: 110, ...leftCol };
      }
      if (key === "part_name") {
        return {
          headerName: label,
          field: key,
          pinned: "left",
          width: 220,
          tooltipField: key,
          ...leftCol,
        };
      }
      return { headerName: label, field: key, minWidth: 120, flex: 1, ...rightCol };
    });
    if (qtyKeys.length) {
      defs.push({
        headerName: "Total",
        colId: "total",
        pinned: "right",
        width: 110,
        ...rightCol,
        cellStyle: { ...rightCol.cellStyle, fontWeight: 600 },
        valueGetter: (params) => rowTotal(params.data, qtyKeys),
      });
    }
    return defs;
  }, [columns, qtyKeys]);

  const pinnedBottomRowData = useMemo(() => {
    if (!rows.length) return [];
    const totals: Record<string, any> = { part_no: "Total", part_name: "" };
    qtyKeys.forEach((key) => {
      totals[key] = rows.reduce((sum, row) => sum + (Number(row?.[key]) || 0), 0);
    });
    return [totals];
  }, [rows, qtyKeys]);

  return (
    <div className={R26_GRID_CLASS}>
      <AgGridReact
        ref={gridRef}
        loadingOverlayComponent={CustomLoadingOverlay}
        loading={cleaningSummaryReportLoading}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={rows}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        excelStyles={r26ExcelStyles}
        pinnedBottomRowData={pinnedBottomRowData}
        getRowClass={totalRowClass}
        pagination={false}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default CleaningSummaryTable;
