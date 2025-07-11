import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
interface RowData {
  srno: string;
  operator: string;
  
}

type Props = {
  rowData: RowData[];
  setRowdata: React.Dispatch<React.SetStateAction<RowData[]>>;
};
const MasterqrCodeTable: React.FC<Props> = ({ rowData, setRowdata }) => {
  const columnDefs: ColDef[] = [
    { headerName: "#", field: "serialNo", sortable: true, filter: true, valueGetter: "node.rowIndex+1", width: 100 },
    { headerName: "SR No.", field: "srno", sortable: true, filter: true, flex: 1 },
    { headerName: "Operator", field: "operator", sortable: true, filter: true, flex: 1 },
    {
      headerName: "",
      field: "",
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <IconButton
          onClick={() => {
            setRowdata(rowData.filter((row) => row.srno !== params.data.srno));
          }}
        >
          <DeleteIcon fontSize="small" color="error" />
        </IconButton>
      ),
      width: 100,
    },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-210px)] ">
      <AgGridReact
        overlayNoRowsTemplate={`
    <div>
      <div class="flex items-center justify-center w-full h-full no-rows-template opacity-60">
        <img src="/scanqr.svg" class="w-[250px]" alt="No Data" />
      </div>
    </div>
    `}
        suppressCellFocus={true}
        rowData={rowData}
        columnDefs={columnDefs}
      />
    </div>
  );
};

export default MasterqrCodeTable;
