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
} from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import {
  resetDocumentFile,
  resetFormData,
} from "@/features/wearhouse/Rawmin/RawMinSlice";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { getCurrency } from "@/features/common/commonSlice";
import {
  Autocomplete,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
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
import dayjs from "dayjs";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import { showToast } from "@/utils/toasterContext";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import { Button } from "@/components/ui/button";
import Success from "@/components/reusable/Success";
import {
  getDispatchFromDetail,
  getShippingAddress,
} from "@/features/master/client/clientSlice";
import { transformSkuCode } from "@/utils/transformUtills";
import AddPOTable from "./AddPOTable";
import {
  createPO,
  getPODetail,
  setFormData,
} from "@/features/procurement/poSlices";
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
  mobileNo: string;
  gst: string;
  pin: string;
  pan: string;
  addressLine1: string;
  addressLine2: string;
  label: string;
}

interface ShippingAddress {
  id: number;
  pin: string;
  gst: string;
  pan: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
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
  vendor: string | null;
  gstin: string;
};
const CreatePO: React.FC = () => {
  const [alert, setAlert] = useState<boolean>(false);
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
  const { VendorBranchData, venderaddressdata } = useAppSelector(
    (state) => state.divicemin
  );
  const { loading } = useAppSelector((state) => state.po);
  const { formData } = useAppSelector((state) => state.po);
  const { dispatchFromDetails, shippingAddress } = useAppSelector(
    (state) => state.client
  ) as any;
  const isEdit = window.location.href.includes("edit-po");
  const id = window.location.href.split("edit-po/")[1]?.replace(/_/g, "/") || "";

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
      vendor: null,
      vendorbranch: "",
      vendoraddress: "",
      gstin: "",
    },
  });

  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Form Details", "Add Component Details", "Review & Submit"];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    // Set form values from Redux state before going back
    if (formData) {
      Object.entries(formData).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    }
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
    dispatch(clearaddressdetail());
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // Validate required fields
    if (!data.vendorname) {
      showToast("Please select a vendor", "error");
      return;
    }
    if (!data.vendorbranch) {
      showToast("Please select a vendor branch", "error");
      return;
    }
    if (!data.billaddressid) {
      showToast("Please select a bill address", "error");
      return;
    }
    if (!data.shipaddressid) {
      showToast("Please select a shipping address", "error");
      return;
    }

    try {
      dispatch(setFormData(data as any));
      setActiveStep(1); // Directly set the step instead of using handleNext
    } catch (error) {
      console.error("Error submitting form:", error);
      showToast("Error submitting form", "error");
    }
  };
  const finalSubmit = () => {
    if (formData) {
      if (rowData.length === 0) {
        showToast("Please Add Material Details", "error");
      } else {
        if (!checkRequiredFields(rowData)) {
          const component = rowData.map(
            (item) => item.partComponent?.value || ""
          );
          const qty = rowData.map((item) => Number(item.qty));
          const rate = rowData.map((item) => Number(item.rate));
          const gsttype = rowData.map((item) => item.gstType);
          const gstrate = rowData.map((item) => Number(item.gstRate));
          const hsncode = rowData.map((item) => item.hsnCode);
          const remark = rowData.map((item) => item.remarks);
          const payload: any = {
            component,
            qty,
            rate,
            gsttype,
            gstrate,
            hsncode,
            remark,
            currency: formData.currency?.value || "",
            vendorname: formData.vendorname?.id || "",
            vendorbranch: formData.vendorbranch || "",
            vendoraddress: formData.vendoraddress || "",
            duedate: dayjs(formData.duedate).format("DD-MM-YYYY") || "",
            advancepayment: formData.advancepayment || "",
            billaddressid: formData.billaddressid || "",
            shipaddressid: formData.shipaddressid || "",
            billaddress:
              formData.billaddress?.addressLine1 +
                formData.billaddress?.addressLine2 || "",
            shipaddress:
              formData.shipaddress?.addressLine1 +
                formData.shipaddress?.addressLine2 || "",
            exchange: formData.exchange || "",
            doucmentDate: formData.doucmentDate || "",
          };
          dispatch(createPO(payload)).then((response: any) => {
            if (response.payload.data.success) {
              showToast(response.payload?.data?.message, "success");
              resetall();
              handleNext();
              dispatch(resetFormData());
              setMinno(response.payload?.data?.data.po_id);
            }
          });
        }
      }
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
      setValue("billaddressid", value.code);
      setValue("billaddress.label", value.label);
      setValue("billaddress.addressLine1", value.addressLine1);
      setValue("billaddress.addressLine2", value.addressLine2);
      setValue("billaddress.mobileNo", value.mobileNo);
      setValue("billaddress.gst", value.gst);
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
      setValue("shipaddress.city", value.city);
      setValue("shipaddress.gst", value.gst);
      setValue("shipaddress.pan", value.pan);
      setValue("shipaddress.pin", value.pin);
    }
  };
  const billLabel = watch("billaddress.label");
  const shipLabel = watch("shipaddress.label");

  useEffect(() => {
    if (isEdit) {
      dispatch(getPODetail({ id: id })).then((response: any) => {
        if (response.payload.success) {
          const { bill, ship, materials, header } = response.payload.data;
          console.log(bill, ship, materials, header);
          setValue("vendorname", header?.vendorcode?.value);
          dispatch(getVendorBranchAsync(header?.vendorcode?.value));
          setValue("vendorbranch", header?.vendorbranch?.value);
          dispatch(getVendorAddress(header?.vendorbranch?.value)).then(
            (response: any) => {
              if (response.payload.data.success) {
                setValue(
                  "vendoraddress",
                  replaceBrWithNewLine(response.payload.data?.data?.address) ||
                    ""
                );
                setValue("gstin", response.payload.data?.data?.gstid);
              }
            }
          );
          // setValue("duedate", header?.duedate || "");
          setValue("exchange", header?.exchangerate || "");
          setValue("currency", header?.currency?.value || "");
          setValue("billaddressid", bill?.addrbillid || "");
          handleBillAddressChange(bill?.addrbillid || "");
          setValue("shipaddressid", ship?.addrshipid || "");
          handleShipAddressChange(ship?.addrshipid || "");
          setRowData(materials.map((item: any ) => ({
            ...item,
            partComponent: { lable: item.component_short, value: item.componentKey },
            qty: item.orderqty,
            rate: item.rate,
            taxablevalue: item.taxablevalue,
            foreignvalue: item.exchangetaxablevalue===item.taxablevalue?0:item.exchangetaxablevalue,
            hsnCode: item.hsncode,
            gstType: item.gsttype?.id,
            gstRate: item.gstrate,
            cgst: Number(item.cgst),
            sgst: Number(item.sgst),
            igst: Number(item.igst),
            remarks: item.remark,
            currency: item.header?.currency?.value || "",
            isNew: true,
            excRate: item.header?.exchangerate || 1,
            uom: item.uom,
          })));
        }
      });
    }
  }, [isEdit]);

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
                      value={field.value as any}
                      onChange={(_, newValue) => field.onChange(newValue)}
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
              </div>
            </div>
          )}
          {activeStep === 1 && (
            <div className="h-[calc(100vh-200px)]   ">
              <AddPOTable
                rowData={rowData}
                setRowData={setRowData}
                setTotal={setTotal}
                exchange={formData?.exchange}
                currency={formData?.currency?.value}
              />
            </div>
          )}
          {activeStep === 2 && (
            <div className="h-[calc(100vh-200px)] flex items-center justify-center">
              <div className="flex flex-col justify-center gap-[10px]">
                <Success />
                <Typography variant="inherit" fontWeight={500}>
                  PO No. : {minNo}
                </Typography>
                <LoadingButton
                  onClick={() => setActiveStep(0)}
                  variant="contained"
                >
                  Create New PO
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
                  onClick={() => {
                    onSubmit(watch());
                  }}
                >
                  Next
                </LoadingButton>
              </>
            )}
            {activeStep === 1 && (
              <>
                <LoadingButton
                  disabled={loading}
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
                  disabled={loading}
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
                  loading={loading}
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
