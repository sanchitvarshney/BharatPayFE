import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";

import { Input } from "@/components/ui/input";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";

interface RowData {
  id: number;
  componentName: string;
  remarks: string;
  requstqty: string;
  sfcontrol: string;
  sfqty: string;
  stockqty: string;
  requiredqty: string;
  componentCode: string;
}

const MaterialReqWithBomPackingTable: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([
    {
      id: 1,
      componentName: "--",
      remarks: "--",
      requstqty: "---",
      sfcontrol: "---",
      sfqty: "---",
      stockqty: "---",
      requiredqty: "",
      componentCode: "--",
    },
  ]);

  const handleQuantityChange = (id: number, value: number) => {
    setRowData(rowData.map((row) => (row.id === id ? { ...row, quantity: value } : row)));
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "Component Name",
      field: "componentName",
      sortable: false,
      filter: false,
    },
    {
      headerName: "Component Code",
      field: "componentCode",
      sortable: false,
      filter: false,
    },
    {
      headerName: "Required QTY",
      field: "requiredqty",
      sortable: false,
      filter: false,
    },
    {
      headerName: "Stock QTY",
      field: "stockqty",
      sortable: false,
      filter: false,
    },
    {
      headerName: "SF QTY",
      field: "sfqty",
      sortable: false,
      filter: false,
    },
    {
      headerName: "SF Control",
      field: "sfcontrol",
      sortable: false,
      filter: false,
    },
    {
      headerName: "Request QTY",
      field: "requstqty",
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center w-full h-full">
          <Input className="border-slate-400 py-[4px]" value={params.value} onChange={(e) => handleQuantityChange(params.data.id, Number(e.target.value))} style={{ width: "100%" }} />
        </div>
      ),
    },
    {
      headerName: "Remarks",
      field: "remarks",
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center w-full h-full">
          <Input  className="border-slate-400 py-[4px]" value={params.value} onChange={(e) => handleQuantityChange(params.data.id, Number(e.target.value))} style={{ width: "100%" }} />
        </div>
      ),
    },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-200px)]">
      <AgGridReact  overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={rowData} columnDefs={columnDefs} />
    </div>
  );
};

export default MaterialReqWithBomPackingTable;
