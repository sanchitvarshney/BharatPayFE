import React, { memo, useMemo } from "react";
import { ColDef, ColGroupDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import CustomPagination from "@/components/reusable/CustomPagination";
import { useAppSelector } from "@/hooks/useReduxHook";
import { flexCellStyle, formatNumber } from "@/utils/agGridSummaryCellUtils";

type Props = {
  handlePageChange: (page: number) => void;
  pageSize: number;
};

const numericCellStyle = flexCellStyle("right");

const numericCol = (headerName: string, field: string, width = 140): ColDef => ({
  headerName,
  field,
  width,
  valueFormatter: (params) => formatNumber(params.value),
  cellStyle: numericCellStyle,
  headerClass: "ag-right-aligned-header",
});

const baseColumnDefs: ColDef[] = [
  { headerName: "S.No", field: "s_no", width: 90, pinned: "left" },
  { headerName: "Part Code", field: "part_code", width: 120, pinned: "left" },
  { headerName: "Part Name", field: "part_name", width: 280, pinned: "left" },
  numericCol("BOM Qty", "bom_qty", 110),
  numericCol("Opening Balance", "opening_balance", 160),
  numericCol("Purchase MSC", "purchase_msc"),
  numericCol("Purchase BPE", "purchase_bpe"),
  numericCol("Wastage %", "wastage_percent", 120),
  numericCol("Total In", "overall_total_in"),
  numericCol("Total Out", "overall_total_out"),
  numericCol("Closing Balance", "closing_balance", 160),
  numericCol("Total Consume", "total_consume", 150),
];

const EMPTY_ROWS: any[] = [];

const SwipeSummaryReportTable: React.FC<Props> = ({
  handlePageChange,
  pageSize,
}) => {
  const { summaryReportData, summaryReportLoading } = useAppSelector(
    (state) => state.swipeBilling,
  );

  const rowData = useMemo(
    () => summaryReportData?.data ?? EMPTY_ROWS,
    [summaryReportData?.data],
  );

  const columnDefs = useMemo<(ColDef | ColGroupDef)[]>(() => {
    const skuNames: string[] = [];
    rowData.forEach((row: any) => {
      Object.keys(row?.sku_data ?? {}).forEach((name) => {
        if (!skuNames.includes(name)) skuNames.push(name);
      });
    });

    const skuGroups: ColGroupDef[] = skuNames.map((name) => ({
      headerName: name,
      headerClass: "ag-center-aligned-header",
      children: [
        {
          headerName: "Consumption",
          colId: `${name}__consumption`,
          width: 130,
          valueGetter: (params) => params.data?.sku_data?.[name]?.consumption,
          valueFormatter: (params) => formatNumber(params.value),
          cellStyle: numericCellStyle,
          headerClass: "ag-right-aligned-header",
        },
        {
          headerName: "%",
          colId: `${name}__percentage`,
          width: 90,
          valueGetter: (params) => params.data?.sku_data?.[name]?.percentage,
          valueFormatter: (params) => formatNumber(params.value),
          cellStyle: numericCellStyle,
          headerClass: "ag-right-aligned-header",
        },
      ],
    }));

    return [...baseColumnDefs, ...skuGroups];
  }, [rowData]);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      filter: true,
      sortable: true,
      resizable: true,
      cellStyle: flexCellStyle("left"),
    }),
    [],
  );

  const pagination = summaryReportData?.pagination;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="relative ag-theme-quartz flex-1 min-h-0">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={summaryReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableCellTextSelection={true}
        />
      </div>
      {pagination && (
        <CustomPagination
          currentPage={pagination.currentPage || 0}
          totalPages={pagination.totalPages || 0}
          totalRecords={pagination.totalRecords || 0}
          onPageChange={handlePageChange}
          isLimit={false}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export default memo(SwipeSummaryReportTable);
