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
  { headerName: "#", field: "id", valueGetter: "node.rowIndex+1", maxWidth: 100 },
  { headerName: "Part Code", field: "partCode", sortable: true, filter: true, width: 150 },
  { headerName: "Part Name", field: "partName", sortable: true, filter: true },
  { headerName: "Opening Qty", field: "openingQty", sortable: true, filter: true },
  { headerName: "Inward Qty", field: "inwardQty", sortable: true, filter: true },
  {headerName:"Consumption Qty",field:"consumpQty",sortable:true,filter:true},
  {headerName:"Closing Qty",field:"closingQty",sortable:true,filter:true},
  {headerName:"Count Qty",field:"countQty",sortable:true,filter:true},
  {headerName:"Physical Date",field:"physicalDt",sortable:true,filter:true},
];


const R13ReportTable: React.FC<Props> = ({ gridRef }) => {
  const { r15Report, r15ReportLoading } = useAppSelector((state) => state.report);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={r15ReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r15Report?.data || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </div>
  );
};

export default R13ReportTable;
