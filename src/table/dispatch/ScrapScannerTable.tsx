import React, { useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import {
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { QrCodeScanner } from "@mui/icons-material";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { showToast } from "@/utils/toasterContext";

const EXPECTED_IDS_PER_SCAN = 63;

export type ScrapScannerRow = {
  imei: string;
  srno: string;
  productKey: string;
  serialNo: number;
  modalNo: string;
  deviceSku: string;
  imei2?: string;
  index: number;
  boxNo?: string;
};

export type CheckBoxValidResponse = {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>[];
};

export type ScrapScannerTableProps = {
  rowData: ScrapScannerRow[];
  setRowData: React.Dispatch<React.SetStateAction<ScrapScannerRow[]>>;
  /** Same payload shape as checkBoxLocation: parent adds fromLocation & sku and calls dispatchDivice/checkBoxValid */
  onCheckBoxValid: (payload: { boxNo: string; serial: string[] }) => Promise<CheckBoxValidResponse>;
  loading?: boolean;
};

function getTokenCount(input: string): number {
  return input
    .trim()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean).length;
}

function parseScannerInput(
  input: string
): { boxNo: string; serialIds: string[] } {
  const tokens = input
    .trim()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (tokens.length === 0) return { boxNo: "", serialIds: [] };
  const boxNo = tokens[0] ?? "";
  const serialIds = tokens.slice(1, 1 + EXPECTED_IDS_PER_SCAN);
  return { boxNo, serialIds };
}

function mapDeviceToRow(
  device: Record<string, unknown>,
  boxNo: string,
  baseIndex: number
): ScrapScannerRow {
  const imeiVal = device.device_imei ?? device.imei_no1;
  const imei2Val = device.imei_no2;
  const srnoVal = device.sl_no ?? device.serialNo;
  const modalVal = device.p_name;
  const skuVal = device.device_sku;
  const productKeyVal = device.product_key;

  return {
    boxNo,
    imei:
      typeof imeiVal === "string" && imeiVal.trim() ? imeiVal : "--",
    imei2:
      typeof imei2Val === "string" && imei2Val.trim() ? imei2Val : "--",
    srno: typeof srnoVal === "string" ? srnoVal : "",
    modalNo: typeof modalVal === "string" ? modalVal : "",
    deviceSku: typeof skuVal === "string" ? skuVal : "",
    productKey: typeof productKeyVal === "string" ? productKeyVal : "",
    serialNo: 0,
    index: baseIndex,
  };
}

function DeleteRowButton({
  index,
  onDelete,
}: Readonly<{
  index: number;
  onDelete: (index: number) => void;
}>) {
  return (
    <IconButton
      size="small"
      onClick={() => onDelete(index)}
      color="error"
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  );
}

const ScrapScannerTable: React.FC<ScrapScannerTableProps> = ({
  rowData,
  setRowData,
  onCheckBoxValid,
  loading = false,
}) => {
  const [scannerInput, setScannerInput] = useState("");
  const scannerInputRef = useRef<HTMLInputElement>(null);

  const removeRowByIndex = (rowIndex: number) => {
    setRowData((prev) => {
      const filtered = prev.filter((r) => r.index !== rowIndex);
      return filtered.map((item, idx) => ({ ...item, index: idx + 1 }));
    });
  };

  const columnDefs: ColDef<ScrapScannerRow>[] = [
    {
      headerName: "#",
      field: "index",
      sortable: true,
      filter: true,
      width: 80,
    },
    {
      headerName: "Box No",
      field: "boxNo",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Serial No",
      field: "srno",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "IMEI",
      field: "imei",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Model",
      field: "modalNo",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Action",
      sortable: false,
      filter: false,
      width: 90,
      cellRenderer: (params: ICellRendererParams<ScrapScannerRow>) => {
        const index = params.data?.index;
        if (index == null) return null;
        return (
          <DeleteRowButton index={index} onDelete={removeRowByIndex} />
        );
      },
    },
  ];

  const processScan = async (inputValue: string) => {
    const trimmed = inputValue?.trim();
    if (!trimmed) return;

    const { boxNo, serialIds } = parseScannerInput(trimmed);

    // Limit to maximum 30 distinct boxes across the table
    const existingBoxNos = new Set(
      rowData.map((r) => (r.boxNo ?? "").trim()).filter(Boolean)
    );
    const isNewBox = boxNo && !existingBoxNos.has(boxNo);
    if (isNewBox && existingBoxNos.size >= 30) {
      showToast("Maximum 30 boxes can be scanned in one dispatch.", "error");
      setScannerInput("");
      scannerInputRef.current?.focus();
      return;
    }

    if (!boxNo || serialIds.length !== EXPECTED_IDS_PER_SCAN) {
      showToast(
        `Enter box code followed by exactly ${EXPECTED_IDS_PER_SCAN} device IDs (space or newline separated)`,
        "error"
      );
      return;
    }

    const existingSerials = new Set(
      rowData.map((r) => (r.srno ?? "").trim()).filter(Boolean)
    );
    const toAdd = serialIds
      .map((s) => s.trim())
      .filter((s) => s && !existingSerials.has(s));

    const duplicates = serialIds.length - toAdd.length;
    if (duplicates > 0) {
      showToast(`${duplicates} duplicate ID(s) skipped`, "info");
    }

    if (toAdd.length === 0) {
      setScannerInput("");
      scannerInputRef.current?.focus();
      return;
    }

    try {
      const res = await onCheckBoxValid({ boxNo, serial: toAdd });

      if (!res?.success) {
        showToast(
          res?.message ?? "Check box validation failed",
          "error"
        );
        return;
      }

      const devices = res?.data;
      const list = Array.isArray(devices) ? devices : [];
      const mapped: ScrapScannerRow[] =
        list.length > 0
          ? list.map(
              (device: unknown, deviceIndex: number) =>
                mapDeviceToRow(
                  (device ?? {}) as Record<string, unknown>,
                  boxNo,
                  rowData.length + deviceIndex + 1
                )
            )
          : toAdd.map((serialId, deviceIndex) => {
              const srno = serialId.trim();
              return {
                boxNo,
                srno,
                imei: "--",
                imei2: "--",
                modalNo: "",
                deviceSku: "",
                productKey: "",
                serialNo: 0,
                index: rowData.length + deviceIndex + 1,
              };
            });

      if (mapped.length === 0) {
        showToast("No devices to add for this scan", "warning");
        return;
      }

      setRowData((prev) => {
        const updated = [...prev, ...mapped];
        return updated.map((item, idx) => ({ ...item, index: idx + 1 }));
      });

      setScannerInput("");
      scannerInputRef.current?.focus();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to process scan";
      showToast(message, "error");
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-shrink-0 pb-4 min-w-[320px] max-w-[480px] w-full">
        <Typography variant="subtitle2" sx={{ mb: 0.4 }} className="block">
          Scanner (1 box code + 63 device IDs)
        </Typography>
        <TextField
          inputRef={scannerInputRef}
          placeholder="Box code then 63 device IDs (paste or type, Enter to submit when 64 items)"
          value={scannerInput}
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
          onChange={(e) => setScannerInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              const tokenCount = getTokenCount(scannerInput);
              if (tokenCount >= 1 + EXPECTED_IDS_PER_SCAN) {
                e.preventDefault();
                processScan(scannerInput);
              }
            }
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData?.getData("text") ?? "";
            const tokenCount = getTokenCount(pasted);
            if (tokenCount >= 1 + EXPECTED_IDS_PER_SCAN) {
              e.preventDefault();
              processScan(pasted);
            }
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {loading ? (
                    <Typography variant="caption" color="text.secondary">
                      Checking…
                    </Typography>
                  ) : (
                    <QrCodeScanner />
                  )}
                </InputAdornment>
              ),
            },
          }}
        />
      </div>
      <div className="ag-theme-quartz flex-1 min-h-0">
        <AgGridReact<ScrapScannerRow>
          rowData={rowData}
          columnDefs={columnDefs}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          defaultColDef={{ resizable: true }}
          domLayout="normal"
        />
      </div>
    </div>
  );
};

export default ScrapScannerTable;
