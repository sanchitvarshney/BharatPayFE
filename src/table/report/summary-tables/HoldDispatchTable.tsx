import React, { memo, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { flexCellStyle } from "@/utils/agGridSummaryCellUtils";

const EMPTY_ROWS: unknown[] = [];

const findSerialField = (row?: Record<string, unknown>): string | null => {
  if (!row) return null;
  const key = Object.keys(row).find((field) => /serial/i.test(field));
  return key ?? null;
};

const extractSerials = (
  rows: Record<string, unknown>[],
  field: string | null,
): string[] => {
  if (!field) return [];
  return rows
    .map((row) => row[field])
    .filter((value): value is string | number => value !== null && value !== undefined && value !== "")
    .map((value) => String(value));
};

const HoldDispatchTable: React.FC = () => {
  const { holdData, holdLoading, holdAssemblyData, holdAssemblyLoading } =
    useAppSelector((state) => state.summary);

  const holdRows = useMemo(
    () => (holdData?.data ?? EMPTY_ROWS) as Record<string, unknown>[],
    [holdData?.data],
  );
  const holdAssemblyRows = useMemo(
    () => (holdAssemblyData?.data ?? EMPTY_ROWS) as Record<string, unknown>[],
    [holdAssemblyData?.data],
  );

  const rowData = useMemo(() => {
    const serialField = findSerialField(holdRows[0]) ?? findSerialField(holdAssemblyRows[0]);

    const holdSerials = extractSerials(holdRows, serialField);
    const holdAssemblySerials = extractSerials(holdAssemblyRows, serialField);

    const uniqueSerials = Array.from(
      new Set([...holdSerials, ...holdAssemblySerials]),
    );

    return uniqueSerials.map((serial_no) => ({ serial_no }));
  }, [holdRows, holdAssemblyRows]);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "#",
        valueGetter: "node.rowIndex+1",
        width: 100,
        sortable: false,
        filter: false,
        cellStyle: flexCellStyle("left"),
      },
      {
        headerName: "Serial No.",
        field: "serial_no",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 200,
        cellStyle: flexCellStyle("left"),
      },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-200px)]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={holdLoading || holdAssemblyLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={false}
          paginationPageSize={20}
          enableCellTextSelection={true}
        />
      </div>
    </div>
  );
};

export default memo(HoldDispatchTable);
