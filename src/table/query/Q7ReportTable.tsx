import React, { RefObject, useMemo, useState, useImperativeHandle, forwardRef } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef, ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import * as XLSX from "xlsx";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/reusable/CustomModal";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

// ── types ──────────────────────────────────────────────────────────────────────
type SubIssue = { text: string; description: string };
type IssueCategory = {
  category: { text: string; description: string };
  subIssues: SubIssue[];
};
type TimelineEntry = {
  attempt: number;
  txnID: string;
  status: string;
  issues: IssueCategory[];
  inBy: string;
  inDt: string;
  lastUpdateBy: string;
  lastUpdateDt: string;
};
type DsnRow = {
  dsn: string;
  type: string;
  currentStatus: string;
  totalAttempts: number;
  timeline: TimelineEntry[];
};

export type Q7TableHandle = { exportExcel: () => void };

type Props = { gridRef: RefObject<AgGridReact<any>> };

// ── helpers ────────────────────────────────────────────────────────────────────
const statusBadge = (val: string) => {
  const base = "inline-flex px-2 py-0.5 rounded text-xs font-semibold";
  if (val === "APPROVED" || val === "PASS")
    return `${base} text-green-700 bg-green-50 border border-green-200`;
  if (val === "REJECTED" || val === "FAIL")
    return `${base} text-red-700 bg-red-50 border border-red-200`;
  return `${base} text-yellow-700 bg-yellow-50 border border-yellow-200`;
};

const stepperDot = (status: string) => {
  if (status === "APPROVED" || status === "PASS")
    return "border-green-400 bg-green-50 text-green-700";
  if (status === "REJECTED" || status === "FAIL")
    return "border-red-400 bg-red-50 text-red-700";
  return "border-yellow-400 bg-yellow-50 text-yellow-700";
};

const cardBorder = (status: string) => {
  if (status === "APPROVED" || status === "PASS") return "border-green-100";
  if (status === "REJECTED" || status === "FAIL") return "border-red-100";
  return "border-yellow-100";
};

