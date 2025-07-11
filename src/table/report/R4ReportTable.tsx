import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { Button } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { r4ReportDetail } from "@/features/report/report/reportSlice";
import CustomPagination from "@/components/reusable/CustomPagination";
type Props = {
  gridRef: RefObject<AgGridReact<any>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deviceType: string;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  pageSize: number;
};

// Define new column definitions

// Generate dummy data according to pagination needs
const R4ReportTable: React.FC<Props> = ({
  gridRef,
  setOpen,
  deviceType,
  handlePageChange,
  handlePageSizeChange,
  pageSize,
}) => {
  const dispatch = useAppDispatch();
  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "id",
      sortable: true,
      filter: true,
      width: 100,
      valueGetter: "node.rowIndex+1",
    },
    {
      headerName: "Production ID",
      field: "prodductionId",
      sortable: true,
      filter: true,
    },
    {
      headerName: "SR No.",
      field: "productSrlNo",
      sortable: true,
      filter: true,
    },
    {
      headerName: "IMEI 1",
      field: "productImei1",
      sortable: true,
      filter: true,
    },
    {
      headerName: "IMEI 2",
      field: "productImei2",
      sortable: true,
      filter: true,
    },
    { headerName: "SKU", field: "sku", sortable: true, filter: true },
    { headerName: "SKU Name", field: "skuName", sortable: true, filter: true },
    {
      headerName: "Device Move ID",
      field: "device_mov_id",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Requested Date",
      field: "insertDate",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Requested By",
      field: "insertBy",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Pick Location",
      field: "productionLocation",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Drop Location",
      field: "dropLocation",
      sortable: true,
      filter: true,
    },
    {
      headerName: "",
      field: "prodductionId",
      sortable: true,
      filter: true,
      hide: true,
    },
    {
      headerName: "",
      pinned: "right",
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <Button
          onClick={() => {
            setOpen(true);
            dispatch(
              r4ReportDetail({
                query: params.data.prodductionId,
                deviceType: deviceType,
              })
            );
          }}
          variant="contained"
          size="small"
          startIcon={<FullscreenIcon fontSize="small" />}
        >
          Detail
        </Button>
      ),
      width: 150,
    },
  ];
  const { r4report, r4reportLoading } = useAppSelector((state) => state.report);

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
          loading={r4reportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r4report?.data || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={false}
          paginationPageSize={paginationPageSize}
          enableCellTextSelection
        />
      </div>
      {r4report && (
        <CustomPagination
          currentPage={r4report?.pagination?.currentPage}
          totalPages={r4report?.pagination?.totalPages}
          totalRecords={r4report?.pagination?.totalRecords}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export default R4ReportTable;
