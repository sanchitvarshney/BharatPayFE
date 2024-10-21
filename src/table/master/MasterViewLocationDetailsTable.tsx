import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";

interface RowData {
    id: number;
    locationName: string;
    parentLocation: string;
    locationType: string;
    locationFor: string;
    locationAddress: string;
    assignedTo: string;
    insertDate: string;
    insertBy: string;
  }

const columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true },
    { headerName: 'Location Name', field: 'locationName', sortable: true, filter: true },
    { headerName: 'Parent Location', field: 'parentLocation', sortable: true, filter: true },
    { headerName: 'Location Type', field: 'locationType', sortable: true, filter: true },
    { headerName: 'Location For', field: 'locationFor', sortable: true, filter: true },
    { headerName: 'Location Address', field: 'locationAddress', sortable: true, filter: true },
    { headerName: 'Assigned To', field: 'assignedTo', sortable: true, filter: true },
    { headerName: 'Insert Date', field: 'insertDate', sortable: true, filter: true },
    { headerName: 'Insert By', field: 'insertBy', sortable: true, filter: true },
];

const MasterViewLocationDetailsTable: React.FC = () => {
  const rowData: RowData[] = [
    {
        id: 1,
        locationName: 'Main Warehouse',
        parentLocation: 'Head Office',
        locationType: 'Warehouse',
        locationFor: 'Storage',
        locationAddress: '123 Main St, City, Country',
        assignedTo: 'John Doe',
        insertDate: '2024-08-31',
        insertBy: 'Admin',
      },
      {
        id: 2,
        locationName: 'Branch Office',
        parentLocation: 'Head Office',
        locationType: 'Office',
        locationFor: 'Operations',
        locationAddress: '456 Market Rd, City, Country',
        assignedTo: 'Jane Smith',
        insertDate: '2024-08-31',
        insertBy: 'Admin',
      },
    // Add more rows as needed
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      floatingFilter: true,
    };
  }, []);
  return (
    <div>
      <div className=" ag-theme-quartz h-[calc(100vh-50px)]">
        <AgGridReact loadingOverlayComponent={CustomLoadingOverlay}  overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSize={20} />
      </div>
    </div>
  );
};

export default MasterViewLocationDetailsTable;
