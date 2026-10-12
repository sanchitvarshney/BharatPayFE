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
  QC_NUMERIC_COLUMNS,
} from "./r26GridShared";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
  quickFilterText?: string;
};

const columnDefs: ColDef[] = [
  rowIndexCol,
  { headerName: "Model", field: "model", width: 170, pinned: "left" },
  { headerName: "SKU", field: "sku", width: 170 },
  { headerName: "Product Name", field: "product_name", width: 260 },
  numericCol("AWB Scan", "awb_scan", 130),
  numericCol("Inward", "inward", 120),
  numericCol("Outward", "outward", 120, true),
  numericCol("Partial MIN", "partial_min", 140),
  {
    headerName: "Device Image",
    field: "device_img",
    sortable: false,
    filter: false,
    width: 150,
    cellStyle: { color: "#64748b" },
    valueFormatter: (params) =>
      params.node?.rowPinned ? "" : params.value ? String(params.value) : "-",
  },
];

const QcMinOutwardTable: React.FC<Props> = ({ gridRef, quickFilterText }) => {
  const { qcminreport, qcminreportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );
  const data: any[] = qcminreport?.data || [];

  const pinnedBottomRowData = useMemo(() => {
    if (!data.length) return [];

    const totals: Record<string, any> = { model: "Grand Total" };
    QC_NUMERIC_COLUMNS.forEach((col) => {
      totals[col] = sumBy(data, (row) => row[col]);
    });
    return [totals];
  }, [data]);

  return (
    <div className={R26_GRID_CLASS}>
      <AgGridReact
        ref={gridRef}
        loadingOverlayComponent={CustomLoadingOverlay}
        loading={qcminreportLoading}
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
        paginationPageSize={50}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default QcMinOutwardTable;
