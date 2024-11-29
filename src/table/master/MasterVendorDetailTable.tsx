import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { Link } from "react-router-dom";
import { Icons } from "@/components/icons";

interface RowData {
  id: number;
  name: string;
  code: string;
  vendorStatus: string;
  panNo: string;
}
type Props = {
  updateProduct?: boolean;
  setUpdateProduct?: React.Dispatch<React.SetStateAction<boolean>>;
  viewProduct?: boolean;
  setViewProduct?: React.Dispatch<React.SetStateAction<boolean>>;
};

const MasterVendorDetailTable: React.FC<Props> = () => {
  const rowData: RowData[] = [
    {
      id: 1,
      name: "Vendor A",
      code: "VEND-001",
      vendorStatus: "Active",
      panNo: "ABCDE1234F",
    },
    {
      id: 2,
      name: "Vendor B",
      code: "VEND-002",
      vendorStatus: "Inactive",
      panNo: "FGHIJ5678K",
    },
    // Add more rows as needed
  ];
  const columnDefs: ColDef[] = [
    { headerName: "#", field: "id", sortable: true, filter: false, valueGetter: "node.rowIndex+1", maxWidth: 80 },
    { headerName: "Name", field: "name", sortable: true, filter: true, flex: 1,cellRenderer: (params: any) => <div className="flex items-center justify-center h-full"><Link to={`/master-vende/${params.data.code}`} className="w-[80%] h-[25px]  rounded-md  px-[5px] flex items-center justify-between text-cyan-600 hover:bg-neutral-50  ">{params.value}<Icons.followLink sx={{fontSize: "16px"}}/></Link></div> },
    { headerName: "Code", field: "code", sortable: true, filter: true, flex: 1 },
    { headerName: "Vendor Status", field: "vendorStatus", sortable: false, filter: false, flex: 1 },
    { headerName: "PAN No.", field: "panNo", sortable: true, filter: false, flex: 1 },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      floatingFilter: true,
    };
  }, []);
  return (
    <div>
      <div className=" ag-theme-quartz h-[calc(100vh-230px)]">
        <AgGridReact loadingOverlayComponent={CustomLoadingOverlay} overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSizeSelector={[10, 25, 50]} />
      </div>
    </div>
  );
};

export default MasterVendorDetailTable;
