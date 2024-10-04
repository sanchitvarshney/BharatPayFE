import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

const columnDefs: ColDef[] = [
  { headerName: "#", field: "id", sortable: true, filter: true, width: 100, valueGetter: "node.rowIndex+1" },
  { headerName: "Serial No.", field: "serialNo", sortable: true, filter: true },
  { headerName: "Name", field: "skuName", sortable: true, filter: true },
  { headerName: "Date", field: "insertDt", sortable: true, filter: true },
  { headerName: "SKU", field: "skuCode", sortable: true, filter: true },
  { headerName: "IMEI", field: "imei", sortable: true, filter: true },
  { headerName: "SIM Availability", field: "simAvailiblity", sortable: true, filter: true },
  { headerName: "UOM", field: "uom", sortable: true, filter: true },
  { headerName: "In Location", field: "inLoc", sortable: true, filter: true },
  { headerName: "Vendor Name", field: "vendorName", sortable: true, filter: true },
  { headerName: "Doc Type", field: "docType", sortable: true, filter: true },
  { headerName: "MIN No.", field: "minNo", sortable: true, filter: true },
  { headerName: "Doc ID", field: "docId", sortable: true, filter: true },
  { headerName: "Inward By", field: "insertBy", sortable: true, filter: true },
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
      <div className="relative ag-theme-quartz h-[calc(100vh-135px)]">
        <AgGridReact ref={gridRef} loading={getR1DataLoading} overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={r1Data} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSize={20} />
      </div>
    </div>
  );
};

export default DeviceMinReportTable;
