import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import FixIssueTabelCellRenderer from "../Cellrenders/FixIssueTabelCellRenderer";

interface Issue {
  id: number;
  issue: string;
  selectedPart: string;
  quantity: number | string;
  remarks: string;
  isChecked: boolean;
  code: string;
}

type Props = {
  rowData: Issue[];
  setRowData: React.Dispatch<React.SetStateAction<Issue[]>>;
};

const FixIssuesTable: React.FC<Props> = ({ rowData, setRowData }) => {
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

  const columnDefs: ColDef[] = [
    {
      headerName: "",
      field: "isChecked",
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      editable: false,
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
          headerHeight={0}
          ref={gridRef}
        />
      </div>
    </div>
  );
};

export default FixIssuesTable;
