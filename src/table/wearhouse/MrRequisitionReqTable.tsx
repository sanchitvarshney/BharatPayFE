import React, { useMemo, useState } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { CustomButton } from "@/components/reusable/CustomButton";
import { HiViewfinderCircle } from "react-icons/hi2";
import { CustomDrawer, CustomDrawerContent, CustomDrawerHeader, CustomDrawerTitle } from "@/components/reusable/CustomDrawer";
import ApprovalItemDetailTable from "./ApprovalItemDetailTable";
import { getApproveItemDetail } from "@/features/wearhouse/MaterialApproval/MrApprovalSlice";

const MrRequisitionReqTable: React.FC = () => {
  const { approvedMaterialListData, approvedMaterialListLoading } = useAppSelector((state) => state.pendingMr);
  const [detail, setDetail] = useState<boolean>();
  const [txnid, setTxnid] = useState<string>("");
  const dispatch = useAppDispatch();
  const columnDefs: ColDef[] = [
    { headerName: "#", field: "id", sortable: true, filter: true, flex: 1, valueGetter: "node.rowIndex+1", maxWidth: 80 },
    { headerName: "Request ID", field: "transaction", sortable: true, filter: true, flex: 1 },
    { headerName: "Request Date", field: "createDate", sortable: true, filter: true, flex: 1 },

    { headerName: "RM Qty", field: "totalRm", sortable: true, filter: true },
    { headerName: "Pick Location", field: "pickLocation", sortable: true, filter: true, flex: 1 },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center h-full">
          <CustomButton
            onClick={() => {
              setDetail(true);
              dispatch(getApproveItemDetail(params?.data?.transaction));
              setTxnid(params?.data?.transaction);
            }}
            icon={<HiViewfinderCircle className="h-[18px] w-[18px]" />}
            className="p-0 bg-cyan-700 hover:bg-cyan-800 h-[30px] px-[10px]"
          >
            View Detail
          </CustomButton>
        </div>
      ),
    },
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <>
      <CustomDrawer open={detail} onOpenChange={setDetail}>
        <CustomDrawerContent className="p-0 min-w-[75%]">
          <CustomDrawerHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] bg-zinc-200 gap-0 border-b border-zinc-300 ">
            <CustomDrawerTitle className="text-slate-600 font-[500] p-0">{txnid}</CustomDrawerTitle>
          </CustomDrawerHeader>
          <ApprovalItemDetailTable />
        </CustomDrawerContent>
      </CustomDrawer>
      <div className=" ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact loading={approvedMaterialListLoading} overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={approvedMaterialListData} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSize={20} />
      </div>
    </>
  );
};

export default MrRequisitionReqTable;
