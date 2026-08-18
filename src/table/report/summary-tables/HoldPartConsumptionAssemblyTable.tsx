import React, { memo, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";

const EMPTY_ROWS: unknown[] = [];

const formatHeaderName = (field: string) =>
  field
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const HoldPartConsumptionAssemblyTable: React.FC = () => {
  const { holdAssemblyData, holdAssemblyLoading } = useAppSelector(
    (state) => state.summary,
  );

  const rowData = useMemo(
    () => holdAssemblyData?.data ?? EMPTY_ROWS,
    [holdAssemblyData?.data],
  );

  const columnDefs = useMemo<ColDef[]>(() => {
    const firstRow = rowData[0] as Record<string, unknown> | undefined;
    if (!firstRow) return [];

    return Object.keys(firstRow).map((field) => ({
      headerName: formatHeaderName(field),
      field,
      sortable: true,
      filter: true,
      flex: 1,
         headerClass: "center-header",
      cellStyle: {
        textAlign: "center",
      },
      minWidth: 250,
    }));
  }, [rowData]);

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
          loading={holdAssemblyLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          suppressFieldDotNotation
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

export default memo(HoldPartConsumptionAssemblyTable);
