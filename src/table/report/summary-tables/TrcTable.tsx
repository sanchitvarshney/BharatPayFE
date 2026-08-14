import React, { memo, RefObject, useEffect, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { clearR6data } from "@/features/report/report/reportSlice";
import CustomPagination from "@/components/reusable/CustomPagination";

type Props = {
  gridRef?: RefObject<AgGridReact<any>>;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  pageSize: number;
};

const COLUMN_NAME_MAP: Record<string, string> = {
  serial_no: "Serial No.",
  imei_no: "IMIE",
  issue_txn_id: "Issue Txn Id",
  mfg_txn_id: "Mfg Txn Id",
  issue_dt: "Issue Date",
  inward_txn_id: "Inward Txn Id",
  inward_dt: "Inward Date",
};

const EMPTY_ROWS: unknown[] = [];
const EMPTY_COLS: ColDef[] = [];

const TrcTable: React.FC<Props> = ({
  gridRef,
  handlePageChange,
  handlePageSizeChange,
  pageSize,
}) => {
  const dispatch = useAppDispatch();
  const { trcData, trcLoading } = useAppSelector(
    (state) => state.summary,
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  const columnDefs = useMemo<ColDef[]>(() => {
    const header = trcData?.headers;
    if (!header?.length) return EMPTY_COLS;
    return header.map((col: string) => ({
      colId: col,
      field: col,
      headerName: COLUMN_NAME_MAP[col] || col,
      sortable: true,
      filter: true,
      resizable: true,
      headerClass: "center-header",
      cellStyle: {
        textAlign: "center",
      },
      width: 250,
    }));
  }, [trcData?.headers]);

  const rowData = useMemo(() => trcData?.data ?? EMPTY_ROWS, [trcData?.data]);

  useEffect(() => {
    dispatch(clearR6data());
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-200px)]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          ref={gridRef}
          loading={trcLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          suppressFieldDotNotation
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={false}
          paginationPageSize={20}
          enableCellTextSelection
        />
      </div>
      {trcData?.pagination && (
        <CustomPagination
          currentPage={trcData?.pagination?.currentPage as any}
          totalPages={trcData?.pagination?.totalPages as any}
          totalRecords={trcData?.pagination?.totalRecords as any}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export default memo(TrcTable);
