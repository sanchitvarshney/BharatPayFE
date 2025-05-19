import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import MaterialInvardUploadDocumentDrawer from "@/components/Drawers/wearhouse/MaterialInvardUploadDocumentDrawer";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  clearaddressdetail,
  getLocationAsync,
  getVendorAddress,
  getVendorAsync,
  getVendorBranchAsync,
  uploadInvoiceFile,
} from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import {
  createRawMin,
  deletefile,
  resetDocumentFile,
  resetFormData,
  storeDocumentFile,
  storeFormdata,
} from "@/features/wearhouse/Rawmin/RawMinSlice";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { CreateRawMinPayloadType } from "@/features/wearhouse/Rawmin/RawMinType";
import { getCurrency } from "@/features/common/commonSlice";
import {
  Autocomplete,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import SelectVendor, { VendorData } from "@/components/reusable/SelectVendor";
import { replaceBrWithNewLine } from "@/utils/replacebrtag";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import FileUploader from "@/components/reusable/FileUploader";
import { LoadingButton } from "@mui/lab";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Icons } from "@/components/icons";
import { showToast } from "@/utils/toasterContext";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import RMMaterialsAddTablev2 from "@/table/wearhouse/RMMaterialsAddTablev2";
import { Button } from "@/components/ui/button";
import Success from "@/components/reusable/Success";
import SelectCostCenter, {
  CostCenterType,
} from "@/components/reusable/SelectCostCenter";
import {
  getDispatchFromDetail,
  getShippingAddress,
} from "@/features/master/client/clientSlice";
import { transformSkuCode } from "@/utils/transformUtills";
import AddPOTable from "@/pages/procurement/AddPOTable";
interface RowData {
  partComponent: { lable: string; value: string } | null;
  qty: number;
  rate: string;
  taxableValue: number;
  foreignValue: number;
  hsnCode: string;
  gstType: string;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  location: { lable: string; value: string } | null;
  autoConsump: string;
  remarks: string;
  id: string;
  currency: string;
  isNew?: boolean;
  excRate: number;
  uom: string;
}

interface Totals {
  cgst: number;
  sgst: number;
  igst: number;
  taxableValue: number;
}

interface BillAddress {
  id: number;
  code: string;
  addressLine1: string;
  addressLine2: string;
  mobileNo: string;
  city: string;
  gst: string;
  company: string;
  pan: string;
  pin: string;
  label: string;
}

