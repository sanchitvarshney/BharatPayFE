import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { StatusPanelDef } from "@ag-grid-community/core";
import { useAppSelector } from "@/hooks/useReduxHook";
import AddtrcTableCellRenderer from "../Cellrenders/AddtrcTableCellRenderer";
import { IconButton } from "@mui/material";
import { Icons } from "@/components/icons";
interface RowData {
  remarks: string;
  id: number;
  isNew: boolean;
  issues: string[];
  IMEI: string;
}
type Props = {
  rowData: RowData[];
  setRowdata: React.Dispatch<React.SetStateAction<RowData[]>>;
  addRow: () => void;
};
const AddtrcTable: React.FC<Props> = ({ rowData, setRowdata, addRow }) => {
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
      textInputCellRenderer: (params: any) => <AddtrcTableCellRenderer props={params} customFunction={getAllTableData} />,
    }),
    []
  );
  const handleDeleteRow = (id: number) => {
    setRowdata(rowData.filter((row) => row.id !== id));
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "Action",
      field: "action",
      width: 120,
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center w-full h-full">
          <IconButton   onClick={() => handleDeleteRow(params.data.id)}>
            <Icons.delete color="error"/>
          </IconButton>
        </div>
      ),
      headerComponent: () => (
        <div className="flex items-center justify-center w-full h-full">
          <Button className="bg-cyan-700 hover:bg-cyan-800 h-[30px] w-[30px] p-0 flex justify-center items-center" onClick={addRow}>
            <Plus className="h-[18px] w-[18px]" />
          </Button>
        </div>
      ),
    },

    {
      headerName: "IMEI/Serial No.",
      field: "IMEI",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
    },
    {
      headerName: "Issues",
      field: "issues",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
    },
    {
      headerName: "Remarks",
      field: "remarks",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
    },
  ];

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "a" && (e.metaKey || e.ctrlKey)) {
        if ((e.target instanceof HTMLElement && e.target.isContentEditable) || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
          return;
        }
        e.preventDefault();
        const newId = rowData.length + 1;
        const newRow: RowData = {
          id: newId,
          remarks: "",
          isNew: true,
          IMEI: "",
          issues: [],
        };
        setRowdata((prev) => [...prev, newRow].reverse());
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  console.log(rowData);
  return (
    <div className=" ag-theme-quartz h-[calc(100vh-100px)]">
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
