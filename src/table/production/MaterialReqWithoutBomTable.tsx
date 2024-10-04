import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { HiMiniTrash } from "react-icons/hi2";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { StatusPanelDef } from "@ag-grid-community/core";
import MaterialRequestWithoutBomCellrender from "../Cellrenders/MaterialRequestWithoutBomCellrender";
import { useAppSelector } from "@/hooks/useReduxHook";
interface RowData {
  code: string;
  pickLocation: string;
  orderqty: string;
  remarks: string;
  id: number;
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
          <Button variant={"outline"} className="border shadow-none p-0 h-[30px] w-[30px]" onClick={() => handleDeleteRow(params.data.id)}>
            <HiMiniTrash className="h-[18px] w-[18px] text-red-500" />
          </Button>
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
      headerName: `${type === "part" ? "Part Code" : "SKU"}`,
      field: "code",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
    },
    {
      headerName: "Pick Location",
      field: "pickLocation",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
    },
    {
      headerName: "Available Qty",
      field: "availableqty",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
    },
    {
      headerName: "Order Qty",
      field: "orderqty",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
    },
    {
      headerName: "Remarks",
      field: "remarks",
      cellRenderer: "textInputCellRenderer",
      flex: 1,
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
        const newId = rowData.length + 1;
        const newRow: RowData = {
          id: newId,
          code: "",
          pickLocation: "",
          orderqty: "",
          remarks: "",
          isNew: true,
          availableqty: "",
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
        ref={gridRef}
        suppressCellFocus={true}
        columnDefs={columnDefs}
        suppressRowClickSelection={false}
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

export default MaterialReqWithoutBomTable;
