import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { StatusPanelDef } from "@ag-grid-community/core";
import CreateProductionCellrenderer from "../Cellrenders/CreateProductionCellrenderer";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
interface RowData {
  remark: string;
  id: string;
  isNew: boolean;
  component: { lable: string; value: string } | null;
  qty: string;
  uom: string;
  requiredQty: string;
  compKey: string;
}
type Props = {
  rowData: RowData[];
  setRowdata: React.Dispatch<React.SetStateAction<RowData[]>>;
  addrow: () => void;
  enabled: boolean;
};
const CreateProductionTable: React.FC<Props> = ({ rowData, setRowdata, addrow, enabled }) => {
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
 console.log(addrow,enabled)
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
      textInputCellRenderer: (params: any) => <CreateProductionCellrenderer props={params} customFunction={getAllTableData} />,
    }),
    []
  );
  const handleDeleteRow = (id: string) => {
    setRowdata(rowData.filter((row) => row.compKey !== id));
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "",
      field: "action",
      width: 120,
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center w-full h-full">
          <IconButton color="error" onClick={() => handleDeleteRow(params.data.compKey)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      ),
      // headerComponent: () => (
      //   <div className="flex items-center justify-center w-full h-full">
      //     <Button
      //       disabled={!enabled}
      //       variant="contained"
      //       color="primary"
      //       style={{
      //         borderRadius: "10%",
      //         width: 25,
      //         height: 25,
      //         minWidth: 0,
      //         padding: 0,
      //       }}
      //       onClick={addrow}
      //       size="small"
      //       sx={{ zIndex: 1 }}
      //     >
      //       <Icons.add fontSize="small" />
      //     </Button>
      //   </div>
      // ),
    },
    {
      headerName: "Component",
      field: "componentName",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
    },
    {
      headerName: "Qty",
      field: "requiredQty",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
    },
    {
      headerName: "Category",
      field: "category",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
    },
    // {
    //   headerName: "Status",
    //   field: "bomstatus",
    //   cellRenderer: "textInputCellRenderer",
    //   flex: 1,
    // },

    {
      headerName: "Remark (If Needed)",
      field: "remark",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
    },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-200px)]">
      <AgGridReact
        suppressCellFocus={true}
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
          return null;
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
      />
    </div>
  );
};

export default CreateProductionTable;
