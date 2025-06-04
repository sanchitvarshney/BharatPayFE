import React, { useEffect, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { StatusPanelDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { Button, IconButton } from "@mui/material";
import { Icons } from "@/components/icons";
import { generateUniqueId } from "@/utils/uniqueid";
import POCellRenderer from "@/table/Cellrenders/POCellRenderer";
interface RowData {
  partComponent: { lable: string; value: string } | null;
  qty: number;
  rate: string;
  taxableValue: number;
  foreignValue: number;
  hsnCode: string;
  gstType: string;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  location: { lable: string; value: string } | null;
  autoConsump: string;
  remarks: string;
  id: string;
  currency: string;
  isNew?: boolean;
  excRate: number;
  uom: string;
}
type Props = {
  rowData: RowData[];
  setRowData: React.Dispatch<React.SetStateAction<RowData[]>>;
};
const ComponentTable: React.FC<Props> = ({ rowData, setRowData, }) => {
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const getAllTableData = () => {
    const allData: RowData[] = [];
console.log(allData)
    // const rowCount = gridRef.current?.api.getDisplayedRowCount() ?? 0;
    // for (let i = 0; i < rowCount; i++) {
    //   const rowNode = gridRef.current?.api.getDisplayedRowAtIndex(i);

    //   if (rowNode && rowNode.data) {
    //     allData.push(rowNode.data);
    //   }
    // }
    // setTotal(calculateTotals(allData));
  };

  const handleAddRow = () => {
    getAllTableData();
    const newRow: any = {
      id: generateUniqueId(),
      partComponent: null,
      qty: 0,
      rate: "",
      taxableValue: 0,
      foreignValue: 0,
      hsnCode: "",
      gstRate: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      location: null,
      autoConsump: "",
      remarks: "",
      isNew: true,
      uom: "",
    };
    setRowData([newRow, ...rowData]);
  };

  useEffect(()=>{
    handleAddRow();
  },[])
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
      textInputCellRenderer: (params: any) => <POCellRenderer props={params} customFunction={getAllTableData} />,
      
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
      headerName: "Part Component",
      field: "partComponent",
      cellRenderer: "textInputCellRenderer",
      minWidth: 500,
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

export default ComponentTable;
