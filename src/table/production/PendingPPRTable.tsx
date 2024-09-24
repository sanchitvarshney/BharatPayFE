import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoDocumentTextSharp } from "react-icons/io5";
import { HiMiniViewfinderCircle } from "react-icons/hi2";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
interface RowData {
  id: number;
  pprNo: string;
  type: string;
  project: string;
  customer: string;
  createdBy: string;
  reqDateTime: string;
  productSku: string;
  productName: string;
  plannedQty: number;
  dueDate: string;
  executedQty: number;
  qtyRemaining: number;
}

const PendingPPRTable: React.FC = () => {
  const [rowData] = useState<RowData[]>([
    {
        id: 1,
        pprNo: 'PPR-001',
        type: 'Manufacturing',
        project: 'Project A',
        customer: 'Customer X',
        createdBy: 'John Doe',
        reqDateTime: '2024-09-01 10:00',
        productSku: 'SKU-1234',
        productName: 'Product A',
        plannedQty: 100,
        dueDate: '2024-09-15',
        executedQty: 50,
        qtyRemaining: 50,
      },
  ]);


  const columnDefs: ColDef[] = [
    {
      headerName: "Action",
      field: "action",
      cellRenderer: () => (
        <DropdownMenu>
          <div className="flex items-center px-[20px] h-full">
            <DropdownMenuTrigger className="p-[5px] focus-visible::ring-slate-300 ">
              <BsThreeDotsVertical className="font-[600] text-[20px] text-slate-600" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="w-[170px]">
            <DropdownMenuItem className="flex items-center gap-[10px] text-slate-600" >
              <IoDocumentTextSharp className="h-[18px] w-[18px] text-slate-500" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-[10px] text-slate-600" >
              <HiMiniViewfinderCircle className="h-[18px] w-[18px] text-slate-500" />
              Map Cost Center
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    { headerName: "ID", field: "id", sortable: true, filter: true },
    { headerName: "PPR No.", field: "pprNo", sortable: true, filter: true },
    { headerName: "Type", field: "type", sortable: true, filter: true },
    { headerName: "Project", field: "project", sortable: true, filter: true },
    { headerName: "Customer", field: "customer", sortable: true, filter: true },
    { headerName: "Created By", field: "createdBy", sortable: true, filter: true },
    { headerName: "Req Date/Time", field: "reqDateTime", sortable: true, filter: true },
    { headerName: "Product SKU", field: "productSku", sortable: true, filter: true },
    { headerName: "Product Name", field: "productName", sortable: true, filter: true },
    { headerName: "Planned Qty", field: "plannedQty", sortable: true, filter: true },
    { headerName: "Due Date", field: "dueDate", sortable: true, filter: true },
    { headerName: "Executed Qty", field: "executedQty", sortable: true, filter: true },
    { headerName: "Qty Remaining", field: "qtyRemaining", sortable: true, filter: true },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-150px)]">
      <AgGridReact  overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={rowData} columnDefs={columnDefs} />
    </div>
  );
};

export default PendingPPRTable;
