import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MdOutlineCloudUpload } from "react-icons/md";
import { HiMiniViewfinderCircle } from "react-icons/hi2";
import { FaEdit } from "react-icons/fa";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";

interface RowData {
  id: number;
  productName: string;
  sku: string;
  unit: string;
  category: string;
}
type Props = {
  updateProduct?: boolean;
  setUpdateProduct?: React.Dispatch<React.SetStateAction<boolean>>;
  viewProduct?: boolean;
  setViewProduct?: React.Dispatch<React.SetStateAction<boolean>>;
};

const MasterProductSFgTable: React.FC<Props> = ({ setViewProduct, setUpdateProduct }) => {
  const rowData: RowData[] = [
    { id: 1, productName: "Product A", sku: "SKU001", unit: "kg", category: "Category 1" },
    { id: 2, productName: "Product B", sku: "SKU002", unit: "m", category: "Category 2" },
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
            <DropdownMenuItem className="flex items-center gap-[10px] text-slate-600" onSelect={() => setUpdateProduct && setUpdateProduct(true)}>
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
    {
      headerName: "#",
      field: "id",
      sortable: true,
      filter: true,
      maxWidth: 80,
    },
    {
      headerName: "Product Name",
      field: "productName",
      sortable: true,
      filter: true,
    },
    {
      headerName: "SKU",
      field: "sku",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Unit",
      field: "unit",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Category",
      field: "category",
      sortable: true,
      filter: true,
    },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);
  return (
    <div>
      <div className=" ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSizeSelector={[10, 25, 50]} />
      </div>
    </div>
  );
};

export default MasterProductSFgTable;
