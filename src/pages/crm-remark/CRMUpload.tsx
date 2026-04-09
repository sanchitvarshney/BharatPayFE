import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { submitCrmSerials } from "@/features/crmRemark/crmRemarkSlice";
import { showToast } from "@/utils/toasterContext";

type PreviewRow = Record<string, unknown>;

const ALLOWED_REMARKS = new Set(["DONE", "QC_PENDING", "HOLD"]);

const findRemarkColumnKey = (columnKeys: string[]): string | null =>
  columnKeys.find((k) => k.trim().toLowerCase() === "remark") ?? null;

const validateRowsForRemark = (
  rows: PreviewRow[],
  columnKeys: string[],
): { ok: true } | { ok: false; message: string } => {
  const remarkKey = findRemarkColumnKey(columnKeys);
  if (!remarkKey) {
    return {
      ok: false,
      message:
        "Excel must include a 'remark' column. Each row must use one of: DONE, QC_PENDING, HOLD.",
    };
  }
  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i][remarkKey];
    const normalized = String(raw ?? "").trim().toUpperCase();
    if (!normalized) {
      return {
        ok: false,
        message: `Row ${i + 2}: remark is required (DONE, QC_PENDING, or HOLD).`,
      };
    }
    if (!ALLOWED_REMARKS.has(normalized)) {
      return {
        ok: false,
        message: `Row ${i + 2}: invalid remark "${String(raw).trim()}". Allowed: DONE, QC_PENDING, HOLD.`,
      };
    }
  }
  return { ok: true };
};

const CRMUpload = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const dispatch = useAppDispatch();
  const { submitLoading } = useAppSelector((state) => state.crmRemark);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setPreviewRows([]);
    setColumns([]);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!ext || !["xls", "xlsx", "csv"].includes(ext)) {
      setFile(null);
      return;
    }

    setFile(selectedFile);
    parseFile(selectedFile);
  };

  const parseFile = (selectedFile: File) => {
    setIsParsing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const json: PreviewRow[] = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
        });

        if (!json.length) {
          setPreviewRows([]);
          setColumns([]);
        } else {
          const cols = Object.keys(json[0]);
          const validation = validateRowsForRemark(json, cols);
          if (!validation.ok) {
            showToast(validation.message);
            showToast(validation.message, "error");
            setPreviewRows([]);
            setColumns([]);
          } else {
            setColumns(cols);
            setPreviewRows(json);
          }
        }
      } catch (err) {
        showToast("Unable to read the file. Please check the format and try again.");
        setPreviewRows([]);
        setColumns([]);
      } finally {
        setIsParsing(false);
      }
    };

    reader.onerror = () => {
      setIsParsing(false);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleDownloadSample = () => {
    const sampleData = [{ serial_number: "00067972330", remark: "DONE" }];
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample");
    XLSX.writeFile(workbook, "crm_remark_sample.xlsx");
  };

  const handleSubmit = async () => {
    if (!file || !previewRows.length) return;

    const validation = validateRowsForRemark(previewRows, columns);
    if (!validation.ok) {
      showToast(validation.message, "error");
      return;
    }

    const remarkKey = findRemarkColumnKey(columns);
    if (!remarkKey) {
      showToast(
        "Excel must include a 'remark' column (DONE, QC_PENDING, or HOLD).",
        "error",
      );
      return;
    }

    const pairs = previewRows
      .map((row) => ({
        serial: String(row.serial_number ?? "").trim(),
        remark: String(row[remarkKey] ?? "").trim().toUpperCase(),
      }))
      .filter((p) => p.serial.length > 0);

    if (!pairs.length) {
      showToast("No valid serial numbers found in the file.", "error");
      return;
    }

    for (let i = 0; i < pairs.length; i++) {
      if (!ALLOWED_REMARKS.has(pairs[i].remark)) {
        showToast(
          `Row ${i + 2}: invalid remark. Allowed: DONE, QC_PENDING, HOLD.`,
          "error",
        );
        return;
      }
    }

    const serialNumbers = pairs.map((p) => p.serial);
    const remark = pairs.map((p) => p.remark);

    const action = await dispatch(submitCrmSerials({ serialNumbers, remark }));

    if (submitCrmSerials.fulfilled.match(action)) {
      const payload = action.payload;
      if (payload?.success === true) {
        showToast(
          payload.message ?? "Remark status changed successfully.",
          "success",
        );
        handleClear();
      }
    } else if (submitCrmSerials.rejected.match(action)) {
      const message =
        (action.payload as string) ||
        "Failed to submit data. Please try again.";

      showToast(message, "error");
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreviewRows([]);
    setColumns([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isSubmitDisabled =
    !file || !previewRows.length || isParsing || submitLoading;

  return (
    <Box sx={{ p: 0, height: "calc(100vh - 100px)" }}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent
          sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Select Excel file
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Button component="label" variant="outlined" color="primary">
                Choose file
                <input
                  ref={fileInputRef}
                  hidden
                  type="file"
                  accept=".xls,.xlsx,.csv"
                  onChange={handleFileChange}
                />
              </Button>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ flexGrow: 1 }}
              >
                {file ? (
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {file.name}
                  </Typography>
                ) : (
                  "No file selected"
                )}
              </Typography>
              <Button
                variant="text"
                color="primary"
                onClick={handleDownloadSample}
                sx={{ whiteSpace: "nowrap" }}
              >
                Download sample
              </Button>
            </Stack>
            <Typography variant="caption" color="text.disabled">
              Supported formats: .xls, .xlsx, .csv — remark must be DONE,
              QC_PENDING, or HOLD.
            </Typography>
          </Box>


          {isParsing && (
            <Typography variant="body2" color="text.secondary">
              Reading file, please wait...
            </Typography>
          )}

          {!!previewRows.length && !isParsing && (
            <Box
              sx={{
                mt: 1,
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Typography variant="subtitle2">Preview</Typography>
                <Typography variant="caption" color="text.secondary">
                  Showing first {Math.min(previewRows.length)} rows
                </Typography>
              </Box>
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ flex: 1, minHeight: 0, maxHeight: 400 }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {columns.map((col) => (
                        <TableCell
                          key={col}
                          sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
                        >
                          {col}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {previewRows.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {columns.map((col) => (
                          <TableCell key={col}>
                            {String(row[col] ?? "")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </CardContent>

        <CardActions
          sx={{
            borderTop: 1,
            borderColor: "divider",
            px: 2.5,
            py: 1.5,
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleClear}
            disabled={isParsing && !file && !previewRows.length}
          >
            Clear
          </Button>
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            loading={submitLoading}
            disabled={isSubmitDisabled}
          >
            Submit
          </LoadingButton>
        </CardActions>
      </Card>
    </Box>
  );
};

export default CRMUpload;
