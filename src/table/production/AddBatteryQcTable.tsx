import React, { useMemo, useRef, useEffect, useState } from "react";
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
  batteryID: string;
}

type Props = {
  rowData: RowData[];
  setRowdata: React.Dispatch<React.SetStateAction<RowData[]>>;
};

const AddBatteryQcTable: React.FC<Props> = ({ rowData, setRowdata }) => {
  const gridRef = useRef<AgGridReact<RowData>>(null);

  const [batteryStatus, setBatteryStatus] = useState<string>("");

  // Helper function to get the battery status based on IR and voltage
  const getStatus = (ir: number, volt: number): string => {
    const voltage = volt;
    const resistance = ir;
  
    if (voltage <= 2.5) {
      return "Rejected"; // If voltage is less than or equal to 2.5, it is always Rejected.
    }
  
    if (voltage >= 3.8 && resistance > 0 && resistance <= 200) {
      return "Pass"; // If voltage is greater than or equal to 3.8 and IR is between 0 and 200, it's Pass.
    }
  
    if (voltage >= 2.6 && voltage <= 3.7 && resistance > 0 && resistance <= 200) {
      return "Charging Required"; // If voltage is between 2.6 and 3.7 and IR is between 0 and 200, it's Charging Required.
    }
  
    return "Rejected"; // Default case: Rejected
  };

  // Determine whether the Battery ID column should be visible
  const isBatteryIDVisible = () => {
    return batteryStatus === "Rejected";
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
      textInputCellRenderer: (params: any) => <AddBatteryQcCellrender props={params} customFunction={getAllTableData} />,
    }),
    []
  );

  const handleDeleteRow = (id: number) => {
    setRowdata(rowData.filter((row) => row.id !== id));
  };

  const columnDefs: ColDef[] = useMemo(() => {
    return [
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
        hide: !isBatteryIDVisible(), // Hide this column based on the battery status
      },
      {
        headerName: "Remark (If Needed)",
        field: "remark",
        cellRenderer: "textInputCellRenderer",
      },
    ];
  }, [batteryStatus]);
  
  // Update the battery status when IR or voltage change
  useEffect(() => {
    const intervalId = setInterval(() => {
    const ir = rowData[0]?.IR; // Assuming you are using the first row's IR for demonstration
    const voltage = rowData[0]?.voltage; // Assuming you are using the first row's voltage for demonstration
    if (ir && voltage) {
      const status = getStatus(parseFloat(ir), parseFloat(voltage));
      setBatteryStatus(status); // Update the status whenever IR or voltage changes
    }
  }, 3000);// setInterval to update the battery status every 3 seconds we will find another approach in the future to replace it.

  return () => clearInterval(intervalId);
  }, [rowData]);

  return (
    <div className="ag-theme-quartz h-[calc(100vh-200px)]">
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
