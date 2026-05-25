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

export interface RowData {
  id: string;
  partComponent: { label: string; value: string } | null;
  hsn?: string;
  qty: number;
  rate: string;
  remarks: string;
  isNew?: boolean;
  excRate: number;
  uom: string;
  currency?: string;
  updaterow?: string;
  pickLocation?: { label?: string; value?: string } | null;
  // GST columns
  gstRate?: string;
  cgst?: number;
  sgst?: number;
  igst?: number;
  taxableAmount?: number;
  totalAmount?: number;
}

interface Totals {
  totalAmount?: number;
  taxableAmount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
}

type Props = {
  rowData: RowData[];
  setRowData: React.Dispatch<React.SetStateAction<RowData[]>>;
  setTotal: React.Dispatch<React.SetStateAction<Totals>>;
  exchange: number | string;
  currency: string;
  pickLocation?: LocationType | null;
  gstType?: string; // "Inter State" | "Intra State" – passed from parent
};

const AddPartCodeTable: React.FC<Props> = ({
  rowData,
  setRowData,
  setTotal,
  exchange,
  currency,
  pickLocation = null,
  gstType = "",
}) => {
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
    const taxableAmount = allData.reduce(
      (sum, row) => sum + (Number(row.taxableAmount) || (Number(row.qty) || 0) * (Number(row.rate) || 0)),
      0
    );
    const cgst = allData.reduce((sum, row) => sum + (Number(row.cgst) || 0), 0);
    const sgst = allData.reduce((sum, row) => sum + (Number(row.sgst) || 0), 0);
    const igst = allData.reduce((sum, row) => sum + (Number(row.igst) || 0), 0);
    const totalAmount = taxableAmount + cgst + sgst + igst;
    setTotal({ taxableAmount, cgst, sgst, igst, totalAmount });
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
      isNew: true,
      excRate: Number(exchange) || 0,
      uom: "",
      currency,
      pickLocation: null,
      gstRate: "",
      cgst: 0,
      sgst: 0,
      igst: 0,
      taxableAmount: 0,
      totalAmount: 0,
    };
    setRowData([newRow, ...rowData]);
  };

  const handleDeleteRow = (id: string) => {
    setRowData(rowData.filter((row) => row.id !== id));
  };

  const statusBar = useMemo<{ statusPanels: StatusPanelDef[] }>(() => {
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
        <PartCodeChallanCellRenderer
          props={params}
          customFunction={getAllTableData}
          pickLocation={pickLocation}
          gstType={gstType}
        />
      ),
    }),
    [pickLocation, gstType]
  );

  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      width: 55,
      pinned: "left",
    },
    {
      headerName: "Action",
      field: "action",
      width: 80,
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
      minWidth: 200,
    },
    {
      headerName: "Stock",
      field: "stock",
      cellRenderer: "challanCellRenderer",
      width: 100,
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
      width: 130,
    },
    {
      headerName: "Rate",
      field: "rate",
      cellRenderer: "challanCellRenderer",
      width: 130,
    },
    // ── New GST columns ──────────────────────────────────
    {
      headerName: "GST Type",
      field: "gstType",
      cellRenderer: "challanCellRenderer",
      width: 130,
    },
    {
      headerName: "GST Rate (%)",
      field: "gstRate",
      cellRenderer: "challanCellRenderer",
      width: 130,
    },
    {
      headerName: "CGST",
      field: "cgst",
      cellRenderer: "challanCellRenderer",
      width: 110,
    },
    {
      headerName: "SGST",
      field: "sgst",
      cellRenderer: "challanCellRenderer",
      width: 110,
    },
    {
      headerName: "IGST",
      field: "igst",
      cellRenderer: "challanCellRenderer",
      width: 110,
    },
    // ── End columns ──────────────────────────────────────
    {
      headerName: "Taxable Amount",
      field: "taxableAmount",
      cellRenderer: "challanCellRenderer",
      width: 140,
    },
    {
      headerName: "Total Amount",
      field: "totalAmount",
      cellRenderer: "challanCellRenderer",
      width: 140,
    },
    {
      headerName: "Remarks",
      field: "remarks",
      cellRenderer: "challanCellRenderer",
      minWidth: 180,
    },
    {
      headerName: "uom",
      field: "uom",
      hide: true,
    },
  ];

  return (
    <div className="ag-theme-quartz h-[calc(100vh-200px)]">
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
          if (focusedCell) focusedCell.focus();
          if (focusButton) focusButton.focus();
        }}
        navigateToNextCell={() => null}
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
