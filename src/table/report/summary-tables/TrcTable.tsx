import React, { memo, RefObject, useEffect, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { clearR6data } from "@/features/report/report/reportSlice";
import CustomPagination from "@/components/reusable/CustomPagination";
import { baseFlexCellStyle, flexCellStyle } from "@/utils/agGridSummaryCellUtils";

type Props = {
  gridRef?: RefObject<AgGridReact<any>>;
  handlePageChange: (page: number) => void;

};

const COLUMN_NAME_MAP: Record<string, string> = {
  serial_no: "Serial No.",
  imei_no: "IMEI",
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

}) => {
  const dispatch = useAppDispatch();
  const { trcData, trcLoading } = useAppSelector(
    (state) => state.summary,
  );
    const tabValue = useAppSelector(
    (state) => state.summary?.tabValue,
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      cellStyle: flexCellStyle("left"),
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
      cellStyle: baseFlexCellStyle("center"),
      width: 250,
    }));
  }, [trcData?.headers]);

  const rowData = useMemo(() => trcData?.data ?? EMPTY_ROWS, [trcData?.data]);

  useEffect(() => {
    dispatch(clearR6data());
  }, []);

  return (
    <div>
      <div className={`relative ag-theme-quartz ${tabValue === "preview" ? "h-[calc(100vh-210px)]" : "h-[calc(100vh-255px)]"}`}>
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
         isLimit={false}
          pageSize={10}
        />
      )}
    </div>
  );
};

export default memo(TrcTable);
