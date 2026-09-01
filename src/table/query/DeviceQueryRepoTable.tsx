import React, { RefObject, useEffect, useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppSelector } from "@/hooks/useReduxHook";
import { ColDef } from "@ag-grid-community/core";
import { RowData } from "@/features/query/query/queryType";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import CustomPagination from "@/components/reusable/CustomPagination";

type Props = {
  gridRef: RefObject<AgGridReact<RowData>>;
  pageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
};
const DeviceQueryRepoTable: React.FC<Props> = ({ gridRef, pageSize, handlePageChange, handlePageSizeChange }) => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const { q1Data, getQ1DataLoading, q1Pagination } = useAppSelector((state) => state.query);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  useEffect(() => {
    if (q1Data) {
      const convertedData: RowData[] = q1Data?.body?.map((item) => ({
        insertDate: item.insertDate,
        type: item.type.type,
        transaction: item.type.txnID,
        qtyIn: item.qtyIn,
        qtyOut: item.qtyOut,
        locIn: item.locIn,
        locOut: item.locOut,
        insertBy: item.insertBy,
        vendor: item.vendor.name.trim(),
        vendorCode: item.vendor.code,
        imei: item.IMEI,
        srlNo: item.SRLNo,
        issue: item.issue,
      }));
      setRowData(convertedData);
    }
  }, [q1Data]);

  const columnDefs: ColDef[] = [
    { headerName: "#", field: "id", sortable: true, filter: true, width: 100, valueGetter: (params: any) => params.node.rowIndex + 1 },
    { headerName: "IMEI", field: "imei", sortable: true, filter: true },
    { headerName: "SRLNo", field: "srlNo", sortable: true, filter: true },
    { headerName: "Date", field: "insertDate", sortable: true, filter: true },
    { headerName: "Type", field: "type", sortable: true, filter: true },
    { headerName: "Transaction", field: "transaction", sortable: true, filter: true },
    { headerName: "Qty In", field: "qtyIn", sortable: true, filter: true, width: 150 },
    { headerName: "Qty Out", field: "qtyOut", sortable: true, filter: true, width: 150 },
    { headerName: "Location In", field: "locIn", sortable: true, filter: true },
    { headerName: "Location Out", field: "locOut", sortable: true, filter: true },
    { headerName: "Issue", field: "issue", sortable: true, filter: true },
    // { headerName: "Vendor Code", field: "vendorCode", sortable: true, filter: true },
    { headerName: "Inserted By", field: "insertBy", sortable: true, filter: true },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      <div className="flex-1">
        <div className="relative ag-theme-quartz h-[calc(100vh-160px)]">
          <AgGridReact loadingOverlayComponent={CustomLoadingOverlay} ref={gridRef} loading={getQ1DataLoading} overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={false} enableCellTextSelection />
        </div>
      </div>
      {q1Pagination && (
        <CustomPagination
          currentPage={q1Pagination.currentPage}
          totalPages={q1Pagination.totalPages}
          totalRecords={q1Pagination.totalRecords}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};

export default DeviceQueryRepoTable;
