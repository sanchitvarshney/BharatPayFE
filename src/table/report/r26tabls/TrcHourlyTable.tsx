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

const columnDefs: ColDef[] = [
  rowIndexCol,
  { headerName: "Emp Code", field: "empCode", flex: 1, minWidth: 160 },
  { ...numericCol("Total Done", "total_done", 160, true), flex: 1 },
];

const TrcHourlyTable: React.FC<Props> = ({ gridRef, quickFilterText }) => {
  const { trcHourlyReport, trcHourlyReportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );
  const data: any[] = trcHourlyReport?.data || [];

  const pinnedBottomRowData = useMemo(
    () =>
      data.length
        ? [
            {
              empCode: "Grand Total",
              total_done: sumBy(data, (row) => row.total_done),
            },
          ]
        : [],
    [data],
  );

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
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default TrcHourlyTable;
