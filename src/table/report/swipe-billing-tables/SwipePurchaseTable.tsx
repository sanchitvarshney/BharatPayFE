import React, { memo, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { flexCellStyle, formatCurrency } from "@/utils/agGridSummaryCellUtils";

const numericCellStyle = flexCellStyle("right");

const currencyCol = (headerName: string, field: string): ColDef => ({
  headerName,
  field,
  width: 170,
  valueFormatter: (params) => formatCurrency(params.value),
  cellStyle: numericCellStyle,
  headerClass: "ag-right-aligned-header",
});

const columnDefs: ColDef[] = [
  {
    headerName: "#",
    colId: "index",
    width: 80,
    valueGetter: (params) =>
      params?.node?.rowPinned ? "" : (params?.node?.rowIndex ?? 0) + 1,
  },
  { headerName: "Part Code", field: "part_code", width: 130 },
  { headerName: "Component Name", field: "component_name", width: 340 },
  {
    headerName: "Quantity",
    field: "qty",
    width: 130,
    cellStyle: numericCellStyle,
    headerClass: "ag-right-aligned-header",
  },
  currencyCol("Rate", "rate"),
  currencyCol("Taxable Amount", "taxable_amount"),
  {
    headerName: "GST Rate",
    field: "gst_rate",
    width: 120,
    cellStyle: numericCellStyle,
    headerClass: "ag-right-aligned-header",
  },
  currencyCol("GST Amount", "gst_amount"),
  currencyCol("Total Invoice", "total_invoice"),
  {
    headerName: "Purchase Count",
    field: "purchase_count",
    width: 150,
    cellStyle: numericCellStyle,
    headerClass: "ag-right-aligned-header",
  },
  { headerName: "Rate Bifurcation", field: "bifurcation", width: 220 },
];

const EMPTY_ROWS: any[] = [];

const sumBy = (rows: any[], key: string) =>
  Number(rows.reduce((sum, row) => sum + Number(row[key] || 0), 0).toFixed(3));

const SwipePurchaseTable: React.FC = () => {
  const { purchaseData, purchaseLoading } = useAppSelector(
    (state) => state.swipeBilling,
  );

  const rowData = useMemo(
    () => purchaseData?.data ?? EMPTY_ROWS,
    [purchaseData?.data],
  );

  const grandTotalRow = useMemo(
    () => ({
      component_name: "Grand Total",
      qty: sumBy(rowData, "qty"),
      taxable_amount: sumBy(rowData, "taxable_amount"),
      gst_amount: sumBy(rowData, "gst_amount"),
      total_invoice: sumBy(rowData, "total_invoice"),
    }),
    [rowData],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      filter: true,
      sortable: true,
      resizable: true,
      cellStyle: flexCellStyle("left"),
    }),
    [],
  );

  return (
    <div className="relative ag-theme-quartz flex-1 min-h-0">
      <AgGridReact
        loadingOverlayComponent={CustomLoadingOverlay}
        loading={purchaseLoading}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pinnedBottomRowData={rowData.length ? [grandTotalRow] : []}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default memo(SwipePurchaseTable);
