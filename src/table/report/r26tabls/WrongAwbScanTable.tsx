import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

const columnDefs: ColDef[] = [
  {
    headerName: "Category",
    field: "category_name",
    sortable: true,
    filter: false,
    flex: 1,
  },
  {
    headerName: "Count",
    field: "count",
    sortable: true,
    filter: false,
    width: 140,
    headerClass: "ag-right-aligned-header",
    cellStyle: { textAlign: "right", fontWeight: 600 },
  },
];

const WrongAwbscanTable: React.FC<Props> = ({ gridRef }) => {
  const { awbscanreport, awbscanreportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      resizable: true,
    };
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz workers-report-grid awb-report-grid h-[calc(100vh-420px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={awbscanreportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={awbscanreport?.WrongDevice?.breakdown || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default WrongAwbscanTable;
