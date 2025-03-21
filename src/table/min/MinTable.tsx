import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, StatusPanelDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { IconButton } from "@mui/material";
import { Icons } from "@/components/icons";
import DeviceMinCellRener from "@/table/Cellrenders/DeviceMinCellRener";
interface RowData {
  imei: string;
  srno: string;
  productKey: string;
  serialNo: number;
  modalNo: string;
  deviceSku: string;
}

type Props = {
  rowData: RowData[];
  setRowdata: React.Dispatch<React.SetStateAction<RowData[]>>;
};
const MinTable: React.FC<Props> = ({ rowData, setRowdata }) => {
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
      textInputCellRenderer: (params: any) => (
        <DeviceMinCellRener props={params} customFunction={getAllTableData} />
      ),
    }),
    []
  );
  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "sr",
      width: 60,
      valueGetter: "node.rowIndex+1",
    },
    {
      headerName: "Serial No.",
      field: "serialno",
      minWidth: 300,
      lockVisible: true,
    },
    {
      headerName: "IMEI",
      field: "IMEI",
      cellRenderer: "textInputCellRenderer",
      minWidth: 300,
      lockVisible: true,
    },
    {
      headerName: "Model",
      field: "model",
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
      lockVisible: true,
    },
    {
      headerName: "SIM Availability",
      field: "simAvailability",
      cellRenderer: "textInputCellRenderer",
      lockVisible: true,
    },
    
    // {
    //   headerName: "isAvailble",
    //   field: "isAvailble",
    //   cellRenderer: "textInputCellRenderer",
    //   minWidth: 200,
    //   hide: true,
    //   lockVisible: true,
    // },
    {
      headerName: "",
      field: "isNew",
      // pinned: "right",
      cellRenderer: (params: any) => {
        const { data } = params;
        return (
          // <div
          //   key={data.id}
          //   // className="flex items-center justify-center h-full gap-[10px]"
          // >
            <IconButton
              onClick={() =>
                setRowdata(rowData.filter((item: any) => item.id !== data?.id))
              }
              color="error"
            >
              <Icons.delete />
            </IconButton>
          // </div>
        );
      },
      width: 120,
      hide: false,
      lockVisible: true,
    },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-220px)]">
      <AgGridReact
        ref={gridRef}
        onCellFocused={(event: any) => {
          const { rowIndex, column } = event;
          const focusedCell = document.querySelector(
            `.ag-row[row-index="${rowIndex}"] .ag-cell[col-id="${column.colId}"] input `
          ) as HTMLInputElement;
          const focusButton = document.querySelector(
            `.ag-row[row-index="${rowIndex}"] .ag-cell[col-id="${column.colId}"] button `
          ) as HTMLButtonElement;

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

export default MinTable;
