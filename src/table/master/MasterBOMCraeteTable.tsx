import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { StatusPanelDef } from "@ag-grid-community/core";
import CraeteBomCellRender from "../Cellrenders/CraeteBomCellRender";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
interface RowData {
  id: number;
  component: string;
  qty: number;
  isNew: boolean;
  uom: string;
}
type Props = {
  rowData: RowData[];
  setRowdata: React.Dispatch<React.SetStateAction<RowData[]>>;
  addRow: () => void;
};

const MasterBOMCraeteTable: React.FC<Props> = ({ rowData, setRowdata, addRow }) => {
  const gridRef = useRef<AgGridReact<RowData>>(null);

  const handleDeleteRow = (id: number) => {
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
  const statusBar = useMemo<{
    statusPanels: StatusPanelDef[];
  }>(() => {
    return {
      statusPanels: [
        { statusPanel: "agFilteredRowCountComponent", align: "right" },
        { statusPanel: "agSelectedRowCountComponent", align: "right" },
        { statusPanel: "agAggregationComponent", align: "right" },
      ],
    };
  }, []);

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
          <Button className="bg-cyan-700 hover:bg-cyan-800 p-0 h-[30px] w-[30px]" onClick={addRow}>
            <Plus className="h-[18px] w-[18px]" />
          </Button>
        </div>
      ),
    },

    {
      headerName: "Components",
      field: "component",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
    },
    {
      headerName: "Quantity",
      field: "qty",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
    },
    {
      headerName: "Uom",
      field: "uom",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
      hide: true,
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
        statusBar={statusBar}
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

export default MasterBOMCraeteTable;
