import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  RowSelectionOptions,
  SelectionColumnDef,
} from "ag-grid-community";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import { CloudUpload, DeleteSweep } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  fetchIssue,
  submitAssemblyToTrc,
} from "@/features/transfer/deviceTransferSlice";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import { Icons } from "@/components/icons";
import { showToast } from "@/utils/toasterContext";
import { VisuallyHiddenInput } from "@/theme";

type ImeiRow = { imei: string };

const IMEI_HEADER = "IMEI";
const IMEI_ALIASES = ["imei", "imei no", "imei no.", "imei number"];
const IMEI_REGEX = /^\d{15}$/;
const REMARK_MAX_LENGTH = 250;

const getImeiCell = (row: Record<string, unknown>) =>
  Object.entries(row).find(([key]) =>
    IMEI_ALIASES.includes(key.trim().toLowerCase()),
  )?.[1];

const parseImeiRows = (
  jsonData: Record<string, unknown>[],
): { imeis: string[] } | { error: string } => {
  if (!jsonData.length) return { error: "Excel file is empty" };
  if (!jsonData.some((row) => getImeiCell(row) !== undefined)) {
    return { error: `Excel must have an "${IMEI_HEADER}" column` };
  }

  const imeis: string[] = [];
  const seen = new Set<string>();
  for (const [i, row] of jsonData.entries()) {
    const excelRow = i + 2;
    const imei = String(getImeiCell(row) ?? "").trim();
    if (!imei) continue;
    if (!IMEI_REGEX.test(imei)) {
      return { error: `Row ${excelRow}: "${imei}" is not a valid 15-digit IMEI` };
    }
    if (seen.has(imei)) {
      return { error: `Row ${excelRow}: Duplicate IMEI "${imei}"` };
    }
    seen.add(imei);
    imeis.push(imei);
  }

  if (!imeis.length) return { error: "No IMEI numbers found in the file" };
  return { imeis };
};

const defaultColDef: ColDef = {
  sortable: true,
  resizable: true,
  suppressHeaderMenuButton: true,
};

const rowSelection: RowSelectionOptions = {
  mode: "multiRow",
  checkboxes: true,
  headerCheckbox: true,
  enableClickSelection: true,
};


const selectionColumnDef: SelectionColumnDef = {
  width: 60,
  resizable: false,
  suppressHeaderMenuButton: true,
  headerClass:
    "!justify-center !px-0 [&_.ag-header-select-all]:!mr-0 [&_.ag-header-cell-comp-wrapper]:!hidden",
  cellClass:
    "!flex !justify-center !px-0 [&_.ag-cell-wrapper]:justify-center [&_.ag-selection-checkbox]:!mr-0",
};

