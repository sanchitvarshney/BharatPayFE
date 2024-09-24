import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { HiMiniTrash } from "react-icons/hi2";
import { Input } from "@/components/ui/input";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";

interface RowData {
  documentName: string;
  uploadDocument: File | null;
  id: number;
}

const MaterialInvardUploadDocumentTable: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);

  const handleAddRow = () => {
    const newRow: RowData = {
      id: rowData.length + 1,
      documentName: "",
      uploadDocument: null,
    };
    setRowData([...rowData, newRow]);
  };

  const handleDeleteRow = (id: number) => {
    setRowData(rowData.filter((row) => row.id !== id));
  };

  const handleInputChange = (id: number, field: keyof RowData, value: any) => {
    setRowData(rowData.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
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
          <Button className="bg-cyan-700 hover:bg-cyan-800 h-[30px] w-[30px] p-0 flex justify-center items-center" onClick={handleAddRow}>
            <Plus className="h-[18px] w-[18px]" />
          </Button>
        </div>
      ),
    },
    {
      headerName: "Document Name",
      field: "documentName",
      flex:1,
      cellRenderer: (params: any) => <div className="flex items-center justify-center w-full h-full"><Input type="text" className="border-slate-400 py-[4px]" value={params.value} onChange={(e) => handleInputChange(params.data.id, "documentName", e.target.value)} style={{ width: "100%" }} /></div>
    },
    {
      headerName: "Upload Document",
      field: "uploadDocument",
      flex:1,
      cellRenderer: (params: any) => <div className="flex items-center justify-center w-full h-full"><Input type="file" className="border-slate-400 py-[4px]" onChange={(e) => handleInputChange(params.data.id, "uploadDocument", e.target.files?.[0] || null)} style={{ width: "100%" }} /></div>
    },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-50px)]">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        suppressCellFocus={true}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
      />
    </div>
  );
};

export default MaterialInvardUploadDocumentTable;
