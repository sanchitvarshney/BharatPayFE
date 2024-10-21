import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { TiDocumentText } from "react-icons/ti";
import { Badge } from "@/components/ui/badge";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";

type Props = {
  open?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const R2ReportTable: React.FC<Props> = ({ setOpen }) => {
  // Column definitions for ag-Grid
  const columnDefs: ColDef[] = [
    { headerName: "Sr No", field: "srNo", sortable: true, filter: true },
    { headerName: "Requested By", field: "requestedBy", sortable: true, filter: true },
    { headerName: "Ref ID", field: "refId", sortable: true, filter: true },
    { headerName: "Device", field: "device", sortable: true, filter: true },
    { headerName: "Total Devices", field: "totalDevices", sortable: true, filter: true },
    { headerName: "Requested Location", field: "requestedLocation", sortable: true, filter: true },
    { headerName: "Requested Date", field: "requestedDate", sortable: true, filter: true },
    {
      headerName: "Request Status",
      field: "requestStatus",
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => <div className="flex items-center h-full ">{params.value === "Pending" ? <Badge className="bg-amber-600 hover:bg-amber-700">{params.value}</Badge> : <Badge className="bg-emerald-600 hover:bg-emerald-700">{params.value}</Badge>}</div>,
    },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: () => (
        <div className="flex items-center h-full">
          <Button onClick={() => setOpen(true)} size={"sm"} className="bg-cyan-700 hover:bg-cyan-800 flex items-center gap-[5px]">
            <TiDocumentText className="h-[17px] w-[17px]" />
            View Details
          </Button>
        </div>
      ),
    },
  ];

  // Default row data for the table
  const rowData = [
    {
      srNo: 1,
      requestedBy: "John Doe",
      refId: "REF123",
      device: "Laptop",
      totalDevices: 10,
      requestedLocation: "New York",
      requestedDate: "2024-10-21",
      requestStatus: "Pending",
    },
    {
      srNo: 2,
      requestedBy: "Jane Smith",
      refId: "REF456",
      device: "Mobile",
      totalDevices: 5,
      requestedLocation: "London",
      requestedDate: "2024-10-22",
      requestStatus: "Approved",
    },
    // Add more rows as needed
  ];

  return (
    <div className="relative ag-theme-quartz h-[calc(100vh-135px)]">
      <AgGridReact loadingOverlayComponent={CustomLoadingOverlay} suppressCellFocus columnDefs={columnDefs} rowData={rowData} pagination={true} />
    </div>
  );
};

export default R2ReportTable;
