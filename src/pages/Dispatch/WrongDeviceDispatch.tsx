import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import MaterialInvardUploadDocumentDrawer from "@/components/Drawers/wearhouse/MaterialInvardUploadDocumentDrawer";
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
  FormControl,
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
import { LocationType } from "@/components/reusable/editor/SelectClient";
import { DeviceType } from "@/components/reusable/SelectSku";
import {
  getClientBranch,
  wrongDeviceDispatch,
  getChallanById,
} from "@/features/Dispatch/DispatchSlice";
import { DispatchWrongItemPayload } from "@/features/Dispatch/DispatchType";
import { Dayjs } from "dayjs";
import WrongDeviceImeiTable from "@/table/dispatch/WrongDeviceImeiTable";
import { useParams } from "react-router-dom";
import { CloudUpload } from "@mui/icons-material";
import { VisuallyHiddenInput } from "@/theme";
type RowData = {
  awbNo: string;
  uniqueId: string;
  serialNo: string;
};

const EXCEL_HEADERS = {
  awbNo: "AWB No.",
  uniqueId: "Unique ID",
  serialNo: "Serial No",
} as const;

const getExcelColumnValue = (
  row: Record<string, unknown>,
  aliases: string[],
) => {
  const aliasSet = new Set(aliases.map((alias) => alias.trim().toLowerCase()));

  for (const [key, value] of Object.entries(row)) {
    if (aliasSet.has(key.trim().toLowerCase())) {
      return value;
    }
  }

  return undefined;
};

const normalizeExcelCell = (value: unknown) => {
  const str = String(value ?? "").trim();
  return str || "--";
};

type FormDataType = {
  clientDetail: clientDetailType | null;
  shipToDetails: shipToDetailsType | null;
  invoice: string;
  qty: string;
  location: LocationType | null;
  remark: string;
  file: File[] | null;
  sku: DeviceType | null;
  docNo: string;
  document: string;
  dispatchDate: Dayjs | null;
};

type clientDetailType = {
  client: string;
  branchId: string;
  address1: string;
  address2: string;
  pincode: string;
};

type shipToDetailsType = {
  shipTo: string;
  address1: string;
  address2: string;
  pincode: string;
  mobileNo: string;
  city: string;
};

