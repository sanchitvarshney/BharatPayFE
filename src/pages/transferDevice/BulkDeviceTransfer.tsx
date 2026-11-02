import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { CloudUpload } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  BulkTransferSkipped,
  submitBulkTransfer,
} from "@/features/transfer/deviceTransferSlice";
import SelectLocationAcordingModule, {
  LocationType,
} from "@/components/reusable/SelectLocationAcordingModule";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import { Icons } from "@/components/icons";
import { VisuallyHiddenInput } from "@/theme";
import { showToast } from "@/utils/toasterContext";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import DeleteIcon from "@mui/icons-material/Delete";
import { ColDef } from "ag-grid-community";
import { leftAlignedColumn } from "@/utils/agGridAlignUtils";

type RowData = {
  srno: string;
  index: number;
};

type FormDataType = {
  deviceType: string;
  pickLocation: LocationType | null;
  dropLocation: LocationType | null;
};

const BULK_TRANSFER_MAX = 5000;

// locationType is sent to the location endpoints
const DEVICE_TYPE_OPTIONS = [
  { label: "SoundBox", value: "device", locationType: "SOUNDBOX" },
  { label: "Swipe Device", value: "swipeMachine", locationType: "SWIPE" },
];

const BulkDeviceTransfer: React.FC = () => {
  const dispatch = useAppDispatch();
  const [rowData, setRowData] = useState<RowData[]>([]);

  const [resetAlert, setResetAlert] = useState<boolean>(false);
  const [skipped, setSkipped] = useState<BulkTransferSkipped[]>([]);
  const [skippedOpen, setSkippedOpen] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<string>("");
  const { isBulkTransferLoading } = useAppSelector(
    (state) => state.deviceTransfer,
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormDataType>({
    defaultValues: {
      deviceType: "",
      pickLocation: null,
      dropLocation: null,
    },
  });
  const deviceType = watch("deviceType");
  const locationType =
    DEVICE_TYPE_OPTIONS.find((o) => o.value === deviceType)?.locationType ??
    "SOUNDBOX";

  const handleDownloadBulkSample = () => {
    const worksheet = XLSX.utils.json_to_sheet([{ "SR No": "" }]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bulk Transfer");
    XLSX.writeFile(workbook, "bulk_device_transfer_sample.xlsx");
  };

  const handleDownloadSkipped = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      skipped.map((s) => ({ "Serial No": s.serial, Reason: s.reason })),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Skipped");
    XLSX.writeFile(workbook, "bulk_transfer_skipped.xlsx");
  };
  const columnDefs: ColDef[] = [
    {
      headerName: "Index",
      field: "index",
      sortable: true,
      filter: true,
      width: 100,
    },

    {
      headerName: "Serial Number",
      field: "srno",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Action",
      field: "",
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <IconButton
          onClick={() => {
            const deviceIndex = params.data.index;
            const filteredData = rowData.filter(
              (row) => row.index !== deviceIndex,
            );
            // Reassign index numbers to maintain sequential order
            const reindexedData = filteredData.map((item, index) => ({
              ...item,
              index: index + 1,
            }));
            setRowData(reindexedData);
          }}
        >
          <DeleteIcon fontSize="small" color="error" />
        </IconButton>
      ),
      width: 100,
    },
  ];

  const defaultColDef: ColDef = {
    wrapText: true,
    autoHeight: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    ...leftAlignedColumn,
  };

  const handleBulkFile = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    if (!deviceType) {
      showToast("Please select Device Type before uploading", "error");
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["xls", "xlsx", "csv"].includes(ext)) {
      showToast("Please upload an Excel file (.xlsx, .xls or .csv)", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      let values: string[] = [];
      try {
        const workbook = XLSX.read(event.target?.result, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetRows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
          header: 1,
          defval: "",
          raw: false,
        });
        // First column holds SR No, first row is the header
        values = sheetRows
          .slice(1)
          .map((row) => String(row?.[0] ?? "").trim())
          .filter((value) => value !== "");
      } catch {
        showToast(
          "Unable to read the file. Please check the format and try again.",
          "error",
        );
        return;
      }

      if (values.length === 0) {
        showToast("No SR No found in the uploaded file", "error");
        return;
      }

      const uniqueValues = [...new Set(values)];
      if (uniqueValues.length !== values.length) {
        showToast(
          `${values.length - uniqueValues.length} duplicate SR No removed from file`,
          "warning",
        );
      }

      const isSet = (v: string) => v !== "" && v !== "--";
      const existingKeys = new Set<string>(
        rowData
          .flatMap((row) => [row.srno])
          .map((v) => (v ?? "").trim())
          .filter(isSet),
      );
      const newValues = uniqueValues.filter((v) => !existingKeys.has(v));
      if (newValues.length !== uniqueValues.length) {
        showToast(
          `${uniqueValues.length - newValues.length} SR No already in table, skipped`,
          "warning",
        );
      }
      if (newValues.length === 0) {
        showToast("No new devices to add", "warning");
        return;
      }

      if (rowData.length + newValues.length > BULK_TRANSFER_MAX) {
        showToast(
          `Maximum ${BULK_TRANSFER_MAX} devices allowed. Table has ${rowData.length}, file has ${newValues.length} new.`,
          "error",
        );
        return;
      }

      // No device lookup: values from the file go straight into the table as serial numbers
      setRowData((prevRowData) =>
        [...prevRowData, ...newValues.map((srno) => ({ srno, index: 0 }))].map(
          (item, index) => ({ ...item, index: index + 1 }),
        ),
      );
      showToast(`${newValues.length} devices added from file`, "success");
    };
    reader.readAsArrayBuffer(file);
  };

  const resetAll = () => {
    setRowData([]);
    setSkipped([]);
    reset();
  };

  const onSubmit = async (data: FormDataType) => {
    if (rowData.length === 0) {
      showToast("Please upload devices before submitting", "error");
      return;
    }
    if (data.pickLocation?.code === data.dropLocation?.code) {
      showToast("Pick location and drop location cannot be the same", "error");
      return;
    }

    const serial = rowData
      .map((row) => (row.srno ?? "").trim())
      .filter((s) => s !== "" && s !== "--");
    if (serial.length !== rowData.length) {
      showToast(
        `${rowData.length - serial.length} device(s) have no serial number and will not be transferred`,
        "warning",
      );
    }
    if (serial.length === 0) {
      showToast("No serial numbers found to transfer", "error");
      return;
    }

    try {
      const res = await dispatch(
        submitBulkTransfer({
          serial,
          pickLocation: data.pickLocation?.code ?? "",
          dropLocation: data.dropLocation?.code ?? "",
        }),
      ).unwrap();

      const skippedList = res?.skipped ?? [];
      if (res?.success) {
        showToast(res.message || "Devices transferred successfully", "success");
        // Keep only the skipped devices in the table so they can be reviewed
        const skippedSerials = new Set(skippedList.map((s) => s.serial));
        setRowData((prev) =>
          prev
            .filter((row) => skippedSerials.has((row.srno ?? "").trim()))
            .map((item, index) => ({ ...item, index: index + 1 })),
        );
      } else {
        showToast(res?.message || "Bulk transfer failed", "error");
      }

      if (skippedList.length > 0) {
        setSkipped(skippedList);
        setResultMessage(res?.message ?? "");
        setSkippedOpen(true);
      }
    } catch (error: any) {
      showToast(error?.message || "Bulk transfer failed", "error");
    }
  };

  return (
    <>
      <Dialog
        open={skippedOpen}
        onClose={() => setSkippedOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Skipped Devices ({skipped.length})</DialogTitle>
        <DialogContent dividers>
          {resultMessage && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              {resultMessage}
            </Typography>
          )}
          <div className="max-h-[400px] overflow-y-auto border border-neutral-200 rounded">
            <table className="w-full text-sm">
              <thead className="bg-neutral-100 sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2 w-[60px]">#</th>
                  <th className="text-left px-3 py-2">Serial No</th>
                  <th className="text-left px-3 py-2">Reason</th>
                </tr>
              </thead>
              <tbody>
                {skipped.map((item, index) => (
                  <tr
                    key={`${item.serial}-${index}`}
                    className="border-t border-neutral-200"
                  >
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2 font-medium">{item.serial}</td>
                    <td className="px-3 py-2 text-red-600">{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<Icons.download />}
            onClick={handleDownloadSkipped}
          >
            Download
          </Button>
          <Button variant="contained" onClick={() => setSkippedOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmationModel
        open={resetAlert}
        onClose={() => setResetAlert(false)}
        title="Are you sure?"
        content="Are you sure you want to reset all fields and table data?"
        cancelText="Cancel"
        confirmText="Continue"
        onConfirm={() => {
          resetAll();
          setResetAlert(false);
        }}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-[calc(100vh-100px)] bg-white flex flex-col"
      >
        <div className="flex-1 min-h-0 flex gap-4 p-4 bg-neutral-50">
          <aside className="w-[440px] flex-shrink-0 h-full min-h-0 overflow-y-auto flex flex-col gap-4">
            <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col gap-3">
              <Typography variant="subtitle1" fontWeight={600}>
                Bulk Upload
              </Typography>
              <Controller
                name="deviceType"
                control={control}
                rules={{ required: "Device Type is required" }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors.deviceType}
                  >
                    <InputLabel id="bulk-transfer-device-type">
                      Device Type
                    </InputLabel>
                    <Select
                      labelId="bulk-transfer-device-type"
                      label="Device Type"
                      value={field.value}
                      disabled={isBulkTransferLoading}
                      onChange={(e) => {
                        // Devices and locations depend on the type, so start over
                        if (e.target.value !== field.value) {
                          setRowData([]);
                          setValue("pickLocation", null);
                          setValue("dropLocation", null);
                        }
                        field.onChange(e.target.value);
                      }}
                    >
                      {DEVICE_TYPE_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <Button
                fullWidth
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
                startIcon={<CloudUpload />}
                disabled={!deviceType || isBulkTransferLoading}
              >
                {`Upload File (Max ${BULK_TRANSFER_MAX})`}
                <VisuallyHiddenInput
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(event) => {
                    handleBulkFile(event.target.files);
                    event.target.value = "";
                  }}
                />
              </Button>

              <Button
                fullWidth
                size="small"
                variant="text"
                startIcon={<Icons.download />}
                onClick={handleDownloadBulkSample}
              >
                Download Sample
              </Button>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col gap-3">
              <Typography variant="subtitle1" fontWeight={600}>
                Transfer Locations
              </Typography>
              <Controller
                name="pickLocation"
                control={control}
                rules={{ required: "Pick Location is required" }}
                render={({ field }) => (
                  <SelectLocationAcordingModule
                    key={`pick-${locationType}`}
                    endPoint={`/swipeMovement/pickLocation?type=${locationType}`}
                    label="Pick Location"
                    size="small"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.pickLocation}
                    helperText={errors.pickLocation?.message}
                    isSearch={false}
                    disabled={!deviceType || isBulkTransferLoading}
                  />
                )}
              />
              <Controller
                name="dropLocation"
                control={control}
                rules={{ required: "Drop Location is required" }}
                render={({ field }) => (
                  <SelectLocationAcordingModule
                    key={`drop-${locationType}`}
                    endPoint={`/swipeMovement/dropLocation?type=${locationType}`}
                    label="Drop Location"
                    size="small"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.dropLocation}
                    helperText={errors.dropLocation?.message}
                    isSearch={false}
                    disabled={!deviceType || isBulkTransferLoading}
                  />
                )}
              />
            </div>
          </aside>

          <section className="flex-1 min-w-0 h-full min-h-0 flex flex-col bg-white border border-neutral-200 rounded-lg overflow-hidden">
            <div className="h-[44px] flex-shrink-0 flex items-center justify-between px-4 border-b border-neutral-200">
              <Typography variant="subtitle1" fontWeight={600}>
                Uploaded Devices
              </Typography>
              <div className="flex items-center gap-2">
                {skipped.length > 0 && (
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setSkippedOpen(true)}
                  >
                    View Skipped ({skipped.length})
                  </Button>
                )}
                <span className="rounded-md px-2 py-[2px] text-xs font-medium bg-blue-50 text-blue-700">
                  Total: <span className="font-semibold">{rowData.length}</span>
                </span>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <div className="ag-theme-quartz h-full">
                <AgGridReact
                  overlayNoRowsTemplate={OverlayNoRowsTemplate}
                  suppressCellFocus={true}
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  enableCellTextSelection={true}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="h-[50px] flex-shrink-0 border-t border-neutral-300 flex items-center justify-end px-[20px] bg-neutral-50 gap-[10px]">
          <Button
            variant="outlined"
            disabled={isBulkTransferLoading}
            onClick={() => setResetAlert(true)}
          >
            Reset
          </Button>
          <LoadingButton
            type="submit"
            loading={isBulkTransferLoading}
            loadingPosition="start"
            variant="contained"
            startIcon={<Icons.save />}
            disabled={rowData.length === 0}
          >
            Submit
          </LoadingButton>
        </div>
      </form>
    </>
  );
};

export default BulkDeviceTransfer;
