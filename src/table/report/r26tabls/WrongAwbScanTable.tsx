import React, { RefObject } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { numericCol, R26_GRID_CLASS, r26DefaultColDef, r26ExcelStyles } from "./r26GridShared";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
  quickFilterText?: string;
};

const columnDefs: ColDef[] = [
  { headerName: "Category", field: "category_name", flex: 1, minWidth: 200 },
  numericCol("Count", "count", 160, true),
];

const WrongAwbscanTable: React.FC<Props> = ({ gridRef, quickFilterText }) => {
  const { awbscanreport, awbscanreportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );

  return (
    <div className={R26_GRID_CLASS}>
      <AgGridReact
        ref={gridRef}
        loadingOverlayComponent={CustomLoadingOverlay}
        loading={awbscanreportLoading}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={awbscanreport?.WrongDevice?.breakdown || []}
        columnDefs={columnDefs}
        defaultColDef={r26DefaultColDef}
        excelStyles={r26ExcelStyles}
        quickFilterText={quickFilterText}
        pagination={false}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default WrongAwbscanTable;
