import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { sumBy } from "@/components/report/r26/reportUtils";
import {
  numericCol,
  R26_GRID_CLASS,
  r26DefaultColDef,
  r26ExcelStyles,
  r26SideBar,
  rowIndexCol,
  totalRowClass,
} from "./r26GridShared";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
  quickFilterText?: string;
};

const AwbscanTable: React.FC<Props> = ({ gridRef, quickFilterText }) => {
  const { awbscanreport, awbscanreportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );

  const columnDefs = useMemo<ColDef[]>(() => {
    const columns: string[] = awbscanreport?.columns || [];
    if (!columns.length) return [];

    const cols: ColDef[] = [rowIndexCol];
    columns.forEach((col) => {
      if (col === "product") {
        cols.push({ headerName: "Product", field: "product", width: 280, pinned: "left" });
      } else if (col === "total") {
        cols.push(numericCol("Total", "total", 130, true));
      } else {
        cols.push(numericCol(col, col, 140));
      }
    });
    return cols;
  }, [awbscanreport?.columns]);

  const pinnedBottomRowData = useMemo(() => {
    const columns: string[] = awbscanreport?.columns || [];
    const data: any[] = awbscanreport?.data || [];
    if (!columns.length || !data.length) return [];

    const totals: Record<string, any> = { product: "Grand Total" };
    columns.forEach((col) => {
      if (col === "product") return;
      totals[col] = sumBy(data, (row) => row[col]);
    });
    return [totals];
  }, [awbscanreport]);

  return (
    <div className={R26_GRID_CLASS}>
      <AgGridReact
        ref={gridRef}
        loadingOverlayComponent={CustomLoadingOverlay}
        loading={awbscanreportLoading}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={awbscanreport?.data || []}
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

export default AwbscanTable;
