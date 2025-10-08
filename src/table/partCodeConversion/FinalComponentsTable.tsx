import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { IconButton, Button } from "@mui/material";
import { Icons } from "@/components/icons";
import ComponentCellRenderer from "./ComponentCellRenderer";

interface FinalComponent {
  id: string;
  component: { label: string; value: string };
  quantity: number;
  unit: string;
  isNew: boolean;
}

interface Props {
  rowData: FinalComponent[];
  setRowData: React.Dispatch<React.SetStateAction<FinalComponent[]>>;
}

const FinalComponentsTable: React.FC<Props> = ({ rowData, setRowData }) => {
  // Add new row
  const handleAddRow = () => {
    const newRow: FinalComponent = {
      id: Math.random().toString(36).substr(2, 9),
      component: { label: "", value: "" },
      quantity: 0,
      unit: "",
      isNew: true,
    };
    setRowData([...rowData, newRow]);
  };

  // Delete row
  const handleDeleteRow = (id: string) => {
    setRowData(rowData.filter((row) => row.id !== id));
  };

  // Cell renderer components
  const components = {
    textInputCellRenderer: (params: any) => {
      return <ComponentCellRenderer props={params} showStockInfo={false} />;
    },
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
      headerComponent: () => (
        <div className="flex items-center justify-center w-full h-full">
          <Button
            variant="contained"
            color="primary"
            style={{
              borderRadius: "10%",
              width: 25,
              height: 25,
              minWidth: 0,
              padding: 0,
            }}
            onClick={handleAddRow}
            size="small"
            sx={{ zIndex: 1 }}
          >
            <Icons.add fontSize="small" />
          </Button>
        </div>
      ),
      pinned: "left",
    },
    {
      headerName: "Component",
      field: "component",
      cellRenderer: "textInputCellRenderer",
      minWidth: 300,
    },
    {
      headerName: "Quantity",
      field: "quantity",
      cellRenderer: "textInputCellRenderer",
      minWidth: 250,
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
        components={components}
        defaultColDef={{
          resizable: true,
          suppressCellFlash: true,
          editable: false,
        }}
      />
    </div>
  );
};

export default FinalComponentsTable;
