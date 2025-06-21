import React, { useMemo, useState } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { CustomDrawer, CustomDrawerContent, CustomDrawerHeader, CustomDrawerTitle } from "@/components/reusable/CustomDrawer";
import ApprovalItemDetailTable from "./ApprovalItemDetailTable";
import { getApproveItemDetail } from "@/features/wearhouse/MaterialApproval/MrApprovalSlice";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@mui/material";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";

const MrRequisitionReqTable: React.FC = () => {
  const { approvedMaterialListData, approvedMaterialListLoading ,  serial,serialLoading} = useAppSelector((state) => state.pendingMr);
  const [detail, setDetail] = useState<boolean>();
  const [txnid, setTxnid] = useState<string>("");
  const [showserial, setShowSerial] = useState<boolean>(false);
  const [serialid, setSerialid] = useState<string>("");
  const dispatch = useAppDispatch();

  // Global column default definition
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      flex: 1,
      cellRenderer: (params: any) =>
        approvedMaterialListLoading ? (
          <div className="flex items-center justify-center h-full">
            {" "}
            <Skeleton className="h-[20px] w-full" />
          </div>
        ) : (
          params?.value
        ), // Global skeleton logic
    };
  }, [approvedMaterialListLoading]);
  const columnDefs: ColDef[] = [
    { headerName: "#", field: "id", sortable: true, filter: true, flex: 1, valueGetter: "node.rowIndex+1", maxWidth: 80 },
    {
      headerName: "Request ID",
      field: "transaction",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Request Date",
      field: "createDate",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "RM Qty",
      field: "totalRm",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Pick Location",
      field: "location",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: (params: any) =>
        !approvedMaterialListLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingButton
              size="small"
              onClick={() => {
                setDetail(true);
                dispatch(getApproveItemDetail(params?.data?.transaction));
                setTxnid(params?.data?.transaction);
              }}
              startIcon={<Icons.view fontSize="small" />}
              variant="contained"
            >
              View Detail
            </LoadingButton>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            {" "}
            <Skeleton className="h-[20px] w-full" />
          </div>
        ),
      pinned: "right",
    },
  ];
  const columnDefsserial: ColDef[] = [
    {
      headerName: "Serial No.",
      field: "srlNo",
      sortable: true,
      filter: false,
      flex: 1,
    },
    
  ];

  return (
    <>
      <CustomDrawer open={showserial} onOpenChange={setShowSerial}>
        <CustomDrawerContent className="p-0 min-w-[30%] ">
          <CustomDrawerHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] bg-zinc-200 gap-0 border-b border-zinc-300 ">
            <CustomDrawerTitle className="text-slate-600 font-[500] p-0">
              <Typography fontSize={16} fontWeight={500} variant="h4" component="div">
                #{serialid}
              </Typography>
            </CustomDrawerTitle>
          </CustomDrawerHeader>
          <div className=" ag-theme-quartz h-[calc(100vh-50px)]">
          <AgGridReact  loadingOverlayComponent={CustomLoadingOverlay} loading={serialLoading} overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={serial || []} columnDefs={columnDefsserial}  pagination={false} />
          </div>
        </CustomDrawerContent>
      </CustomDrawer>
      <CustomDrawer open={detail} onOpenChange={setDetail}>
        <CustomDrawerContent className="p-0 min-w-[75%]">
          <CustomDrawerHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] bg-zinc-200 gap-0 border-b border-zinc-300 ">
            <CustomDrawerTitle className="text-slate-600 font-[500] p-0">
              <Typography fontSize={16} fontWeight={500} variant="h4" component="div">
                #{txnid}
              </Typography>
            </CustomDrawerTitle>
          </CustomDrawerHeader>
          <ApprovalItemDetailTable setSerialid={setSerialid} setSerial={setShowSerial} />
        </CustomDrawerContent>
      </CustomDrawer>
      <div className=" ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={approvedMaterialListData || []} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSize={20} />
      </div>
    </>
  );
};

export default MrRequisitionReqTable;
