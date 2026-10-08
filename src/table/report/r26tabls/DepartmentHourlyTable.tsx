import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { sortHourColumns, sumBy } from "@/components/report/r26/reportUtils";
import {
  numericCol,
  R26_GRID_CLASS,
  r26DefaultColDef,
  r26ExcelStyles,
  totalRowClass,
  DEPARTMENT_FIXED_COLUMNS,
} from "./r26GridShared";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
  report: { columns?: string[]; data?: any[] } | null;
  loading: boolean;
};


const deptField = (index: number) => `dept_${index}`;

const DepartmentHourlyTable: React.FC<Props> = ({ gridRef, report, loading }) => {
  const departments: any[] = report?.data || [];
  const columns: string[] = report?.columns || [];

  const hourColumns = useMemo(
    () => sortHourColumns(columns.filter((c) => !DEPARTMENT_FIXED_COLUMNS.includes(c))),
    [columns],
  );

  const columnDefs = useMemo<ColDef[]>(() => {
    if (!columns.length) return [];
    return [
      { headerName: "Hour", field: "hour", width: 130, pinned: "left" },
      ...departments.map((dept, i) =>
        numericCol(String(dept.department ?? "—"), deptField(i), 140),
      ),
      { ...numericCol("Grand Total", "grandTotal", 130, true), pinned: "right" },
    ];
  }, [columns.length, departments]);

  const rowData = useMemo(
    () =>
      hourColumns.map((hour) => {
        const row: Record<string, any> = { hour };
        departments.forEach((dept, i) => {
          row[deptField(i)] = dept[hour];
        });
        row.grandTotal = sumBy(departments, (dept) => dept[hour]);
        return row;
      }),
    [hourColumns, departments],
  );

  const pinnedBottomRowData = useMemo(() => {
    if (!departments.length) return [];
    const totals: Record<string, any> = { hour: "Total" };
    departments.forEach((dept, i) => {
      totals[deptField(i)] = dept.total;
    });
    totals.grandTotal = sumBy(departments, (dept) => dept.total);
    return [totals];
  }, [departments]);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      ...r26DefaultColDef,
      suppressHeaderMenuButton: true,
    }),
    [],
  );

  return (
    <div className={R26_GRID_CLASS}>
      <AgGridReact
        ref={gridRef}
        loadingOverlayComponent={CustomLoadingOverlay}
        loading={loading}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={rowData}
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

export default DepartmentHourlyTable;
