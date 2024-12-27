import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { HiMiniViewfinderCircle } from "react-icons/hi2";
import { Download } from "lucide-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppSelector } from "@/hooks/useReduxHook";
import { useDispatch } from "react-redux";
import { changeBomStatus, getFGBomList } from "@/features/master/BOM/BOMSlice";
import { AppDispatch } from "@/features/Store";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { CircularProgress, Switch } from "@mui/material";
type Props = {
  edit?: boolean;
  setEdit?: React.Dispatch<React.SetStateAction<boolean>>;
  view?: boolean;
  setView?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProductId: React.Dispatch<React.SetStateAction<string | null>>;
  setBomName: React.Dispatch<React.SetStateAction<string | null>>;
};
const MasterFgBOMTable: React.FC<Props> = ({ setEdit, setView, setSelectedProductId, setBomName }) => {
  const { fgBomList, fgBomListLoading, changeStatusLoading } = useAppSelector((state) => state.bom);
  const dispatch = useDispatch<AppDispatch>();
  const [id, setId] = useState<string>("");

  const columnDefs: ColDef[] = [
    {
      headerName: "Action",
      field: "action",
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full">
          <DropdownMenu>
            <div className="flex items-center px-[20px] h-full">
              <DropdownMenuTrigger className="p-[5px] focus-visible::ring-slate-300 h-full flex items-center">
                <BsThreeDotsVertical className="font-[600] text-[20px] text-slate-600" />
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent className="w-[170px]" side="bottom" align="start">
              <DropdownMenuItem
                className="flex items-center gap-[10px] text-slate-600"
                onSelect={() => setEdit && setEdit(true)}
                onClick={() => {
                  setSelectedProductId(params.node.data.subjectKey);
                }}
              >
                <FaEdit className="h-[18px] w-[18px] text-slate-500" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-[10px] text-slate-600"
                onSelect={() => setView && setView(true)}
                onClick={() => {
                  // Access the data for the row clicked
                  const subjectKey = params.node.data.subjectKey;
                  setSelectedProductId(subjectKey); // Set the selected product ID
                  setBomName(params.node.data.subjectName);
                }}
              >
                <HiMiniViewfinderCircle className="h-[18px] w-[18px] text-slate-500" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="flex items-center gap-[10px] text-slate-600">
                <Download className="h-[18px] w-[18px] text-slate-500" />
                Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      cellRenderer: (row: any) => {
        const [isChecked, setIsChecked] = useState(Boolean(row?.data?.status));

        return (
          <div className="flex items-center h-full">
            {changeStatusLoading && id === row?.data?.id ? (
              <CircularProgress size={20} />
            ) : (
              <Switch
                id="airplane-mode"
                checked={isChecked}
                onChange={(e) => {
                  setId(row?.data?.id);
                  const newStatus = e.target.checked ? 1 : 0;
                  setIsChecked(Boolean(newStatus));
                  const subject = row?.data?.subjectKey;
                  dispatch(changeBomStatus({ status: newStatus, subject: subject })).then((res: any) => {
                    if (res.payload?.data?.success) {
                      dispatch(getFGBomList("FG"));
                    }
                  });
                }}
              />
            )}
          </div>
        );
      },
    },
    {
      headerName: "BOM Name",
      field: "subjectName",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "SKU",
      field: "skuCode",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Created Date",
      field: "insertDate",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "#",
      field: "id",
      sortable: true,
      filter: true,
      flex: 1,
      hide: true,
      valueGetter: "node.rowIndex+1",
    },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-100px)]">
      <AgGridReact
        loadingOverlayComponent={CustomLoadingOverlay}
        loading={fgBomListLoading}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={fgBomList || []}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={20}
      />
    </div>
  );
};

export default MasterFgBOMTable;
