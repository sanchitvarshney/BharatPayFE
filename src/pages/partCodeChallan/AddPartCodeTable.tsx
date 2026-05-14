import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { StatusPanelDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { Button, IconButton } from "@mui/material";
import { Icons } from "@/components/icons";
import { generateUniqueId } from "@/utils/uniqueid";
import PartCodeChallanCellRenderer from "@/table/Cellrenders/PartCodeChallanCellRenderer";
import { LocationType } from "@/components/reusable/SelectLocationAcordingModule";

interface RowData {
  id: string;
  partComponent: { label: string; value: string } | null;
  hsn?: string;
  qty: number;
  rate: string;
  remarks: string;
  gstRate: string;
  gstState: { label: string; value: string } | null;
  isNew?: boolean;
  excRate: number;
  uom: string;
  currency?: string;
  pickLocation?: { label?: string; value?: string } | null;
}

interface Totals {
  totalAmount?: number;
}

type Props = {
  rowData: RowData[];
  setRowData: React.Dispatch<React.SetStateAction<RowData[]>>;
  setTotal: React.Dispatch<React.SetStateAction<Totals>>;
  exchange: number | string;
  currency: string;
  pickLocation?: LocationType | null;
};

const AddPartCodeTable: React.FC<Props> = ({ rowData, setRowData, setTotal, exchange, currency, pickLocation = null }) => {
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
    const totalAmount = allData.reduce(
      (sum, row) => sum + (Number(row.qty) || 0) * (Number(row.rate) || 0),
      0
    );
    setTotal({ totalAmount });
  };

  const handleAddRow = () => {
    getAllTableData();
    const newRow: RowData = {
      id: generateUniqueId(),
      partComponent: null,
      hsn: "",
      qty: 0,
      rate: "",
      remarks: "",
      gstRate: "",
      gstState: null,
      isNew: true,
      excRate: Number(exchange) || 0,
      uom: "",
      currency,
      pickLocation: null,
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
      challanCellRenderer: (params: any) => (
        <PartCodeChallanCellRenderer props={params} customFunction={getAllTableData} pickLocation={pickLocation} />
      ),
    }),
    [pickLocation]
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
          <IconButton color="error" onClick={() => handleDeleteRow(params.data.id)}>
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
      cellRenderer: "challanCellRenderer",
      hide: true,
    },
    {
      headerName: "Part Component",
      field: "partComponent",
      cellRenderer: "challanCellRenderer",
      minWidth: 300,
    },
    {
      headerName: "Pick Location",
      field: "pickLocation",
      cellRenderer: "challanCellRenderer",
      minWidth: 300,
    },
    {
      headerName: "Stock",
      field: "stock",
      cellRenderer: "challanCellRenderer",
      width: 120,
    },
    {
      headerName: "HSN",
      field: "hsn",
      cellRenderer: "challanCellRenderer",
      width: 120,
    },
    {
      headerName: "Qty",
      field: "qty",
      cellRenderer: "challanCellRenderer",
    },
    {
      headerName: "Rate",
      field: "rate",
      cellRenderer: "challanCellRenderer",
      width: 200,
    },
    {
      headerName: "GST Type",
      field: "gstState",
      cellRenderer: "challanCellRenderer",
      minWidth: 170,
    },
    {
      headerName: "GST Rate",
      field: "gstRate",
      cellRenderer: "challanCellRenderer",
      width: 130,
    },
    {
      headerName: "Remarks",
      field: "remarks",
      cellRenderer: "challanCellRenderer",
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

export default AddPartCodeTable;
