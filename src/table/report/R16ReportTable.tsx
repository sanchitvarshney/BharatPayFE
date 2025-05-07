import React, {
  RefObject,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getR16Report } from "@/features/report/report/reportSlice";
import CustomPagination from "@/components/reusable/CustomPagination";

type Props = {
  gridRef: RefObject<AgGridReact>;
};

const R16ReportTable: React.FC<Props> = ({ gridRef }) => {
  const { r16Report, r16ReportLoading, r16ReportDateRange, r16ReportPartner } =
    useAppSelector((state) => state.report);
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "id",
      valueGetter: "node.rowIndex+1",
      maxWidth: 100,
    },
    { headerName: "Inward Location", field: "inwardLoc", minWidth: 150 },
    { headerName: "Partner Name", field: "partnerName", minWidth: 150 },
    { headerName: "Method", field: "method", minWidth: 100 },
    { headerName: "SKU Name", field: "skuName", minWidth: 150 },
    { headerName: "Device SKU", field: "deviceSKU", minWidth: 150 },
    { headerName: "Model", field: "model", minWidth: 100 },
    { headerName: "Serial No", field: "serialNo", minWidth: 150 },
    { headerName: "IMEI No 1", field: "imeiNo1", minWidth: 150 },
    { headerName: "IMEI No 2", field: "imeiNo2", minWidth: 150 },
    { headerName: "Sim No", field: "simNo", minWidth: 150 },
    { headerName: "Transaction ID", field: "txnID", minWidth: 200 },
    { headerName: "Remark", field: "remark", minWidth: 150 },
    { headerName: "Insert Date", field: "insertData", minWidth: 150 },
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      sortable: true,
      resizable: true,
    };
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      if (
        !r16ReportDateRange.from ||
        !r16ReportDateRange.to ||
        !r16ReportPartner
      ) {
        return;
      }

      setCurrentPage(page);
      dispatch(
        getR16Report({
          from: r16ReportDateRange.from,
          to: r16ReportDateRange.to,
          partner: r16ReportPartner,
          page: page,
          limit: pageSize,
        })
      );
    },
    [dispatch, r16ReportDateRange, r16ReportPartner, pageSize]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when changing page size
      if (
        r16ReportDateRange.from &&
        r16ReportDateRange.to &&
        r16ReportPartner
      ) {
        dispatch(
          getR16Report({
            from: r16ReportDateRange.from,
            to: r16ReportDateRange.to,
            partner: r16ReportPartner,
            page: 1,
            limit: size,
          })
        );
      }
    },
    [dispatch, r16ReportDateRange, r16ReportPartner]
  );

  // Initial data load
  useEffect(() => {
    if (
      isInitialLoad &&
      r16ReportDateRange.from &&
      r16ReportDateRange.to &&
      r16ReportPartner
    ) {
      setIsInitialLoad(false);
      dispatch(
        getR16Report({
          from: r16ReportDateRange.from,
          to: r16ReportDateRange.to,
          partner: r16ReportPartner,
          page: 1,
          limit: pageSize,
        })
      );
    }
  }, [dispatch, r16ReportDateRange, r16ReportPartner, pageSize, isInitialLoad]);

  // Update current page when data is loaded
  useEffect(() => {
    if (r16Report?.page) {
      setCurrentPage(r16Report.page);
    }
  }, [r16Report?.page]);

  return (
    <div className="flex flex-col h-full  ">
      <div className="flex-1">
        <div className="relative ag-theme-quartz h-[calc(100vh-150px)]">
          <AgGridReact
            ref={gridRef}
            loadingOverlayComponent={CustomLoadingOverlay}
            loading={r16ReportLoading}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            suppressCellFocus={true}
            rowData={r16Report?.data || []}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            enableCellTextSelection={true}
            // domLayout="autoHeight"
          />
        </div>
      </div>
      {r16Report && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={r16Report.totalPages}
          totalRecords={r16Report.totalRecords}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};

export default R16ReportTable;
