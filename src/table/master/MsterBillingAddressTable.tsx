import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
interface RowData {
    label: string;
    company: string;
    state: string;
    panNo: string;
    gst: string;
    cin: string;
    registerDate: string;
  }

const columnDefs: ColDef[] = [
    { headerName: 'Label', field: 'label', sortable: true, filter: true,flex:1 },
    { headerName: 'Company', field: 'company', sortable: true, filter: true ,flex:1},
    { headerName: 'State', field: 'state', sortable: true, filter: true,flex:1 },
    { headerName: 'PAN No.', field: 'panNo', sortable: true, filter: true,flex:1 },
    { headerName: 'GST', field: 'gst', sortable: true, filter: true,flex:1 },
    { headerName: 'CIN', field: 'cin', sortable: true, filter: true ,flex:1},
    { headerName: 'Register Date', field: 'registerDate', sortable: true, filter: true ,flex:1},
];

const MsterBillingAddressTable: React.FC = () => {
  const rowData: RowData[] = [
    {
        label: 'Company A',
        company: 'Company A Pvt Ltd',
        state: 'Maharashtra',
        panNo: 'ABCDE1234F',
        gst: '27ABCDE1234F1Z5',
        cin: 'L12345MH1996PLC123456',
        registerDate: '2024-09-01',
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
      <div className=" ag-theme-quartz h-[calc(100vh-150px)]">
        <AgGridReact  overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSize={10} />
      </div>
    </div>
  );
};

export default MsterBillingAddressTable;