interface ShippingAddress {
  id: number;
  addressLine1: string;
  addressLine2: string;
  mobileNo: string;
  city: string;
  gst: string;
  company: string;
  pan: string;
  pin: string;
  label: string;
}
type FormData = {
  currency: string;
  invoice: string;
  location: string;
  vendorname: VendorData | null;
  vendorbranch: string;
  vendoraddress: string;
  duedate: string;
  advancepayment: 0;
  billaddressid: 0;
  billaddress: BillAddress;
  shipaddressid: 0;
  shipaddress: ShippingAddress;
  exchange: 0;
  vendorType: string;
  gstin: string;
  doucmentDate: Dayjs | null;
  documentId: string;
  cc: CostCenterType | null;
};
const CreatePO: React.FC = () => {
  const [filename, setFilename] = useState<string>("");
  const [alert, setAlert] = useState<boolean>(false);
  const [file, setfile] = useState<File[] | null>(null);
  const [minNo, setMinno] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [total, setTotal] = useState<Totals>({
    cgst: 0,
    sgst: 0,
    igst: 0,
    taxableValue: 0,
  });
  const dispatch = useAppDispatch();
  const { VendorBranchData, venderaddressdata, uploadInvoiceFileLoading } =
    useAppSelector((state) => state.divicemin);
  const { documnetFileData, createminLoading, formdata } = useAppSelector(
    (state) => state.rawmin
  );
  const { dispatchFromDetails, shippingAddress } = useAppSelector(
    (state) => state.client
  ) as any;

  const { currencyData } = useAppSelector((state) => state.common);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      vendorType: "V01",
      vendor: null,
      vendorBranch: "",
      vendorAddress: "",
      gstin: "",
      doucmentDate: null,
      documentId: "",
      cc: null,
    },
  });

  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Form Details", "Add Component Details", "Review & Submit"];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const checkRequiredFields = (data: RowData[]) => {
    let hasErrors = false;
    const requiredFields: Array<keyof RowData> = [
      "partComponent",
      "qty",
      "rate",
      "hsnCode",
      "gstType",
      "gstRate",
      "location",
    ];

    const missingDetails: string[] = [];

    data.forEach((item, index) => {
      const missingFields: string[] = [];

      requiredFields.forEach((field) => {
        if (
          item[field] === "" ||
          item[field] === 0 ||
          item[field] === undefined ||
          item[field] === null
        ) {
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
        missingDetails.push(`Row ${index + 1}: ${missingFields.join(", ")}`);
        hasErrors = true;
      }
    });

    if (missingDetails.length > 0) {
      showToast(
        `Some required fields are missing:\n${missingDetails.join("\n")}`,
        "error"
      );
    }

    return hasErrors;
  };

  const resetall = () => {
    setRowData([]);
    setTotal({ cgst: 0, sgst: 0, igst: 0, taxableValue: 0 });
    reset();
    dispatch(resetDocumentFile());
    setFilename("");
    setfile(null);
    dispatch(clearaddressdetail());
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // if (!documnetFileData || documnetFileData.length === 0)
    //   return showToast("Please Upload Invoice Documents", "error");
    // dispatch(storeFormdata(data));
    handleNext();
  };
  const finalSubmit = () => {
    if (formdata) {
      if (rowData.length === 0) {
        showToast("Please Add Material Details", "error");
      } else if (!documnetFileData) {
        showToast("Please Upload Invoice Documents", "error");
      } else {
        if (!checkRequiredFields(rowData)) {
          const component = rowData.map(
            (item) => item.partComponent?.value || ""
          );
          const qty = rowData.map((item) => Number(item.qty));
          const rate = rowData.map((item) => Number(item.rate));
          const gsttype = rowData.map((item) => item.gstType);
          const gstrate = rowData.map((item) => Number(item.gstRate));
          const location = rowData.map((item) => item.location?.value || "");
          const currency = rowData.map((item) => item.currency);
          const remarks = rowData.map((item) => item.remarks);
          const hsnCode = rowData.map((item) => item.hsnCode);
          const payload: CreateRawMinPayloadType = {
            component,
            qty,
            rate,
            gsttype,
            gstrate,
            location,
            hsnCode,
            remarks,
            currency: currency || [],
            vendor: formdata.vendor?.id || "",
            vendorbranch: formdata.vendorBranch || "",
            address: formdata.vendorAddress || "",
            doc_id: formdata.documentId || "",
            doc_date: dayjs(formdata.doucmentDate).format("DD-MM-YYYY") || "",
            vendortype: formdata.vendorType || "",
            invoiceAttachment: documnetFileData || [],
            cc: formdata?.cc?.id || "",
          };
          dispatch(createRawMin(payload)).then((response: any) => {
            if (response.payload.data.success) {
              showToast(response.payload?.data?.message, "success");
              resetall();
              handleNext();
              dispatch(resetFormData());
              setMinno(response.payload?.data?.data.transaction_id);
            }
          });
        }
      }
    }
  };

  const InvoiceFileUpload = () => {
    if (file && filename) {
      const formdata = new FormData();
      formdata.append("file", file[0]);
      formdata.append("fileName", filename);
      dispatch(uploadInvoiceFile(formdata)).then((res: any) => {
        if (res.payload.data.success) {
          dispatch(storeDocumentFile(res.payload.data?.data[0]));

          showToast(res.payload.data.message, "success");
          setfile(null);
          setFilename("");
        }
      });
    } else {
      showToast("File and Document Name Required", "error");
    }
  };
  useEffect(() => {
    dispatch(getVendorAsync(null));
    dispatch(getLocationAsync(null));
    dispatch(getPertCodesync(null));
    dispatch(getCurrency());
    dispatch(getDispatchFromDetail());
    dispatch(getShippingAddress());
  }, []);

  const handleBillAddressChange = (value: any) => {
    console.log(value);
    if (value) {
      setValue("billaddressid", value.id);
      setValue("billaddress.label", value.label);
      setValue("billaddress.addressLine1", value.addressLine1);
      setValue("billaddress.addressLine2", value.addressLine2);
      setValue("billaddress.mobileNo", value.mobileNo);
      setValue("billaddress.gst", value.gst);
      setValue("billaddress.company", value.company);
      setValue("billaddress.pan", value.pan);
      setValue("billaddress.pin", value.pin);
    }
  };
  const handleShipAddressChange = (value: any) => {
    console.log(value);
    if (value) {
      setValue("shipaddressid", value.code);
      setValue("shipaddress.label", value.label);
      setValue("shipaddress.addressLine1", value.addressLine1);
      setValue("shipaddress.addressLine2", value.addressLine2);
      setValue("shipaddress.mobileNo", value.mobileNo);
      setValue("shipaddress.city", value.city);
      setValue("shipaddress.gst", value.gst);
      setValue("shipaddress.company", value.company);
      setValue("shipaddress.pan", value.pan);
      setValue("shipaddress.pin", value.pin);
    }
  };
  const billLabel = watch("billaddress.label");
  const shipLabel = watch("shipaddress.label");
  return (
    <>
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
              <div
                id="primary-item-details"
                className="flex items-center w-full gap-3"
              >
                <div className="flex items-center gap-[5px]">
                  <Icons.user />
                  <h2
                    id="primary-item-details"
                    className="text-lg font-semibold"
                  >
                    Vendor Details
                  </h2>
                </div>
                <Divider
                  sx={{
                    borderBottomWidth: 2,
                    borderColor: "#f59e0b",
                    flexGrow: 1,
                  }}
                />
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                <Controller
                  name="cc"
                  control={control}
                  rules={{ required: "Cost Center  is required" }}
                  render={({ field }) => (
                    <SelectCostCenter
                      variant="filled"
                      error={!!errors.cc}
                      helperText={errors.cc?.message}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        dispatch(getVendorBranchAsync(e!.id));
                      }}
                      label="Cost Center"
                    />
                  )}
                />
                <Controller
                  name="vendorname"
                  control={control}
                  rules={{ required: "Vendor  is required" }}
                  render={({ field }) => (
                    <SelectVendor
                      varient="filled"
                      error={!!errors.vendorname}
                      helperText={errors.vendorname?.message}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        dispatch(getVendorBranchAsync(e!.id));
                      }}
                      label="Vendor"
                    />
                  )}
                />
                <Controller
                  name="vendorbranch"
                  control={control}
                  rules={{ required: "Vendor Branch  is required" }}
                  render={({ field }) => (
                    <FormControl
                      variant="filled"
                      error={!!errors.vendorbranch}
                      disabled={!VendorBranchData}
                      fullWidth
                    >
                      <InputLabel id="Vendor-simple-select-label">
                        Vendor Branch
                      </InputLabel>
                      <Select
                        labelId="Vendor-simple-select-label"
                        id="Vendor-simple-select"
                        label="Vendor Branch"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          dispatch(getVendorAddress(e.target.value)).then(
                            (response: any) => {
                              if (response.payload.data.success) {
                                setValue(
                                  "vendoraddress",
                                  replaceBrWithNewLine(
                                    response.payload.data?.data?.address
                                  ) || ""
                                );
                                setValue(
                                  "gstin",
                                  response.payload.data?.data?.gstid
                                );
                              }
                            }
                          );
                        }}
                      >
                        {VendorBranchData?.map((item) => (
                          <MenuItem value={item.id}>{item.text}</MenuItem>
                        ))}
                      </Select>
                      {errors.vendorbranch && (
                        <FormHelperText>
                          {errors.vendorbranch.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />

                <div className="flex items-center gap-[10px] text-slate-600 sm:col-span-1 md:col-span-2 ">
                  <p className="font-[500]">GSTIN :</p>
                  <p>{venderaddressdata ? venderaddressdata.gstid : "--"}</p>
                </div>
                <div className="col-span-2">
                  <TextField
                    variant="filled"
                    sx={{ mb: 1 }}
                    error={!!errors.vendoraddress}
                    helperText={errors?.vendoraddress?.message}
                    focused={!!watch("vendoraddress")}
                    multiline
                    rows={3}
                    fullWidth
                    label="Bill From Address"
                    className="h-[100px] resize-none"
                    {...register("vendoraddress", {
                      required: "Bill From Address is required",
                    })}
                  />
                </div>
              </div>
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.shipping />
                  <h2 className="text-lg font-semibold">Billing Details</h2>
                </div>
                <Divider
                  sx={{
                    borderBottomWidth: 2,
                    borderColor: "#f59e0b",
                    flexGrow: 1,
                  }}
                />
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                <Controller
                  name="billaddressid"
                  rules={{
                    required: {
                      value: true,
                      message: "Bill Address is required",
                    },
                  }}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      value={
                        dispatchFromDetails?.data?.find(
                          (address: any) => address.code === field.value
                        ) || null
                      }
                      onChange={(_, newValue) =>
                        handleBillAddressChange(newValue)
                      }
                      disablePortal
                      id="combo-box-demo"
                      options={dispatchFromDetails || []}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={(billLabel || "Bill Address") as any}
                          error={!!errors.billaddress}
                          helperText={errors.billaddress?.message}
                          variant="filled"
                        />
                      )}
                    />
                  )}
                />

                <TextField
                  variant="filled"
                  // sx={{ mb: 1 }}
                  error={!!errors.billaddress?.pin}
                  helperText={errors?.billaddress?.pin?.message}
                  focused={!!watch("billaddress.pin")}
                  // multiline
                  rows={3}
                  fullWidth
                  label="PinCode"
                  className="h-[10px] resize-none"
                  {...register("billaddress.pin", {
                    required: "PinCode is required",
                  })}
                />

                <TextField
                  variant="filled"
                  // sx={{ mb: 1 }}
                  error={!!errors.billaddress?.mobileNo}
                  helperText={errors?.billaddress?.mobileNo?.message}
                  focused={!!watch("billaddress.mobileNo")}
                  // multiline
                  rows={3}
                  fullWidth
                  label="Mobile No"
                  className="h-[10px] resize-none"
                  {...register("billaddress.mobileNo", {
                    required: "Mobile No is required",
                  })}
                />
                <TextField
                  variant="filled"
                  // sx={{ mb: 1 }}
                  error={!!errors.billaddress?.gst}
                  helperText={errors?.billaddress?.gst?.message}
                  focused={!!watch("billaddress.gst")}
                  // multiline
                  rows={3}
                  fullWidth
                  label="GST"
                  className="h-[10px] resize-none"
                  {...register("billaddress.gst", {
                    required: "GST is required",
                  })}
                />
                <TextField
                  variant="filled"
                  sx={{ mb: 5 }}
                  error={!!errors.billaddress?.pan}
                  helperText={errors?.billaddress?.pan?.message}
                  focused={!!watch("billaddress.pan")}
                  // multiline
                  rows={3}
                  fullWidth
                  label="PAN"
                  className="h-[10px] resize-none"
                  {...register("billaddress.pan", {
                    required: "PAN is required",
                  })}
                />
                <div></div>

                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.billaddress?.addressLine1}
                  helperText={errors?.billaddress?.addressLine1?.message}
                  focused={!!watch("billaddress.addressLine1")}
                  multiline
                  rows={3}
                  fullWidth
                  label="Dispatch From Address 1"
                  className="h-[100px] resize-none"
                  {...register("billaddress.addressLine1", {
                    required: "Address 1 is required",
                  })}
                />
                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.billaddress?.addressLine2}
                  helperText={errors?.billaddress?.addressLine2?.message}
                  focused={!!watch("billaddress.addressLine2")}
                  multiline
                  rows={3}
                  fullWidth
                  label="Dispatch From Address 2"
                  className="h-[100px] resize-none"
                  {...register("billaddress.addressLine2", {
                    required: "Address 2 is required",
                  })}
                />
              </div>
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.building />
                  <h2 className="text-lg font-semibold">Shipping Details</h2>
                </div>
                <Divider
                  sx={{
                    borderBottomWidth: 2,
                    borderColor: "#f59e0b",
                    flexGrow: 1,
                  }}
                />
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                <Controller
                  name="shipaddressid"
                  rules={{
                    required: {
                      value: true,
                      message: "Ship Address is required",
                    },
                  }}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      // value={field.value}
                      value={
                        shippingAddress?.data?.find(
                          (address: any) => address.code === field.value
                        ) || null
                      }
                      onChange={(_, newValue) =>
                        handleShipAddressChange(newValue)
                      }
                      disablePortal
                      id="combo-box-demo"
                      options={shippingAddress || []}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={(shipLabel || "Ship Address") as any}
                          error={!!errors.shipaddress}
                          helperText={errors.shipaddress?.message}
                          variant="filled"
                        />
                      )}
                    />
                  )}
                />

                <TextField
                  variant="filled"
                  // sx={{ mb: 1 }}
                  error={!!errors.shipaddress?.pin}
                  helperText={errors?.shipaddress?.pin?.message}
                  focused={!!watch("shipaddress.pin")}
                  // multiline
                  rows={3}
                  fullWidth
                  label="PinCode"
                  className="h-[10px] resize-none"
                  {...register("shipaddress.pin", {
                    required: "PinCode is required",
                  })}
                />

                <TextField
                  variant="filled"
                  // sx={{ mb: 1 }}
                  error={!!errors.shipaddress?.gst}
                  helperText={errors?.shipaddress?.gst?.message}
                  focused={!!watch("shipaddress.gst")}
                  // multiline
                  rows={3}
                  fullWidth
                  label="GST"
                  className="h-[10px] resize-none"
                  {...register("shipaddress.gst", {
                    required: "GST is required",
                  })}
                />
                <TextField
                  variant="filled"
                  // sx={{ mb: 1 }}
                  error={!!errors.shipaddress?.pan}
                  helperText={errors?.shipaddress?.pan?.message}
                  focused={!!watch("shipaddress.pan")}
                  // multiline
                  rows={3}
                  fullWidth
                  label="PAN"
                  className="h-[10px] resize-none"
                  {...register("shipaddress.pan", {
                    required: "PAN is required",
                  })}
                />
                <TextField
                  variant="filled"
                  sx={{ mb: 5 }}
                  error={!!errors.shipaddress?.city}
                  helperText={errors?.shipaddress?.city?.message}
                  focused={!!watch("shipaddress.city")}
                  rows={3}
                  fullWidth
                  label="City"
                  className="h-[10px] resize-none"
                  {...register("shipaddress.city")}
                />
                <div></div>

                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.shipaddress?.addressLine1}
                  helperText={errors?.shipaddress?.addressLine1?.message}
                  focused={!!watch("shipaddress.addressLine1")}
                  multiline
                  rows={3}
                  fullWidth
                  label="Dispatch From Address 1"
                  className="h-[100px] resize-none"
                  {...register("shipaddress.addressLine1", {
                    required: "Address 1 is required",
                  })}
                />
                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.shipaddress?.addressLine2}
                  helperText={errors?.shipaddress?.addressLine2?.message}
                  focused={!!watch("shipaddress.addressLine2")}
                  multiline
                  rows={3}
                  fullWidth
                  label="Dispatch From Address 2"
                  className="h-[100px] resize-none"
                  {...register("shipaddress.addressLine2", {
                    required: "Address 2 is required",
                  })}
                />
              </div>
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.documentDetail />
                  <h2 className="text-lg font-semibold">Document Details</h2>
                </div>
                <Divider
                  sx={{
                    borderBottomWidth: 2,
                    borderColor: "#f59e0b",
                    flexGrow: 1,
                  }}
                />
              </div>
              <div className="grid grid-cols-3 gap-[30px] py-[20px]">
                <Controller
                  name="currency"
                  rules={{
                    required: {
                      value: true,
                      message: "Currency is required",
                    },
                  }}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      // value={field.value}
                      // value={
                      //   currencyData?.find(
                      //     (address: any) => address.code === field.value
                      //   ) || null
                      // }
                      onChange={(_, newValue) => setValue("currency", newValue)}
                      disablePortal
                      id="combo-box-demo"
                      options={transformSkuCode(currencyData) || []}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Currency"
                          error={!!errors.currency}
                          helperText={errors.currency?.message}
                          variant="filled"
                        />
                      )}
                    />
                  )}
                />
                <TextField
                  variant="filled"
                  label="Exchange Rate"
                  error={!!errors.exchange}
                  helperText={errors.exchange?.message}
                  {...register("exchange", {
                    required: "Exchange Rate  is required",
                  })}
                />
                <Controller
                  name="duedate"
                  control={control}
                  rules={{ required: " Due Date is required" }}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        format="DD-MM-YYYY"
                        slots={{
                          textField: TextField,
                        }}
                        maxDate={dayjs()}
                        slotProps={{
                          textField: {
                            variant: "filled",
                            error: !!errors.duedate,
                            helperText: errors.duedate?.message,
                          },
                        }}
                        value={(field.value as any) || null}
                        onChange={(value) => field.onChange(value)}
                        sx={{ width: "100%" }}
                        label="Due Date"
                        name="duedate"
                      />
                    </LocalizationProvider>
                  )}
                />
                <TextField
                  variant="filled"
                  label="Document ID"
                  error={!!errors.documentId}
                  helperText={errors.documentId?.message}
                  {...register("documentId", {
                    required: "Document Id  is required",
                  })}
                />
              </div>
            </div>
          )}
          {activeStep === 1 && (
            <div className="h-[calc(100vh-200px)]   ">
              <AddPOTable
                rowData={rowData}
                setRowData={setRowData}
                setTotal={setTotal}
              />
            </div>
          )}
          {activeStep === 2 && (
            <div className="h-[calc(100vh-200px)] flex items-center justify-center">
              <div className="flex flex-col justify-center gap-[10px]">
                <Success />
                <Typography variant="inherit" fontWeight={500}>
                  Min No. : {minNo}
                </Typography>
                <LoadingButton
                  onClick={() => setActiveStep(0)}
                  variant="contained"
                >
                  Create New MIN
                </LoadingButton>
              </div>
            </div>
          )}
          <div className="h-[50px] border-t border-neutral-300 flex items-center justify-end px-[20px] bg-neutral-50 gap-[10px] relative">
            {activeStep === 1 && (
              <div
                className={`absolute bottom-0 left-0 w-[500px] z-[10]  transition-all bg-white ${
                  open ? "h-[290px]" : "h-[50px]"
                } border-r overflow-hidden`}
              >
                <div className="h-[50px] bg-cyan-900 flex items-center pe-[20px] gap-[10px]">
                  <Button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="bg-amber-500 hover:bg-amber-600 p-0  rounded-none h-full w-[50px]"
                  >
                    <Icons.up
                      className={`h-[20px] w-[20px] transition-transform duration-200 ${
                        open ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </Button>
                  <Typography
                    variant="h6"
                    component={"div"}
                    fontWeight={500}
                    fontSize={"17px"}
                    className="text-white"
                  >
                    Total GST and Tax Details
                  </Typography>
                </div>
                <Card className="border-0 rounded-none shadow-none">
                  <CardContent className="flex flex-col gap-[20px] pt-[20px]">
                    <div className="flex justify-between">
                      <p className="text-slate-600 font-[500]">
                        Sub-Total value before Taxes
                      </p>
                      <p className="text-[14px] text-muted-foreground">
                        {total.taxableValue}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-slate-600 font-[500]">CGST</p>
                      <p className="text-[14px] text-muted-foreground">
                        (+) {total.cgst}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-slate-600 font-[500]">SGST</p>
                      <p className="text-[14px] text-muted-foreground">
                        (+) {total.sgst}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-slate-600 font-[500]">IGST</p>
                      <p className="text-[14px] text-muted-foreground">
                        (+) {total.igst}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-slate-600 font-[500]">
                        Sub-Total values after Taxes
                      </p>
                      <p className="text-[14px] text-muted-foreground">
                        {total.taxableValue +
                          (total.cgst + total.sgst + total.igst)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {activeStep === 0 && (
              <>
                <LoadingButton
                  sx={{ background: "white", color: "red" }}
                  variant="contained"
                  startIcon={<Icons.refreshv2 />}
                  onClick={() => {
                    setAlert(true);
                  }}
                >
                  Reset
                </LoadingButton>

                <LoadingButton
                  type="submit"
                  variant="contained"
                  endIcon={<Icons.next />}
                  // onClick={() => {
                  //   handleNext();
                  // }}
                >
                  Next
                </LoadingButton>
              </>
            )}
            {activeStep === 1 && (
              <>
                <LoadingButton
                  disabled={createminLoading}
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
                  disabled={createminLoading}
                  sx={{ background: "white", color: "red" }}
                  variant="contained"
                  startIcon={<Icons.refreshv2 />}
                  onClick={() => {
                    setAlert(true);
                  }}
                >
                  Reset
                </LoadingButton>
                <LoadingButton
                  loading={createminLoading}
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

export default CreatePO;
