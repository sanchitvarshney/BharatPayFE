import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { StatusPanelDef } from "@ag-grid-community/core";
import AddtrcTableCellRenderer from "../Cellrenders/AddtrcTableCellRenderer";
import { IconButton } from "@mui/material";
import { Icons } from "@/components/icons";
interface RowData {
  remarks: string;
  id: string;
  isNew: boolean;
  issues: string[];
  IMEI: string;
  slNo: string;
}
type Props = {
  rowData: RowData[];
  setRowdata: React.Dispatch<React.SetStateAction<RowData[]>>;
};
const AddtrcTable: React.FC<Props> = ({ rowData, setRowdata }) => {
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
      textInputCellRenderer: (params: any) => <AddtrcTableCellRenderer props={params} customFunction={getAllTableData} />,
    }),
    []
  );
  const handleDeleteRow = (id: string) => {
    setRowdata(rowData.filter((row) => row.id !== id));
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "Action",
      field: "action",
      width: 120,
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center w-full h-full">
          <IconButton onClick={() => handleDeleteRow(params.data.id)}>
            <Icons.delete color="error" />
          </IconButton>
        </div>
      ),
    },

    {
      headerName: "IMEI",
      field: "IMEI",
      width:200,
    },
    {
      headerName: "Serial No.",
      field: "slNo",
      width:200,
    },
    {
      headerName: "Issues",
      field: "issues",
      cellRenderer: "textInputCellRenderer",
     width:300
    },
    {
      headerName: "Remarks",
      field: "remarks",
      cellRenderer: "textInputCellRenderer",
    
    },
  ];


  return (
    <div className=" ag-theme-quartz h-[calc(100vh-200px)]">
      <AgGridReact
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
        ref={gridRef}
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
        onCellKeyDown={(e) => e.event?.preventDefault()}
      />
    </div>
  );
};

export default AddtrcTable;
