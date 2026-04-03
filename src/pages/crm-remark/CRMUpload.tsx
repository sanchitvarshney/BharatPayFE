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
          setColumns(cols);
          setPreviewRows(json);
        }
      } catch (err) {
       
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
    const header = ["serial_number"];
    const sampleData = [{ serial_number: "00067972330" }];
    const worksheet = XLSX.utils.json_to_sheet(sampleData, { header });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample");
    XLSX.writeFile(workbook, "crm_remark_sample.xlsx");
  };

  const handleSubmit = async () => {
    if (!file || !previewRows.length) return;

    // Extract serial numbers from parsed rows (expects `serial_number` column)
    const serialNumbers = previewRows
      .map((row) => String(row.serial_number ?? "").trim())
      .filter((v) => v.length > 0);

    if (!serialNumbers.length) {
     
      return;
    }

    const action = await dispatch(submitCrmSerials(serialNumbers));

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
        (action.payload as string) || "Failed to submit data. Please try again.";
    
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
    !file || !previewRows.length  || isParsing || submitLoading;

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
              Supported formats: .xls, .xlsx, .csv
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
