import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { TiDocumentText } from "react-icons/ti";
import { Badge } from "@/components/ui/badge";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { getR2ReportDetail, setRefId } from "@/features/report/report/reportSlice";
import { CustomButton } from "@/components/reusable/CustomButton";

type Props = {
  open?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const R2ReportTable: React.FC<Props> = ({ setOpen }) => {
  const { r2Data, getR2DataLoading, r2ReportDetailLoading } = useAppSelector((state) => state.report);
  const dispatch = useAppDispatch();
  const columnDefs: ColDef[] = [
    { headerName: "#", field: "srNo", sortable: true, filter: true, valueGetter: "node.rowIndex + 1", maxWidth: 80 },
    { headerName: "Requested By", field: "requestBy", sortable: true, filter: true },
    { headerName: "Ref ID", field: "refId", sortable: true, filter: true },
    { headerName: "Device", field: "device", sortable: true, filter: true },
    { headerName: "Total Devices", field: "totalDevice", sortable: true, filter: true },
    { headerName: "Requested Location", field: "pickLocation", sortable: true, filter: true },
    { headerName: "Requested Date", field: "insertDate", sortable: true, filter: true },
    {
      headerName: "Request Status",
      field: "status",
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => <div className="flex items-center h-full ">{params.value !== "COMPLETED" ? <Badge className="bg-amber-600 hover:bg-amber-700">{params.value}</Badge> : <Badge className="bg-emerald-600 hover:bg-emerald-700">{params.value}</Badge>}</div>,
    },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full">
          <CustomButton
            loading={r2ReportDetailLoading}
            onClick={() => {
              setOpen(true);
              dispatch(getR2ReportDetail(params?.data?.refId));
              dispatch(setRefId(params?.data?.refId));
            }}
            size={"sm"}
            className="bg-cyan-700 hover:bg-cyan-800 flex items-center gap-[5px]"
          >
            <TiDocumentText className="h-[17px] w-[17px]" />
            View Details
          </CustomButton>
        </div>
      ),
    },
  ];

  return (
    <div className="relative ag-theme-quartz h-[calc(100vh-135px)]">
      <AgGridReact loading={getR2DataLoading} loadingOverlayComponent={CustomLoadingOverlay} overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus columnDefs={columnDefs} rowData={r2Data ? r2Data : []} pagination={true} />
    </div>
  );
};

export default R2ReportTable;
