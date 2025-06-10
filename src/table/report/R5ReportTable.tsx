import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { Button } from "@mui/material";
import { useSocketContext } from "@/components/context/SocketContext";
import { DownloadIcon } from "@radix-ui/react-icons";
import { formatNumber } from "@/utils/numberFormatUtils";
import CustomPagination from "@/components/reusable/CustomPagination";
type Props = {
  gridRef: RefObject<AgGridReact<any>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTxn: React.Dispatch<React.SetStateAction<string>>;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  pageSize: number;
};

// Define new column definitions

// Generate dummy data according to pagination needs
const R5ReportTable: React.FC<Props> = ({ gridRef, setTxn, handlePageChange, handlePageSizeChange, pageSize }) => {
  const { emitDownloadr5Report, emitDownloadWrongDeviceReport,emitDownloadSwipeReport } =
    useSocketContext();
  // const dispatch = useAppDispatch();
  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "id",
      sortable: true,
      filter: true,
      width: 100,
      valueGetter: "node.rowIndex+1",
    },

    { headerName: "SKU", field: "sku", sortable: true, filter: true, flex: 1 },
    {
      headerName: "SKU Name",
      field: "skuName",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Dispatch Date",
      field: "dispatchDate",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Dispatch Qty",
      field: "dispatchQty",
      sortable: true,
      filter: true,
      flex: 1,
      valueFormatter: (params: any) => {
        return formatNumber(params.value);
      },
    },
    {
      headerName: "Insert By",
      field: "inserby",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "TXN ID",
      field: "txnId",
      sortable: false,
      filter: true,
      flex: 1,
      hide: true,
    },
    {
      headerName: "Dispatch ID",
      field: "dispatchId",
      sortable: true,
      filter: true,
      flex: 1,
      hide: false,
    },

    {
      headerName: "",
      pinned: "right",
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <Button
          onClick={() => {
            // setOpen(true);
            // dispatch(getr5ReportDetail(params.data.txnId));
            setTxn(params.data.txnId);
            const id = params?.data?.txnId;
            const type = params?.data?.deviceType;
            if (type === "wrongDevices") {
              emitDownloadWrongDeviceReport({ txnId: id });
            }else if(type === "swipedevice"){
              emitDownloadSwipeReport({ txnId: id });
            }            
            else {
              emitDownloadr5Report({ txnId: id });
            }
          }}
          variant="contained"
          size="small"
          startIcon={<DownloadIcon fontSize="small" />}
        >
          Download
        </Button>
      ),
      width: 150,
    },
  ];
  const { r5report, r5reportLoading } = useAppSelector((state) => state.report);

  const paginationPageSize = 20; // Define page size

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      sortable: true,
    };
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-160px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={r5reportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r5report?.data ||  []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={false}
          paginationPageSize={paginationPageSize}
          enableCellTextSelection
        />
      </div>
       {r5report && <CustomPagination
          currentPage={r5report?.pagination?.currentPage}
          totalPages={r5report?.pagination?.totalPages}
          totalRecords={r5report?.pagination?.totalRecords}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />}
    </div>
  );
};

export default R5ReportTable;
