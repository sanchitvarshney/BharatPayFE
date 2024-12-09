import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";

const columnDefs: ColDef[] = [
  {
    headerName: "#",
    field: "id",
    sortable: true,
    filter: false,
    width: 60,
    valueGetter: (params: any) => {
      return params.node.rowIndex + 1;
    },
  },
  { headerName: "Serial No", field: "slNo", sortable: true, filter: true },
  { headerName: "IMEI No", field: "imei", sortable: true, filter: true },
  { headerName: "Model", field: "deviceModel", sortable: true, filter: true },
  {
    headerName: "SIM Availability",
    field: "simExist",
    sortable: true,
    filter: true,

    cellRenderer: (params: any) => {
      return params.value === "Y" ? "Available" : "Not Available";
    },
  },
  { headerName: "Remarks", field: "remark", sortable: true, filter: true },
];

const DeviceMinViewTable: React.FC = () => {
  const { getAllSubminInfo, getAllsubmitinfoLoading } = useAppSelector((state) => state.divicemin);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);
  return (
    <div>
      <div className=" ag-theme-quartz h-[calc(100vh-150px)]">
        <AgGridReact
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          loading={getAllsubmitinfoLoading}
          suppressCellFocus={true}
          rowData={getAllSubminInfo ? getAllSubminInfo.data.serialData : null}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </div>
  );
};

export default DeviceMinViewTable;
