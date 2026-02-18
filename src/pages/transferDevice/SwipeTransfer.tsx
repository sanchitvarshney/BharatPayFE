import SelectLocationAcordingModule from "@/components/reusable/SelectLocationAcordingModule";
import { useAppSelector } from "@/hooks/useReduxHook";
import { LoadingButton } from "@mui/lab";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { QrCodeScanner } from "@mui/icons-material";

import { getDeviceDetails } from "@/features/production/Batteryqc/BatteryQcSlice";
import { showToast } from "@/utils/toasterContext";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircularProgress } from "@mui/material";
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

const SwipeTransfer = () => {
  const dispatch = useDispatch<any>();
  const [tableRows, setTableRows] = useState<SwipeTableRow[]>([]);
  const serialInputRef = useRef<HTMLInputElement>(null);
  const boxNoInputRef = useRef<HTMLInputElement>(null);

  const { isSubmitLoading } = useAppSelector((state) => state.deviceTransfer);
  const { deviceDetailLoading } = useAppSelector(
    (state) => state.batteryQcReducer,
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      locationfromId: "",
      locationtoId: "",
      boxNo: "",
      serialNo: "",
    },
  });

  const boxNoValue = watch("boxNo");

  const handleSerialKeyDown = async (
    boxNoValue: string,
    serialValue: string,
    clearSerial: () => void,
    clearBoxNo: () => void,
  ) => {
    const trimmed = serialValue?.trim();
    if (!trimmed) return;

    const exists = tableRows.some(
      (r) => r.serialNo === trimmed || r.sl_no === trimmed,
    );
    if (exists) {
      showToast("Serial number already added", "error");
      return;
    }

    const boxNoTrimmed = boxNoValue?.trim() ?? "";

    try {
      const res: any = await dispatch(
        getDeviceDetails({
          imei: trimmed,
          deviceType: "swipeMachine",
        }),
      ).unwrap();

      const apiData = res?.data;
      if (apiData?.success && apiData?.data?.[0]) {
        const detail = apiData.data[0];
        const row: SwipeTableRow = {
          id: `${trimmed}-${Date.now()}`,
          boxNo: boxNoTrimmed,
          serialNo: trimmed,
          p_name: detail.p_name,
          device_imei: detail.device_imei ?? detail.imei_no1,
          device_model: detail.device_model,
          device_sku: detail.device_sku,
          mfgBy: detail.mfgBy,
          mfgMonth: detail.mfgMonth,
          mfgYear: detail.mfgYear,
          sl_no: detail.sl_no ?? trimmed,
        };
        setTableRows((prev) => [...prev, row]);
        clearSerial();
        clearBoxNo();
        setTimeout(() => boxNoInputRef.current?.focus(), 0);
      } else {
        showToast(apiData?.message || "Device not found", "error");
      }
    } catch (error: any) {
      showToast(
        error?.message ||
          error?.response?.data?.message ||
          "Failed to fetch device",
        "error",
      );
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
      const payload: any = {
        fromLocation: data.locationfromId.code,
        toLocation: data.locationtoId.code,
        boxNo: tableRows.map((r) => r.boxNo).filter(Boolean),
        srlNo: tableRows.map((r) => r.serialNo || r.sl_no).filter(Boolean),
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
    <div className="h-[calc(100vh-100px)] bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="p-0">
        <div className="w-full h-[calc(100vh-170px)] overflow-y-auto">
          <div className="w-full grid grid-cols-1 gap-12 p-4">
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
              <div className="min-w-[200px] flex-1 max-w-[280px]">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                  Box No
                </Typography>
                <Controller
                  name="boxNo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      inputRef={boxNoInputRef}
                      placeholder="Enter Box No"
                      value={field.value || ""}
                      fullWidth
                      onChange={(e) => field.onChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          serialInputRef.current?.focus();
                        }
                      }}
                    />
                  )}
                />
              </div>

              <div className="min-w-[200px] flex-1 max-w-[280px]">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                  Enter Serial Number
                </Typography>
                <Controller
                  name="serialNo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      inputRef={serialInputRef}
                      placeholder="Enter Serial No. and press Enter"
                      value={field.value || ""}
                      fullWidth
                      onChange={(e) => field.onChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSerialKeyDown(
                            boxNoValue ?? "",
                            field.value,
                            () => field.onChange(""),
                            () => {
                              if ('setValue' in control && typeof control.setValue === 'function') {
                                // @ts-ignore
                                control.setValue("boxNo", "");
                              }
                            },
                            // () => control.setValue("boxNo", ""),
                          );
                        }
                      }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              {deviceDetailLoading ? (
                                <CircularProgress size={20} />
                              ) : (
                                <QrCodeScanner />
                              )}
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

          {/* Table */}
          <div className="w-full px-4 pb-4">
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              Added devices ({tableRows.length})
            </Typography>
            <div className="ag-theme-quartz h-[280px]">
              <AgGridReact<SwipeTableRow>
                rowData={tableRows}
                columnDefs={columnDefs}
                overlayNoRowsTemplate={OverlayNoRowsTemplate}
                suppressCellFocus={true}
                defaultColDef={{ resizable: true }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-neutral-300 py-3 absolute bottom-0 left-0 right-0 bg-white">
          <div className="h-[50px] px-5 flex items-center gap-3 justify-end">
            <Button onClick={onReset} variant="outlined">
              Reset
            </Button>
            <LoadingButton
              loadingPosition="start"
              type="submit"
              variant="contained"
              loading={isSubmitLoading}
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
