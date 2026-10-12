import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { clearaddressdetail } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import * as XLSX from "xlsx";
import {
  resetDocumentFile,
  storeFormdata,
} from "@/features/wearhouse/Rawmin/RawMinSlice";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import {
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import { showToast } from "@/utils/toasterContext";
import Success from "@/components/reusable/Success";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import FullPageLoading from "@/components/shared/FullPageLoading";
import {
  wrongDeviceDispatch,
  getChallanById,
  wrongDeviceLookup,
} from "@/features/Dispatch/DispatchSlice";
import { DispatchWrongItemPayload } from "@/features/Dispatch/DispatchType";
import WrongDeviceImeiTable, {
  WrongDeviceRow as RowData,
} from "@/table/dispatch/WrongDeviceImeiTable";
import { useParams } from "react-router-dom";
import { CloudUpload, DeleteSweep } from "@mui/icons-material";
import { VisuallyHiddenInput } from "@/theme";

type ScannedAwb = {
  awbNo: string;
  qty: number;
};

type FormDataType = {
  qty: string;
  remark: string;
};

const STEPS = ["Form Details", "Add Component Details", "Review & Submit"];

const EXCEL_HEADERS = {
  awbNo: "AWB No.",
  serialNo: "Serial No",
} as const;

const getExcelColumnValue = (
  row: Record<string, unknown>,
  aliases: string[],
) => {
  const aliasSet = new Set(aliases.map((alias) => alias.trim().toLowerCase()));
  const match = Object.entries(row).find(([key]) =>
    aliasSet.has(key.trim().toLowerCase()),
  );
  return match?.[1];
};

const toCell = (value: unknown) => String(value ?? "").trim();

const toChallanId = (id?: string) => id?.replace(/_/g, "/") || "";

const onEnter =
  (handler: () => void) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handler();
    }
  };

type DetailSection = {
  title: string;
  Icon: React.ElementType;
  gridClass: string;
  headerClass?: string;
  fields: { label: string; value: unknown }[];
};

const getDetailSections = (data: any): DetailSection[] => [
  {
    title: "Client Details",
    Icon: Icons.user,
    gridClass: "grid-cols-5 gap-2",
    fields: [
      { label: "Name", value: data?.clientDetail?.name },
      { label: "Branch", value: data?.clientDetail?.branchName },
      { label: "PinCode", value: data?.clientDetail?.pincode },
      { label: "Address Line 1", value: data?.clientDetail?.address1 },
      { label: "Address Line 2", value: data?.clientDetail?.address2 },
    ],
  },
  {
    title: "Ship To Details",
    Icon: Icons.userAddress,
    gridClass: "grid-cols-6 gap-2",
    fields: [
      { label: "Ship To", value: data?.shipToDetails?.shipLabel },
      { label: "PinCode", value: data?.shipToDetails?.pincode },
      { label: "Mobile No", value: data?.shipToDetails?.mobileNo },
      { label: "City", value: data?.shipToDetails?.city },
      { label: "Address Line 1", value: data?.shipToDetails?.address1 },
      { label: "Address Line 2", value: data?.shipToDetails?.address2 },
    ],
  },
  {
    title: "Dispatch From Details",
    Icon: Icons.shipping,
    gridClass: "grid-cols-4 gap-6",
    fields: [
      {
        label: "Dispatch From",
        value: data?.dispatchFromDetails?.dispatchFromLabel,
      },
      { label: "PinCode", value: data?.dispatchFromDetails?.pin },
      { label: "Mobile No", value: data?.dispatchFromDetails?.mobileNo },
      { label: "GST No", value: data?.dispatchFromDetails?.gst },
      { label: "PAN No", value: data?.dispatchFromDetails?.pan },
      { label: "City", value: data?.dispatchFromDetails?.city },
      { label: "Address Line 1", value: data?.dispatchFromDetails?.address1 },
      { label: "Address Line 2", value: data?.dispatchFromDetails?.address2 },
    ],
  },
  {
    title: "Dispatch Details and Attachments",
    Icon: Icons.files,
    gridClass: "grid-cols-4 gap-6",
    headerClass: "pt-6",
    fields: [
      { label: "Dispatch Quantity", value: data?.dispatchQty },
      { label: "Other Reference", value: data?.otherRef },
      { label: "GST Rate", value: data?.gstrate },
      {
        label: "GST Type",
        value: data?.gsttype === "inter" ? "Inter State" : "Intra State",
      },
      { label: "Device Type", value: "Wrong Device" },
      { label: "Item Rate", value: data?.itemRate },
      { label: "HSN Code", value: data?.hsnCode },
      { label: "Material Name", value: data?.materialName },
      { label: "Remarks", value: data?.remark },
    ],
  },
];

