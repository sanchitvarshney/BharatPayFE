import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { IconButton } from "@mui/material";
import { Icons } from "@/components/icons";

interface InitialComponent {
  id: string;
  component: { label: string; value: string };
  quantity: number;
  availableqty: string;
  unit: string;
  isNew: boolean;
}

interface Props {
  rowData: InitialComponent[];
  setRowData: React.Dispatch<React.SetStateAction<InitialComponent[]>>;
}

const SimpleInitialComponentsTable: React.FC<Props> = ({
  rowData,
  setRowData,
}) => {
  // Delete row
  const handleDeleteRow = (id: string) => {
    setRowData(rowData.filter((row) => row.id !== id));
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "id",
      width: 50,
      valueGetter: "node.rowIndex + 1",
      pinned: "left",
    },
    {
      headerName: "Action",
      field: "action",
      width: 80,
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center w-full h-full">
          <IconButton onClick={() => handleDeleteRow(params.data.id)}>
            <Icons.delete fontSize="small" color="error" />
          </IconButton>
        </div>
      ),
      pinned: "left",
    },
    {
      headerName: "Component",
      field: "component",
      valueGetter: (params) => params.data.component?.label || "",
      minWidth: 200,
    },
    {
      headerName: "Available Qty",
      field: "availableqty",
      minWidth: 150,
    },
    {
      headerName: "Quantity",
      field: "quantity",
      minWidth: 100,
    },
  ];

  return (
    <div className="ag-theme-quartz h-full">
      <AgGridReact
        columnDefs={columnDefs}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        rowData={rowData}
        animateRows
        loading={false}
        defaultColDef={{
          resizable: true,
          suppressCellFlash: true,
          editable: false,
        }}
      />
    </div>
  );
};

export default SimpleInitialComponentsTable;
