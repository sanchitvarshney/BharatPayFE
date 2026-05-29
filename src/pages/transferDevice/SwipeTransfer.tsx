import SelectLocationAcordingModule from "@/components/reusable/SelectLocationAcordingModule";
import { useAppSelector } from "@/hooks/useReduxHook";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
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
import Success from "@/components/reusable/Success";
import { Dialog, DialogContent } from "@mui/material";

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
const DEFAULT_IDS_PER_SCAN = 30;
const MAX_DEVICES_SWIPE = 1575;
const MAX_DEVICES_SOUNDBOX = 1560;

const DEVICE_TYPE_OPTIONS: { label: string; value: DeviceMovementType }[] = [
  { label: "Swipe", value: "SWIPE" },
  { label: "Soundbox", value: "SOUNDBOX" },
];

const isSoundboxType = (type?: DeviceMovementType | string) =>
  String(type ?? "").toUpperCase() === "SOUNDBOX";

const isSwipeType = (type?: DeviceMovementType | string) =>
  String(type ?? "").toUpperCase() === "SWIPE";

const getMaxDevices = (type?: DeviceMovementType) =>
  isSoundboxType(type) ? MAX_DEVICES_SOUNDBOX : MAX_DEVICES_SWIPE;

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
  const [successOpen, setSuccessOpen] = useState(false);
  const [successInfo, setSuccessInfo] = useState({
    message: "",
    deviceCount: 0,
    deviceTypeLabel: "",
  });
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
    unregister,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      deviceType: "SOUNDBOX" as DeviceMovementType,
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
  const showSkuField = isSwipeType(watchedDeviceType);
  const maxDevices = getMaxDevices(watchedDeviceType);

  useEffect(() => {
    if (isSoundbox) {
      setValue("sku", null);
      unregister("sku");
    }
  }, [isSoundbox, setValue, unregister]);

  const getTokenCount = (input: string) =>
    input
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

  const processScan = async (inputValue: string, clearInput: () => void) => {
    const trimmed = inputValue?.trim();
    if (!trimmed) return;

    const failScan = (message: string) => {
      showToast(message, "error");
      clearInput();
      scannerInputRef.current?.focus();
    };

    const deviceType = getValues("deviceType") as DeviceMovementType;
    if (!deviceType) {
      failScan("Please select device type");
      return;
    }

    const deviceCount = Number(getValues("deviceCount"));
    const scanMax = getMaxDevices(deviceType);
    if (!Number.isInteger(deviceCount) || deviceCount < 1 || deviceCount > scanMax) {
      failScan(`Enter a valid device count between 1 and ${scanMax}`);
      return;
    }

    const { boxNo, serialIds } = parseScannerInput(trimmed, deviceCount, deviceType);

    if (isSoundboxType(deviceType)) {
      if (serialIds.length !== deviceCount) {
        failScan(
          `Enter exactly ${deviceCount} device ID(s) (space or newline separated)`,
        );
        return;
      }
    } else if (!boxNo || serialIds.length !== deviceCount) {
      failScan(
        `Enter box code followed by exactly ${deviceCount} device IDs (space or newline separated)`,
      );
      return;
    }

    const serialsTrimmed = serialIds.map((id) => id.trim()).filter(Boolean);
    const seenInBatch = new Set<string>();
    const hasBatchDuplicate = serialsTrimmed.some((serial) => {
      if (seenInBatch.has(serial)) return true;
      seenInBatch.add(serial);
      return false;
    });

    const existingSerials = new Set(
      tableRows.map((r) => (r.serialNo ?? r.sl_no)?.trim()).filter(Boolean) as string[],
    );
    const hasTableDuplicate = serialsTrimmed.some((serial) => existingSerials.has(serial));

    if (hasBatchDuplicate || hasTableDuplicate) {
      failScan("Duplicate device ID(s) are not allowed");
      return;
    }

    const toAdd = serialsTrimmed;

    const locationFrom = getValues("locationfromId");
    if (!locationFrom?.code) {
      failScan("Please select location from");
      return;
    }

    const locationTo = getValues("locationtoId");
    if (!locationTo?.code) {
      failScan("Please select location to");
      return;
    }

    const sku = getValues("sku");
    if (!isSoundboxType(deviceType) && !sku?.sku) {
      failScan("Please select SKU");
      return;
    }

    try {
      const data = await dispatch(
        checkBoxLocation({
          boxNo,
          serial: toAdd,
          fromLocation: locationFrom.code,
          type: deviceType,
          ...(!isSoundboxType(deviceType) && sku?.sku ? { sku: sku.sku } : {}),
        }),
      ).unwrap();
      if (!data?.success) {
        failScan(data?.message ?? "Check box location failed");
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
        if (afterAdd > scanMax) {
          const canAdd = scanMax - currentTotal;
          if (canAdd <= 0) {
            failScan(`Maximum ${scanMax} devices allowed. Cannot add more.`);
            return;
          }
          const toAddCapped = newRows.slice(0, canAdd);
          setTableRows((prev) => [...prev, ...toAddCapped]);
          setFieldsLocked(true);
          showToast(
            isSoundboxType(deviceType)
              ? `Added ${toAddCapped.length} device(s). Maximum ${scanMax} devices reached.`
              : `Added ${toAddCapped.length} device(s) for box ${boxNo}. Maximum ${scanMax} devices reached.`,
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
      failScan(message ?? "Check box location failed");
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

      if (!soundboxSubmit && !data.sku?.sku) {
        showToast("Please select SKU", "error");
        return;
      }

      const payload = {
        fromLocation: data.locationfromId.code,
        toLocation: data.locationtoId.code,
        data: dataPayload,
        type: deviceType,
        ...(!soundboxSubmit && data.sku?.sku ? { sku: data.sku.sku } : {}),
      };

      const result: any = await dispatch(submitSwipeTransferData(payload)).unwrap();
      if (result?.success) {
        const typeLabel =
          DEVICE_TYPE_OPTIONS.find((o) => o.value === deviceType)?.label ?? deviceType;
        setSuccessInfo({
          message: result?.message ?? "Transfer submitted successfully",
          deviceCount: tableRows.length,
          deviceTypeLabel: typeLabel,
        });
        setSuccessOpen(true);
        reset();
        setTableRows([]);
        setFieldsLocked(false);
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
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    setSuccessInfo({ message: "", deviceCount: 0, deviceTypeLabel: "" });
  };

  const applyDeviceTypeSideEffects = (
    newType: DeviceMovementType,
    previousType?: DeviceMovementType,
  ) => {
    if (previousType !== undefined && newType === previousType) return;

    setValue("locationfromId", "");
    setValue("locationtoId", "");
    setValue("sku", null);
    setValue("scannerInput", "");
    setTableRows([]);
    setFieldsLocked(false);
    if (isSoundboxType(newType)) {
      unregister("sku");
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] bg-white flex flex-col">
      <Dialog
        open={successOpen}
        onClose={handleSuccessClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, overflow: "hidden" } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <div className="flex flex-col items-center justify-center gap-[24px] text-center bg-[#f8f9fa] p-8">
            <div className="text-green-500 animate-bounce">
              <Success />
            </div>
            <Typography
              variant="h5"
              fontWeight={700}
              color="primary"
              className="border-b-2 border-blue-200 pb-2"
            >
              Transfer Submitted Successfully!
            </Typography>
            <div className="space-y-4 bg-white p-6 rounded-md shadow-sm w-full">
              <Typography
                variant="body1"
                fontWeight={500}
                className="flex justify-between gap-4"
              >
                <span className="text-gray-600">Type:</span>
                <span className="text-blue-600 font-semibold">
                  {successInfo.deviceTypeLabel || "-"}
                </span>
              </Typography>
              <Typography
                variant="body1"
                fontWeight={500}
                className="flex justify-between gap-4"
              >
                <span className="text-gray-600">Devices transferred:</span>
                <span className="text-blue-600 font-semibold">
                  {successInfo.deviceCount}
                </span>
              </Typography>
              <Typography
                variant="body1"
                fontWeight={500}
                className="flex justify-between gap-4"
              >
                <span className="text-gray-600 shrink-0">Message:</span>
                <span className="text-green-600 text-right">
                  {successInfo.message || "-"}
                </span>
              </Typography>
            </div>
            <LoadingButton
              onClick={handleSuccessClose}
              variant="contained"
              className="w-full max-w-[280px]"
            >
              Create New Transfer
            </LoadingButton>
          </div>
        </DialogContent>
      </Dialog>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 p-0">
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 w-full overflow-hidden gap-4 px-4 py-2">
          <div className="w-full lg:w-[380px] xl:w-[400px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto lg:overflow-y-auto lg:max-h-full">
              <div className="w-full">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                  Type
                </Typography>
                <Controller
                  name="deviceType"
                  control={control}
                  rules={{ required: "Type is required" }}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.deviceType}>
                      <Select
                        value={field.value ?? "SOUNDBOX"}
                        onChange={(e) => {
                          const nextType = e.target.value as DeviceMovementType;
                          const previousType = field.value as DeviceMovementType;
                          field.onChange(nextType);
                          applyDeviceTypeSideEffects(nextType, previousType);
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
              <div className="w-full">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                  Location From
                </Typography>
                <Controller
                  name="locationfromId"
                  control={control}
                  rules={{ required: "Location from is required" }}
                  render={({ field }) => (
                    <SelectLocationAcordingModule
                      key={`pick-${watchedDeviceType || "SOUNDBOX"}`}
                      endPoint={`/swipeMovement/pickLocation?type=${watchedDeviceType || "SOUNDBOX"}`}
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

              <div className="w-full">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                  Location To
                </Typography>
                <Controller
                  name="locationtoId"
                  control={control}
                  rules={{ required: "Location to is required" }}
                  render={({ field }) => (
                    <SelectLocationAcordingModule
                      key={`drop-${watchedDeviceType || "SOUNDBOX"}`}
                      endPoint={`/swipeMovement/dropLocation?type=${watchedDeviceType || "SOUNDBOX"}`}
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
              {showSkuField ? (
                <div className="w-full" key="sku-field">
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
              ) : null}
              <div className="w-full">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                  Device count
                </Typography>
                <Controller
                  name="deviceCount"
                  control={control}
                  rules={{
                    required: "Required",
                    min: { value: 1, message: "Min 1" },
                    max: { value: maxDevices, message: `Max ${maxDevices}` },
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
                      inputProps={{ min: 1, max: maxDevices, step: 1 }}
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
              <div className="w-full">
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
                      disabled={isCheckBoxLocationLoading || tableRows.length >= maxDevices}
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

          <div className="flex-1 flex flex-col min-h-0 min-w-0 lg:border-l lg:border-neutral-200 lg:pl-4 pb-2">
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }} className="flex-shrink-0">
              Added devices ({tableRows.length} / {maxDevices})
            </Typography>
            <div className="ag-theme-quartz flex-1 min-h-[280px] lg:min-h-0">
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
