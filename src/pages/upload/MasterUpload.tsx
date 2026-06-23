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
  Chip,
  Divider,
  LinearProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { CloudUpload, Download, ErrorOutline } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { uploadMasterData } from "@/features/upload/uploadSlice";
import { showToast } from "@/utils/toasterContext";
import SelectDevice, { DeviceType } from "@/components/reusable/SelectSku";

type PreviewRow = Record<string, unknown>;

const EXPECTED_COLUMNS = ["serial", "imei", "manufacturingMonth", "manufacturingYear"];

const MasterUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const { masterUploadLoading } = useAppSelector((state) => state.upload);

  const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  const parseFile = (f: File) => {
    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: PreviewRow[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

        if (!rows.length) {
          showToast("File is empty or has no data rows.", "error");
          setPreviewRows([]);
          setColumns([]);
        } else {
          setColumns(Object.keys(rows[0]));
          setPreviewRows(rows);
        }
      } catch {
        showToast("Failed to parse the file. Please check the format.", "error");
        setPreviewRows([]);
        setColumns([]);
      } finally {
        setIsParsing(false);
      }
    };
    reader.onerror = () => setIsParsing(false);
    reader.readAsArrayBuffer(f);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setPreviewRows([]);
    setColumns([]);
    if (!selected) { setFile(null); return; }

    const ext = selected.name.split(".").pop()?.toLowerCase();
    if (!ext || !["xls", "xlsx", "csv"].includes(ext)) {
      showToast("Only .csv, .xlsx or .xls files are accepted.", "error");
      setFile(null);
      return;
    }
    setFile(selected);
    parseFile(selected);
  };

  const handleDeviceChange = (val: DeviceType | null) => {
    setSelectedDevice(val);
    handleClear();
  };

  const handleClear = () => {
    setFile(null);
    setPreviewRows([]);
    setColumns([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      EXPECTED_COLUMNS,
      ["SN001", "352099001761481", "January", "2024"],
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "master_upload_template.xlsx");
  };

  const handleSubmit = async () => {
    if (!file || !selectedDevice) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("deviceId", selectedDevice.id);
    formData.append("deviceName", selectedDevice.text);

    const res = await dispatch(uploadMasterData(formData));
    const payload: any = res?.payload;
    if (payload?.data?.success) {
      showToast(payload.data.message || "Uploaded successfully", "success");
      handleClear();
    }
  };

  const missingCols = file
    ? EXPECTED_COLUMNS.filter(
        (col) => !columns.map((c) => c.toLowerCase()).includes(col.toLowerCase())
      )
    : [];

  const isSubmitDisabled =
    !file || !previewRows.length || isParsing || masterUploadLoading || missingCols.length > 0;

  return (
    <Box sx={{ p: 0, height: "calc(100vh - 50px)" }}>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 0 }}>
        {isParsing && <LinearProgress sx={{ height: 2 }} />}

        <CardContent sx={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 2.5, p: 3 }}>

          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={700} lineHeight={1.3}>
                Master Upload
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Select a device model, then upload master data (serial, IMEI, manufacturing month &amp; year).
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Download fontSize="small" />}
              onClick={handleDownloadTemplate}
            >
              Download Template
            </Button>
          </Box>

          <Divider />

          {/* Device type dropdown */}
          <Box sx={{ maxWidth: 340 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.75 }}>
              Device Model <span style={{ color: "red" }}>*</span>
            </Typography>
            <SelectDevice
              value={selectedDevice}
              onChange={handleDeviceChange}
              label="Search & select device"
              size="small"
            />
          </Box>

          {/* Upload section — shown only after device is selected */}
          {selectedDevice && (
            <>
              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.75 }}>
                  Upload File
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    startIcon={<CloudUpload fontSize="small" />}
                  >
                    Choose File
                    <input
                      ref={fileInputRef}
                      hidden
                      type="file"
                      accept=".xls,.xlsx,.csv"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {file ? (
                    <Chip
                      label={file.name}
                      size="small"
                      onDelete={handleClear}
                      sx={{ maxWidth: 280 }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.disabled">
                      No file selected
                    </Typography>
                  )}
                </Box>
                <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: "block" }}>
                  Accepted: .csv, .xlsx, .xls &nbsp;·&nbsp; Required columns: {EXPECTED_COLUMNS.join(", ")}
                </Typography>
              </Box>

              {/* Missing column warnings */}
              {missingCols.length > 0 && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderColor: "error.light",
                    bgcolor: "#fff5f5",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                    maxWidth: 600,
                  }}
                >
                  <ErrorOutline color="error" fontSize="small" />
                  <Typography variant="caption" color="error.main" fontWeight={600}>
                    Missing required columns:
                  </Typography>
                  {missingCols.map((col) => (
                    <Chip key={col} label={col} color="error" size="small" variant="outlined" />
                  ))}
                </Paper>
              )}

              {/* Preview table */}
              {previewRows.length > 0 && !isParsing && (
                <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Preview
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {previewRows.length} row{previewRows.length !== 1 ? "s" : ""} · {columns.length} columns
                    </Typography>
                  </Box>
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{ flex: 1, minHeight: 0, maxHeight: 420 }}
                  >
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, bgcolor: "#f9fafb", color: "text.secondary", width: 48 }}>
                            #
                          </TableCell>
                          {columns.map((col) => {
                            const isExpected = EXPECTED_COLUMNS.some(
                              (c) => c.toLowerCase() === col.toLowerCase()
                            );
                            return (
                              <TableCell
                                key={col}
                                sx={{
                                  fontWeight: 700,
                                  bgcolor: "#f9fafb",
                                  color: isExpected ? "primary.main" : "text.primary",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {col}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {previewRows.map((row, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell sx={{ color: "text.disabled", fontSize: 11 }}>{idx + 1}</TableCell>
                            {columns.map((col) => (
                              <TableCell key={col} sx={{ whiteSpace: "nowrap" }}>
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

              {/* Empty state */}
              {!file && !isParsing && (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    color: "text.disabled",
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                    py: 6,
                  }}
                >
                  <CloudUpload sx={{ fontSize: 48, opacity: 0.3 }} />
                  <Typography variant="body2">
                    Choose a file to preview before uploading
                  </Typography>
                </Box>
              )}
            </>
          )}
        </CardContent>

        {/* Footer */}
        <CardActions
          sx={{ borderTop: 1, borderColor: "divider", px: 2.5, py: 1.5, justifyContent: "flex-end", gap: 1 }}
        >
          <Button variant="outlined" color="inherit" onClick={handleClear} disabled={!file}>
            Clear
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleSubmit}
            loading={masterUploadLoading}
            disabled={isSubmitDisabled}
            startIcon={<CloudUpload fontSize="small" />}
          >
            Upload
          </LoadingButton>
        </CardActions>
      </Card>
    </Box>
  );
};

export default MasterUpload;
