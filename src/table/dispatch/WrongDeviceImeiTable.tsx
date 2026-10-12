import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { showToast } from "@/utils/toasterContext";

export type WrongDeviceRow = {
  awbNo: string;
  serialNo: string;
  qty?: number;
  qtyEditable?: boolean;
  maxQty?: number;
};

type Props = {
  rowData: WrongDeviceRow[];
  setRowdata: React.Dispatch<React.SetStateAction<WrongDeviceRow[]>>;
};

const defaultColDef: ColDef = {
  sortable: true,
  filter: false,
  resizable: true,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

const ImeiTable: React.FC<Props> = ({ rowData, setRowdata }) => {
  const columnDefs = useMemo<ColDef<WrongDeviceRow>[]>(
    () => [
      {
        headerName: "#",
        sortable: false,
        valueGetter: "node.rowIndex+1",
        width: 80,
      },
      { headerName: "AWB No.", field: "awbNo", flex: 1 },
      { headerName: "Serial No", field: "serialNo", flex: 1 },
      {
        headerName: "Qty",
        field: "qty",
        width: 120,
        editable: (params) => !!params.data?.qtyEditable,
        cellEditor: "agNumberCellEditor",
        cellEditorParams: (params: any) => ({
          min: 1,
          max: params.data?.maxQty,
          precision: 0,
        }),
        valueSetter: (params) => {
          const qty = Math.floor(Number(params.newValue));
          const maxQty = params.data?.maxQty;
          if (!qty || qty < 1) {
            showToast("Qty must be at least 1", "error");
          } else if (maxQty && qty > maxQty) {
            showToast(`Qty cannot be more than ${maxQty}`, "error");
          } else {
            setRowdata((prev) =>
              prev.map((row) => (row === params.data ? { ...row, qty } : row)),
            );
          }
          return false;
        },
        cellRenderer: (params: any) => {
          const qty = params.value ?? 1;
          if (!params.data?.qtyEditable) return qty;
          return (
            <Tooltip title={`Click to edit qty (max ${params.data.maxQty})`}>
              <span className="flex items-center gap-[6px] cursor-pointer text-blue-700 font-medium">
                {qty}
                <EditIcon sx={{ fontSize: 14 }} />
              </span>
            </Tooltip>
          );
        },
      },
      {
        headerName: "",
        sortable: false,
        resizable: false,
        width: 80,
        cellRenderer: (params: any) => (
          <Tooltip title="Remove">
            <IconButton
              size="small"
              onClick={() =>
                // remove by reference so it stays correct when the grid is sorted
                setRowdata((prev) => prev.filter((row) => row !== params.data))
              }
            >
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [setRowdata],
  );

  return (
    <div className="ag-theme-quartz h-full">
      <AgGridReact
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        singleClickEdit
        stopEditingWhenCellsLoseFocus
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  );
};

export default ImeiTable;
