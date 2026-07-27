import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import {
  getPartCodeConversionDetail,
  setRefId,
} from "@/features/report/report/reportSlice";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";

type Props = {
  open?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const PartCodeConversionReportTable: React.FC<Props> = ({ setOpen }) => {
  const { partConversionData, partConversionLoading } = useAppSelector(
    (state) => state.report
  );
  const dispatch = useAppDispatch();
  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "srNo",
      sortable: true,
      filter: true,
      valueGetter: "node.rowIndex + 1",
      maxWidth: 80,
    },
    { headerName: "Part Code", field: "partNo_no", sortable: true, filter: true },
    { headerName: "Component Name", field: "partName", sortable: true, filter: true },
    { headerName: "Qty", field: "qty", sortable: true, filter: true },
    { headerName: "Drop Location", field: "dropLocation", sortable: true, filter: true },
    {
      headerName: "Date",
      field: "date",
      sortable: true,
      filter: true,
    },
    {
      headerName: "User Name",
      field: "userName",
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
            loading={partConversionLoading}
            onClick={() => {
              setOpen(true);
              dispatch(
                getPartCodeConversionDetail({
                  txnNo: params?.data?.txn,
                })
              );
              dispatch(setRefId(params?.data?.txn));
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
    <div className="relative ag-theme-quartz h-[calc(100vh-100px)]">
      <AgGridReact
        loading={partConversionLoading}
        loadingOverlayComponent={CustomLoadingOverlay}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus
        columnDefs={columnDefs}
        rowData={partConversionData || []}
        pagination={true}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default PartCodeConversionReportTable;
