import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { CustomButton } from "@/components/reusable/CustomButton";
import { TbRefresh } from "react-icons/tb";

interface RowData {
  id: number;
  requestedBy: string;
  refid: string;
  fromLocation: string;
  insertDate: string;
  totalDevice: number;
}

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const ViewTRCTable: React.FC<Props> = ({  setOpen }) => {
  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "id",
      sortable: true,
      filter: true,
      flex: 1,
      maxWidth: 80,
    },
    {
      headerName: "Requested By",
      field: "requestedBy",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Reference ID",
      field: "refid",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "From Location",
      field: "fromLocation",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Insert Date",
      field: "insertDate",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Total Device",
      field: "totalDevice",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: () => (
        <div className="flex items-center justify-center h-full">
          <CustomButton onClick={() => setOpen(true)} icon={<TbRefresh className="h-[18px] w-[18px]" />} className="p-0 bg-cyan-700 hover:bg-cyan-800 h-[30px] px-[10px]">
            Process
          </CustomButton>
        </div>
      ),
      flex: 1,
      maxWidth: 100,
    },
  ];
  const rowData: RowData[] = [
    {
      id: 1,
      requestedBy: "User A",
      refid: "REF-1234",
      fromLocation: "Location A",
      insertDate: "2024-08-31",
      totalDevice: 10,
    },
    {
      id: 2,
      requestedBy: "User B",
      refid: "REF-5678",
      fromLocation: "Location B",
      insertDate: "2024-08-30",
      totalDevice: 15,
    },
    // Add more rows as needed
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSize={20} />
      </div>
    </div>
  );
};

export default ViewTRCTable;
