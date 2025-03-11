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
  { headerName: "IMEI", field: "imei", sortable: true, filter: true, width: 150 },
  { headerName: "Serial", field: "serial", sortable: true, filter: true },
  { headerName: "Model", field: "model", sortable: true, filter: true },
  { headerName: "Qc Status", field: "qcStatus", sortable: true, filter: true },
  {headerName:"Sim Testing",field:"simTest",sortable:true,filter:true},
  {headerName:"Sim Pairing",field:"simPair",sortable:true,filter:true},
  {headerName:"Mono Cartoon SN Match",field:"monoCarton",sortable:true,filter:true},
  {headerName:"Charging Cable and Adaptor Check",field:"chargingCable",sortable:true,filter:true},
  {headerName:"Key Function",field:"keyFunction",sortable:true,filter:true},
  {headerName:"Visual Condition",field:"visualCondition",sortable:true,filter:true},
  {headerName:"Charging Testing",field:"chargingTest",sortable:true,filter:true},
  { headerName: "Insert Date and Time", field: "insertDate", sortable: true, filter: true },
  { headerName: "Insert By", field: "insertBy", sortable: true, filter: true },
  { headerName: "Analysis Remark", field: "analytisRemark", sortable: true, filter: true },
];


const R13ReportTable: React.FC<Props> = ({ gridRef }) => {
  const { r13Report, r13ReportLoading } = useAppSelector((state) => state.report);
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
          loading={r13ReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r13Report?.data || []}
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
