import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { leftAlignedColumn, rightAlignedColumn } from "@/utils/agGridAlignUtils";
import {
  R26_GRID_CLASS,
  r26DefaultColDef,
  r26ExcelStyles,
  totalRowClass,
} from "./r26GridShared";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

const columnDefs: ColDef[] = [
  { headerName: "Time", field: "time", flex: 1, minWidth: 160, ...leftAlignedColumn },
  { headerName: "Assembly", field: "assembly", flex: 1, minWidth: 140, ...rightAlignedColumn },
  { headerName: "TRC", field: "trc", flex: 1, minWidth: 140, ...rightAlignedColumn },
];

const PreQcTable: React.FC<Props> = ({ gridRef }) => {
  const { preQcReport, preQcReportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );
  const hourly: any[] = preQcReport?.hourly_report || [];

  // The API sends the "Total" row inside hourly_report; pin it at the bottom.
  const { rowData, pinnedBottomRowData } = useMemo(
    () => ({
      rowData: hourly.filter((row) => row.time !== "Total"),
      pinnedBottomRowData: hourly.filter((row) => row.time === "Total"),
    }),
    [hourly],
  );

  return (
    <div className={R26_GRID_CLASS}>
      <AgGridReact
        ref={gridRef}
        loadingOverlayComponent={CustomLoadingOverlay}
        loading={preQcReportLoading}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={r26DefaultColDef}
        excelStyles={r26ExcelStyles}
        pinnedBottomRowData={pinnedBottomRowData}
        getRowClass={totalRowClass}
        pagination={false}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default PreQcTable;
