import React, { useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { getTrcList } from "@/features/trc/ViewTrc/viewTrcSlice";
import { Button } from "@mui/material";

const PendingTRCListTable: React.FC = () => {
    const dispatch = useAppDispatch();
  const { getTrcListLoading, trcList } = useAppSelector(
    (state) => state.viewTrc
  );

  useEffect(() => {
    dispatch(getTrcList());
  }, []);

  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "id",
      width: 50,
      filter: true,
      valueGetter: "node.rowIndex+1",
    },
    {
      headerName: "IMEI No.",
      field: "imeiNo",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "ITEM Code",
      field: "itemCode",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Put Location",
      field: "putLocation",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Total Device",
      field: "totalDevice",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Transaction ID",
      field: "txnId",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Transaction Status",
      field: "txnStatus",
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
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-100px)] bg-white">
         <div className="flex justify-between items-center mb-4 ">
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(getTrcList())} // Call `getTrcList` on refresh
        >
          Refresh
        </Button>
      </div>
      <AgGridReact
        loadingOverlayComponent={CustomLoadingOverlay}
        loading={getTrcListLoading}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={trcList || []}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={20}
      />
    </div>
  );
};

export default PendingTRCListTable;