const AssemblyToTrc: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAssemblyToTrcLoading, issueData } = useAppSelector(
    (state) => state.deviceTransfer,
  );

  const [rowData, setRowData] = useState<ImeiRow[]>([]);
  const [selectedRows, setSelectedRows] = useState<ImeiRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [issues, setIssues] = useState<string[]>([]);

  const toggleIssue = (id: string, checked: boolean) =>
    setIssues((prev) =>
      checked ? [...prev, id] : prev.filter((issueId) => issueId !== id),
    );
  const [remark, setRemark] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchIssue());
  }, []);

  const columnDefs = useMemo<ColDef<ImeiRow>[]>(
    () => [
      {
        headerName: "#",
        sortable: false,
        valueGetter: "node.rowIndex+1",
        width: 80,
      },
      { headerName: "IMEI", field: "imei", flex: 1 },
    ],
    [],
  );

  const handleDeleteSelected = () => {
    if (!selectedRows.length) return;
    const selected = new Set(selectedRows);
    setRowData((prev) => prev.filter((row) => !selected.has(row)));
    showToast(`Removed ${selected.size} IMEI(s)`, "info");
    setSelectedRows([]);
  };

  const handleDownloadSample = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      { [IMEI_HEADER]: "869737064360784" },
      { [IMEI_HEADER]: "869737066550143" },
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assembly to TRC");
    XLSX.writeFile(workbook, "assembly_to_trc_sample.xlsx");
  };

  const handleFileChange = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["xls", "xlsx"].includes(ext)) {
      showToast("Please upload an Excel file (.xlsx or .xls)", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target?.result, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          worksheet,
          { defval: "" },
        );

        const result = parseImeiRows(jsonData);
        if ("error" in result) {
          showToast(result.error, "error");
          return;
        }

        setRowData(result.imeis.map((imei) => ({ imei })));
        setFileName(file.name);
        showToast(`${result.imeis.length} IMEI(s) loaded from Excel`, "success");
      } catch {
        showToast(
          "Unable to read the file. Please check the format and try again.",
          "error",
        );
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleClear = () => {
    setRowData([]);
    setSelectedRows([]);
    setFileName("");
    setIssues([]);
    setRemark("");
  };

  const handleSubmit = async () => {
    setConfirmOpen(false);
    if (!rowData.length || !issues.length) return;

    const trimmedRemark = remark.trim();
    const action = await dispatch(
      submitAssemblyToTrc({
        imei: rowData.map((row) => row.imei),
        issue: issues.join(","),
        ...(trimmedRemark && { remark: trimmedRemark }),
      }),
    );

    if (!submitAssemblyToTrc.fulfilled.match(action)) return;
    const body = action.payload;
    if (body?.success) {
      showToast(body.message || "Devices transferred to TRC", "success");
      handleClear();
    } else {
      showToast(body?.message || "Unable to transfer devices", "error");
    }
  };

  return (
    <>
      <ConfirmationModel
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Transfer to TRC?"
        content={`${rowData.length} device(s) will be transferred from Assembly to TRC. Do you want to continue?`}
        cancelText="Cancel"
        confirmText="Transfer"
        color="primary"
        onConfirm={handleSubmit}
      />
      <div className="h-[calc(100vh-100px)] flex flex-col bg-white">
        <div className="flex flex-1 min-h-0 bg-neutral-50">
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex flex-wrap items-center gap-[12px] px-[16px] py-[12px] bg-white border-b border-neutral-200">
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUpload />}
                disabled={isAssemblyToTrcLoading}
              >
                Upload Excel
                <VisuallyHiddenInput
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(event) => {
                    handleFileChange(event.target.files);
                    event.target.value = "";
                  }}
                />
              </Button>
              <Button
                variant="text"
                startIcon={<Icons.download />}
                onClick={handleDownloadSample}
              >
                Sample File
              </Button>
              <span className="text-[13px] text-neutral-600 truncate">
                {fileName ? (
                  <>
                    File:{" "}
                    <span className="font-medium text-neutral-800">
                      {fileName}
                    </span>
                  </>
                ) : (
                  `Upload an Excel file with an "${IMEI_HEADER}" column (15-digit IMEI numbers).`
                )}
              </span>
              <Button
                className="!ml-auto"
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                disabled={!selectedRows.length || isAssemblyToTrcLoading}
                onClick={handleDeleteSelected}
              >
                Delete{selectedRows.length ? ` (${selectedRows.length})` : ""}
              </Button>
            </div>

            <div className="flex-1 min-h-0 p-[0px]">
              <div className="ag-theme-quartz h-full">
                <AgGridReact
                  overlayNoRowsTemplate={OverlayNoRowsTemplate}
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  rowSelection={rowSelection}
                  selectionColumnDef={selectionColumnDef}
                  onSelectionChanged={(e) =>
                    setSelectedRows(e.api.getSelectedRows())
                  }
                />
              </div>
            </div>
          </div>

          <aside className="w-[420px] shrink-0 flex flex-col gap-[14px] p-[16px] bg-white border-l border-neutral-200 overflow-y-auto">
            <section className="flex flex-col gap-[10px]">
              <h3 className="text-[13px] font-semibold uppercase tracking-wide text-neutral-500">
                Transfer Summary
              </h3>
              <dl className="grid grid-cols-2 gap-[8px] text-[13px]">
                {[
                  { label: "From", value: "Assembly" },
                  { label: "To", value: "TRC" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-md border border-neutral-200 bg-neutral-50 px-[10px] py-[8px]"
                  >
                    <dt className="text-neutral-500">{label}</dt>
                    <dd className="text-[15px] font-semibold text-neutral-800">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div
                className={`flex items-center justify-between rounded-md border px-[12px] py-[10px] ${
                  rowData.length
                    ? "bg-green-50 text-green-700 border-green-300"
                    : "bg-neutral-100 text-neutral-700 border-neutral-300"
                }`}
              >
                <span className="text-[13px] font-semibold">Total IMEI</span>
                <span className="text-[18px] font-semibold">
                  {rowData.length}
                </span>
              </div>
            </section>

            <section className="flex flex-col gap-[8px]">
              <h3 className="text-[13px] font-semibold uppercase tracking-wide text-neutral-500">
                Select Issue <span className="text-red-500">*</span>
              </h3>
              <FormGroup
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 0.5,
                }}
              >
                {issueData?.map((item: any) => (
                  <FormControlLabel
                    key={item.id}
                    control={
                      <Checkbox
                        size="small"
                        checked={issues.includes(String(item.id))}
                        onChange={(e) => toggleIssue(String(item.id), e.target.checked)}
                      />
                    }
                    label={item.text}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.875rem",
                      },
                    }}
                    disabled={isAssemblyToTrcLoading}
                  />
                ))}
              </FormGroup>
            </section>

            <section className="flex flex-col gap-[8px]">
              <h3 className="text-[13px] font-semibold uppercase tracking-wide text-neutral-500">
                Remark{" "}
                <span className="normal-case font-normal text-neutral-400">
                  (optional)
                </span>
              </h3>
              <TextField
                fullWidth
                multiline
                minRows={4}
                maxRows={8}
                value={remark}
                placeholder="Add a remark for this transfer"
                disabled={isAssemblyToTrcLoading}
                onChange={(e) => setRemark(e.target.value)}
                helperText={
                  <span className="flex justify-end">
                    {remark.length}/{REMARK_MAX_LENGTH}
                  </span>
                }
                slotProps={{ htmlInput: { maxLength: REMARK_MAX_LENGTH } }}
              />
            </section>
          </aside>
        </div>

        <div className="h-[50px] border-t border-neutral-300 flex items-center justify-end gap-[10px] px-[20px] bg-neutral-50">
          <Button
            variant="text"
            color="error"
            startIcon={<DeleteSweep />}
            disabled={(!rowData.length && !issues.length) || isAssemblyToTrcLoading}
            onClick={handleClear}
          >
            Clear All
          </Button>
          <LoadingButton
            variant="contained"
            loading={isAssemblyToTrcLoading}
            loadingPosition="start"
            startIcon={<Icons.save />}
            disabled={!rowData.length || !issues.length}
            onClick={() => setConfirmOpen(true)}
          >
            Submit
          </LoadingButton>
        </div>
      </div>
    </>
  );
};

export default AssemblyToTrc;
