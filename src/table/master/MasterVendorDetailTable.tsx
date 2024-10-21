import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MdOutlineCloudUpload } from "react-icons/md";
import { HiMiniViewfinderCircle } from "react-icons/hi2";
import { FaEdit } from "react-icons/fa";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";


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

const MasterVendorDetailTable: React.FC<Props> = ({ setViewProduct, setUpdateProduct }) => {
  const rowData: RowData[] = [
    {
        id: 1,
        name: 'Vendor A',
        code: 'VEND-001',
        vendorStatus: 'Active',
        panNo: 'ABCDE1234F',
      },
      {
        id: 2,
        name: 'Vendor B',
        code: 'VEND-002',
        vendorStatus: 'Inactive',
        panNo: 'FGHIJ5678K',
      },
    // Add more rows as needed
  ];
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
            <DropdownMenuItem className="flex items-center gap-[10px] text-slate-600" onSelect={() => setUpdateProduct && setUpdateProduct(true)} >
              <FaEdit className="h-[18px] w-[18px] text-slate-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-[10px] text-slate-600" onSelect={() => setViewProduct && setViewProduct(true)}>
              <HiMiniViewfinderCircle className="h-[18px] w-[18px] text-slate-500" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="flex items-center gap-[10px] text-slate-600">
              <MdOutlineCloudUpload className="h-[18px] w-[18px] text-slate-500" />
              Upload
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      sortable: false,
      filter: false,
      width: 120,
    },
    { headerName: 'Name', field: 'name', sortable: true, filter: true,flex:1 },
    { headerName: 'Code', field: 'code', sortable: true, filter: true ,flex:1},
    { headerName: 'Vendor Status', field: 'vendorStatus', sortable: true, filter: true,flex:1 },
    { headerName: 'PAN No.', field: 'panNo', sortable: true, filter: true,flex:1 },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);
  return (
    <div>
      <div className=" ag-theme-quartz h-[calc(100vh-150px)]">
        <AgGridReact loadingOverlayComponent={CustomLoadingOverlay}  overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSizeSelector={[10, 25, 50]} />
      </div>
    </div>
  );
};

export default MasterVendorDetailTable;
