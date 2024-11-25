import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

const columnDefs: ColDef[] = [
  { headerName: "#", field: "id", sortable: true, filter: true, width: 100, valueGetter: "node.rowIndex+1" },
  { headerName: "Serial No.", field: "serialNo", sortable: true, filter: true, flex: 1 },
  { headerName: "IMEI", field: "imei", sortable: true, filter: true, flex: 1 },
  { headerName: "SIM Availability", field: "simAvailability", sortable: true, filter: true, flex: 1 },
  { headerName: "Model", field: "model", sortable: true, filter: true, flex: 1 },
];

const DeviceMinReportTable: React.FC<Props> = ({ gridRef }) => {
  const { r1Data, getR1DataLoading } = useAppSelector((state) => state.report);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);
  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-50px)]">
        <AgGridReact loadingOverlayComponent={CustomLoadingOverlay} ref={gridRef} loading={getR1DataLoading} overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={r1Data ? r1Data.body : []} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSize={20} />
      </div>
    </div>
  );
};

export default DeviceMinReportTable;
