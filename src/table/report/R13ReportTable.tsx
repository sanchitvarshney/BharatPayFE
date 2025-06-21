import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import CustomPagination from "@/components/reusable/CustomPagination";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  pageSize: number;
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


const R13ReportTable: React.FC<Props> = ({ gridRef,handlePageChange, handlePageSizeChange, pageSize }) => {
  const { r13Report, r13ReportLoading } = useAppSelector((state) => state.report);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-150px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={r13ReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r13Report?.data || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={false}
          paginationPageSize={20}
          enableCellTextSelection
        />
      </div>
      {r13Report && (
        <CustomPagination
          currentPage={r13Report?.pagination?.currentPage as any}
          totalPages={r13Report?.pagination?.totalPages as any}
          totalRecords={r13Report?.pagination?.totalRecords as any}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export default R13ReportTable;
