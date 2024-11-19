import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HiMiniViewfinderCircle } from "react-icons/hi2";
import { MdOutlineCloudUpload } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";

type Props = {
  updateProduct?: boolean;
  setUpdateProduct?: React.Dispatch<React.SetStateAction<boolean>>;
  viewProduct?: boolean;
  setViewProduct?: React.Dispatch<React.SetStateAction<boolean>>;
};

const MasterProductFgTable: React.FC<Props> = ({ setUpdateProduct, setViewProduct }) => {
  const {products,getProductsLoading} = useAppSelector(state=>state.product)
  const columnDefs: ColDef[] = [
    {
      headerName: "",
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
      width: 80,
    },
    {
      headerName: "#",
      field: "id",
      sortable: true,
      filter: false,
      maxWidth: 80,
      valueGetter: (params:any) => params.node.rowIndex + 1,
    
    },
    {
      headerName: "Product Name",
      field: "p_name",
      sortable: true,
      filter: true,
      flex:1
    },
    {
      headerName: "SKU",
      field: "p_sku",
      sortable: true,
      filter: true,
      flex:1
    },
    {
      headerName: "Unit",
      field: "units_name",
      sortable: true,
      filter: true,
      flex:1
    },
   
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      floatingFilter: true,
    };
  }, []);
  return (
    <div>
      <div className=" ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact loadingOverlayComponent={CustomLoadingOverlay}  overlayNoRowsTemplate={OverlayNoRowsTemplate} loading={getProductsLoading} suppressCellFocus={true}  paginationPageSize={20}  rowData={products} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSizeSelector={[20, 30, 50]} />
      </div>
    </div>
  );
};

export default MasterProductFgTable;
