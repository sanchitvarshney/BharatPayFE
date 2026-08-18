import React, { memo, useMemo } from "react";
import { ColDef, ColGroupDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { formatNumber } from "@/utils/numberFormatUtils";
import { RawMaterialReportItem } from "@/features/rawMaterialReport/rawMaterialReportSlice";

const EMPTY_ROWS: RawMaterialReportItem[] = [];

const numericColStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const LOCATION_GROUP_COLORS = 6;

const buildStockValueGetter =
  (location: string, key: "opening" | "inward" | "outward" | "closing") =>
  (params: { data?: RawMaterialReportItem }) =>
    params.data?.locations?.[location]?.[key] ?? 0;

const RawMaterialReportTable: React.FC = () => {
  const reportData = useAppSelector(
    (state) => state.rawMaterialReport?.reportData,
  );
  const reportLoading = useAppSelector(
    (state) => state.rawMaterialReport?.reportLoading,
  );

  const rowData = useMemo(() => reportData?.data ?? EMPTY_ROWS, [reportData]);

  const columnDefs = useMemo<(ColDef | ColGroupDef)[]>(() => {
    const locations = reportData?.locations ?? [];

    const locationGroups: ColGroupDef[] = locations.map((location, index) => {
      const colorIndex = index % LOCATION_GROUP_COLORS;
      const groupClass = `rm-group-${colorIndex}`;
      const lastClass = `rm-last-${colorIndex}`;

      return {
        headerName: location,
        headerClass: `center-header ${groupClass} ${lastClass}`,
        children: [
          {
            headerName: "Opening",
            colId: `${location}_opening`,
            valueGetter: buildStockValueGetter(location, "opening"),
            valueFormatter: (p) => formatNumber(p.value),
            cellStyle: numericColStyle,
            minWidth: 110,
            headerClass: `center-header ${groupClass}`,
          },
          {
            headerName: "Inward",
            colId: `${location}_inward`,
            valueGetter: buildStockValueGetter(location, "inward"),
            valueFormatter: (p) => formatNumber(p.value),
            cellStyle: numericColStyle,
            minWidth: 110,
            headerClass: `center-header ${groupClass}`,
          },
          {
            headerName: "Outward",
            colId: `${location}_outward`,
            valueGetter: buildStockValueGetter(location, "outward"),
            valueFormatter: (p) => formatNumber(p.value),
            cellStyle: numericColStyle,
            minWidth: 110,
            headerClass: `center-header ${groupClass}`,
          },
          {
            headerName: "Closing",
            colId: `${location}_closing`,
            valueGetter: buildStockValueGetter(location, "closing"),
            valueFormatter: (p) => formatNumber(p.value),
            cellStyle: { ...numericColStyle, fontWeight: 600 },
            minWidth: 110,
            headerClass: `center-header ${groupClass} ${lastClass}`,
            cellClass: lastClass,
          },
        ],
      };
    });

    return [
      {
        headerName: "Part Code",
        field: "part_code",
        pinned: "left",
        width: 130,
        sortable: true,
        filter: true,
        headerClass: "center-header"
      },
      {
        headerName: "Item",
        field: "item",
        pinned: "left",
        flex: 1,
        minWidth: 260,
        sortable: true,
        filter: true,
        headerClass: "center-header"
      },
      ...locationGroups,
    ];
  }, [reportData]);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      sortable: false,
      filter: false,
    }),
    [],
  );

  return (
    <div className="relative ag-theme-quartz raw-material-report-grid h-[calc(100vh-100px)]">
      <AgGridReact
        loadingOverlayComponent={CustomLoadingOverlay}
        loading={reportLoading}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        suppressFieldDotNotation
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        enableCellTextSelection={true}
        rowHeight={34}
      />
    </div>
  );
};

export default memo(RawMaterialReportTable);
