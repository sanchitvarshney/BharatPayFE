import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
interface RowData {
    id: number;
    requestDate: string;
    requestId: string;
    rmQty: number;
    pickLocation: string;
  }

const columnDefs: ColDef[] = [
    {
        headerName: 'Action',
        field: 'action',
        cellRenderer: () =>"action",
      },
      { headerName: 'ID', field: 'id', sortable: true, filter: true,flex:1 },
      { headerName: 'Request Date', field: 'requestDate', sortable: true, filter: true,flex:1 },
      { headerName: 'Request ID', field: 'requestId', sortable: true, filter: true ,flex:1},
      { headerName: 'RM Qty', field: 'rmQty', sortable: true, filter: true },
      { headerName: 'Pick Location', field: 'pickLocation', sortable: true, filter: true,flex:1 },
];

const MrRequisitionReqTable: React.FC = () => {
  const rowData: RowData[] = [
    {
        id: 1,
        requestDate: '2024-08-31',
        requestId: 'REQ-1234',
        rmQty: 50,
        pickLocation: 'Location A',
      },
      {
        id: 2,
        requestDate: '2024-08-30',
        requestId: 'REQ-5678',
        rmQty: 100,
        pickLocation: 'Location B',
      },
    // Add more rows as needed
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);
  return (
    <div>
      <div className=" ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact  overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSize={10} />
      </div>
    </div>
  );
};

export default MrRequisitionReqTable;
