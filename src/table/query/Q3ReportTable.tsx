import React, { useMemo } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppSelector } from "@/hooks/useReduxHook";
import { ColDef } from "@ag-grid-community/core";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { formatNumber } from "@/utils/numberFormatUtils";

const Q3ReportTable: React.FC = () => {
  const { q3data, q3DataLoading } = useAppSelector((state) => state.query);

  const defaultColDef = useMemo<ColDef>(
    () => ({ filter: true, sortable: true, resizable: true }),
    []
  );

  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      width: 80,
      valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
    },
    { headerName: "Location", field: "locationName", flex: 1 },
    {
      headerName: "Opening Balance",
      field: "openingBalance",
      flex: 1,
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      headerName: "Inward",
      field: "totalIn",
      flex: 1,
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      headerName: "Outward",
      field: "totalOut",
      flex: 1,
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      headerName: "Closing Balance",
      field: "closeQty",
      flex: 1,
      valueFormatter: (params) => formatNumber(params.value),
    },
  ];

  return (
    <div className="relative ag-theme-quartz h-[calc(100vh-100px)]">
      <AgGridReact
        loadingOverlayComponent={CustomLoadingOverlay}
        loading={q3DataLoading}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={q3data?.locationQty || []}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        enableCellTextSelection
        paginationPageSize={20}
        pagination={true}
        suppressExcelExport={true}
        suppressCsvExport={true}
      />
    </div>
  );
};

export default Q3ReportTable;
