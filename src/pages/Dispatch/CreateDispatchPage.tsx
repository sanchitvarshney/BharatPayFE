import React, { useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
  Controller,
} from "react-hook-form";
import MaterialInvardUploadDocumentDrawer from "@/components/Drawers/wearhouse/MaterialInvardUploadDocumentDrawer";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { clearaddressdetail } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import {
  resetDocumentFile,
  resetFormData,
  storeFormdata,
} from "@/features/wearhouse/Rawmin/RawMinSlice";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import {
  Button,
  CircularProgress,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  LinearProgress,
  ListItemText,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import { showToast } from "@/utils/toasterContext";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import Success from "@/components/reusable/Success";
import { LocationType } from "@/components/reusable/editor/SelectClient";
import {
  checkBoxValid,
  createDispatchScrap,
  CreateDispatch,
  CreateSwipeDispatch,
  getChallanById,
  getClientBranch,
} from "@/features/Dispatch/DispatchSlice";
import SelectLocationAcordingModule from "@/components/reusable/SelectLocationAcordingModule";
import SelectSku, { DeviceType } from "@/components/reusable/SelectSku";
import { getDeviceDetails } from "@/features/production/Batteryqc/BatteryQcSlice";
import ImeiTable from "@/table/dispatch/ImeiTable";
import ScrapScannerTable from "@/table/dispatch/ScrapScannerTable";
import { getDispatchFromDetail } from "@/features/master/client/clientSlice";
import { DispatchItemPayload } from "@/features/Dispatch/DispatchType";
import { Dayjs } from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { CloudUpload } from "@mui/icons-material";
import { VisuallyHiddenInput } from "@/theme";
import DispatchPageSkeleton from "@/components/skeletons/DispatchPageSkeleton";
import {
  blockedScrapMessage,
  isBlockedScrapBox,
} from "@/constants/blockedScrapBoxes";

type RowData = {
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

type BulkFailedEntry = {
  value: string;
  reason: string;
};

const BULK_DISPATCH_MAX = 5000;
const BULK_FETCH_CHUNK_SIZE = 100;
const BULK_FETCH_CONCURRENCY = 3;

type FormDataType = {
  clientDetail: clientDetailType | null;
  shipToDetails: shipToDetailsType | null;
  dispatchFromDetails: dispatchFromDetailsType | null;
  invoice: string;
  qty: string;
  location: LocationType | null;
  remark: string;
  file: File[] | null;
  sku: DeviceType | null;
  docNo: string;
  document: string;
  dispatchDate: Dayjs | null;
  gstRate: string;
  gstState: string;
  otherRef: string;
  gstType: string;
  deviceType: string;
};

type clientDetailType = {
  client: string;
  branchId: string;
  address1: string;
  address2: string;
  pincode: string;
};

type dispatchFromDetailsType = {
  dispatchFrom: string;
  address1: string;
  address2: string;
  mobileNo: string;
  city: string;
  gst: string;
  company: string;
  pan: string;
  pin: string;
};

type shipToDetailsType = {
  shipTo: string;
  address1: string;
  address2: string;
  pincode: string;
  mobileNo: string;
  city: string;
};

const CreateDispatchPage: React.FC = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [alert, setAlert] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [imei, setImei] = React.useState<string>("");
  const [dispatchNo, setDispatchNo] = useState<string>("");
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const { deviceDetailLoading } = useAppSelector(
    (state) => state.batteryQcReducer,
  );
  const [isMultiple, setIsMultiple] = useState<boolean>(true); // Default is multiple IMEIs
  const [deviceBatchSize, setDeviceBatchSize] = useState<number>(30); // Devices per batch: 20 or 30
  const [bulkLoading, setBulkLoading] = useState<boolean>(false);
  const [bulkProgress, setBulkProgress] = useState<number>(0);
  const { dispatchCreateLoading, checkBoxValidLoading } = useAppSelector(
    (state) => state.dispatch,
  );

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormDataType>({
    defaultValues: {
      clientDetail: null,
      shipToDetails: null,
      dispatchFromDetails: null,
      invoice: "",
      qty: "",
      document: "",
      location: null,
      remark: "",
      file: null,
      sku: null,
      docNo: "",
      otherRef: "",
      gstRate: "",
      gstType: "",
    },
  });
  const formValues = watch();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Form Details", "Add Component Details", "Submit"];
  const { challanList, getChallanLoading } = useAppSelector(
    (state) => state.dispatch,
  );
  const [data, setData] = useState<any>(null);
  const formdata = new FormData();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const resetall = () => {
    setRowData([]);
    reset();
    dispatch(resetDocumentFile());
    dispatch(clearaddressdetail());
    formdata.delete("document");
  };

  const onSubmit: SubmitHandler<FormDataType> = (data) => {
    // if (!data.document)
    //   return showToast("Please Upload Invoice Documents", "error");
    dispatch(storeFormdata(data));
    handleNext();
  };

  const onInvalid: SubmitErrorHandler<FormDataType> = (formErrors) => {
    const firstError = (["location", "sku"] as const).find(
      (name) => formErrors[name],
    );
    if (!firstError) return;
    const el = document.getElementById(`field-${firstError}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.querySelector<HTMLInputElement>("input")?.focus({
      preventScroll: true,
    });
  };

  useEffect(() => {
    if (isEditMode && id) {
      const shipmentId = id.replace(/_/g, "/");
      dispatch(getChallanById({ challanId: shipmentId }));
    }
  }, [id, isEditMode, dispatch, setValue]);

  useEffect(() => {
    if (challanList) {
      setData(challanList?.[0]);
      setValue("remark", challanList?.[0]?.remark);
      setValue("qty", challanList?.[0]?.dispatchQty);
    }
  }, [challanList]);

  const finalSubmit = (rows: RowData[] = rowData) => {
    const data1 = formValues;

    // Initial quantity validation
    if (rows.length !== Number(data1.qty)) {
      showToast(
        `Total Devices (${rows.length}) should be equal to Quantity you have entered (${data1.qty})`,
        "error",
      );
      return;
    }

    const allImeis = rows
      .map((item) => item.imei?.trim())
      .filter((imei) => imei && imei !== "--");
    const allImei2s = rows
      .map((item) => item.imei2?.trim())
      .filter((imei) => imei && imei !== "--");
    const allSerials = rows
      .map((item) => item.srno?.trim())
      .filter((srno) => srno);

    // Check for duplicates and show warnings
    const duplicateImeis = allImeis.filter(
      (imei, index) => allImeis.indexOf(imei) !== index,
    );
    const duplicateImei2s = allImei2s.filter(
      (imei, index) => allImei2s.indexOf(imei) !== index,
    );
    const duplicateSerials = allSerials.filter(
      (srno, index) => allSerials.indexOf(srno) !== index,
    );
    const crossDuplicates = allImeis.filter((imei) => allImei2s.includes(imei));

    // Show warnings but don't block submission
    if (duplicateImeis.length > 0) {
      showToast(
        `Duplicate IMEI1 found: ${duplicateImeis.join(", ")}`,
        "warning",
      );
    }
    if (duplicateImei2s.length > 0) {
      showToast(
        `Duplicate IMEI2 found: ${duplicateImei2s.join(", ")}`,
        "warning",
      );
    }
    if (duplicateSerials.length > 0) {
      showToast(
        `Duplicate serial numbers found: ${duplicateSerials.join(", ")}`,
        "warning",
      );
    }
    if (crossDuplicates.length > 0) {
      showToast(
        `IMEI1 and IMEI2 conflicts found: ${crossDuplicates.join(", ")}`,
        "warning",
      );
    }

    const validRowData = rows.filter((item) => {
      const imei = item.imei?.trim();
      const imei2 = item.imei2?.trim();
      const srno = item.srno?.trim();

      // Skip completely empty entries
      if (!imei && !imei2 && !srno) {
        return false;
      }

      // Keep entries with valid data (filter out "--" or empty critical fields)
      return imei || imei2 || srno;
    });

    // Check if we have any valid data
    if (validRowData.length === 0) {
      showToast("No valid devices found in the list", "error");
      return;
    }

    // Final quantity check with valid data
    if (validRowData.length !== Number(data1.qty)) {
      showToast(
        `Valid devices (${validRowData.length}) don't match quantity (${data1.qty}). Please check duplicates and empty entries.`,
        "error",
      );
      return;
    }

    if (data.deviceType === "scrapDevice") {
      const byBox = validRowData.reduce<Record<string, string[]>>((acc, r) => {
        const box = r.boxNo?.trim() ?? "";
        const serial = (r.srno ?? "").trim();
        if (!box || !serial) return acc;
        if (!acc[box]) acc[box] = [];
        acc[box].push(serial);
        return acc;
      }, {});
      const scrapData = Object.entries(byBox).map(([boxNo, serial]) => ({
        boxNo,
        serial,
      }));
      const skuValue = data1.sku as
        | (DeviceType & { sku?: string })
        | null
        | undefined;
      const sku = skuValue?.sku ?? skuValue?.id ?? "";

      const blockedBox = scrapData.find((item) =>
        isBlockedScrapBox(item.boxNo),
      );
      if (blockedBox) {
        showToast(blockedScrapMessage(blockedBox.boxNo), "error");
        return;
      }

      if (scrapData.length === 0) {
        showToast("No valid box/serial data to submit", "error");
        return;
      }
      if (!data1.location?.code) {
        showToast("Pick Location is required", "error");
        return;
      }
      if (!sku) {
        showToast("SKU is required", "error");
        return;
      }

      const scrapPayload = {
        pickLocation: data1.location.code,
        data: scrapData,
        sku,
        remark: data1.remark ?? "",
        challanId: id?.replace(/_/g, "/") ?? "",
      };

      dispatch(createDispatchScrap(scrapPayload)).then((res: any) => {
        if (res.payload?.data?.success) {
          setDispatchNo(res?.payload?.data?.data?.refID);
          reset();
          setRowData([]);
          handleNext();
          resetall();
        } else {
          showToast(res?.payload?.data?.message || "Dispatch failed", "error");
        }
      });
      return;
    }

    // Create payload with valid data (device / swipe)
    const payload: DispatchItemPayload = {
      sku: validRowData.map((item) => item.productKey),
      remark: data1.remark,
      imeis: validRowData.map((item) => item.imei || ""),
      imei1: validRowData.map((item) => item.imei || ""),
      imei2: validRowData.map((item) => item.imei2 || ""),
      srlnos: validRowData.map((item) => item.srno || ""),
      pickLocation: data1.location?.code || "",
      challanId: id?.replace(/_/g, "/") || "",
    };

    if (data.deviceType === "device") {
      dispatch(CreateDispatch(payload)).then((res: any) => {
        if (res.payload.data.success) {
          setDispatchNo(res?.payload?.data?.data?.refID);
          reset();
          setRowData([]);
          handleNext();
          resetall();
        } else {
          showToast(res?.payload?.data?.message || "Dispatch failed", "error");
        }
      });
    } else {
      dispatch(CreateSwipeDispatch(payload)).then((res: any) => {
        if (res.payload.data.success) {
          setDispatchNo(res?.payload?.data?.data?.refID);
          reset();
          setRowData([]);
          handleNext();
          resetall();
        } else {
          showToast(res?.payload?.data?.message || "Dispatch failed", "error");
        }
      });
    }
  };

  useEffect(() => {
    dispatch(getDispatchFromDetail());
  }, []);

  useEffect(() => {
    if (formValues.clientDetail?.client) {
      dispatch(
        getClientBranch(
          (formValues.clientDetail.client as any).code ??
            formValues.clientDetail.client,
        ),
      );
    }
  }, [formValues.clientDetail?.client]);

  const onImeiSubmit = (imei: string) => {
    const imeiArray = imei ? imei.split("\n") : []; // Handle empty string
    const count = imeiArray.filter((num) => num.trim() !== "").length;
    if (count === deviceBatchSize) {
      setOpen(true);
    }
  };

  const onSingleImeiSubmit = (imei: string) => {
    const imeiArray = imei ? imei.split("\n") : []; // Handle empty string
    if (imeiArray.filter((num) => num.trim() !== "").length === 1) {
      setOpen(true);
    }
  };
  const handleDownloadBulkSample = () => {
    const worksheet = XLSX.utils.json_to_sheet([{ "IMEI/SR No": "" }]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bulk Dispatch");
    XLSX.writeFile(workbook, "bulk_dispatch_sample.xlsx");
  };

  const fetchBulkDeviceDetails = async (values: string[]) => {
    const chunks: string[][] = [];
    for (let i = 0; i < values.length; i += BULK_FETCH_CHUNK_SIZE) {
      chunks.push(values.slice(i, i + BULK_FETCH_CHUNK_SIZE));
    }

    const devices: Omit<RowData, "index" | "serialNo">[] = [];
    const failed: BulkFailedEntry[] = [];
    let done = 0;
    let next = 0;

    const worker = async () => {
      while (next < chunks.length) {
        const chunk = chunks[next++];
        try {
          const res: any = await dispatch(
            getDeviceDetails({
              imei: chunk.join("\n"),
              deviceType: data?.deviceType,
            }),
          );
          if (res?.payload?.data?.success) {
            (res.payload.data.data ?? []).forEach((device: any) => {
              devices.push({
                imei: device.device_imei || device.imei_no1 || "",
                imei2: device.imei_no2 || "",
                srno: device.sl_no || "",
                modalNo: device?.p_name || "",
                deviceSku: device?.device_sku || "",
                productKey: device?.product_key || "",
              });
            });
          } else {
            const reason =
              res?.payload?.data?.message || "Failed to fetch device details";
            chunk.forEach((value) => failed.push({ value, reason }));
          }
        } catch {
          chunk.forEach((value) =>
            failed.push({ value, reason: "Failed to fetch device details" }),
          );
        }
        done++;
        setBulkProgress(Math.round((done / chunks.length) * 100));
      }
    };

    await Promise.all(
      Array.from(
        { length: Math.min(BULK_FETCH_CONCURRENCY, chunks.length) },
        worker,
      ),
    );
    return { devices, failed };
  };

  const handleBulkFile = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["xls", "xlsx", "csv"].includes(ext)) {
      showToast("Please upload an Excel file (.xlsx, .xls or .csv)", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      let values: string[] = [];
      try {
        const workbook = XLSX.read(event.target?.result, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetRows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
          header: 1,
          defval: "",
          raw: false,
        });
        // First column holds IMEI/SR No, first row is the header
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
        showToast("No IMEI/SR No found in the uploaded file", "error");
        return;
      }

      const uniqueValues = [...new Set(values)];
      if (uniqueValues.length !== values.length) {
        showToast(
          `${values.length - uniqueValues.length} duplicate IMEI/SR No removed from file`,
          "warning",
        );
      }

      // Skip anything already scanned into the table
      const isSet = (v: string) => v !== "" && v !== "--";
      const existingKeys = new Set<string>(
        rowData
          .flatMap((row) => [row.imei, row.imei2 ?? "", row.srno])
          .map((v) => (v ?? "").trim())
          .filter(isSet),
      );
      const newValues = uniqueValues.filter((v) => !existingKeys.has(v));
      if (newValues.length !== uniqueValues.length) {
        showToast(
          `${uniqueValues.length - newValues.length} IMEI/SR No already in table, skipped`,
          "warning",
        );
      }
      if (newValues.length === 0) {
        showToast("No new devices to add", "warning");
        return;
      }

      const dispatchQty = Number(formValues.qty) || 0;
      const remainingQty = dispatchQty - rowData.length;
      if (remainingQty <= 0) {
        showToast(
          `Dispatch quantity (${dispatchQty}) already reached in table`,
          "error",
        );
        return;
      }
      if (newValues.length > remainingQty) {
        showToast(
          `Only ${remainingQty} more devices allowed (Dispatch Qty ${dispatchQty}, in table ${rowData.length}). File has ${newValues.length}.`,
          "error",
        );
        return;
      }

      if (rowData.length + newValues.length > BULK_DISPATCH_MAX) {
        showToast(
          `Maximum ${BULK_DISPATCH_MAX} devices allowed. Table has ${rowData.length}, file has ${newValues.length} new.`,
          "error",
        );
        return;
      }

      setBulkProgress(0);
      setBulkLoading(true);
      const { devices, failed } = await fetchBulkDeviceDetails(newValues);
      setBulkLoading(false);

      // Dedupe fetched devices on IMEI1 / IMEI2 / SR No, including against the table
      const seen = new Set<string>(existingKeys);
      const fetchedKeys = new Set<string>();
      const deduped = devices.filter((device) => {
        const keys = [device.imei, device.imei2 ?? "", device.srno]
          .map((v) => v.trim())
          .filter(isSet);
        keys.forEach((k) => fetchedKeys.add(k));
        if (keys.length === 0 || keys.some((k) => seen.has(k))) return false;
        keys.forEach((k) => seen.add(k));
        return true;
      });

      // Anything uploaded that didn't come back from the API
      const failedValues = new Set(failed.map((f) => f.value));
      const notFound = newValues.filter(
        (v) => !fetchedKeys.has(v) && !failedValues.has(v),
      );

      if (failed.length > 0) {
        const reasons = [...new Set(failed.map((f) => f.reason))];
        showToast(
          `${failed.length} devices failed: ${reasons.join(", ")}`,
          "error",
        );
      }
      if (notFound.length > 0) {
        showToast(`Devices not found: ${notFound.join(", ")}`, "warning");
      }

      if (deduped.length === 0) {
        showToast("No devices added from file", "warning");
        return;
      }

      // Same as scanning: newest on top, then reindex
      setRowData((prevRowData) =>
        [...(deduped as RowData[]), ...prevRowData].map((item, index) => ({
          ...item,
          index: index + 1,
        })),
      );
      showToast(`${deduped.length} devices added from file`, "success");
    };
    reader.readAsArrayBuffer(file);
  };

  const handleClose = (_: object, reason: string) => {
    if (reason === "backdropClick") return; // Prevent closing on outside click
    setOpen(false);
  };

  const isScrapDevice = data?.deviceType === "scrapDevice";
  const modelCount = (tag: string) =>
    rowData.filter((item) => item.modalNo?.includes(tag)).length;
  const handleScrapCheckBoxValid = async (payload: {
    boxNo: string;
    serial: string[];
  }) => {
    if (isBlockedScrapBox(payload.boxNo)) {
      const message = blockedScrapMessage(payload.boxNo);
      showToast(message, "error");
      return { success: false, message };
    }

    const fromLocation = formValues.location?.code;
    const skuValue = formValues.sku as
      | (DeviceType & { sku?: string })
      | null
      | undefined;
    const sku =
      skuValue?.sku ??
      skuValue?.id ??
      data?.productKey ??
      data?.deviceSku ??
      "";
    if (!fromLocation) {
      showToast("Please select Pick Location", "error");
      return { success: false, message: "Pick Location is required" };
    }
    if (!sku) {
      showToast("Please select SKU for scrap device scan", "error");
      return { success: false, message: "SKU is required" };
    }
    try {
      const result = await dispatch(
        checkBoxValid({
          ...payload,
          pickLocation: fromLocation,
          sku,
        }),
      ).unwrap();
      return result;
    } catch {
      return { success: false, message: "Check box validation failed" };
    }
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="absolute top-0 left-0 right-0">
          {deviceDetailLoading && <LinearProgress />}
        </div>
        <div className="absolute font-[500]  right-[10px] top-[10px]">
          Total Devices: {imei.split("\n").length}
        </div>
        <DialogTitle id="alert-dialog-title">{"Dispatch Devices"}</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            className="grid grid-cols-5 gap-[10px] "
          >
            {imei.split("\n").map((no) => (
              <ListItemText key={no} primary={no} />
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={deviceDetailLoading}
            color="error"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            autoFocus
            disabled={deviceDetailLoading}
            onClick={() => {
              // Get input IMEIs and clean them
              const imeiArray = imei
                ? imei
                    .split("\n")
                    .map((imei) => imei.trim())
                    .filter((imei) => imei !== "")
                : [];

              // Get existing data for validation
              const existingImeis = rowData
                .map((item: any) => item.imei?.trim())
                .filter((imei) => imei);
              const existingImei2s = rowData
                .map((item: any) => item.imei2?.trim())
                .filter((imei) => imei);
              const existingSerials = rowData
                .map((item: any) => item.srno?.trim())
                .filter((srno) => srno);

              // Check for duplicate IMEIs in input and keep only unique ones
              const uniqueImeiArray = [...new Set(imeiArray)];
              const duplicateInputImeis = imeiArray.filter(
                (imei, index) => imeiArray.indexOf(imei) !== index,
              );

              if (duplicateInputImeis.length > 0) {
                showToast(
                  `Duplicate IMEIs removed from input: ${duplicateInputImeis.join(
                    ", ",
                  )}`,
                  "warning",
                );
                // Update the input to show only unique values
                setImei(uniqueImeiArray.join("\n"));
              }

              // Check for duplicate IMEIs against existing data and filter them out
              const filteredImeiArray = uniqueImeiArray.filter(
                (newImei: string) =>
                  !existingImeis.includes(newImei) &&
                  !existingImei2s.includes(newImei),
              );
              const duplicateExistingImeis = uniqueImeiArray.filter(
                (newImei: string) =>
                  existingImeis.includes(newImei) ||
                  existingImei2s.includes(newImei),
              );

              if (duplicateExistingImeis.length > 0) {
                showToast(
                  `IMEIs already exist, removed: ${duplicateExistingImeis.join(
                    ", ",
                  )}`,
                  "warning",
                );
                // Update the input to show only unique values that don't exist
                setImei(filteredImeiArray.join("\n"));
              }

              // Use the final filtered IMEI array for API call
              const finalImeiArray =
                filteredImeiArray.length > 0
                  ? filteredImeiArray
                  : uniqueImeiArray;

              if (finalImeiArray.length === 0) {
                showToast("No valid IMEIs to process", "error");
                setOpen(false);
                return;
              }

              dispatch(
                getDeviceDetails({
                  imei: finalImeiArray.join("\n"),
                  deviceType: data?.deviceType,
                }),
              ).then((res: any) => {
                if (res.payload.data.success) {
                  const newRowData = res?.payload?.data?.data?.map(
                    (device: any, deviceIndex: number) => {
                      console.log(device);
                      return {
                        imei: device.device_imei || device.imei_no1 || "",
                        imei2: device.imei_no2 || "",
                        srno: device.sl_no || "",
                        modalNo: device?.p_name || "",
                        deviceSku: device?.device_sku || "",
                        productKey: device?.product_key || "",
                        index: rowData.length + deviceIndex + 1, // Assign sequential index numbers
                      };
                    },
                  );

                  // Strictly deduplicate against existing + within this batch
                  const existingImeiSet = new Set<string>([
                    ...existingImeis,
                    ...existingImei2s,
                  ]);
                  const existingSerialSet = new Set<string>([
                    ...existingSerials,
                  ]);

                  const batchImeiSet = new Set<string>();
                  const batchImei2Set = new Set<string>();
                  const batchSerialSet = new Set<string>();

                  const skippedImeis: string[] = [];
                  const skippedImei2s: string[] = [];
                  const skippedSerials: string[] = [];

                  const dedupedNewRowData: any[] = [];

                  for (const item of newRowData) {
                    const imei1 = (item.imei ?? "").trim();
                    const imei2 = (item.imei2 ?? "").trim();
                    const srno = (item.srno ?? "").trim();

                    // Skip empty identifiers
                    if (!imei1 && !imei2 && !srno) {
                      continue;
                    }

                    // Reject if any identifier already exists (current list)
                    if (imei1 !== "--" && existingImeiSet.has(imei1)) {
                      skippedImeis.push(imei1);
                      continue;
                    }

                    if (imei2 !== "--" && existingImeiSet.has(imei2)) {
                      skippedImei2s.push(imei2);
                      continue;
                    }

                    if (srno && existingSerialSet.has(srno)) {
                      skippedSerials.push(srno);
                      continue;
                    }

                    // Reject if duplicate within this batch

                    if (imei1 !== "--" && batchImeiSet.has(imei1)) {
                      skippedImeis.push(imei1);
                      continue;
                    }

                    if (imei2 !== "--" && batchImei2Set.has(imei2)) {
                      skippedImei2s.push(imei2);
                      continue;
                    }

                    if (srno && batchSerialSet.has(srno)) {
                      skippedSerials.push(srno);
                      continue;
                    }

                    // Reject cross-duplicate (imei1 equals imei2)
                    if (imei1 !== "--") {
                      if (imei2 && imei1 === imei2) {
                        skippedImeis.push(imei1);
                        skippedImei2s.push(imei2);
                        continue;
                      }
                    }

                    // Accept and update sets
                    if (imei1) {
                      batchImeiSet.add(imei1);
                      existingImeiSet.add(imei1);
                    }
                    if (imei2) {
                      batchImei2Set.add(imei2);
                      existingImeiSet.add(imei2);
                    }
                    if (srno) {
                      batchSerialSet.add(srno);
                      existingSerialSet.add(srno);
                    }

                    dedupedNewRowData.push(item);
                  }

                  // Warn about any skipped identifiers
                  const uniq = (arr: string[]) => Array.from(new Set(arr));
                  if (skippedImeis.length > 0) {
                    showToast(
                      `Duplicate IMEI removed: ${uniq(skippedImeis).join(
                        ", ",
                      )}`,
                      "warning",
                    );
                  }
                  if (skippedImei2s.length > 0) {
                    showToast(
                      `Duplicate IMEI2 removed: ${uniq(skippedImei2s).join(
                        ", ",
                      )}`,
                      "warning",
                    );
                  }
                  if (skippedSerials.length > 0) {
                    showToast(
                      `Duplicate serial removed: ${uniq(skippedSerials).join(
                        ", ",
                      )}`,
                      "warning",
                    );
                  }

                  if (dedupedNewRowData.length === 0) {
                    showToast("No unique devices to add", "warning");
                    setOpen(false);
                    return;
                  }

                  // Update rowData by appending deduped list to the existing rowData
                  setRowData((prevRowData) => {
                    const updatedData = [...dedupedNewRowData, ...prevRowData];
                    // Reassign index numbers to maintain sequential order
                    return updatedData.map((item, index) => ({
                      ...item,
                      index: index + 1,
                    }));
                  });
                  setImei("");
                  setOpen(false);
                } else {
                  showToast(res.payload.data.message, "error");
                  setOpen(false);
                }
              });
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmationModel
        open={alert}
        onClose={() => setAlert(false)}
        title="Are you sure?"
        content="Are you sure you want to reset all fields and table data?"
        cancelText="Cancel"
        confirmText="Continue"
        onConfirm={() => {
          resetall();
          dispatch(resetDocumentFile());
          dispatch(resetFormData());
          setActiveStep(0);
          setAlert(false);
        }}
      />
      {getChallanLoading ? (
        <DispatchPageSkeleton />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="bg-white "
        >
          <MaterialInvardUploadDocumentDrawer
            open={upload}
            setOpen={setUpload}
          />

          <div className="h-[calc(100vh-100px)]   ">
            <div className="h-[50px] flex items-center w-full px-[20px] bg-neutral-50 border-b border-neutral-300">
              <Stepper activeStep={activeStep} className="w-full">
                {steps.map((label, index) => (
                  <Step key={index}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>

            {activeStep === 0 && (
              <div className="h-[calc(100vh-200px)] py-[20px] sm:px-[10px] md:px-[30px] lg:px-[50px] flex flex-col gap-[20px] overflow-y-auto">
                <div>
                  {/* Section: Primary Item Details */}
                  <section aria-labelledby="primary-item-details">
                    <div
                      id="primary-details"
                      className="flex items-center w-full gap-3"
                    >
                      <Icons.user />
                      <h2
                        id="primary-details"
                        className="text-lg font-semibold"
                      >
                        Client Details
                      </h2>
                      <Divider
                        sx={{
                          borderBottomWidth: 2,
                          borderColor: "#f59e0b",
                          flexGrow: 1,
                        }}
                      />
                    </div>

                    {/* Subsection: Basic Item Details */}
                    <section
                      aria-labelledby="basic-item-details"
                      className="mt-2"
                    >
                      <div className="grid grid-cols-5 gap-2 mt-4">
                        {[
                          { label: "Name", value: data?.clientDetail?.name },
                          {
                            label: "Branch",
                            value: data?.clientDetail?.branchName,
                          },
                          {
                            label: "PinCode",
                            value: data?.clientDetail?.pincode,
                          },
                          {
                            label: "Address Line 1",
                            value: data?.clientDetail?.address1,
                          },
                          {
                            label: "Address Line 2",
                            value: data?.clientDetail?.address2,
                          },
                        ].map(({ label, value }) => (
                          <div key={label} className="py-5">
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              className="text-gray-600"
                            >
                              {label}:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {value || "N/A"}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </section>
                  </section>
                  <section aria-labelledby="ship-to-details">
                    <div
                      id="ship-to-details"
                      className="flex items-center w-full gap-3"
                    >
                      {" "}
                      <Icons.userAddress />
                      <h2
                        id="ship-to-details"
                        className="text-lg font-semibold"
                      >
                        Ship To Details
                      </h2>
                      <Divider
                        sx={{
                          borderBottomWidth: 2,
                          borderColor: "#f59e0b",
                          flexGrow: 1,
                        }}
                      />
                    </div>

                    {/* Subsection: Basic Item Details */}
                    <section
                      aria-labelledby="basic-item-details"
                      className="mt-2"
                    >
                      <div className="grid grid-cols-6 gap-2 mt-4">
                        {[
                          {
                            label: "Ship To",
                            value: data?.shipToDetails?.shipLabel,
                          },
                          {
                            label: "PinCode",
                            value: data?.shipToDetails?.pincode,
                          },
                          {
                            label: "Mobile No",
                            value: data?.shipToDetails?.mobileNo,
                          },
                          { label: "City", value: data?.shipToDetails?.city },
                          {
                            label: "Address Line 1",
                            value: data?.shipToDetails?.address1,
                          },
                          {
                            label: "Address Line 2",
                            value: data?.shipToDetails?.address2,
                          },
                        ].map(({ label, value }) => (
                          <div key={label} className="py-5">
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              className="text-gray-600"
                            >
                              {label}:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {value || "N/A"}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </section>
                  </section>
                  <section aria-labelledby="dispatch-from-details">
                    <div
                      id="dispatch-from-details"
                      className="flex items-center w-full gap-3"
                    >
                      {" "}
                      <Icons.shipping />
                      <h2
                        id="dispatch-from-details"
                        className="text-lg font-semibold"
                      >
                        Dispatch From Details
                      </h2>
                      <Divider
                        sx={{
                          borderBottomWidth: 2,
                          borderColor: "#f59e0b",
                          flexGrow: 1,
                        }}
                      />
                    </div>

                    {/* Subsection: Basic Item Details */}
                    <section
                      aria-labelledby="basic-item-details"
                      className="mt-2"
                    >
                      <div className="grid grid-cols-4 gap-6 mt-4">
                        {[
                          {
                            label: "Dispatch From",
                            value: data?.dispatchFromDetails?.dispatchFromLabel,
                          },
                          {
                            label: "PinCode",
                            value: data?.dispatchFromDetails?.pin,
                          },
                          {
                            label: "Mobile No",
                            value: data?.dispatchFromDetails?.mobileNo,
                          },
                          {
                            label: "GST No",
                            value: data?.dispatchFromDetails?.gst,
                          },
                          {
                            label: "PAN No",
                            value: data?.dispatchFromDetails?.pan,
                          },
                          {
                            label: "City",
                            value: data?.dispatchFromDetails?.city,
                          },
                          {
                            label: "Address Line 1",
                            value: data?.dispatchFromDetails?.address1,
                          },
                          {
                            label: "Address Line 2",
                            value: data?.dispatchFromDetails?.address2,
                          },
                        ].map(({ label, value }) => (
                          <div key={label} className="py-5">
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              className="text-gray-600"
                            >
                              {label}:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {value || "N/A"}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </section>
                  </section>
                  <section aria-labelledby="dispatch-from-details">
                    <div
                      id="dispatch-from-details"
                      className="flex items-center w-full gap-3 pt-6"
                    >
                      {" "}
                      <Icons.files />
                      <h2
                        id="dispatch-details"
                        className="text-lg font-semibold"
                      >
                        Dispatch Details and Attachments
                      </h2>
                      <Divider
                        sx={{
                          borderBottomWidth: 2,
                          borderColor: "#f59e0b",
                          flexGrow: 1,
                        }}
                      />
                    </div>

                    {/* Subsection: Basic Item Details */}
                    <section
                      aria-labelledby="basic-item-details"
                      className="mt-2"
                    >
                      <div className="grid grid-cols-4 gap-6 mt-4">
                        {[
                          {
                            label: "Dispatch Quantity",
                            value: data?.dispatchQty,
                          },
                          { label: "Other Reference", value: data?.otherRef },
                          { label: "GST Rate", value: data?.gstrate },
                          {
                            label: "GST Type",
                            value:
                              data?.gsttype === "inter"
                                ? "Inter State"
                                : "Intra State",
                          },
                          {
                            label: "Device Type",
                            value:
                              data?.deviceType === "device"
                                ? "SoundBox"
                                : data?.deviceType === "scrapDevice"
                                  ? "Scrap Device"
                                  : "Swipe Device",
                          },
                          { label: "Item Rate", value: data?.itemRate },
                          { label: "HSN Code", value: data?.hsnCode },
                          { label: "Material Name", value: data?.materialName },
                          { label: "Remarks", value: data?.remark },
                        ].map(({ label, value }) => (
                          <div key={label} className="py-5">
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              className="text-gray-600"
                            >
                              {label}:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {value || "N/A"}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </section>
                  </section>
                </div>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                  <div id="field-location">
                    <Controller
                      name="location"
                      rules={{
                        required: {
                          value: true,
                          message: "Location is required",
                        },
                      }}
                      control={control}
                      render={({ field }) => (
                        <SelectLocationAcordingModule
                          endPoint="/dispatchDivice/pickLocation"
                          error={!!errors.location}
                          helperText={errors.location?.message}
                          size="medium"
                          label="Pick Location"
                          varient="filled"
                          value={field.value as any}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  {isScrapDevice && (
                    <div id="field-sku">
                      <Controller
                        name="sku"
                        control={control}
                        rules={{
                          required: {
                            value: true,
                            message: "SKU is required for scrap device",
                          },
                        }}
                        render={({ field }) => (
                          <SelectSku
                            varient="filled"
                            size="medium"
                            label="SKU"
                            value={field.value}
                            onChange={field.onChange}
                            error={!!errors.sku}
                            helperText={errors.sku?.message}
                          />
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeStep === 1 && (
              <div className="h-[calc(100vh-200px)]">
                {isScrapDevice ? (
                  <div className="h-full min-h-0 flex flex-col px-6 pl-10 pt-4 pb-2">
                    <ScrapScannerTable
                      rowData={rowData}
                      setRowData={setRowData}
                      onCheckBoxValid={handleScrapCheckBoxValid}
                      loading={checkBoxValidLoading}
                    />
                  </div>
                ) : (
                  <div className="h-full min-h-0 flex gap-4 p-4 bg-neutral-50">
                    {/* Left: scan controls */}
                    <aside className="w-[340px] flex-shrink-0 h-full min-h-0 overflow-y-auto flex flex-col gap-4">
                      <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <QrCodeScannerIcon fontSize="small" color="primary" />
                          <Typography variant="subtitle1" fontWeight={600}>
                            Scan Devices
                          </Typography>
                        </div>

                        <ToggleButtonGroup
                          exclusive
                          fullWidth
                          size="small"
                          color="primary"
                          value={isMultiple ? "multiple" : "single"}
                          onChange={(_, value) => {
                            if (value) setIsMultiple(value === "multiple");
                          }}
                        >
                          <ToggleButton value="multiple">Multiple</ToggleButton>
                          <ToggleButton value="single">Single</ToggleButton>
                        </ToggleButtonGroup>

                        {isMultiple && (
                          <FormControl fullWidth size="small">
                            <InputLabel id="device-batch-size-label">
                              Devices per Batch
                            </InputLabel>
                            <Select
                              labelId="device-batch-size-label"
                              label="Devices per Batch"
                              value={deviceBatchSize}
                              onChange={(e) =>
                                setDeviceBatchSize(Number(e.target.value))
                              }
                            >
                              <MenuItem value={20}>20 Devices</MenuItem>
                              <MenuItem value={30}>30 Devices</MenuItem>
                            </Select>
                          </FormControl>
                        )}

                        <TextField
                          fullWidth
                          multiline={isMultiple}
                          rows={isMultiple ? 6 : undefined}
                          value={imei}
                          label={
                            isMultiple ? "IMEI/SR No." : "Single IMEI/SR No."
                          }
                          helperText={
                            isMultiple
                              ? `Scan one per line, ${deviceBatchSize} per batch`
                              : "Scan and press Enter"
                          }
                          onChange={(e) => {
                            setImei(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              if (isMultiple) {
                                onImeiSubmit(imei);
                              } else {
                                e.preventDefault();
                                onSingleImeiSubmit(imei);
                              }
                            }
                          }}
                          slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  {deviceDetailLoading ? (
                                    <CircularProgress
                                      size={20}
                                      color="inherit"
                                    />
                                  ) : (
                                    <QrCodeScannerIcon />
                                  )}
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </div>
                      <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            {
                              label: "Total",
                              value: rowData.length,
                              className: "bg-blue-50 text-blue-700",
                            },
                            {
                              label: "L Devices",
                              value: modelCount("(L)"),
                              className: "bg-green-50 text-green-700",
                            },
                            {
                              label: "E Devices",
                              value: modelCount("(E)"),
                              className: "bg-red-50 text-red-700",
                            },
                            {
                              label: "F Devices",
                              value: modelCount("(F)"),
                              className: "bg-yellow-50 text-yellow-800",
                            },
                          ].map(({ label, value, className }) => (
                            <div
                              key={label}
                              className={`rounded-md px-3 py-2 ${className}`}
                            >
                              <p className="text-xs font-medium">{label}</p>
                              <p className="text-xl font-semibold">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {isMultiple && (
                        <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col gap-3">
                          <Typography variant="subtitle1" fontWeight={600}>
                            Bulk Upload
                          </Typography>
                          <Button
                            fullWidth
                            component="label"
                            role={undefined}
                            variant="outlined"
                            tabIndex={-1}
                            startIcon={
                              bulkLoading ? (
                                <CircularProgress size={18} color="inherit" />
                              ) : (
                                <CloudUpload />
                              )
                            }
                            disabled={bulkLoading || dispatchCreateLoading}
                          >
                            {bulkLoading
                              ? `Fetching... ${bulkProgress}%`
                              : `Upload File (Max ${BULK_DISPATCH_MAX})`}
                            <VisuallyHiddenInput
                              type="file"
                              accept=".xlsx,.xls,.csv"
                              onChange={(event) => {
                                handleBulkFile(event.target.files);
                                event.target.value = "";
                              }}
                            />
                          </Button>
                          {bulkLoading && (
                            <LinearProgress
                              variant="determinate"
                              value={bulkProgress}
                            />
                          )}
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
                      )}
                    </aside>

                    <section className="flex-1 min-w-0 h-full min-h-0 flex flex-col bg-white border border-neutral-200 rounded-lg overflow-hidden">
                      <div className="h-[44px] flex-shrink-0 flex items-center justify-between px-4 border-b border-neutral-200">
                        <Typography variant="subtitle1" fontWeight={600}>
                          Scanned Devices
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {rowData.length} item{rowData.length === 1 ? "" : "s"}
                        </Typography>
                      </div>
                      <div className="flex-1 min-h-0">
                        <ImeiTable setRowdata={setRowData} rowData={rowData} />
                      </div>
                    </section>
                  </div>
                )}
              </div>
            )}
            {activeStep === 2 && (
              <div className="h-[calc(100vh-200px)] flex items-center justify-center">
                <div className="flex flex-col justify-center gap-[10px]">
                  <Success />
                  <Typography variant="inherit" fontWeight={500}>
                    Dispatch Number - {dispatchNo ? dispatchNo : ""}
                  </Typography>
                  {/* <LoadingButton
                    onClick={() => setActiveStep(0)}
                    variant="contained"
                  >
                    Create New Dispatch
                  </LoadingButton> */}
                </div>
              </div>
            )}
            <div className="h-[50px] border-t border-neutral-300 flex items-center justify-end px-[20px] bg-neutral-50 gap-[10px] relative">
              {activeStep === 0 && (
                <LoadingButton
                  type="submit"
                  variant="contained"
                  endIcon={<Icons.next />}
                >
                  Next
                </LoadingButton>
              )}
              {activeStep === 1 && (
                <>
                  <LoadingButton
                    disabled={dispatchCreateLoading}
                    sx={{ background: "white", color: "red" }}
                    variant="contained"
                    startIcon={<Icons.previous />}
                    onClick={() => {
                      handleBack();
                    }}
                  >
                    Back
                  </LoadingButton>
                  <LoadingButton
                    loading={dispatchCreateLoading}
                    loadingPosition="start"
                    variant="contained"
                    startIcon={<Icons.save />}
                    onClick={() => {
                      finalSubmit();
                    }}
                  >
                    Submit
                  </LoadingButton>
                </>
              )}
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CreateDispatchPage;
