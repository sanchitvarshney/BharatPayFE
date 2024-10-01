import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
interface RowData {
    id: number;
    partCode: string;
    priority: string;
    qty: number;
    category: string;
    status: string;
    vendor: string;
    process: string;
    source: string;
    smyMiLoc: string;
  }
  

  const columnDefs: ColDef[] = [
    {
      headerName: 'ID',
      field: 'id',
      sortable: true,
      filter: false,
      width: 70,
    },
    {
      headerName: 'Part Code',
      field: 'partCode',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Priority',
      field: 'priority',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Qty',
      field: 'qty',
      sortable: true,
      filter: true,
      editable: true,
      valueParser: (params) => Number(params.newValue),
    },
    {
      headerName: 'Category',
      field: 'category',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Vendor',
      field: 'vendor',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Process',
      field: 'process',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Source',
      field: 'source',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'SMY_MI_LOC',
      field: 'smyMiLoc',
      sortable: true,
      filter: true,
    },
  ];

const MasterBomCraeteFileTable: React.FC = () => {
  const rowData: RowData[] = [
    {
      id: 1,
      partCode: 'PC001',
      priority: 'High',
      qty: 100,
      category: 'Category 1',
      status: 'Active',
      vendor: 'Vendor 1',
      process: 'Process 1',
      source: 'Source 1',
      smyMiLoc: 'Location 1',
    },
    {
      id: 2,
      partCode: 'PC002',
      priority: 'Medium',
      qty: 200,
      category: 'Category 2',
      status: 'Inactive',
      vendor: 'Vendor 2',
      process: 'Process 2',
      source: 'Source 2',
      smyMiLoc: 'Location 2',
    },
    // Add more rows as needed
  ]
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      floatingFilter: true,
    };
  }, []);
  return (
    <div>
      <div className=" ag-theme-quartz h-[calc(100vh-100px)]" >
        <AgGridReact  overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true}  rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSize={20} />
      </div>
    </div>
  );
};

export default MasterBomCraeteFileTable;
