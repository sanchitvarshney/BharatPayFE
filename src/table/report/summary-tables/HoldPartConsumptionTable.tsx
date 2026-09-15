import React, { memo, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { formatNumber, flexCellStyle } from "@/utils/agGridSummaryCellUtils";

const EMPTY_ROWS: unknown[] = [];

const numericCellStyle = flexCellStyle("right");

const formatHeaderName = (field: string) =>
  field
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const HoldPartConsumptionTable: React.FC = () => {
  const { holdData, holdLoading } = useAppSelector((state) => state.summary);

  const rowData = useMemo(() => holdData?.data ?? EMPTY_ROWS, [holdData?.data]);

  const columnDefs = useMemo<ColDef[]>(() => {
    const firstRow = rowData[0] as Record<string, unknown> | undefined;
    if (!firstRow) return [];

    return Object.keys(firstRow).map((field) => {
      const isNumeric = typeof firstRow[field] === "number";

      return {
        headerName: formatHeaderName(field),
        field,
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
        ...(isNumeric
          ? {
              valueFormatter: (params: any) => formatNumber(params.value),
              cellStyle: numericCellStyle,
              headerClass: "ag-right-aligned-header",
            }
          : { cellStyle: flexCellStyle("left") }),
      };
    });
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
          loading={holdLoading}
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

export default memo(HoldPartConsumptionTable);
