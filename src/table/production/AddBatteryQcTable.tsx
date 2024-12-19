import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { HiMiniTrash } from "react-icons/hi2";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { StatusPanelDef } from "@ag-grid-community/core";
import AddBatteryQcCellrender from "../Cellrenders/AddBatteryQcCellrender";
interface RowData {
  remark: string;
  id: number;
  isNew: boolean;
  IMEI: string;
  IR: string;
  voltage: string;
  serialNo: string;
}
type Props = {
  rowData: RowData[];
  setRowdata: React.Dispatch<React.SetStateAction<RowData[]>>;
};
const AddBatteryQcTable: React.FC<Props> = ({ rowData, setRowdata }) => {
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
      textInputCellRenderer: (params: any) => <AddBatteryQcCellrender props={params} customFunction={getAllTableData} />,
    }),
    []
  );
  const handleDeleteRow = (id: number) => {
    setRowdata(rowData.filter((row) => row.id !== id));
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "",
      field: "action",
      width: 120,
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center w-full h-full">
          <Button variant={"outline"} className="border shadow-none p-0 h-[30px] w-[30px]" onClick={() => handleDeleteRow(params.data.id)}>
            <HiMiniTrash className="h-[18px] w-[18px] text-red-500" />
          </Button>
        </div>
      ),
    },

    {
      headerName: "IMEI",
      field: "IMEI",
      cellRenderer: "textInputCellRenderer",
     
    },
    {
      headerName: "Serial No.",
      field: "serialNo",
      cellRenderer: "textInputCellRenderer",
     
    },
    {
      headerName: "IR (Internal Resistance)",
      field: "IR",
      cellRenderer: "textInputCellRenderer",
    
    },
    {
      headerName: "Voltage",
      field: "voltage",
      cellRenderer: "textInputCellRenderer",
    },
    {
      headerName: "Battery ID",
      field: "batteryID",
      cellRenderer: "textInputCellRenderer",
    },

    {
      headerName: "Remark (If Needed)",
      field: "remark",
      cellRenderer: "textInputCellRenderer",
      
    },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-200px)]">
      <AgGridReact
        suppressCellFocus={true}
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

export default AddBatteryQcTable;
