import React, { RefObject, useEffect, useMemo, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { clearR6data } from "@/features/report/report/reportSlice";
import CustomPagination from "@/components/reusable/CustomPagination";

type Props = {
  gridRef?: RefObject<AgGridReact<any>>;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  pageSize: number;
};

const TrcTable: React.FC<Props> = ({
  gridRef,
  handlePageChange,
  handlePageSizeChange,
  pageSize,
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState(false);
  const [rowData, setRowData] = useState<any>([]); // Holds the row data
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]); // Holds the column definitions
  const { trcData, trcLoading } = useAppSelector(
    (state) => state.summary,
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  const fetchGridData = async () => {
    setLoading(true);
    const header = trcData?.headers; // Headers from API response
    const data = trcData?.data; // Row data from API response
    //   const filteredHeader = header?.filter(
    //     (col: string) => col !== "Print" && col !== "Transaction ID" && col !== "Invoice File"
    //   );
    const columnNameMap: Record<string, string> = {
      serial_no: "Serial No.",
      imei_no: "IMIE",
      issue_txn_id: "Issue Txn Id",
      mfg_txn_id: "Mfg Txn Id",
      issue_dt: "Issue Date",
    };

    const dynamicColumnDefs: ColDef[] = header?.map((col: string) => ({
      field: col,
      headerName: columnNameMap[col] || col,
      sortable: true,
      filter: true,
      resizable: true,
      autoHeight: true,
      headerClass: "center-header",
      cellStyle: {
        textAlign: "center",
      },
      width: 250,
      cellRenderer: (params: any) => (
        <div style={{ textAlign: "center", width: "100%" }}>{params.value}</div>
      ),
    }));

    setColumnDefs(dynamicColumnDefs); // Set dynamic column definitions
    setRowData(data); // Set the row data
    setLoading(false);
  };

  useEffect(() => {
    fetchGridData();
  }, [trcData?.data]);

  useEffect(() => {
    dispatch(clearR6data());
  }, []);

  return (
    <div>
      {loading && <FullPageLoading />}
      <div className="relative ag-theme-quartz h-[calc(100vh-160px)]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          ref={gridRef}
          loading={trcLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
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

export default TrcTable;
