import SelectLocationAcordingModule from "@/components/reusable/SelectLocationAcordingModule";
import { useAppSelector } from "@/hooks/useReduxHook";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
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
import {
  checkBoxLocation,
  DeviceMovementType,
  submitSwipeTransferData,
} from "@/features/transfer/deviceTransferSlice";
import SelectSku from "@/components/reusable/SelectSku";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";

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
const DEFAULT_IDS_PER_SCAN = 63;
const MAX_DEVICES = 1575;

const DEVICE_TYPE_OPTIONS: { label: string; value: DeviceMovementType }[] = [
  { label: "Swipe", value: "SWIPE" },
  { label: "Soundbox", value: "SOUNDBOX" },
];

const isSoundboxType = (type?: DeviceMovementType) => type === "SOUNDBOX";

const parseScannerInput = (
  input: string,
  expectedIds: number,
  deviceType: DeviceMovementType,
): { boxNo: string; serialIds: string[] } => {
  const tokens = input
    .trim()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (tokens.length === 0) return { boxNo: "", serialIds: [] };

  if (isSoundboxType(deviceType)) {
    return { boxNo: "", serialIds: tokens.slice(0, expectedIds) };
  }

  const boxNo = tokens[BOX_CODE_INDEX] ?? "";
  const serialIds = tokens.slice(1, 1 + expectedIds);
  return { boxNo, serialIds };
};

const getMinTokenCount = (deviceType: DeviceMovementType, expectedIds: number) =>
  isSoundboxType(deviceType) ? expectedIds : 1 + expectedIds;

