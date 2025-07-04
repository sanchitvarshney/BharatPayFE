import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { getR2ReportDetail, setRefId } from "@/features/report/report/reportSlice";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import CustomPagination from "@/components/reusable/CustomPagination";

type Props = {
  open?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
};
const R2ReportTable: React.FC<Props> = ({ setOpen, pageSize, handlePageChange, handlePageSizeChange }) => {
  const { r2Data, getR2DataLoading, r2ReportDetailLoading } = useAppSelector((state) => state.report);
  const dispatch = useAppDispatch();
  const columnDefs: ColDef[] = [
    { headerName: "#", field: "srNo", sortable: true, filter: true, valueGetter: "node.rowIndex + 1", maxWidth: 80 },
    { headerName: "Requested By", field: "requestBy", sortable: true, filter: true },
    {headerName:"IMEI",field:"imei",sortable:true,filter:true},
    { headerName: "Ref ID", field: "refId", sortable: true, filter: true },
    { headerName: "Serial No", field: "srlNo", sortable: true, filter: true },
    { headerName: "Total Devices", field: "totalDevice", sortable: true, filter: true },
    { headerName: "Pick Location", field: "pickLocation", sortable: true, filter: true },
    { headerName: "Put Location", field: "putLocation", sortable: true, filter: true },
    { headerName: "Requested Date", field: "insertDate", sortable: true, filter: true },
    { headerName: "Device Move ID", field: "deviceMovId", sortable: true, filter: true },
    { headerName: "Consumption Date", field: "conspDate", sortable: true, filter: true , valueGetter: (params:any)=>{
      return params?.data?.conspDate ==="Invalid date" ? null : params?.data?.conspDate;
    }},
    { headerName: "Consumption By", field: "conspBy", sortable: true, filter: true },
    {
      headerName: "Request Status",
      field: "status",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full">
          <LoadingButton
            variant="contained"
            loading={r2ReportDetailLoading}
            onClick={() => {
              setOpen(true);
              dispatch(getR2ReportDetail({refId:params?.data?.refId, srlno:params?.data?.srlNo}));
              dispatch(setRefId(params?.data?.refId));
            }}
            size="small"
            startIcon={<Icons.detail fontSize="small" />}
          >
            View Details
          </LoadingButton>
        </div>
      ),
      pinned: "right",
    },
  ];

  return (
    <div className="relative ag-theme-quartz h-[calc(100vh-160px)]">
      <AgGridReact loading={getR2DataLoading} loadingOverlayComponent={CustomLoadingOverlay} overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus columnDefs={columnDefs} rowData={r2Data?.data || []} pagination={false} enableCellTextSelection = {true} />
     {r2Data && <CustomPagination
        currentPage={r2Data?.pagination?.currentPage}
        totalPages={r2Data?.pagination?.totalPages}
        totalRecords={r2Data?.pagination?.totalRecords}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />}
    </div>
  );
};

export default R2ReportTable;
