import React, { Dispatch, useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";

import { HiOutlineRefresh } from "react-icons/hi";
import { IoPrint } from "react-icons/io5";
import { Download } from "lucide-react";
import { RxCross2 } from "react-icons/rx";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getProcessMrReqeustAsync, setRequestDetail } from "@/features/wearhouse/MaterialApproval/MrApprovalSlice";

type Props = {
  approve: boolean;
  setApprove: Dispatch<React.SetStateAction<boolean>>;
  setAlert: Dispatch<React.SetStateAction<boolean>>;
  setRequestType: Dispatch<React.SetStateAction<string>>;
  setxnId: Dispatch<React.SetStateAction<string>>;
};


const PendingMrApprovalTable: React.FC<Props> = ({ setApprove, setAlert,setRequestType ,setxnId}) => {
  const dispatch = useAppDispatch();
  const { getPendingMrRequestLoading, pendingMrRequestData } = useAppSelector((state) => state.pendingMr);
 
  const columnDefs: ColDef[] = [
    {
      headerName: "Action",
      maxWidth: 150,
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
                onSelect={() => {
                  setRequestType(params?.data?.transactionType || "")
                  dispatch(
                    setRequestDetail({
                      name: params?.data?.userName,
                      id: params?.data?.transactionId,
                      requestDate: params?.data?.insertDate,
                    })
                  );
                  setApprove(true);
                  dispatch(getProcessMrReqeustAsync(params?.data?.transactionId));
                }}
                className="flex items-center gap-[10px] text-slate-600"
              >
                <HiOutlineRefresh className="h-[18px] w-[18px] text-slate-500" />
                Process
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-[10px] text-slate-600">
                <Download className="h-[18px] w-[18px] text-slate-500" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-[10px] text-slate-600">
                <IoPrint className="h-[18px] w-[18px] text-slate-500" />
                Print
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-[10px] text-slate-600" onSelect={() => {
                setAlert(true)
                setxnId(params?.data?.transactionId)
              }}>
                <RxCross2 className="h-[18px] w-[18px] text-slate-500" />
                Cancel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
    { headerName: "#", field: "id", sortable: true, filter: true, maxWidth: 100, valueGetter: (params: any) => params.node.rowIndex + 1 },
    { headerName: "Request From", field: "userName", sortable: true, filter: true, flex: 1 },
    { headerName: "Request ID", field: "transactionId", sortable: true, filter: true, flex: 1 },
    { headerName: "Transaction Type", field: "transactionType", sortable: true, filter: true, flex: 1 },
    { headerName: "Request Date", field: "insertDate", sortable: true, filter: true, flex: 1 },
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);
  
  return (
    <div>
      <div className=" ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact loading={getPendingMrRequestLoading} overlayNoRowsTemplate={OverlayNoRowsTemplate}  suppressCellFocus={true} rowData={pendingMrRequestData}  columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSize={10} />
      </div>
    </div>
  );
};

export default PendingMrApprovalTable;
