import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { CustomButton } from "@/components/reusable/CustomButton";
import { TbRefresh } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getTrcRequestDetail, setTrcDetail } from "@/features/trc/ViewTrc/viewTrcSlice";
import { TcDetail } from "@/features/trc/ViewTrc/viewTrcType";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const ViewTRCTable: React.FC<Props> = ({ setOpen }) => {
  const dispatch = useAppDispatch();
  const { trcList, getTrcListLoading } = useAppSelector((state) => state.viewTrc);
  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "id",
      sortable: true,
      filter: true,
      flex: 1,
      maxWidth: 80,
      valueGetter: "node.rowIndex + 1",
    },
    {
      headerName: "Requested By",
      field: "requestBy",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: (params: any) => (params?.value ? params?.value : "--"),
    },
    {
      headerName: "Reference ID",
      field: "txnId",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "From Location",
      field: "putLocation",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Insert Date",
      field: "insertDate",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Total Device",
      field: "totalDevice",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center h-full">
          <CustomButton
            onClick={() => {
              setOpen(true);
              const payload: TcDetail = {
                txnId: params?.data?.txnId,
                location: params?.data?.putLocation,
                requestedBy: params?.data?.requestBy,
                insertDate: params?.data?.insertDate,
                totalDevice: params?.data?.totalDevice,
              };
              dispatch(setTrcDetail(payload));
              dispatch(getTrcRequestDetail(params?.data?.txnId));
            }}
            icon={<TbRefresh className="h-[18px] w-[18px]" />}
            className="p-0 bg-cyan-700 hover:bg-cyan-800 h-[30px] px-[10px]"
          >
            Process
          </CustomButton>
        </div>
      ),
      flex: 1,
      maxWidth: 100,
    },
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact loadingOverlayComponent={CustomLoadingOverlay} loading={getTrcListLoading} overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={trcList ? trcList : []} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSize={20} />
      </div>
    </div>
  );
};

export default ViewTRCTable;
