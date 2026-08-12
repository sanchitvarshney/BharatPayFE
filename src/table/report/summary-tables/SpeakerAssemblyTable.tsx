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

const SpeakerAssemblyTable: React.FC<Props> = ({
  gridRef,
  handlePageChange,
  handlePageSizeChange,
  pageSize,
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState(false);
  const [rowData, setRowData] = useState<any>([]); // Holds the row data

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]); // Holds the column definitions
  const { speakerAssemblyData, speakerAssemblyLoading } = useAppSelector(
    (state) => state.summary,
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  const fetchGridData = async () => {
    setLoading(true);
    const header = speakerAssemblyData?.headers; // Headers from API response
    const data = speakerAssemblyData?.data; // Row data from API response
 
    const columnNameMap: Record<string, string> = {
      serial_no: "Serial No.",
      imei_no: "IMIE",
      issue_txn_id: "Issue Txn Id",
      mfg_txn_id: "Mfg Txn Id",
      issue_dt: "Issue Date",
    };

    const dynamicColumnDefs: ColDef[] = header?.map((col: string) => ({
      colId: col,
      valueGetter: (params:any) => params.data?.[col],
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

    }));

    setColumnDefs(dynamicColumnDefs); // Set dynamic column definitions
    setRowData(data); // Set the row data
    setLoading(false);
  };

  useEffect(() => {
    fetchGridData();
  }, [speakerAssemblyData?.data]);

  useEffect(() => {
    dispatch(clearR6data());
  }, []);

  return (
    <div>
      {loading && <FullPageLoading />}
      <div className="relative ag-theme-quartz h-[calc(100vh-200px)]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          ref={gridRef}
          loading={speakerAssemblyLoading || loading}
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
      {speakerAssemblyData?.pagination && (
        <CustomPagination
          currentPage={speakerAssemblyData?.pagination?.currentPage as any}
          totalPages={speakerAssemblyData?.pagination?.totalPages as any}
          totalRecords={speakerAssemblyData?.pagination?.totalRecords as any}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export default SpeakerAssemblyTable;
