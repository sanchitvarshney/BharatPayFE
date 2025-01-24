import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { IconButton } from "@mui/material";
import { Icons } from "@/components/icons";
import SIMMinCellRener from "../Cellrenders/SIMMinCellRener";

interface RowData {
  remark: string;
  isNew: boolean;
  id: string;
  sr_no: string;
}

type Props = {
  rowData: RowData[];
  setRowdata: React.Dispatch<React.SetStateAction<RowData[]>>;
};
const SimMinTable: React.FC<Props> = ({ rowData, setRowdata }) => {
  const gridRef = useRef<AgGridReact<RowData>>(null);
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
      textInputCellRenderer: (params: any) => <SIMMinCellRener props={params} customFunction={getAllTableData} />,
    }),
    []
  );
  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "sr",
      width: 60,
      valueGetter: (params: any) => params.node.rowIndex + 1,
    },
    {
      headerName: "#",
      field: "id",
      width: 60,

      hide: true,
    },

    {
      headerName: "Sim No.",
      field: "sr_no",
      minWidth: 270,
    },

    {
      headerName: "Remark",
      field: "remark",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
      minWidth: 200,
    },

    {
      headerName: "",
      field: "isNew",
      pinned: "right",
      cellRenderer: (params: any) => {
        const { data } = params;
        return (
          <div key={data.id} className="flex items-center justify-center h-full gap-[10px]">
            <IconButton onClick={() => setRowdata(rowData.filter((item) => item.id !== data?.id))} color="error">
              <Icons.delete />
            </IconButton>
          </div>
        );
      },
      width: 120,
    },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-220px)]">
      <AgGridReact
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
        components={components}
        defaultColDef={{
          resizable: true,
          suppressCellFlash: true,
          editable: false,
        }}
        onCellKeyDown={(e) => e.event?.preventDefault()}
      />
    </div>
  );
};

export default SimMinTable;
