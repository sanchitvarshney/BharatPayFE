import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import FixIssueTabelCellRenderer from "../Cellrenders/FixIssueTabelCellRenderer";
import { Button, IconButton } from "@mui/material";
import { Icons } from "@/components/icons";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";

interface Issue {
  id: string;
  selectedPart: { lable: string; value: string } | null;
  quantity: number | string;
  remarks: string;
  code: string;
  UOM: string;
  isNew: boolean;
}

type Props = {
  rowData: Issue[];
  setRowData: React.Dispatch<React.SetStateAction<Issue[]>>;
  addRow: () => void;
};

const FixIssuesTable: React.FC<Props> = ({ rowData, setRowData, addRow }) => {
  const gridRef = useRef<AgGridReact<Issue>>(null); // Corrected type here

  const getAllTableData = () => {
    const allData: Issue[] = [];

    const rowCount = gridRef.current?.api.getDisplayedRowCount() ?? 0;
    for (let i = 0; i < rowCount; i++) {
      const rowNode = gridRef.current?.api.getDisplayedRowAtIndex(i);
      if (rowNode && rowNode.data) {
        allData.push(rowNode.data);
      }
    }

    setRowData(allData);
  };

  const components = useMemo(
    () => ({
      textInputCellRenderer: (params: any) => <FixIssueTabelCellRenderer customFunction={getAllTableData} props={params} />,
    }),
    []
  );
  const handleDeleteRow = (id: string) => {
    setRowData(rowData.filter((row) => row.id !== id));
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "Action",
      field: "action",
      width: 80,
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center w-full h-full">
          <IconButton onClick={() => handleDeleteRow(params.data.id)}>
            <Icons.delete fontSize="small" color="error" />
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
            onClick={addRow}
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
      field: "id",
      flex: 1,
      hide: true,
      editable: false,
    },
    {
      headerName: "Code",
      field: "code",
      hide: true,
      flex: 1,
      editable: false,
    },
    {
      headerName: "Issue",
      field: "issue",
      hide: true,
      flex: 1,
      editable: false,
    },
    {
      headerName: "UOM",
      field: "UOM",
      hide: true,

      editable: false,
    },
    {
      headerName: "Part",
      field: "selectedPart",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
      editable: false,
    },
    {
      headerName: "Quantity",
      field: "quantity",
      flex: 1,
      cellRenderer: "textInputCellRenderer",
    },
    {
      headerName: "Remarks",
      field: "remarks",
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      editable: false,
    },
  ];
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "a" && (e.metaKey || e.ctrlKey)) {
        if ((e.target instanceof HTMLElement && e.target.isContentEditable) || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
          return;
        }
        e.preventDefault();
        addRow();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <div>
      <div className="ag-theme-quartz h-[calc(100vh-320px)]">
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
          suppressCellFocus={true}
          components={components}
          rowData={rowData}
          columnDefs={columnDefs}
          ref={gridRef}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
        />
      </div>
    </div>
  );
};

export default FixIssuesTable;
