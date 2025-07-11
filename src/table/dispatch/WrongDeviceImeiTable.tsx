import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  rowData: any;
  setRowdata: any;
};
const ImeiTable: React.FC<Props> = ({ rowData, setRowdata }) => {
  const columnDefs: ColDef[] = [
    { headerName: "#", field: "serialNo", sortable: true, filter: true, valueGetter: "node.rowIndex+1", width: 100 },
    { headerName: "AWB No.", field: "awbNo", sortable: true, filter: true, flex: 1 },
    {
      headerName: "",
      field: "",
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <IconButton
          onClick={() => {
            setRowdata(rowData.filter((row:any) => row.awbNo !== params.data.awbNo));
          }}
        >
          <DeleteIcon fontSize="small" color="error" />
        </IconButton>
      ),
      width: 100,
    },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-250px)] ">
      <AgGridReact overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={rowData} columnDefs={columnDefs} />
    </div>
  );
};

export default ImeiTable;
