import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CraeteBomCellRender from "../Cellrenders/CraeteBomCellRender";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, IconButton } from "@mui/material";
import { Icons } from "@/components/icons";
interface RowData {
  id: string;
  component: { lable: string; value: string } | null;
  qty: number;
  isNew: boolean;
  uom: string;
  remark: string;
  reference: string;
  category: { lable: string; value: string } | null;
  status: string;
}
type Props = {
  rowData: RowData[];
  setRowdata: React.Dispatch<React.SetStateAction<RowData[]>>;
  addRow: () => void;
};

const MasterBOMCraeteTable: React.FC<Props> = ({ rowData, setRowdata, addRow }) => {
  const gridRef = useRef<AgGridReact<RowData>>(null);

  const handleDeleteRow = (id: string) => {
    setRowdata(rowData.filter((row) => row.id !== id));
  };

  const getAllTableData = () => {
    const allData: RowData[] = [];
    const rowCount = gridRef.current?.api.getDisplayedRowCount() ?? 0;
    for (let i = 0; i < rowCount; i++) {
      const rowNode = gridRef.current?.api.getDisplayedRowAtIndex(i);

      if (rowNode && rowNode.data) {
        allData.push(rowNode.data);
      }
    }
    setRowdata(allData);
  };

  const components = useMemo(
    () => ({
      textInputCellRenderer: (params: any) => <CraeteBomCellRender props={params} customFunction={getAllTableData} />,
    }),
    []
  );

  const columnDefs: ColDef[] = [
    {
      headerName: "Action",
      field: "action",
      width: 120,
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center w-full h-full">
          <IconButton color="error" onClick={() => handleDeleteRow(params.data.id)}>
            <DeleteIcon />
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
            onClick={addRow}
            size="small"
            sx={{ zIndex: 1 }}
          >
            <Icons.add fontSize="small" />
          </Button>
        </div>
      ),
    },

    {
      headerName: "Components",
      field: "component",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
      minWidth: 300,
    },
   
    {
      headerName: "Quantity",
      field: "qty",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
    },
    {
      headerName: "Uom",
      field: "uom",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
      hide: true,
    },
    {
      headerName: "Reference",
      field: "reference",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
    },
    {
      headerName: "Category",
      field: "category",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Remark",
      field: "remark",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
    },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-100px)]">
      <AgGridReact
        suppressCellFocus
        ref={gridRef}
        onCellFocused={(event: any) => {
          const { rowIndex, column } = event;
          const focusedCell = document.querySelector(`.ag-row[row-index="${rowIndex}"] .ag-cell[col-id="${column.colId}"] input `) as HTMLInputElement;
          const focusButton = document.querySelector(`.ag-row[row-index="${rowIndex}"] .ag-cell[col-id="${column.colId}"] button `) as HTMLButtonElement;

          if (focusedCell) {
            focusedCell.focus();
          }
          if (focusButton) {
            focusButton.focus();
          }
        }}
        navigateToNextCell={() => {
          return null; // Returning null prevents default focus movement
        }}
        columnDefs={columnDefs}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        rowData={rowData}
        animateRows
        loading={false}
        components={components}
        defaultColDef={{
          resizable: true,
          editable: false,
        }}
      />
    </div>
  );
};

export default MasterBOMCraeteTable;
