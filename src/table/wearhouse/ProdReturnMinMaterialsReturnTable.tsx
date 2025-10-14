import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { StatusPanelDef } from "@ag-grid-community/core";
import MaterialInvardCellRenderer from "../Cellrenders/MaterialInvardCellRenderer";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { Button, IconButton } from "@mui/material";
import { Icons } from "@/components/icons";
import { generateUniqueId } from "@/utils/uniqueid";
interface RowData {
  partComponent: { lable: string; value: string } | null;
  qty: number;
  hsnCode: string;
  location: { lable: string; value: string } | null;
  remarks: string;
  id: string;
  isNew?: boolean;
}

type Props = {
  rowData: RowData[];
  setRowData: any;
};
const ProdReturnMinMaterialsReturnTable: React.FC<Props> = ({
  rowData,
  setRowData,
}) => {
  const gridRef = useRef<AgGridReact<RowData>>(null);


  const handleAddRow = () => {
    const newRow: RowData = {
      id: generateUniqueId(),
      partComponent: null,
      qty: 0,
      hsnCode: "",
      location: null,
      remarks: "",
      isNew: true,
    };
    setRowData([newRow, ...rowData]);
  };

  const handleDeleteRow = (id: string) => {
    setRowData(rowData.filter((row) => row.id !== id));
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
        <MaterialInvardCellRenderer
          props={params}
          customFunction={()=>{}}
        />
      ),
    }),
    []
  );
  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      width: 50,
      pinned: "left",
    },
    {
      headerName: "Action",
      field: "action",
      width: 100,
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center w-full h-full">
          <IconButton
            color="error"
            onClick={() => handleDeleteRow(params.data.id)}
          >
            <Icons.delete fontSize="small" />
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
      headerName: "",
      field: "excRate",
      cellRenderer: "textInputCellRenderer",
      hide: true,
    },
    {
      headerName: "Part Component",
      field: "partComponent",
      cellRenderer: "textInputCellRenderer",
      minWidth: 450,
    },
    {
      headerName: "Qty",
      field: "qty",
      cellRenderer: "textInputCellRenderer",
    },

    {
      headerName: "HSN Code",
      field: "hsnCode",
      cellRenderer: "textInputCellRenderer",
      minWidth: 300,
    },

    {
      headerName: "Location",
      field: "location",
      cellRenderer: "textInputCellRenderer",
      minWidth: 300,
    },

    {
      headerName: "Remarks",
      field: "remarks",
      cellRenderer: "textInputCellRenderer",
      minWidth: 400,
    },
    {
      headerName: "uom",
      field: "uom",

      hide: true,
    },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-200px)]">
      <AgGridReact
        suppressCellFocus={false}
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
        rowData={rowData}
        animateRows
        statusBar={statusBar}
        components={components}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        defaultColDef={{
          resizable: true,
          suppressCellFlash: true,
          editable: false,
        }}
      />
    </div>
  );
};

export default ProdReturnMinMaterialsReturnTable;