const WrongDeviceDispatch: React.FC = () => {
  const [upload, setUpload] = useState<boolean>(false);
  const [uploadConfirmOpen, setUploadConfirmOpen] = useState<boolean>(false);
  const [pendingUploadRows, setPendingUploadRows] = useState<RowData[]>([]);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [imei, setImei] = React.useState<string>("");
  const [uniqueIds, setUniqueIds] = React.useState<string>("");
  const [serialNo, setSerialNo] = React.useState<string>("");
  const [dispatchNo, setDispatchNo] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const dispatch = useAppDispatch();
  const { deviceDetailLoading } = useAppSelector(
    (state) => state.batteryQcReducer,
  );

  const { wrongDispatchLoading, getChallanLoading } = useAppSelector(
    (state) => state.dispatch,
  );

  const { handleSubmit, reset, setValue, watch } = useForm<FormDataType>({
    defaultValues: {
      clientDetail: null,
      shipToDetails: null,
      invoice: "",
      qty: "",
      document: "",
      location: null,
      remark: "",
      file: null,
      sku: null,
    },
  });
  const formValues = watch();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Form Details", "Add Component Details", "Review & Submit"];
  const formdata = new FormData();
  const { id } = useParams();

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
    // if (!data.document) return showToast("Please Upload Invoice Documents", "error");
    dispatch(storeFormdata(data));
    handleNext();
  };
  useEffect(() => {
    if (id) {
      // Convert the id parameter back to challanId format (replace _ with /)
      // e.g., "DC_Ref_0384" becomes "DC/Ref/0384"
      const challanId = id.replace(/_/g, "/");
      // Fetch challan details from API using the challanId
      dispatch(getChallanById({ challanId })).then((res: any) => {
        if (res?.payload?.data?.success) {
          const challanData =
            res?.payload?.data?.data?.[0] || res?.payload?.data?.data;
          if (challanData) {
            setData(challanData);
            setValue("remark", challanData?.remark || "");
            setValue("qty", challanData?.dispatchQty || "");
          }
        }
      });
    }
  }, [id, dispatch, setValue]);

  const finalSubmit = () => {
    const data = formValues;
    if (rowData.length !== Number(data.qty))
      return showToast(
        "Total Devices should be equal to Quantity you have entered",
        "error",
      );
    const payload: DispatchWrongItemPayload = {
      awb: rowData.map((item) => item.awbNo),
      challanId: id?.replace(/_/g, "/") || "",
      uniqueIds: rowData.map((item) => item.uniqueId),
      serialNo: rowData.map((item) => item.serialNo),
    };
    dispatch(wrongDeviceDispatch(payload)).then((res: any) => {
      if (res?.payload?.data?.success) {
        setDispatchNo(res?.payload?.data?.data?.refID);
        reset();
        setRowData([]);
        handleNext();
        resetall();
      } else if (res?.payload?.data?.message) {
        showToast(res.payload.data.message, "error");
      }
    });
    //  };
  };

  useEffect(() => {
    if (formValues.clientDetail?.client) {
      dispatch(getClientBranch((formValues.clientDetail.client as any).code));
    }
  }, [formValues.clientDetail?.client]);

  const handleDownloadSample = () => {
    const sampleData = [
      {
        [EXCEL_HEADERS.awbNo]: "AWB123456",
        [EXCEL_HEADERS.uniqueId]: "12345",
        [EXCEL_HEADERS.serialNo]: "67890",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Wrong Device");
    XLSX.writeFile(workbook, "wrong_device_dispatch_sample.xlsx");
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
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          worksheet,
          { defval: "" },
        );

        if (!jsonData.length) {
          showToast("Excel file is empty", "error");
          return;
        }

        const parsedRows: RowData[] = [];
        const seenUniqueIds = new Set<string>();
        const seenSerialNos = new Set<string>();

        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          const awbNo = String(
            getExcelColumnValue(row, [
              EXCEL_HEADERS.awbNo,
              "AWB No",
              "AWB Device",
            ]) ?? "",
          ).trim();
          const uniqueId = normalizeExcelCell(
            getExcelColumnValue(row, [EXCEL_HEADERS.uniqueId, "Unique Id"]),
          );
          const serialNo = normalizeExcelCell(
            getExcelColumnValue(row, [EXCEL_HEADERS.serialNo, "Serial No."]),
          );

          if (!awbNo) {
            showToast(`Row ${i + 2}: AWB No. is required`, "error");
            return;
          }

          if (uniqueId !== "--") {
            if (seenUniqueIds.has(uniqueId)) {
              showToast(
                `Row ${i + 2}: Duplicate Unique ID "${uniqueId}"`,
                "error",
              );
              return;
            }
            seenUniqueIds.add(uniqueId);
          }

          if (serialNo !== "--") {
            if (seenSerialNos.has(serialNo)) {
              showToast(
                `Row ${i + 2}: Duplicate Serial No "${serialNo}"`,
                "error",
              );
              return;
            }
            seenSerialNos.add(serialNo);
          }

          parsedRows.push({ awbNo, uniqueId, serialNo });
        }

        const qty = Number(formValues.qty);
        if (qty && parsedRows.length !== qty) {
          showToast(
            `Uploaded rows (${parsedRows.length}) must match dispatch quantity (${qty})`,
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

  const handleUploadConfirm = () => {
    const count = pendingUploadRows.length;
    setRowData(pendingUploadRows);
    setPendingUploadRows([]);
    setUploadConfirmOpen(false);
    showToast(`${count} device(s) loaded from Excel`, "success");
  };

  const handleUploadCancel = () => {
    setPendingUploadRows([]);
    setUploadConfirmOpen(false);
  };

  return (
    <>
      <ConfirmationModel
        open={uploadConfirmOpen}
        onClose={handleUploadCancel}
        title="Please note:"
        content="The AWB will not be verified when upload the file. Do you want to continue?"
        cancelText="Cancel"
        confirmText="Continue"
        color="primary"
        onConfirm={handleUploadConfirm}
      />
      {getChallanLoading && <FullPageLoading />}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white ">
        <MaterialInvardUploadDocumentDrawer open={upload} setOpen={setUpload} />

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
                    <h2 id="primary-details" className="text-lg font-semibold">
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
                    <h2 id="ship-to-details" className="text-lg font-semibold">
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
                    <h2 id="dispatch-details" className="text-lg font-semibold">
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
                        { label: "Device Type", value: "Wrong Device" },
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
            </div>
          )}
          {activeStep === 1 && (
            <div className="h-[calc(100vh-200px)]   ">
              {/* <RMMaterialsAddTablev2
                rowData={rowData}
                setRowData={setRowData}
                setTotal={setTotal}
              /> */}
              <div>
                <div className="h-[90px] flex flex-row items-center px-[20px] gap-[20px] flex-wrap">
                  <FormControl sx={{ width: "400px" }} variant="outlined">
                    <TextField
                      rows={2}
                      value={imei}
                      label="AWB Device"
                      id="standard-adornment-qty"
                      aria-describedby="standard-weight-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                      onChange={(e) => {
                        setImei(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          // Check if the imei already exists in the rowData
                          const isDuplicate = rowData.some(
                            (item) =>
                              item.awbNo === imei &&
                              (item.uniqueId === "--" || !item.uniqueId),
                          );

                          if (isDuplicate) {
                            showToast(
                              "This AWB Device already exists",
                              "error",
                            ); // You can use a toast or other way to notify the user
                          } else {
                            const awbNo = [
                              { awbNo: imei, uniqueId: "--", serialNo: "--" },
                            ];
                            setRowData((prevRowData: any) => [
                              ...awbNo,
                              ...prevRowData,
                            ]); // Add the new IMEI to the rowData
                          }

                          setImei(""); // Clear the input field after adding
                          e.preventDefault(); // Prevent the default Enter key behavior
                        }
                      }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              {deviceDetailLoading ? (
                                <CircularProgress size={20} color="inherit" />
                              ) : (
                                <QrCodeScannerIcon />
                              )}
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </FormControl>
                  <FormControl sx={{ width: "400px" }} variant="outlined">
                    <TextField
                      rows={1}
                      value={uniqueIds}
                      label="Unique ID"
                      id="standard-adornment-qty"
                      aria-describedby="standard-weight-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                      onChange={(e) => {
                        const regex = /^[0-9_]*$/; // Regular expression to allow only numbers
                        if (regex.test(e.target.value)) {
                          setUniqueIds(e.target.value);
                        }
                      }}
                      type="text"
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                        if (e.key === "Enter") {
                          const isDuplicate = rowData.some(
                            (item: any) => item.uniqueId === uniqueIds,
                          );

                          if (isDuplicate) {
                            showToast("This Unique ID already exists", "error");
                          }
                          if (!imei) {
                            showToast(
                              "Please enter AWB Device before adding Unique ID",
                              "error",
                            );
                            return;
                          }
                          if (!isDuplicate && imei) {
                            const uniqueId: any = [
                              {
                                uniqueId: uniqueIds,
                                awbNo: imei,
                                serialNo: serialNo || "--",
                              },
                            ];

                            setRowData((prevRowData: any) => [
                              ...uniqueId,

                              ...prevRowData,
                            ]);
                          }

                          setUniqueIds("");
                          setSerialNo("");
                          setImei("");
                          e.preventDefault();
                        }
                      }}
                    />
                  </FormControl>
                  <FormControl sx={{ width: "400px" }} variant="outlined">
                    <TextField
                      rows={1}
                      value={serialNo}
                      label="Serial No"
                      id="standard-adornment-serial"
                      aria-describedby="standard-serial-helper-text"
                      inputProps={{
                        "aria-label": "serial",
                      }}
                      onChange={(e) => {
                        const regex = /^[0-9_]*$/;
                        if (regex.test(e.target.value)) {
                          setSerialNo(e.target.value);
                        }
                      }}
                      type="text"
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                        if (e.key === "Enter") {
                          const isDuplicate = rowData.some(
                            (item: any) => item.serialNo === serialNo,
                          );

                          if (isDuplicate) {
                            showToast("This Serial No already exists", "error");
                          }
                          if (!imei) {
                            showToast(
                              "Please enter AWB Device before adding Serial No",
                              "error",
                            );
                            return;
                          }
                          if (!isDuplicate && imei) {
                            const serialRow: any = [
                              {
                                serialNo,
                                awbNo: imei,
                                uniqueId: uniqueIds || "--",
                              },
                            ];

                            setRowData((prevRowData: any) => [
                              ...serialRow,
                              ...prevRowData,
                            ]);
                          }

                          setSerialNo("");
                          setUniqueIds("");
                          setImei("");
                          e.preventDefault();
                        }
                      }}
                    />
                  </FormControl>
                  <Button
                  size="large"
                    component="label"
                    role={undefined}
                    variant="contained"
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

                <div className="h-[calc(100vh-250px)]">
                  <WrongDeviceImeiTable
                    setRowdata={setRowData}
                    rowData={rowData}
                  />
                </div>
              </div>
            </div>
          )}
          {activeStep === 2 && (
            <div className="h-[calc(100vh-200px)] flex items-center justify-center">
              <div className="flex flex-col justify-center gap-[10px]">
                <Success />
                <Typography variant="inherit" fontWeight={500}>
                  Dispatch Number - {dispatchNo ? dispatchNo : ""}
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
          <div className="h-[50px] border-t border-neutral-300 flex items-center justify-end px-[20px] bg-neutral-50 gap-[10px] relative">
            {activeStep === 0 && (
              <>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  endIcon={<Icons.next />}
                >
                  Next
                </LoadingButton>
              </>
            )}
            {activeStep === 1 && (
              <>
                <Button
                  variant="text"
                  startIcon={<Icons.download />}
                  onClick={handleDownloadSample}
                >
                  Sample File
                </Button>
                <LoadingButton
                  disabled={wrongDispatchLoading}
                  sx={{ background: "white", color: "red" }}
                  variant="contained"
                  startIcon={<Icons.previous />}
                  onClick={() => {
                    handleBack();
                  }}
                >
                  Back
                </LoadingButton>
                {/* <LoadingButton
                  disabled={createminLoading}
                  sx={{ background: "white", color: "red" }}
                  variant="contained"
                  startIcon={<Icons.refreshv2 />}
                  onClick={() => {
                    setAlert(true);
                  }}
                >
                  Reset
                </LoadingButton> */}
                <LoadingButton
                  loading={wrongDispatchLoading}
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
    </>
  );
};

export default WrongDeviceDispatch;
