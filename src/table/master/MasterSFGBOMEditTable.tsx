import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { HiMiniTrash } from "react-icons/hi2";
import { Input } from "@/components/ui/input";
import { Select } from "antd";
import { IoCheckmark } from "react-icons/io5";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
interface RowData {
  components: string;
  quantity: number;
  partCode: string;
  status: string;
  priority: string;
  qty: string;
  category: string;
  source: string;
  smtMiLoc: string;
  id: number;
}

const MasterSFGBOMEditTable: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);

  const handleAddRow = () => {
    const newRow: RowData = {
      id: rowData.length + 1,
      components: "component",
      quantity: 0,
      partCode: "partcode",
      status: "",
      priority: "",
      qty: "",
      category: "",
      source: "",
      smtMiLoc: "",
    };
    setRowData([...rowData, newRow]);
  };

  const handleDeleteRow = (id: number) => {
    setRowData(rowData.filter((row) => row.id !== id));
  };

  const handleComponentChange = (id: number, value: string) => {
    setRowData(rowData.map((row) => (row.id === id ? { ...row, component: value } : row)));
  };

  const handleQuantityChange = (id: number, value: number) => {
    setRowData(rowData.map((row) => (row.id === id ? { ...row, quantity: value } : row)));
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "Action",
      field: "action",
      width: 120,
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center w-full h-full">
          {" "}
          <Button variant={"outline"} className="p-0 border shadow-none h-[30px] w-[30px]" onClick={() => handleDeleteRow(params.data.id)}>
            <HiMiniTrash className="h-[18px] w-[18px] text-red-500" />
          </Button>
        </div>
      ),
      headerComponent: () => (
        <div className="flex items-center justify-center w-full h-full">
          <Button className="p-0 bg-cyan-700 hover:bg-cyan-800 max-h-max h-[30px] w-[30px]" onClick={handleAddRow}>
            <Plus className="h-[18px] w-[18px]" />
          </Button>
        </div>
      ),
    },
    {
      headerName: "Components",
      field: "components",
      sortable: false,
      filter: false,
    },
    {
      headerName: "Part Code",
      field: "partCode",
      sortable: false,
      filter: false,
    },

    {
      headerName: "Status",
      field: "status",
      cellRenderer: (params: any) => (
        <Select
          className="w-full"
          defaultValue="lucy"
          onChange={(value) => handleComponentChange(params.data.id, value)}
          options={[
            { value: "jack", label: "Active" },
            { value: "lucy", label: "Inactive" },
          ]}
        />
      ),
    },
    {
      headerName: "Priority",
      field: "priority",
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center w-full h-full">
          <Input type="number" className="border-slate-400 py-[4px]" value={params.value} onChange={(e) => handleQuantityChange(params.data.id, Number(e.target.value))} style={{ width: "100%" }} />
        </div>
      ),
    },
    {
      headerName: "Qty",
      field: "qty",
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center w-full h-full">
          <Input type="number" className="border-slate-400 py-[4px]" value={params.value} onChange={(e) => handleQuantityChange(params.data.id, Number(e.target.value))} style={{ width: "100%" }} />
        </div>
      ),
    },
    {
      headerName: "Category",
      field: "category",
      cellRenderer: (params: any) => (
        <Select
          className="w-full"
          defaultValue="lucy"
          onChange={(value) => handleComponentChange(params.data.id, value)}
          options={[
            { value: "jack", label: "Active" },
            { value: "lucy", label: "Inactive" },
          ]}
        />
      ),
    },
    {
      headerName: "Source",
      field: "source",
      cellRenderer: (params: any) => (
        <Select
          className="w-full"
          defaultValue="lucy"
          onChange={(value) => handleComponentChange(params.data.id, value)}
          options={[
            { value: "jack", label: "Active" },
            { value: "lucy", label: "Inactive" },
          ]}
        />
      ),
    },
    {
      headerName: "SMT/MI LOC",
      field: "smtMiLoc",
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center w-full h-full">
          <Input type="number" className="border-slate-400 py-[4px]" value={params.value} onChange={(e) => handleQuantityChange(params.data.id, Number(e.target.value))} style={{ width: "100%" }} />
        </div>
      ),
    },
    {
      headerName: "",
      field: "save",
      cellRenderer: () => (
        <div className="flex items-center justify-center w-full h-full">
          <Button className="bg-cyan-700 hover:bg-cyan-800 h-[30px] w-[30px] p-0 flex justify-center items-center"><IoCheckmark className="h-[18px] w-[18px] " /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-100px)]">
      <AgGridReact  overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={rowData} columnDefs={columnDefs} />
    </div>
  );
};

export default MasterSFGBOMEditTable;
