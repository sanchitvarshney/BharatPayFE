import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import {
  numericCol,
  R26_GRID_CLASS,
  r26DefaultColDef,
  r26ExcelStyles,
  r26SideBar,
  totalRowClass,
} from "./r26GridShared";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
  // Filters employee columns by code or name.
  quickFilterText?: string;
};

type EmpColumn = { empCode: string; empName?: string };

const empHeader = ({ empCode, empName }: EmpColumn) =>
  empName && empName !== "--" ? `${empName} (${empCode})` : empCode;

const TrcHourlyTable: React.FC<Props> = ({ gridRef, quickFilterText }) => {
  const { trcHourlyReport, trcHourlyReportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );
  const hourly = trcHourlyReport?.hourly;
  const employees: EmpColumn[] = hourly?.columns || [];
  const rowData: any[] = hourly?.rows || [];

  const columnDefs = useMemo<ColDef[]>(() => {
    if (!employees.length) return [];
    const term = quickFilterText?.trim().toLowerCase() ?? "";
    const visible = term
      ? employees.filter(
          (emp) =>
            emp.empCode.toLowerCase().includes(term) ||
            (emp.empName ?? "").toLowerCase().includes(term),
        )
      : employees;
    return [
      { headerName: "Time", field: "slot", width: 150, pinned: "left" },
      ...visible.map((emp) => ({
        ...numericCol(empHeader(emp), emp.empCode, 170),
        headerTooltip: empHeader(emp),
      })),
      { ...numericCol("Total", "total", 120, true), pinned: "right" },
    ];
  }, [employees, quickFilterText]);

  const pinnedBottomRowData = useMemo(
    () => (hourly?.footer && rowData.length ? [hourly.footer] : []),
    [hourly?.footer, rowData.length],
  );

  return (
    <div className={R26_GRID_CLASS}>
      <AgGridReact
        ref={gridRef}
        loadingOverlayComponent={CustomLoadingOverlay}
        loading={trcHourlyReportLoading}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={r26DefaultColDef}
        sideBar={r26SideBar}
        excelStyles={r26ExcelStyles}
        pinnedBottomRowData={pinnedBottomRowData}
        getRowClass={totalRowClass}
        pagination={false}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default TrcHourlyTable;
