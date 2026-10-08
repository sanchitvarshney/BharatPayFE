import React, { RefObject, useMemo } from "react";
import { ColDef, ColGroupDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { sortHourColumns, sumBy } from "@/components/report/r26/reportUtils";
import {
  numericCol,
  R26_GRID_CLASS,
  r26DefaultColDef,
  r26ExcelStyles,
  r26SideBar,
  rowIndexCol,
  totalRowClass,
  TRC_FIXED_COLUMNS,
} from "./r26GridShared";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
  quickFilterText?: string;
};

const TrcHourlyTable: React.FC<Props> = ({ gridRef, quickFilterText }) => {
  const { trcHourlyReport, trcHourlyReportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );
  const data: any[] = trcHourlyReport?.data || [];
  const columns: string[] = trcHourlyReport?.columns || [];

  const hourColumns = useMemo(
    () => sortHourColumns(columns.filter((col) => !TRC_FIXED_COLUMNS.includes(col))),
    [columns],
  );

  const columnDefs = useMemo<(ColDef | ColGroupDef)[]>(() => {
    if (!columns.length) return [];

    return [
      rowIndexCol,
      { headerName: "Emp Code", field: "empCode", width: 160, pinned: "left" },
      {
        headerName: "Worked (Hourly)",
        headerClass: "center-header",
        suppressStickyLabel: true,
        children: hourColumns.map((col) => numericCol(col, col, 110)),
      },
      { ...numericCol("Total", "total", 120, true), pinned: "right" },
    ];
  }, [columns, hourColumns]);

  const pinnedBottomRowData = useMemo(() => {
    if (!columns.length || !data.length) return [];

    const totals: Record<string, any> = { empCode: "Grand Total" };
    [...hourColumns, "total"].forEach((col) => {
      totals[col] = sumBy(data, (row) => row[col]);
    });
    return [totals];
  }, [columns.length, data, hourColumns]);

  return (
    <div className={R26_GRID_CLASS}>
      <AgGridReact
        ref={gridRef}
        loadingOverlayComponent={CustomLoadingOverlay}
        loading={trcHourlyReportLoading}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={r26DefaultColDef}
        sideBar={r26SideBar}
        excelStyles={r26ExcelStyles}
        quickFilterText={quickFilterText}
        pinnedBottomRowData={pinnedBottomRowData}
        getRowClass={totalRowClass}
        pagination={false}
        paginationPageSize={50}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default TrcHourlyTable;
