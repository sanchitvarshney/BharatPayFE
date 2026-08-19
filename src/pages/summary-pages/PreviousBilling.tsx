import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import CustomPagination from "@/components/reusable/CustomPagination";
import { getPreviousBilling } from "@/features/summarySlice/billingSlices";
import { showToast } from "@/utils/toasterContext";

const columnDefs: ColDef[] = [
  {
    headerName: "#",
    field: "id",
    sortable: true,
    width: 100,
    valueGetter: "node.rowIndex+1",
  },
  {
    headerName: "Billing No",
    field: "billing_id",
    sortable: true,
    width: 180,
  },
  {
    headerName: "Invoice No",
    field: "invoice_no",
    sortable: true,
    width: 250,
  },
  {
    headerName: "Date Range",
    field: "date_range",
    cellRenderer: (params: any) =>
      params.value.from_date + " - " + params.value.to_date || "--",
    sortable: true,
    width: 250,
  },
  {
    headerName: "Dispatched QTY",
    field: "dispatched_qty",
    sortable: true,
    width: 250,
  },
  {
    headerName: "Hold QTY",
    field: "hold_qty",
    sortable: true,
    width: 250,
  },
  {
    headerName: "Billed QTY",
    field: "billed_qty",
    sortable: true,
    width: 250,
  },
  {
    headerName: "Billed Date",
    field: "billed_at",
    sortable: true,
    width: 250,
  },
];

const EMPTY_ROWS: unknown[] = [];

const PreviousBilling = () => {
  const previousBillingData = useAppSelector(
    (state) => state.summary?.previousBillingData,
  );
  const previousBillingLoading = useAppSelector(
    (state) => state.summary?.previousBillingLoading,
  );
  const gridRef = useRef<AgGridReact<any>>(null);
  const [pageSize, setPageSize] = useState(20);
  const dispatch = useAppDispatch();

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  const rowData = useMemo(
    () => previousBillingData?.data ?? EMPTY_ROWS,
    [previousBillingData?.data],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(
        getPreviousBilling({
          page: page,
          limit: pageSize,
        }),
      );
    },
    [dispatch, pageSize],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setPageSize(pageSize);
      dispatch(
        getPreviousBilling({
          page: 1,
          limit: pageSize,
        }),
      );
    },
    [dispatch],
  );

  const handleFetchData = useCallback(() => {
    const res: any = dispatch(
      getPreviousBilling({
        page: 1,
        limit: pageSize,
      }),
    ).unwrap();
    if (res?.data?.success) {
      showToast(res?.data?.message, "success");
    } else {
      showToast(res?.data?.message, "error");
    }
  }, [dispatch, pageSize]);

  useEffect(() => {
    handleFetchData();
  }, [dispatch, pageSize]);

  return (
    <div>
      <div className={`relative ag-theme-quartz h-[calc(100vh-100px)]`}>
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={previousBillingLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={false}
          paginationPageSize={20}
          enableCellTextSelection={true}
        />
      </div>

      {previousBillingData?.pagination && (
        <CustomPagination
          currentPage={previousBillingData?.pagination?.page || 0}
          totalPages={previousBillingData?.pagination?.totalPages || 0}
          totalRecords={previousBillingData?.pagination?.totalRecords || 0}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export default PreviousBilling;