const WrongDeviceDispatch: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { wrongDispatchLoading, getChallanLoading } = useAppSelector(
    (state) => state.dispatch,
  );

  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState<any>(null);
  const [dispatchNo, setDispatchNo] = useState("");
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [awbInput, setAwbInput] = useState("");
  const [awbLoading, setAwbLoading] = useState(false);
  const [serialNo, setSerialNo] = useState("");
  const [serialLoading, setSerialLoading] = useState(false);
  const [lastScanned, setLastScanned] = useState<ScannedAwb | null>(null);
  const [uploadConfirmOpen, setUploadConfirmOpen] = useState(false);
  const [pendingUploadRows, setPendingUploadRows] = useState<RowData[]>([]);
  const awbInputRef = useRef<HTMLInputElement>(null);

  const { handleSubmit, reset, setValue, watch } = useForm<FormDataType>({
    defaultValues: { qty: "", remark: "" },
  });
  const dispatchQty = Number(watch("qty")) || 0;

  useEffect(() => {
    if (!id) return;
    dispatch(getChallanById({ challanId: toChallanId(id) })).then(
      (res: any) => {
        const body = res?.payload?.data;
        if (!body?.success) return;
        const challanData = body.data?.[0] || body.data;
        if (challanData) {
          setData(challanData);
          setValue("remark", challanData.remark || "");
          setValue("qty", challanData.dispatchQty || "");
        }
      },
    );
  }, [id, dispatch, setValue]);

  const focusAwbInput = () => {
    setTimeout(() => awbInputRef.current?.focus(), 0);
  };

  const resetAll = () => {
    setRowData([]);
    setLastScanned(null);
    reset();
    dispatch(resetDocumentFile());
    dispatch(clearaddressdetail());
  };

  const onSubmit: SubmitHandler<FormDataType> = (formData) => {
    dispatch(storeFormdata(formData));
    setActiveStep((step) => step + 1);
  };

  const finalSubmit = () => {
    const overLimit = rowData.find(
      (row) => row.maxQty && (row.qty || 1) > row.maxQty,
    );
    if (overLimit) {
      showToast(
        `AWB ${overLimit.awbNo}: Qty cannot be more than ${overLimit.maxQty}`,
        "error",
      );
      return;
    }

    const payload: DispatchWrongItemPayload = {
      awb: rowData.map((item) => item.awbNo),
      challanId: toChallanId(id),
      serial: rowData.map((item) => item.serialNo),
      qty: rowData.map((item) => item.qty || 1),
    };
    dispatch(wrongDeviceDispatch(payload)).then((res: any) => {
      const body = res?.payload?.data;
      if (body?.success) {
        setDispatchNo(body.data?.refID);
        resetAll();
        setActiveStep((step) => step + 1);
      } else if (body?.message) {
        showToast(body.message, "error");
      }
    });
  };

  const handleDownloadSample = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      { [EXCEL_HEADERS.awbNo]: "AWB123456", [EXCEL_HEADERS.serialNo]: "67890" },
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Wrong Device");
    XLSX.writeFile(workbook, "wrong_device_dispatch_sample.xlsx");
  };

  const parseExcelRows = (jsonData: Record<string, unknown>[]) => {
    const parsedRows: RowData[] = [];
    const seenSerialNos = new Set<string>();

    for (const [i, row] of jsonData.entries()) {
      const excelRow = i + 2;
      const awbNo = toCell(
        getExcelColumnValue(row, [EXCEL_HEADERS.awbNo, "AWB No", "AWB Device"]),
      );
      const serialNo =
        toCell(
          getExcelColumnValue(row, [EXCEL_HEADERS.serialNo, "Serial No."]),
        ) || "--";

      if (!awbNo) {
        showToast(`Row ${excelRow}: AWB No. is required`, "error");
        return null;
      }
      if (serialNo !== "--") {
        if (seenSerialNos.has(serialNo)) {
          showToast(
            `Row ${excelRow}: Duplicate Serial No "${serialNo}"`,
            "error",
          );
          return null;
        }
        seenSerialNos.add(serialNo);
      }
      parsedRows.push({ awbNo, serialNo, qty: 1 });
    }
    return parsedRows;
  };

  const handleFileChange = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["xls", "xlsx"].includes(ext)) {
      showToast("Please upload an Excel file (.xlsx or .xls)", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target?.result, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          worksheet,
          { defval: "" },
        );
        if (!jsonData.length) {
          showToast("Excel file is empty", "error");
          return;
        }

        const parsedRows = parseExcelRows(jsonData);
        if (!parsedRows) return;

        if (dispatchQty && parsedRows.length !== dispatchQty) {
          showToast(
            `Uploaded rows (${parsedRows.length}) must match dispatch quantity (${dispatchQty})`,
            "error",
          );
          return;
        }

        setPendingUploadRows(parsedRows);
        setUploadConfirmOpen(true);
      } catch {
        showToast(
          "Unable to read the file. Please check the format and try again.",
          "error",
        );
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const closeUploadConfirm = () => {
    setPendingUploadRows([]);
    setUploadConfirmOpen(false);
  };

  const handleUploadConfirm = () => {
    setRowData(pendingUploadRows);
    showToast(`${pendingUploadRows.length} device(s) loaded from Excel`, "success");
    closeUploadConfirm();
  };

  const handleAwbSubmit = async () => {
    setLastScanned(null);
    const awbNo = awbInput.trim();
    if (!awbNo || awbLoading) return;

    if (rowData.some((row) => row.awbNo === awbNo)) {
      showToast(`AWB ${awbNo} is already added`, "error");
      setAwbInput("");
      focusAwbInput();
      return;
    }

    setAwbLoading(true);
    try {
      const res = await dispatch(wrongDeviceLookup({ awbs: [awbNo] })).unwrap();
      if (!res?.data?.success) {
        showToast(res?.data?.message || "Unable to fetch AWB details", "error");
        return;
      }

      const detail = res.data.data ?? {};
      const awb = String(detail.awb || awbNo);
      const serials: string[] = (detail.serials ?? [])
        .map(toCell)
        .filter(Boolean);
      const remarkCount = Array.isArray(detail.wrongDevicesRemarks)
        ? detail.wrongDevicesRemarks.length
        : 0;

      if (!serials.length && !remarkCount) {
        showToast(`No wrong devices found for AWB ${awb}`, "error");
        return;
      }

      const existingSerials = new Set(rowData.map((row) => row.serialNo));
      const duplicates = serials.filter((serial) => existingSerials.has(serial));
      if (duplicates.length) {
        showToast(`Serial No already added: ${duplicates.join(", ")}`, "error");
        return;
      }

      // serial rows are fixed at qty 1; remarks become one editable row
      // whose qty can't exceed the remarks count
      const newRows: RowData[] = serials.map((serial) => ({
        awbNo: awb,
        serialNo: serial,
        qty: 1,
      }));
      if (remarkCount) {
        newRows.push({
          awbNo: awb,
          serialNo: "--",
          qty: remarkCount,
          qtyEditable: true,
          maxQty: remarkCount,
        });
      }
      setRowData((prev) => [...newRows, ...prev]);
      setLastScanned({ awbNo: awb, qty: serials.length + remarkCount });
    } catch (error: any) {
      showToast(error?.message || "Unable to fetch AWB details", "error");
    } finally {
      setAwbLoading(false);
      setAwbInput("");
      focusAwbInput();
    }
  };

  // Returns the AWB for a serial, or null if the lookup fails
  const lookupAwbBySerial = async (serial: string) => {
    try {
      const res = await dispatch(
        wrongDeviceLookup({ serials: [serial] }),
      ).unwrap();
      const awb = res?.data?.success ? res.data.data?.awb : null;
      return { awb: awb ? String(awb) : null, message: res?.data?.message };
    } catch (error: any) {
      return { awb: null, message: error?.message };
    }
  };

  // Manual entry: Serial No is looked up to find its AWB; if the lookup fails
  // the typed AWB is used.
  const handleManualAdd = async () => {
    setLastScanned(null);
    const typedAwb = awbInput.trim();
    const serial = serialNo.trim();
    if (!serial || serialLoading) return;

    if (rowData.some((row) => row.serialNo === serial)) {
      showToast("This Serial No already exists", "error");
      return;
    }

    setSerialLoading(true);
    const { awb, message } = await lookupAwbBySerial(serial);
    setSerialLoading(false);

    const awbNo = awb || typedAwb;
    if (!awbNo) {
      showToast(message || "AWB not found for this Serial No", "error");
      return;
    }

    setRowData((prev) => [{ awbNo, serialNo: serial, qty: 1 }, ...prev]);
    setSerialNo("");
    setAwbInput("");
    focusAwbInput();
  };

  const handleClearAll = () => {
    setRowData([]);
    setLastScanned(null);
    focusAwbInput();
  };

  return (
    <>
      <ConfirmationModel
        open={uploadConfirmOpen}
        onClose={closeUploadConfirm}
        title="Please note:"
        content="The AWB will not be verified when upload the file. Do you want to continue?"
        cancelText="Cancel"
        confirmText="Continue"
        color="primary"
        onConfirm={handleUploadConfirm}
      />
      {getChallanLoading && <FullPageLoading />}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white">
        <div className="h-[calc(100vh-100px)]">
          <div className="h-[50px] flex items-center w-full px-[20px] bg-neutral-50 border-b border-neutral-300">
            <Stepper activeStep={activeStep} className="w-full">
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>

          {activeStep === 0 && (
            <div className="h-[calc(100vh-200px)] py-[20px] sm:px-[10px] md:px-[30px] lg:px-[50px] flex flex-col gap-[20px] overflow-y-auto">
              <div>
                {getDetailSections(data).map(
                  ({ title, Icon, gridClass, headerClass, fields }) => (
                    <section key={title}>
                      <div
                        className={`flex items-center w-full gap-3 ${headerClass ?? ""}`}
                      >
                        <Icon />
                        <h2 className="text-lg font-semibold">{title}</h2>
                        <Divider
                          sx={{
                            borderBottomWidth: 2,
                            borderColor: "#f59e0b",
                            flexGrow: 1,
                          }}
                        />
                      </div>
                      <div className={`grid mt-6 ${gridClass}`}>
                        {fields.map(({ label, value }) => (
                          <div key={label} className="py-5">
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              className="text-gray-600"
                            >
                              {label}:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {(value as React.ReactNode) || "N/A"}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </section>
                  ),
                )}
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="h-[calc(100vh-200px)] flex flex-col bg-neutral-50">
              <div className="flex flex-wrap items-center gap-[12px] px-[20px] py-[14px] bg-white border-b border-neutral-200">
                <TextField
                  inputRef={awbInputRef}
                  autoFocus
                  value={awbInput}
                  label="Scan / Enter AWB No."
                  placeholder="Scan AWB and press Enter"
                  sx={{ width: "320px" }}
                  disabled={awbLoading}
                  onChange={(e) => setAwbInput(e.target.value)}
                  onKeyDown={onEnter(handleAwbSubmit)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {awbLoading ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <QrCodeScannerIcon />
                          )}
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  value={serialNo}
                  label="Serial No"
                  sx={{ width: "240px" }}
                  disabled={serialLoading}
                  onChange={(e) => {
                    if (/^[0-9_]*$/.test(e.target.value)) {
                      setSerialNo(e.target.value);
                    }
                  }}
                  onKeyDown={onEnter(handleManualAdd)}
                  slotProps={{
                    input: {
                      endAdornment: serialLoading ? (
                        <InputAdornment position="end">
                          <CircularProgress size={20} color="inherit" />
                        </InputAdornment>
                      ) : undefined,
                    },
                  }}
                />
              </div>

              <div className="px-[20px] pt-[10px] text-[13px] text-neutral-600 min-h-[30px]">
                {lastScanned ? (
                  <span>
                    Last scanned AWB{" "}
                    <span className="font-semibold text-neutral-800">
                      {lastScanned.awbNo}
                    </span>{" "}
                    · Qty{" "}
                    <span className="font-semibold text-neutral-800">
                      {lastScanned.qty}
                    </span>
                  </span>
                ) : (
                  <span>
                    Scan an AWB to fetch its serial numbers, or use Bulk Upload.
                  </span>
                )}
              </div>

              <div className="flex-1 min-h-0 px-[20px] pb-[12px] pt-[6px]">
                <WrongDeviceImeiTable
                  setRowdata={setRowData}
                  rowData={rowData}
                />
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="h-[calc(100vh-200px)] flex items-center justify-center">
              <div className="flex flex-col justify-center gap-[10px]">
                <Success />
                <Typography variant="inherit" fontWeight={500}>
                  Dispatch Number - {dispatchNo}
                </Typography>
                <LoadingButton
                  onClick={() => setActiveStep(0)}
                  variant="contained"
                >
                  Create New Dispatch
                </LoadingButton>
              </div>
            </div>
          )}

          <div
            className={`h-[50px] border-t border-neutral-300 flex items-center ${activeStep === 1 ? "justify-between" : "justify-end"} px-[20px] bg-neutral-50 gap-[10px] relative`}
          >
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
              <div className="flex justify-between w-full gap-[10px]">
                <div className="flex gap-[10px]">
                  <Button
                    variant="text"
                    startIcon={<Icons.download />}
                    onClick={handleDownloadSample}
                  >
                    Sample File
                  </Button>
                  <Button
                    size="large"
                    component="label"
                    role={undefined}
                    variant="text"
                    tabIndex={-1}
                    startIcon={<CloudUpload />}
                  >
                    Bulk Upload
                    <VisuallyHiddenInput
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(event) => {
                        handleFileChange(event.target.files);
                        event.target.value = "";
                      }}
                    />
                  </Button>
                </div>
                <div className="flex gap-[10px]">
                  <Button
                    size="large"
                    variant="text"
                    color="error"
                    startIcon={<DeleteSweep />}
                    disabled={!rowData.length}
                    onClick={handleClearAll}
                  >
                    Clear All
                  </Button>
                  <LoadingButton
                    disabled={wrongDispatchLoading}
                    sx={{ background: "white", color: "red" }}
                    variant="contained"
                    startIcon={<Icons.previous />}
                    onClick={() => setActiveStep((step) => step - 1)}
                  >
                    Back
                  </LoadingButton>
                  <LoadingButton
                    loading={wrongDispatchLoading}
                    loadingPosition="start"
                    variant="contained"
                    startIcon={<Icons.save />}
                    onClick={finalSubmit}
                  >
                    Submit
                  </LoadingButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default WrongDeviceDispatch;
