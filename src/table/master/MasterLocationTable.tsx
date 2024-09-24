import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HiMiniViewfinderCircle } from "react-icons/hi2";

import { Switch } from "@/components/ui/switch";
import { IoDocumentTextSharp } from "react-icons/io5";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";

interface RowData {
  id: number;
  locationName: string;
  parentLocation: string;
  isBlocked: boolean;
}
type Props = {
  mapCostcenter?: React.Dispatch<React.SetStateAction<boolean>>;
  setViewLocation?: React.Dispatch<React.SetStateAction<boolean>>;
};

const MasterLocationTable: React.FC<Props> = ({ setViewLocation, mapCostcenter }) => {
  const rowData: RowData[] = [
    {
      id: 1,
      locationName: "Warehouse 1",
      parentLocation: "Main Warehouse",
      isBlocked: false,
    },
    {
      id: 2,
      locationName: "Warehouse 2",
      parentLocation: "Main Warehouse",
      isBlocked: true,
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
            <DropdownMenuItem className="flex items-center gap-[10px] text-slate-600" onSelect={() => setViewLocation && setViewLocation(true)}>
              <IoDocumentTextSharp className="h-[18px] w-[18px] text-slate-500" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-[10px] text-slate-600" onSelect={() => mapCostcenter && mapCostcenter(true)}>
              <HiMiniViewfinderCircle className="h-[18px] w-[18px] text-slate-500" />
              Map Cost Center
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      sortable: false,
      filter: false,
      width: 120,
    },
    {
      headerName: "Location Name",
      field: "locationName",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Parent Location",
      field: "parentLocation",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Is Blocked",
      field: "isBlocked",
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => (
        <div>
          <Switch checked={params.value} />
        </div>
      ),

      maxWidth: 120,
    },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);
  return (
    <div>
      <div className=" ag-theme-quartz h-[calc(100vh-50px)]">
        <AgGridReact  overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSizeSelector={[10, 25, 50]} />
      </div>
    </div>
  );
};

export default MasterLocationTable;
