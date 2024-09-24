import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
interface RowData {
    serialNo: number;
    type: string;
    reqNo: string;
    project: string;
    customer: string;
    createdBy: string;
    reqDateTime: string;
    productSku: string;
    productName: string;
    plannedQty: number;
    dueDate: string;
    qtyExecuted: number;
    qtyRemained: number;
  }
  

const CompletePPRTable: React.FC = () => {
  const [rowData] = useState<RowData[]>([
    {
        serialNo: 1,
        type: 'Manufacturing',
        reqNo: 'REQ-001',
        project: 'Project A',
        customer: 'Customer X',
        createdBy: 'John Doe',
        reqDateTime: '2024-09-01 10:00',
        productSku: 'SKU-1234',
        productName: 'Product A',
        plannedQty: 100,
        dueDate: '2024-09-15',
        qtyExecuted: 50,
        qtyRemained: 50,
      },
  ]);


  const columnDefs: ColDef[] = [
    { headerName: 'Serial No.', field: 'serialNo', sortable: true, filter: true },
  { headerName: 'Type', field: 'type', sortable: true, filter: true },
  { headerName: 'Req No.', field: 'reqNo', sortable: true, filter: true },
  { headerName: 'Project', field: 'project', sortable: true, filter: true },
  { headerName: 'Customer', field: 'customer', sortable: true, filter: true },
  { headerName: 'Created By', field: 'createdBy', sortable: true, filter: true },
  { headerName: 'Req/Date Time', field: 'reqDateTime', sortable: true, filter: true },
  { headerName: 'Product SKU', field: 'productSku', sortable: true, filter: true },
  { headerName: 'Product Name', field: 'productName', sortable: true, filter: true },
  { headerName: 'Planned Qty', field: 'plannedQty', sortable: true, filter: true },
  { headerName: 'Due Date', field: 'dueDate', sortable: true, filter: true },
  { headerName: 'Qty Executed', field: 'qtyExecuted', sortable: true, filter: true },
  { headerName: 'Qty Remained', field: 'qtyRemained', sortable: true, filter: true },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-150px)]">
      <AgGridReact  overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={rowData} columnDefs={columnDefs} />
    </div>
  );
};

export default CompletePPRTable;
