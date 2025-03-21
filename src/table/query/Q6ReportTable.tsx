import React, { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppSelector } from "@/hooks/useReduxHook";
import { ColDef } from "@ag-grid-community/core";
import { RowData } from "@/features/query/query/queryType";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";

type Props = {
  gridRef: any;
};
const Q6ReportTable: React.FC<Props> = ({ gridRef }) => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const { q6Statement, q6StatementLoading } = useAppSelector(
    (state) => state.query
  );
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  useEffect(() => {
    if (q6Statement) {
      const convertedData: any[] = q6Statement?.map((item) => ({
        insertDate: item.time,
        transaction: item.minNo,
        transactionType: item.transactionType,
        method: item.method,
        locIn: item.location,
        locOut: item.locationOut,
        insertBy: item.user,
      }));
      setRowData(convertedData);
    }
  }, [q6Statement]);

  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "id",
      sortable: true,
      filter: true,
      width: 100,
      valueGetter: (params: any) => params.node.rowIndex + 1,
    },
    {
      headerName: "Transaction ID",
      field: "transaction",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Method",
      field: "method",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "Transaction Type",
      field: "transactionType",
      sortable: true,
      filter: true,
      width: 150,
    },
    { headerName: "Location In", field: "locIn", sortable: true, filter: true },
    {
      headerName: "Location Out",
      field: "locOut",
      sortable: true,
      filter: true,
    },
    { headerName: "Date", field: "insertDate", sortable: true, filter: true },
    {
      headerName: "Inserted By",
      field: "insertBy",
      sortable: true,
      filter: true,
    },
  ];

  return (
    <div>
      <div className=" ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          ref={gridRef}
          loading={q6StatementLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </div>
  );
};

export default Q6ReportTable;
