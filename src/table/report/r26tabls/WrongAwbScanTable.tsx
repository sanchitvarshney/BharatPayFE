import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
// import CustomPagination from "@/components/reusable/CustomPagination";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};
// Dummy data

const columnDefs: ColDef[] = [
//   {
//     headerName: "#",
//     field: "id",
//     sortable: true,
//     filter: false,
//     width: 100,
//     valueGetter: "node.rowIndex+1",
//   },
  {
    headerName: "Category",
    field: "category_name",
    sortable: true,
    filter: false,
    width: 220,
  },

  {
    headerName: "Count",
    field: "count",
    sortable: true,
    filter: false,
    width: 160,
    
  },
];

const WrongAwbscanTable: React.FC<Props> = ({ gridRef }) => {
  const { awbscanreport, awbscanreportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );
  // Simulate data loading

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-370px)]">
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