const SwipeTransfer = () => {
  const dispatch = useDispatch<any>();
  const [tableRows, setTableRows] = useState<SwipeTableRow[]>([]);
  const [fieldsLocked, setFieldsLocked] = useState(false);
  const [typeLocked, setTypeLocked] = useState(false);
  const [typeChangeDialogOpen, setTypeChangeDialogOpen] = useState(false);
  const [pendingDeviceType, setPendingDeviceType] = useState<DeviceMovementType | null>(
    null,
  );
  const scannerInputRef = useRef<HTMLInputElement>(null);

  const { isSubmitSwipeLoading, isCheckBoxLocationLoading } = useAppSelector(
    (state) => state.deviceTransfer,
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      deviceType: "SWIPE" as DeviceMovementType,
      locationfromId: "",
      locationtoId: "",
      deviceCount: DEFAULT_IDS_PER_SCAN,
      scannerInput: "",
      sku: null,
    },
  });

  const watchedDeviceCount = watch("deviceCount");
  const watchedDeviceType = watch("deviceType") as DeviceMovementType;
  const isSoundbox = isSoundboxType(watchedDeviceType);

  const getTokenCount = (input: string) =>
    input
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

  const processScan = async (inputValue: string, clearInput: () => void) => {
    const trimmed = inputValue?.trim();
    if (!trimmed) return;

    const deviceType = getValues("deviceType") as DeviceMovementType;
    if (!deviceType) {
      showToast("Please select device type", "error");
      return;
    }

    const deviceCount = Number(getValues("deviceCount"));
    if (!Number.isInteger(deviceCount) || deviceCount < 1 || deviceCount > MAX_DEVICES) {
      showToast(`Enter a valid device count between 1 and ${MAX_DEVICES}`, "error");
      return;
    }

    const { boxNo, serialIds } = parseScannerInput(trimmed, deviceCount, deviceType);

    if (isSoundboxType(deviceType)) {
      if (serialIds.length !== deviceCount) {
        showToast(
          `Enter exactly ${deviceCount} device ID(s) (space or newline separated)`,
          "error",
        );
        return;
      }
    } else if (!boxNo || serialIds.length !== deviceCount) {
      showToast(
        `Enter box code followed by exactly ${deviceCount} device IDs (space or newline separated)`,
        "error",
      );
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

    const locationFrom = getValues("locationfromId");
    if (!locationFrom?.code) {
      showToast("Please select location from", "error");
      return;
    }

    const locationTo = getValues("locationtoId");
    if (!locationTo?.code) {
      showToast("Please select location to", "error");
      return;
    }

    const sku = getValues("sku");
    if (!sku?.sku) {
      showToast("Please select SKU", "error");
      return;
    }

    try {
      const data = await dispatch(
        checkBoxLocation({
          boxNo,
          serial: toAdd,
          fromLocation: locationFrom.code,
          sku: sku.sku,
          type: deviceType,
        }),
      ).unwrap();
      if (!data?.success) {
        showToast(data?.message ?? "Check box location failed", "error");
        return;
      }
      const rowsFromApi = Array.isArray(data?.data) ? data.data : null;
      const newRows: SwipeTableRow[] = rowsFromApi
        ? rowsFromApi.map((row: Partial<SwipeTableRow>, idx: number) => ({
            id: row.id ?? `${(row.serialNo ?? row.sl_no) ?? ""}-${Date.now()}-${idx}`,
            boxNo: row.boxNo ?? boxNo,
            serialNo: row.serialNo ?? row.sl_no ?? "",
            sl_no: row.sl_no ?? row.serialNo ?? "",
            p_name: row.p_name,
            device_imei: row.device_imei,
            device_model: row.device_model,
            device_sku: row.device_sku,
            mfgBy: row.mfgBy,
            mfgMonth: row.mfgMonth,
            mfgYear: row.mfgYear,
          }))
        : toAdd.map((serialId) => {
            const idTrimmed = serialId.trim();
            return {
              id: `${idTrimmed}-${Date.now()}-${Math.random()}`,
              boxNo,
              serialNo: idTrimmed,
              sl_no: idTrimmed,
            };
          });
      if (newRows.length > 0) {
        const currentTotal = tableRows.length;
        const afterAdd = currentTotal + newRows.length;
        if (afterAdd > MAX_DEVICES) {
          const canAdd = MAX_DEVICES - currentTotal;
          if (canAdd <= 0) {
            showToast(`Maximum ${MAX_DEVICES} devices allowed. Cannot add more.`, "error");
            clearInput();
            scannerInputRef.current?.focus();
            return;
          }
          const toAddCapped = newRows.slice(0, canAdd);
          setTableRows((prev) => [...prev, ...toAddCapped]);
          setFieldsLocked(true);
          showToast(
            isSoundboxType(deviceType)
              ? `Added ${toAddCapped.length} device(s). Maximum ${MAX_DEVICES} devices reached.`
              : `Added ${toAddCapped.length} device(s) for box ${boxNo}. Maximum ${MAX_DEVICES} devices reached.`,
            "success",
          );
        } else {
          setTableRows((prev) => [...prev, ...newRows]);
          setFieldsLocked(true);
          showToast(
            isSoundboxType(deviceType)
              ? `Added ${newRows.length} device(s)`
              : `Added ${newRows.length} device(s) for box ${boxNo}`,
            "success",
          );
        }
      }
      clearInput();
      scannerInputRef.current?.focus();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : err instanceof Error
            ? err.message
            : "Check box location failed";
      showToast(message ?? "Check box location failed", "error");
    }
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
      hide: isSoundbox,
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
      const deviceType = data.deviceType as DeviceMovementType;
      const soundboxSubmit = isSoundboxType(deviceType);

      const byBox = tableRows.reduce<Record<string, string[]>>((acc, r) => {
        const box = soundboxSubmit ? "" : (r.boxNo?.trim() ?? "");
        const serial = (r.serialNo || r.sl_no)?.trim?.() ?? "";
        if (!serial) return acc;
        if (!soundboxSubmit && !box) return acc;
        const boxKey = soundboxSubmit ? "" : box;
        if (!acc[boxKey]) acc[boxKey] = [];
        acc[boxKey].push(serial);
        return acc;
      }, {});
      const dataPayload = Object.entries(byBox).map(([boxNo, serial]) => ({
        boxNo,
        serial,
      }));

      if (!deviceType) {
        showToast("Please select device type", "error");
        return;
      }

      const payload = {
        fromLocation: data.locationfromId.code,
        toLocation: data.locationtoId.code,
        data: dataPayload,
        sku: data.sku?.sku,
        type: deviceType,
      };

      const result: any = await dispatch(submitSwipeTransferData(payload)).unwrap();
      if (result?.success) {
        showToast(
          result?.message ?? "Transfer submitted successfully",
          "success",
        );
        reset();
        setTableRows([]);
        setFieldsLocked(false);
        setTypeLocked(false);
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
    setFieldsLocked(false);
    setTypeLocked(false);
    setTypeChangeDialogOpen(false);
    setPendingDeviceType(null);
  };

  const handleDeviceTypeChange = (newType: DeviceMovementType) => {
    const currentType = getValues("deviceType") as DeviceMovementType;
    if (newType === currentType) return;

    if (typeLocked) {
      setPendingDeviceType(newType);
      setTypeChangeDialogOpen(true);
      return;
    }

    setValue("deviceType", newType);
    setValue("locationfromId", "");
    setValue("locationtoId", "");
    setValue("sku", null);
    setTableRows([]);
    setFieldsLocked(false);
    setTypeLocked(true);
  };

  const confirmDeviceTypeChange = () => {
    const newType = pendingDeviceType ?? watchedDeviceType;
    reset({
      deviceType: newType,
      locationfromId: "",
      locationtoId: "",
      deviceCount: DEFAULT_IDS_PER_SCAN,
      scannerInput: "",
      sku: null,
    });
    setTableRows([]);
    setFieldsLocked(false);
    setTypeLocked(true);
    setTypeChangeDialogOpen(false);
    setPendingDeviceType(null);
  };

  return (
    <div className="h-[calc(100vh-100px)] bg-white flex flex-col">
      <ConfirmationModel
        open={typeChangeDialogOpen}
        onClose={() => {
          setTypeChangeDialogOpen(false);
          setPendingDeviceType(null);
        }}
        title="Change device type?"
        content="Changing type will reset all locations, SKU, scanned devices, and scanner input. Do you want to continue?"
        cancelText="Cancel"
        confirmText="Reset & change"
        color="warning"
        onConfirm={confirmDeviceTypeChange}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 p-0">
        <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
          <div className="w-full flex-shrink-0 p-4 pb-2">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[140px] w-[160px] flex-shrink-0">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                  Type
                </Typography>
                <Controller
                  name="deviceType"
                  control={control}
                  rules={{ required: "Type is required" }}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.deviceType}>
                      <InputLabel id="swipe-transfer-device-type-label">Type</InputLabel>
                      <Select
                        value={field.value}
                        labelId="swipe-transfer-device-type-label"
                        label="Type"
                        onChange={(e) => {
                          handleDeviceTypeChange(e.target.value as DeviceMovementType);
                        }}
                      >
                        {DEVICE_TYPE_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
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
                      key={`pick-${watchedDeviceType || "SWIPE"}`}
                      endPoint={`/swipeMovement/pickLocation?type=${watchedDeviceType || "SWIPE"}`}
                      value={field.value || null}
                      onChange={field.onChange}
                      error={!!errors.locationfromId}
                      placeholder="Location from"
                      isSearch={false}
                      disabled={fieldsLocked}
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
                      key={`drop-${watchedDeviceType || "SWIPE"}`}
                      endPoint={`/swipeMovement/dropLocation?type=${watchedDeviceType || "SWIPE"}`}
                      value={field.value || null}
                      onChange={field.onChange}
                      error={!!errors.locationtoId}
                      placeholder="Location to"
                      isSearch={false}
                      disabled={fieldsLocked}
                    />
                  )}
                />
              </div>
              <div className="min-w-[200px] flex-1 max-w-[280px]">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                  SKU
                </Typography>
                <Controller
                  name="sku"
                  control={control}
                  rules={{ required: "SKU is required" }}
                  render={({ field }) => (
                    <SelectSku
                      varient="outlined"
                      onChange={(e) => field.onChange(e)}
                      value={field.value}
                      disabled={fieldsLocked}
                    />
                  )}
                />
              </div>
              <div className="min-w-[120px] w-[130px] flex-shrink-0">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                  Device count
                </Typography>
                <Controller
                  name="deviceCount"
                  control={control}
                  rules={{
                    required: "Required",
                    min: { value: 1, message: "Min 1" },
                    max: { value: MAX_DEVICES, message: `Max ${MAX_DEVICES}` },
                    validate: (v) =>
                      Number.isInteger(Number(v)) || "Whole number only",
                  }}
                  render={({ field }) => (
                    <TextField
                      type="number"
                      placeholder={String(DEFAULT_IDS_PER_SCAN)}
                      value={field.value ?? ""}
                      fullWidth
                      size="small"
                      disabled={fieldsLocked}
                      error={!!errors.deviceCount}
                      helperText={errors.deviceCount?.message as string}
                      inputProps={{ min: 1, max: MAX_DEVICES, step: 1 }}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") {
                          field.onChange("");
                          return;
                        }
                        const n = Number(raw);
                        field.onChange(Number.isNaN(n) ? "" : Math.trunc(n));
                      }}
                    />
                  )}
                />
              </div>
              <div className="min-w-[300px] flex-[2] max-w-[400px]">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                  {isSoundbox
                    ? `Scanner (${Number.isFinite(Number(watchedDeviceCount)) && Number(watchedDeviceCount) > 0 ? Math.trunc(Number(watchedDeviceCount)) : DEFAULT_IDS_PER_SCAN} device IDs — no box code)`
                    : `Scanner (1 box code + ${Number.isFinite(Number(watchedDeviceCount)) && Number(watchedDeviceCount) > 0 ? Math.trunc(Number(watchedDeviceCount)) : DEFAULT_IDS_PER_SCAN} device IDs)`}
                </Typography>
                <Controller
                  name="scannerInput"
                  control={control}
                  render={({ field }) => {
                    const expectedIds =
                      Number.isFinite(Number(watchedDeviceCount)) && Number(watchedDeviceCount) > 0
                        ? Math.trunc(Number(watchedDeviceCount))
                        : DEFAULT_IDS_PER_SCAN;
                    const minTokens = getMinTokenCount(watchedDeviceType, expectedIds);
                    const placeholder = isSoundbox
                      ? `${expectedIds} device ID(s) (paste or type, Enter when ${minTokens} items)`
                      : `Box code then ${expectedIds} device IDs (paste or type, Enter when ${minTokens} items)`;
                    return (
                    <TextField
                      inputRef={scannerInputRef}
                      placeholder={placeholder}
                      value={field.value || ""}
                      fullWidth
                      multiline
                      minRows={2}
                      maxRows={4}
                      disabled={isCheckBoxLocationLoading || tableRows.length >= MAX_DEVICES}
                      onChange={(e) => field.onChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          const tokenCount = getTokenCount(field.value);
                          if (tokenCount >= minTokens) {
                            e.preventDefault();
                            processScan(
                              field.value,
                              () => field.onChange(""),
                            );
                          }
                        }
                      }}
                      onPaste={(e) => {
                        const pasted = e.clipboardData?.getData("text") ?? "";
                        const tokenCount = getTokenCount(pasted);
                        if (tokenCount >= minTokens) {
                          e.preventDefault();
                          processScan(pasted, () => field.onChange(""));
                        }
                      }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              {isCheckBoxLocationLoading ? (
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
                    );
                  }}
                />
              </div>
            </div>
          </div>

          {/* Table - fills remaining space */}
          <div className="flex-1 flex flex-col min-h-0 w-full px-4 pb-4">
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }} className="flex-shrink-0">
              Added devices ({tableRows.length} / {MAX_DEVICES})
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
