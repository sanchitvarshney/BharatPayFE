import React, { RefObject, useMemo } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

const Q7ReportTable: React.FC<Props> = ({ gridRef }) => {
  const { packagingFeedbackList, packagingFeedbackLoading } = useAppSelector(
    (state) => state.dispatch
  );

  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      width: 70,
      valueGetter: (p: any) => p.node.rowIndex + 1,
    },
    {
      headerName: "DSN",
      field: "dsn",
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: "Type",
      field: "type",
      sortable: true,
      filter: true,
      width: 110,
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      width: 110,
      cellRenderer: (params: any) => {
        const val = params.value;
        const color =
          val === "PASS"
            ? "text-green-700 bg-green-50 border border-green-200"
            : "text-red-700 bg-red-50 border border-red-200";
        return (
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${color}`}>
            {val}
          </span>
        );
      },
    },
    {
      headerName: "Issues",
      field: "issues",
      sortable: false,
      filter: true,
      flex: 3,
      autoHeight: true,
      cellRenderer: (params: any) => {
        const issues: { text: string; description: string }[] = params.value ?? [];
        if (!issues.length) return <span className="text-slate-400">—</span>;
        return (
          <div className="flex flex-col gap-[4px] py-[6px]">
            {issues.map((issue, i) => (
              <div key={i}>
                <span className="font-semibold text-slate-700 text-xs">{issue.text}: </span>
                <span className="text-slate-500 text-xs">{issue.description}</span>
              </div>
            ))}
          </div>
        );
      },
      valueFormatter: (params: any) =>
        (params.value ?? []).map((i: any) => i.text).join(", "),
    },
    {
      headerName: "Inserted By",
      field: "inBy",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Insert Date",
      field: "inDt",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Last Update By",
      field: "lastUpdateBy",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Last Update Date",
      field: "lastUpdateDt",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Txn ID",
      field: "txnID",
      sortable: true,
      filter: true,
      flex: 1,
      hide: true,
    },
  ];

  const defaultColDef = useMemo<ColDef>(() => ({ filter: true }), []);

  return (
    <div className="ag-theme-quartz h-[calc(100vh-100px)]">
      <AgGridReact
        ref={gridRef}
        loadingOverlayComponent={CustomLoadingOverlay}
        loading={packagingFeedbackLoading}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={packagingFeedbackList ?? []}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={100}
        enableCellTextSelection
      />
    </div>
  );
};

export default Q7ReportTable;
