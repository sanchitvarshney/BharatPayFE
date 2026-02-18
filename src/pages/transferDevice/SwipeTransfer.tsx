import SelectLocationAcordingModule from "@/components/reusable/SelectLocationAcordingModule";
import { useAppSelector } from "@/hooks/useReduxHook";
import { LoadingButton } from "@mui/lab";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { QrCodeScanner } from "@mui/icons-material";

import { showToast } from "@/utils/toasterContext";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { submitSwipeTransferData } from "@/features/transfer/deviceTransferSlice";

export type SwipeTableRow = {
  id: string;
  boxNo: string;
  serialNo: string;
  p_name?: string;
  device_imei?: string;
  device_model?: string;
  device_sku?: string;
  mfgBy?: string;
  mfgMonth?: string;
  mfgYear?: string;
  sl_no?: string;
};

const BOX_CODE_INDEX = 0;
const EXPECTED_IDS_PER_SCAN = 63;

const SwipeTransfer = () => {
  const dispatch = useDispatch<any>();
  const [tableRows, setTableRows] = useState<SwipeTableRow[]>([]);
  const scannerInputRef = useRef<HTMLInputElement>(null);

  const { isSubmitSwipeLoading } = useAppSelector((state) => state.deviceTransfer);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      locationfromId: "",
      locationtoId: "",
      scannerInput: "",
    },
  });

  const parseScannerInput = (input: string): { boxNo: string; serialIds: string[] } => {
    const tokens = input.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return { boxNo: "", serialIds: [] };
    const boxNo = tokens[BOX_CODE_INDEX] ?? "";
    const serialIds = tokens.slice(1, 1 + EXPECTED_IDS_PER_SCAN);
    return { boxNo, serialIds };
  };

  const processScan = (inputValue: string, clearInput: () => void) => {
    const trimmed = inputValue?.trim();
    if (!trimmed) return;

    const { boxNo, serialIds } = parseScannerInput(trimmed);
    if (!boxNo || serialIds.length === 0) {
      showToast("Scan should contain box code followed by at least one device ID (space separated)", "error");
      return;
    }

    const existingSerials = new Set(
      tableRows.map((r) => r.serialNo ?? r.sl_no).filter(Boolean),
    );
    const toAdd = serialIds.filter((id) => {
      const s = id.trim();
      return s && !existingSerials.has(s);
    });
    const duplicates = serialIds.length - toAdd.length;
    if (duplicates > 0) {
      showToast(`${duplicates} duplicate ID(s) skipped`, "info");
    }
    if (toAdd.length === 0) {
      clearInput();
      return;
    }

    const newRows: SwipeTableRow[] = toAdd.map((serialId) => {
      const idTrimmed = serialId.trim();
      return {
        id: `${idTrimmed}-${Date.now()}-${Math.random()}`,
        boxNo,
        serialNo: idTrimmed,
        sl_no: idTrimmed,
      };
    });
    setTableRows((prev) => [...prev, ...newRows]);
    showToast(`Added ${newRows.length} device(s) for box ${boxNo}`, "success");
    clearInput();
    scannerInputRef.current?.focus();
  };

  const removeRow = (id: string) => {
    setTableRows((prev) => prev.filter((r) => r.id !== id));
  };

  const columnDefs: ColDef<SwipeTableRow>[] = [
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      width: 70,
      sortable: true,
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
      field: "serialNo",
      sortable: true,
      filter: true,
      flex: 1,
    },
 
    {
      headerName: "IMEI",
      field: "device_imei",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Model",
      field: "device_model",
      sortable: true,
      filter: true,
      flex: 1,
    },
  
    {
      headerName: "Action",
      cellRenderer: (params: any) => (
        <IconButton
          size="small"
          onClick={() => removeRow(params.data.id)}
          color="error"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
      width: 90,
      sortable: false,
      filter: false,
    },
  ];

  const onSubmit = async (data: any) => {
    if (tableRows.length === 0) {
      showToast("Add at least one serial number", "error");
      return;
    }
    if (!data.locationfromId?.code || !data.locationtoId?.code) {
      showToast("From location and To location are required", "error");
      return;
    }

    try {
      const byBox = tableRows.reduce<Record<string, string[]>>((acc, r) => {
        const box = r.boxNo?.trim() ?? "";
        const serial = (r.serialNo || r.sl_no)?.trim?.() ?? "";
        if (!box || !serial) return acc;
        if (!acc[box]) acc[box] = [];
        acc[box].push(serial);
        return acc;
      }, {});
      const dataPayload = Object.entries(byBox).map(([boxNo, serial]) => ({
        boxNo,
        serial,
      }));

      const payload: any = {
        fromLocation: data.locationfromId.code,
        toLocation: data.locationtoId.code,
        data: dataPayload,
      };

      const result: any = await dispatch(
        //@ts-ignore
        submitSwipeTransferData(payload),
      ).unwrap();
      if (result?.success) {
        showToast(
          result?.message ?? "Transfer submitted successfully",
          "success",
        );
        reset();
        setTableRows([]);
      } else {
        showToast(result?.message ?? "Submit failed", "error");
      }
    } catch (error: any) {
      showToast(
        error?.message || error?.response?.data?.message || "Submit failed",
        "error",
      );
    }
  };

  const onReset = () => {
    reset();
    setTableRows([]);
  };

  return (
    <div className="h-[calc(100vh-100px)] bg-white flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 p-0">
        <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
          <div className="w-full flex-shrink-0 p-4 pb-2">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[200px] flex-1 max-w-[280px]">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                  Location From
                </Typography>
                <Controller
                  name="locationfromId"
                  control={control}
                  rules={{ required: "Location from is required" }}
                  render={({ field }) => (
                    <SelectLocationAcordingModule
                      endPoint="/swipeMovement/pickLocation"
                      value={field.value || null}
                      onChange={field.onChange}
                      error={!!errors.locationfromId}
                      placeholder="Location from"
                      isSearch={false}
                    />
                  )}
                />
              </div>

              <div className="min-w-[200px] flex-1 max-w-[280px]">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                  Location To
                </Typography>
                <Controller
                  name="locationtoId"
                  control={control}
                  rules={{ required: "Location to is required" }}
                  render={({ field }) => (
                    <SelectLocationAcordingModule
                      endPoint="/swipeMovement/dropLocation"
                      value={field.value || null}
                      onChange={field.onChange}
                      error={!!errors.locationtoId}
                      placeholder="Location to"
                      isSearch={false}
                    />
                  )}
                />
              </div>
              <div className="min-w-[300px] flex-[2] max-w-[600px]">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                  Scanner (Box code + 63 device IDs, space separated)
                </Typography>
                <Controller
                  name="scannerInput"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      inputRef={scannerInputRef}
                      placeholder="e.g. 0DRPJJSI0M0004 G2R0W3A3976 G2R0W385594 ... (1 box code + 63 IDs)"
                      value={field.value || ""}
                      fullWidth
                      multiline
                      minRows={2}
                      maxRows={4}
                      onChange={(e) => field.onChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          processScan(
                            field.value,
                            () => field.onChange(""),
                          );
                        }
                      }}
                      onPaste={(e) => {
                        const pasted = e.clipboardData?.getData("text") ?? "";
                        const tokenCount = pasted.trim().split(/\s+/).filter(Boolean).length;
                        if (tokenCount >= 2) {
                          e.preventDefault();
                          processScan(pasted, () => field.onChange(""));
                        }
                      }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <QrCodeScanner />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Table - fills remaining space */}
          <div className="flex-1 flex flex-col min-h-0 w-full px-4 pb-4">
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }} className="flex-shrink-0">
              Added devices ({tableRows.length})
            </Typography>
            <div className="ag-theme-quartz flex-1 min-h-0">
              <AgGridReact<SwipeTableRow>
                rowData={tableRows}
                columnDefs={columnDefs}
                overlayNoRowsTemplate={OverlayNoRowsTemplate}
                suppressCellFocus={true}
                defaultColDef={{ resizable: true }}
                domLayout="normal"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-neutral-300 py-3 flex-shrink-0 bg-white">
          <div className="h-[50px] px-5 flex items-center gap-3 justify-end">
            <Button onClick={onReset} variant="outlined">
              Reset
            </Button>
            <LoadingButton
              loadingPosition="start"
              type="submit"
              variant="contained"
              loading={isSubmitSwipeLoading}
              disabled={tableRows.length === 0}
            >
              Submit
            </LoadingButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SwipeTransfer;
