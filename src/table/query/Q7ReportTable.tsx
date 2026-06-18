import React, { RefObject, useMemo } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { Tooltip } from "@mui/material";

type Issue = { text: string; description: string };

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

const IssuesCellRenderer = (params: any) => {
  const issues: Issue[] = params.value ?? [];
  if (!issues.length) return <span className="text-slate-400">—</span>;

  const headings = issues.map((i) => i.text).join(", ");

  const tooltipContent = (
    <div className="flex flex-col gap-[8px] p-[4px] max-w-[320px]">
      {issues.map((issue, idx) => (
        <div key={idx}>
          <div className="text-xs font-semibold text-white">{issue.text}</div>
          <div className="text-xs text-slate-300 mt-[2px]">{issue.description}</div>
          {idx < issues.length - 1 && <div className="border-b border-white/20 mt-[6px]" />}
        </div>
      ))}
    </div>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="left" enterDelay={200}>
      <span className="cursor-pointer text-slate-700 text-xs underline decoration-dotted underline-offset-2">
        {headings}
      </span>
    </Tooltip>
  );
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
      suppressSizeToFit: true,
    },
    {
      headerName: "Type",
      field: "type",
      sortable: true,
      filter: true,
      suppressSizeToFit: true,
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      suppressSizeToFit: true,
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
      filter: false,
      flex: 2,
      suppressSizeToFit: true,
      cellRenderer: IssuesCellRenderer,
      // for excel export — show headings as comma list
      valueFormatter: (params: any) =>
        (params.value ?? []).map((i: Issue) => i.text).join(", "),
    },
    {
      // hidden in grid, visible in excel export only
      headerName: "Issue Descriptions",
      field: "issues",
      sortable: false,
      filter: false,
      flex: 2,
      hide: true,
      suppressSizeToFit: true,
      valueFormatter: (params: any) =>
        (params.value ?? [])
          .map((i: Issue) => `${i.text}: ${i.description}`)
          .join(" | "),
    },
    {
      headerName: "Inserted By",
      field: "inBy",
      sortable: true,
      filter: true,
      flex: 1,
      suppressSizeToFit: true,
    },
    {
      headerName: "Insert Date",
      field: "inDt",
      sortable: true,
      filter: true,
      flex: 1,
      suppressSizeToFit: true,
    },
    {
      headerName: "Last Update By",
      field: "lastUpdateBy",
      sortable: true,
      filter: true,
      flex: 1,
      suppressSizeToFit: true,
    },
    {
      headerName: "Last Update Date",
      field: "lastUpdateDt",
      sortable: true,
      filter: true,
      flex: 1,
      suppressSizeToFit: true,
    },
    {
      headerName: "Txn ID",
      field: "txnID",
      sortable: true,
      filter: true,
      flex: 1,
      hide: true,
      suppressSizeToFit: true,
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
