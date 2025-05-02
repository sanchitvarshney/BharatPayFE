import React, { RefObject, useMemo, useCallback, useEffect } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getR16Report } from "@/features/report/report/reportSlice";

type Props = {
  gridRef?: RefObject<AgGridReact<any>>;
};

const R16ReportTable: React.FC<Props> = ({ gridRef }) => {
  const { r16Report, r16ReportLoading, r16ReportDateRange, r16ReportPartner } =
    useAppSelector((state) => state.report);
  const dispatch = useAppDispatch();

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
    { headerName: "Transaction ID", field: "txnID", minWidth: 200 },
    { headerName: "Remark", field: "remark", minWidth: 150 },
    { headerName: "Insert Date", field: "insertDt", minWidth: 150 },
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      sortable: true,
      resizable: true,
    };
  }, []);

  const onPaginationChanged = useCallback(() => {
    if (
      gridRef?.current?.api &&
      r16ReportDateRange.from &&
      r16ReportDateRange.to &&
      r16ReportPartner
    ) {
      const currentPage = gridRef.current.api.paginationGetCurrentPage();
      const pageSize = gridRef.current.api.paginationGetPageSize();

      dispatch(
        getR16Report({
          from: r16ReportDateRange.from,
          to: r16ReportDateRange.to,
          partner: r16ReportPartner,
          page: currentPage + 1,
          limit: pageSize,
        })
      );
    }
  }, [dispatch, gridRef, r16ReportDateRange, r16ReportPartner]);

  // Set total records when data is loaded
  useEffect(() => {
    if (r16Report && gridRef?.current?.api) {
      // Set the total number of rows
      gridRef.current.api.setRowCount(r16Report.totalRecords);
      // Set the current page
      gridRef.current.api.paginationGoToPage(r16Report.page - 1);
    }
  }, [r16Report, gridRef]);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={r16ReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r16Report?.data || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          paginationNumberFormatter={function (params) {
            return params.value.toLocaleString();
          }}
          onPaginationChanged={onPaginationChanged}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
};

export default R16ReportTable;
