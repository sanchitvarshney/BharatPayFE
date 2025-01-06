import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
interface RowData {
  srNo: number;
  label: string;
  company: string;
  state: string;
  panNo: string;
  gst: string;
}

const columnDefs: ColDef[] = [
  { headerName: "SR No.", field: "srNo", sortable: true, filter: true, flex: 1 },
  { headerName: "Label", field: "label", sortable: true, filter: true, flex: 1 },
  { headerName: "Company", field: "company", sortable: true, filter: true, flex: 1 },
  { headerName: "State", field: "state", sortable: true, filter: true, flex: 1 },
  { headerName: "PAN No.", field: "panNo", sortable: true, filter: true, flex: 1 },
  { headerName: "GST", field: "gst", sortable: true, filter: true, flex: 1 },
];

const MasterShippingAddressTable: React.FC = () => {
  const rowData: RowData[] = [
    {
      srNo: 1,
      label: "Label A",
      company: "Company A Pvt Ltd",
      state: "Maharashtra",
      panNo: "ABCDE1234F",
      gst: "27ABCDE1234F1Z5",
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
      <div className=" ag-theme-quartz h-[calc(100vh-190px)]">
        <AgGridReact loadingOverlayComponent={CustomLoadingOverlay} overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSize={20} />
      </div>
    </div>
  );
};

export default MasterShippingAddressTable;
