import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { StatusPanelDef } from "@ag-grid-community/core";
import MaterialRequestWithoutBomCellrender from "../Cellrenders/MaterialRequestWithoutBomCellrender";
import { useAppSelector } from "@/hooks/useReduxHook";
import { CustomButton } from "@/components/reusable/CustomButton";
import { Icons } from "@/components/icons";
import { IconButton } from "@mui/material";

interface RowData {
  code: string;
  pickLocation: string;
  orderqty: string;
  remarks: string;
  id: string;
  isNew: boolean;
  availableqty: string;
}
type Props = {
  rowData: RowData[];
  setRowdata: React.Dispatch<React.SetStateAction<RowData[]>>;
  addRow: () => void;
};
const MaterialReqWithoutBomTable: React.FC<Props> = ({ rowData, setRowdata, addRow }) => {
  const { type } = useAppSelector((state) => state.materialRequestWithoutBom);
  console.log(type);
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
      textInputCellRenderer: (params: any) => <MaterialRequestWithoutBomCellrender props={params} customFunction={getAllTableData} />,
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
            <Icons.delete fontSize="small" color="error" />
          </IconButton>
        </div>
      ),
      headerComponent: () => (
        <div className="flex items-center justify-center w-full h-full">
          <CustomButton className="bg-cyan-700 hover:bg-cyan-800 h-[30px] w-[30px] p-0 flex justify-center items-center" onClick={addRow}>
            <Icons.add fontSize="small" />
          </CustomButton>
        </div>
      ),
      pinned: "left",
    },

    {
      headerName: `${type === "part" ? "Part Code" : "SKU"}`,
      field: "code",
      cellRenderer: "textInputCellRenderer",

      minWidth: 300,
    },
    {
      headerName: "Pick Location",
      field: "pickLocation",
      cellRenderer: "textInputCellRenderer",

      minWidth: 300,
    },
    {
      headerName: "Available Qty",
      field: "availableqty",
      cellRenderer: "textInputCellRenderer",
    },
    {
      headerName: "Order Qty",
      field: "orderqty",
      cellRenderer: "textInputCellRenderer",
      minWidth: 250,
    },
    {
      headerName: "Remarks",
      field: "remarks",
      cellRenderer: "textInputCellRenderer",
    },
    {
      headerName: "unit",
      field: "unit",
      hide: true,
    },
  ];

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "a" && (e.metaKey || e.ctrlKey)) {
        if ((e.target instanceof HTMLElement && e.target.isContentEditable) || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
          return;
        }
        e.preventDefault();
        addRow()
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  console.log(rowData);
  return (
    <div className=" ag-theme-quartz h-[calc(100vh-100px)]">
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
        navigateToNextCell={() => {
          return null; // Returning null prevents default focus movement
        }}
      />
    </div>
  );
};

export default MaterialReqWithoutBomTable;
