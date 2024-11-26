import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MdFileUpload } from "react-icons/md";
import { HiMiniViewfinderCircle } from "react-icons/hi2";
import { MdSystemUpdateAlt } from "react-icons/md";
import { useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uploadImage: boolean;
  setUploadImage: React.Dispatch<React.SetStateAction<boolean>>;
  viewImage: boolean;
  setViewImage: React.Dispatch<React.SetStateAction<boolean>>;
};


const MsterComponentsMaterialListTable: React.FC<Props> = ({ setOpen, setUploadImage, setViewImage }) => {
  const { component, getComponentLoading } = useAppSelector((state) => state.component);
  const columnDefs: ColDef[] = [
    {
      headerName: "",
      maxWidth: 70,
      field: "action",
      cellRenderer: () => (
        <DropdownMenu>
          <div className="flex items-center px-[20px] h-full">
            <DropdownMenuTrigger className="p-[5px] focus-visible::ring-slate-300 ">
              <BsThreeDotsVertical className="font-[600] text-[20px] text-slate-600" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="w-[170px]">
            <DropdownMenuItem disabled className="flex items-center gap-[10px] text-slate-600" onClick={() => setOpen(true)}>
              <MdSystemUpdateAlt className="h-[18px] w-[18px] text-slate-500" />
              Update
            </DropdownMenuItem> 
            <DropdownMenuItem disabled  className="flex items-center gap-[10px] text-slate-600" onClick={() => setViewImage(true)}>
              <HiMiniViewfinderCircle className="h-[18px] w-[18px] text-slate-500" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="flex items-center gap-[10px] text-slate-600" onClick={() => setUploadImage(true)}>
              <MdFileUpload className="h-[18px] w-[18px] text-slate-500" />
              Upload
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      sortable: false,
      filter: false,
    },
    {
      headerName: "#",
      maxWidth: 100,
      field: "id",
      filter: false,
      valueGetter: (params: any) => params.node.rowIndex + 1,
    },
    {
      headerName: "Part Code",
      field: "c_part_no",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Name",
      field: "c_name",
      sortable: true,
      filter: true,
      width: 300,
    },

    {
      headerName: "Is Enabled",
      field: "is_enabled",
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => (params?.value === "Y" ? "Enable" : "Disable"),
    },
    {
      headerName: "UOM",
      field: "units_name",
      sortable: true,
      filter: true,
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
      <div className=" ag-theme-quartz h-[calc(100vh-140px)]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          loading={getComponentLoading}
          rowData={component?.components}
          suppressCellFocus={true}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSizeSelector={[20, 30, 50]}
          paginationPageSize={30}
        />
      </div>
    </div>
  );
};

export default MsterComponentsMaterialListTable;
