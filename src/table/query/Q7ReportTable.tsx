import React, { RefObject, useMemo } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { Tooltip } from "@mui/material";

type SubIssue = { text: string; description: string };
type IssueCategory = { category: { text: string; description: string }; subIssues: SubIssue[] };

type FlatRow = {
  dsn: string;
  type: string;
  currentStatus: string;
  totalAttempts: number;
  attempt: number;
  txnID: string;
  status: string;
  issues: IssueCategory[];
  inBy: string;
  inDt: string;
  lastUpdateBy: string;
  lastUpdateDt: string;
};

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

const IssuesCellRenderer = (params: any) => {
  const issues: IssueCategory[] = params.value ?? [];
  if (!issues.length) return <span className="text-slate-400">—</span>;

  const headings = issues.map((i) => i.category.text).join(", ");

  const tooltipContent = (
    <div className="flex flex-col gap-[8px] p-[4px] max-w-[360px]">
      {issues.map((issue, idx) => (
        <div key={idx}>
          <div className="text-xs font-semibold text-white">{issue.category.text}</div>
          {issue.subIssues.length > 0 && (
            <ul className="mt-[2px] pl-[10px] list-disc">
              {issue.subIssues.map((sub, si) => (
                <li key={si} className="text-xs text-slate-300">{sub.text}</li>
              ))}
            </ul>
          )}
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

const statusColor = (val: string) => {
  if (val === "APPROVED" || val === "PASS")
    return "text-green-700 bg-green-50 border border-green-200";
  if (val === "REJECTED" || val === "FAIL")
    return "text-red-700 bg-red-50 border border-red-200";
  return "text-yellow-700 bg-yellow-50 border border-yellow-200";
};

const StatusCell = (params: any) => (
  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusColor(params.value)}`}>
    {params.value}
  </span>
);

const Q7ReportTable: React.FC<Props> = ({ gridRef }) => {
  const { packagingFeedbackList, packagingFeedbackLoading } = useAppSelector(
    (state) => state.dispatch
  );

  const rowData = useMemo<FlatRow[]>(() => {
    if (!packagingFeedbackList) return [];
    const flat: FlatRow[] = [];
    for (const item of packagingFeedbackList) {
      for (const t of item.timeline ?? []) {
        flat.push({
          dsn: item.dsn,
          type: item.type,
          currentStatus: item.currentStatus,
          totalAttempts: item.totalAttempts,
          attempt: t.attempt,
          txnID: t.txnID,
          status: t.status,
          issues: t.issues ?? [],
          inBy: t.inBy,
          inDt: t.inDt,
          lastUpdateBy: t.lastUpdateBy,
          lastUpdateDt: t.lastUpdateDt,
        });
      }
    }
    return flat;
  }, [packagingFeedbackList]);

  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      width: 60,
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
      width: 110,
      suppressSizeToFit: true,
    },
    {
      headerName: "Attempt",
      field: "attempt",
      sortable: true,
      filter: true,
      width: 100,
      suppressSizeToFit: true,
    },
    {
      headerName: "Total Attempts",
      field: "totalAttempts",
      sortable: true,
      filter: true,
      width: 130,
      suppressSizeToFit: true,
    },
    {
      headerName: "Attempt Status",
      field: "status",
      sortable: true,
      filter: true,
      width: 140,
      suppressSizeToFit: true,
      cellRenderer: StatusCell,
    },
    {
      headerName: "Current Status",
      field: "currentStatus",
      sortable: true,
      filter: true,
      width: 140,
      suppressSizeToFit: true,
      cellRenderer: StatusCell,
    },
    {
      headerName: "Issues",
      field: "issues",
      sortable: false,
      filter: false,
      suppressSizeToFit: true,
      cellRenderer: IssuesCellRenderer,
      valueFormatter: (params: any) =>
        (params.value ?? []).map((i: IssueCategory) => i.category.text).join(", "),
    },
    {
      headerName: "Issue Details",
      field: "issues",
      sortable: false,
      filter: false,
      hide: true,
      suppressSizeToFit: true,
      valueFormatter: (params: any) =>
        (params.value ?? [])
          .map((i: IssueCategory) =>
            `${i.category.text}: ${i.subIssues.map((s: SubIssue) => s.text).join(", ")}`
          )
          .join(" | "),
    },
    {
      headerName: "Inserted By",
      field: "inBy",
      sortable: true,
      filter: true,
      suppressSizeToFit: true,
    },
    {
      headerName: "Insert Date",
      field: "inDt",
      sortable: true,
      filter: true,
      suppressSizeToFit: true,
    },
    {
      headerName: "Last Update By",
      field: "lastUpdateBy",
      sortable: true,
      filter: true,
      suppressSizeToFit: true,
    },
    {
      headerName: "Last Update Date",
      field: "lastUpdateDt",
      sortable: true,
      filter: true,
      suppressSizeToFit: true,
    },
    {
      headerName: "Txn ID",
      field: "txnID",
      sortable: true,
      filter: true,
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
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={100}
        enableCellTextSelection
        onFirstDataRendered={(params) => params.api.autoSizeAllColumns()}
      />
    </div>
  );
};

export default Q7ReportTable;
