import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
interface RowData {
  imei: string;
  srno: string;
  productKey: string;
  serialNo: number;
  modalNo: string;
  deviceSku: string;
  imei2?: string;
  index: number;
}

type Props = {
  rowData: RowData[]|any;
  setRowdata: React.Dispatch<React.SetStateAction<RowData[]>>|any;
};
const ImeiTable: React.FC<Props> = ({ rowData, setRowdata }) => {
  const columnDefs: ColDef[] = [
    {
      headerName: "Index",
      field: "index",
      sortable: true,
      filter: true,
      width: 100,
    },
    {
      headerName: "Modal Name",
      field: "modalNo",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Device SKU",
      field: "deviceSku",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "IMEI",
      field: "imei",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "IMEI2",
      field: "imei2",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "SR No.",
      field: "srno",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Action",
      field: "",
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <IconButton
          onClick={() => {
            // Delete by index instead of IMEI/SR No
            const deviceIndex = params.data.index;
            const filteredData = rowData.filter(
              (row:any) => row.index !== deviceIndex
            );
            // Reassign index numbers to maintain sequential order
            const reindexedData = filteredData.map((item:any, index:any) => ({
              ...item,
              index: index + 1,
            }));
            setRowdata(reindexedData);
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