// ── timeline modal ─────────────────────────────────────────────────────────────
const TimelineModal: React.FC<{
  open: boolean;
  onClose: () => void;
  row: DsnRow | null;
}> = ({ open, onClose, row }) => {
  const timeline = useMemo(
    () => [...(row?.timeline ?? [])].reverse(),
    [row]
  );

  return (
    <Modal open={open} onOpenChange={(v) => !v && onClose()}>
      <ModalContent className="max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden p-0">
        {/* header */}
        <ModalHeader className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <ModalTitle className="text-base font-semibold text-slate-800">
            Timeline — {row?.dsn}
          </ModalTitle>
          <ModalDescription className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <span>{row?.type}</span>
            <span className="text-slate-300">·</span>
            <span>{row?.totalAttempts} attempt{(row?.totalAttempts ?? 0) > 1 ? "s" : ""}</span>
            <span className="text-slate-300">·</span>
            <span>Current Status:</span>
            <span className={statusBadge(row?.currentStatus ?? "")}>
              {row?.currentStatus}
            </span>
          </ModalDescription>
        </ModalHeader>

        {/* scrollable body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          <div className="flex flex-col gap-0">
            {timeline.map((t, idx) => (
              <div key={t.attempt} className="flex gap-4">
                {/* stepper spine */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 z-10 ${stepperDot(t.status)}`}
                  >
                    {t.attempt}
                  </div>
                  {idx < timeline.length - 1 && (
                    <div className="w-[2px] flex-1 min-h-[16px] bg-slate-200 my-1" />
                  )}
                </div>

                {/* attempt card */}
                <div
                  className={`mb-4 flex-1 rounded-lg border bg-white p-4 shadow-sm ${cardBorder(t.status)}`}
                >
                  {/* card header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-700">
                      Attempt {t.attempt}
                    </span>
                    <span className={statusBadge(t.status)}>{t.status}</span>
                  </div>

                  {/* issues */}
                  {t.issues.length > 0 && (
                    <div className="flex flex-col gap-2 mb-3">
                      {t.issues.map((issue, i) => (
                        <div
                          key={i}
                          className="bg-slate-50 rounded-md px-3 py-2 border border-slate-100"
                        >
                          <div className="text-xs font-semibold text-slate-600 mb-1">
                            {issue.category.text}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {issue.subIssues.map((sub, j) => (
                              <span
                                key={j}
                                className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs"
                              >
                                {sub.text}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* metadata */}
                  <div className="grid grid-cols-4 gap-x-4 gap-y-1 text-xs border-t border-slate-100 pt-2">
                    <span className="text-slate-400">Inserted By</span>
                    <span className="text-slate-600 col-span-1">{t.inBy}</span>
                    <span className="text-slate-400">Insert Date</span>
                    <span className="text-slate-600">{t.inDt}</span>
                    <span className="text-slate-400">Last Update By</span>
                    <span className="text-slate-600">{t.lastUpdateBy}</span>
                    <span className="text-slate-400">Last Update Date</span>
                    <span className="text-slate-600">{t.lastUpdateDt}</span>
                    <span className="text-slate-400">Txn ID</span>
                    <span className="text-slate-600 col-span-3 break-all">{t.txnID}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

// ── excel export ───────────────────────────────────────────────────────────────
function buildExcelRows(list: DsnRow[]) {
  const rows: Record<string, string | number>[] = [];
  for (const item of list) {
    for (const t of item.timeline) {
      for (const issue of t.issues.length ? t.issues : [null]) {
        rows.push({
          DSN: item.dsn,
          Type: item.type,
          "Current Status": item.currentStatus,
          "Total Attempts": item.totalAttempts,
          Attempt: t.attempt,
          "Attempt Status": t.status,
          "Issue Category": issue ? issue.category.text : "",
          "Sub Issues": issue ? issue.subIssues.map((s) => s.text).join(", ") : "",
          "Inserted By": t.inBy,
          "Insert Date": t.inDt,
          "Last Update By": t.lastUpdateBy,
          "Last Update Date": t.lastUpdateDt,
          "Txn ID": t.txnID,
        });
      }
    }
  }
  return rows;
}

// ── main table ─────────────────────────────────────────────────────────────────
const Q7ReportTable = forwardRef<Q7TableHandle, Props>(({ gridRef }, ref) => {
  const { packagingFeedbackList, packagingFeedbackLoading } = useAppSelector(
    (state) => state.dispatch
  );

  const [modalRow, setModalRow] = useState<DsnRow | null>(null);

  useImperativeHandle(ref, () => ({
    exportExcel() {
      const rows = buildExcelRows(packagingFeedbackList ?? []);
      const ws = XLSX.utils.json_to_sheet(rows);

      // column widths
      ws["!cols"] = [
        { wch: 20 }, { wch: 10 }, { wch: 16 }, { wch: 16 },
        { wch: 10 }, { wch: 16 }, { wch: 22 }, { wch: 30 },
        { wch: 20 }, { wch: 22 }, { wch: 20 }, { wch: 22 }, { wch: 38 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Q7 Report");
      XLSX.writeFile(wb, `Q7_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    },
  }));

  const rowData = useMemo<DsnRow[]>(
    () => packagingFeedbackList ?? [],
    [packagingFeedbackList]
  );

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "#",
        width: 60,
        valueGetter: (p: any) => p.node.rowIndex + 1,
      },
      { headerName: "DSN", field: "dsn", sortable: true, filter: true, flex: 2 },
      { headerName: "Type", field: "type", sortable: true, filter: true, width: 120 },
      {
        headerName: "Total Attempts",
        field: "totalAttempts",
        sortable: true,
        filter: true,
        width: 145,
      },
      {
        headerName: "Current Status",
        field: "currentStatus",
        sortable: true,
        filter: true,
        width: 150,
        cellRenderer: (params: any) => (
          <span className={statusBadge(params.value)}>{params.value}</span>
        ),
        valueFormatter: (params: any) => params.value ?? "",
      },
      {
        headerName: "Timeline",
        field: "timeline",
        sortable: false,
        filter: false,
        width: 130,
        cellRenderer: (params: any) => (
          <button
            className="px-3 py-1 text-xs font-medium rounded border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
            onClick={() => setModalRow(params.data)}
          >
            View ({params.value?.length ?? 0})
          </button>
        ),
        // Excel export: summarise each attempt on one line
        valueFormatter: (params: any) =>
          (params.value as TimelineEntry[] ?? [])
            .map((t) => {
              const issueStr = t.issues
                .map((ic) => `${ic.category.text} [${ic.subIssues.map((s) => s.text).join(", ")}]`)
                .join("; ");
              return `Attempt ${t.attempt} (${t.status})${issueStr ? `: ${issueStr}` : ""}`;
            })
            .join(" | "),
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(() => ({ filter: true }), []);

  return (
    <>
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

      <TimelineModal
        open={modalRow !== null}
        onClose={() => setModalRow(null)}
        row={modalRow}
      />
    </>
  );
});

export default Q7ReportTable;
