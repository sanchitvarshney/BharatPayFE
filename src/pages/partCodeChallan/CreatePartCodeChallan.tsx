import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import MaterialInvardUploadDocumentDrawer from "@/components/Drawers/wearhouse/MaterialInvardUploadDocumentDrawer";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { clearaddressdetail, getLocationAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import {
  resetDocumentFile,
  resetFormData,
} from "@/features/wearhouse/Rawmin/RawMinSlice";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import {
  Autocomplete,
  Divider,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import { showToast } from "@/utils/toasterContext";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import { Button } from "@/components/ui/button";
import Success from "@/components/reusable/Success";
import { getShippingAddress } from "@/features/master/client/clientSlice";
import AddPOTable from "./AddPartCodeTable";
import {
  createPartCodeChallan,
  getPartCodeChallanDetail,
  setFormData,
  updatePartCodeChallan,
} from "@/features/procurement/poSlices";
import { useNavigate, useParams } from "react-router-dom";
import FullPageLoading from "@/components/shared/FullPageLoading";
import SelectLocationAcordingModule, {
  LocationType,
} from "@/components/reusable/SelectLocationAcordingModule";

interface RowData {
  id: string;
  partComponent: { lable: string; value: string } | null;
  qty: number;
  rate: string;
  remarks: string;
  isNew?: boolean;
  excRate: number;
  uom: string;
  currency?: string;
  updaterow?: string;
}

interface Totals {
  totalAmount?: number;
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
interface FormData {
  location: string;
  pickLocation: LocationType | null;
  dropLocation: LocationType | null;
  billaddressid: 0;
  billaddress: BillAddress;
  shipaddressid: 0;
  shipaddress: ShippingAddress;
  deliveryNoteNo: string;
  referenceNoAndDate: string;
  otherReferences: string;
  buyerOrderNo: string;
  dispatchDocNo: string;
  dispatchedThrough: string;
  destination: string;
  termsOfDelivery: string;
  remarks: string;
}
const CreatePartCodeChallan: React.FC = () => {
  const navigate = useNavigate();
  const { id: routeId } = useParams<{ id?: string }>();
  const isEdit = Boolean(routeId);
  const id = routeId || "";
  const [alert, setAlert] = useState<boolean>(false);
  const [isNext, setIsNext] = useState<boolean>(true);
  const [minNo, setMinno] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [total, setTotal] = useState<Totals>({ totalAmount: 0 });
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.po);
  const { formData } = useAppSelector((state) => state.po);
  const { shippingAddress } = useAppSelector((state) => state.client) as any;

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
      pickLocation: null,
      dropLocation: null,
      deliveryNoteNo: "",
      referenceNoAndDate: "",
      otherReferences: "",
      buyerOrderNo: "",
      dispatchDocNo: "",
      dispatchedThrough: "",
      destination: "",
      termsOfDelivery: "",
      remarks: "",
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
    setTotal({ totalAmount: 0 });
    reset();
    dispatch(resetDocumentFile());
    dispatch(clearaddressdetail());
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (!data.billaddressid) {
      showToast("Please select a Bill To address", "error");
      return;
    }
    if (!data.shipaddressid) {
      showToast("Please select a Ship To address", "error");
      return;
    }
    if (!data.pickLocation) {
      showToast("Please select a Pick Location", "error");
      return;
    }
    if (!data.dropLocation) {
      showToast("Please select a Drop Location", "error");
      return;
    }
    try {
      dispatch(setFormData(data as any));
      setActiveStep(1);
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
          const remark = rowData.map((item) => item.remarks ?? "");

          const billingDetails = formData.billaddress
            ? {
                id: formData.billaddressid || formData.billaddress?.id,
                label: formData.billaddress?.label ?? "",
                mobileNo: formData.billaddress?.mobileNo ?? "",
                gst: formData.billaddress?.gst ?? "",
                pin: formData.billaddress?.pin ?? "",
                pan: formData.billaddress?.pan ?? "",
                addressLine1: formData.billaddress?.addressLine1 ?? "",
                addressLine2: formData.billaddress?.addressLine2 ?? "",
              }
            : {};

          const shippingDetails = formData.shipaddress
            ? {
                id: formData.shipaddressid || formData.shipaddress?.id,
                label: formData.shipaddress?.label ?? "",
                pin: formData.shipaddress?.pin ?? "",
                gst: formData.shipaddress?.gst ?? "",
                pan: formData.shipaddress?.pan ?? "",
                city: formData.shipaddress?.city ?? "",
                addressLine1: formData.shipaddress?.addressLine1 ?? "",
                addressLine2: formData.shipaddress?.addressLine2 ?? "",
              }
            : {};

          const payload: any = {
            component,
            qty,
            rate,
            remark,
            pickLocation: formData.pickLocation?.code ?? formData.pickLocation?.sku ?? "",
            dropLocation: formData.dropLocation?.code ?? formData.dropLocation?.sku ?? "",
            billingDetails,
            shippingDetails,
            deliveryNoteNo: formData.deliveryNoteNo || watch("deliveryNoteNo") || "",
            referenceNoAndDate: formData.referenceNoAndDate || watch("referenceNoAndDate") || "",
            otherReferences: formData.otherReferences || watch("otherReferences") || "",
            buyerOrderNo: formData.buyerOrderNo || watch("buyerOrderNo") || "",
            dispatchDocNo: formData.dispatchDocNo || watch("dispatchDocNo") || "",
            dispatchedThrough: formData.dispatchedThrough || watch("dispatchedThrough") || "",
            destination: formData.destination || watch("destination") || "",
            termsOfDelivery:
              watch("termsOfDelivery") || formData.termsOfDelivery || "",
            updaterow: rowData.map((item) => item.updaterow),
            challanId: id,
            remarks: watch("remarks") || formData.remarks || "",
          };
          if (isEdit) {
            dispatch(updatePartCodeChallan(payload)).then((response: any) => {
              if (response.payload?.data?.success) {
                showToast(response.payload?.data?.message, "success");
                resetall();
                handleNext();
                dispatch(resetFormData());
                navigate("/manage-challan");
              }
            });
          } else {
            dispatch(createPartCodeChallan(payload)).then((response: any) => {
              if (response.payload?.data?.success) {
                showToast(response.payload?.data?.message, "success");
                resetall();
                handleNext();
                dispatch(resetFormData());
                setMinno(response.payload?.data?.data?.challanId || response.payload?.data?.data?.id || "");
              }
            });
          }
        }
      }
    }
  };
  useEffect(() => {
    dispatch(getLocationAsync(null));
    dispatch(getPertCodesync(null));
    dispatch(getShippingAddress());
  }, []);

  const handleBillAddressChange = (value: any) => {
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
  const shippingList = Array.isArray(shippingAddress) ? shippingAddress : (shippingAddress?.data ?? []);
  const isKortek = (addr: any) => addr?.label?.toLowerCase().includes("kortek");
  const billSelected = shippingList.find((a: any) => a.code === watch("billaddressid"));
  const shipSelected = shippingList.find((a: any) => a.code === watch("shipaddressid"));
  const billToOptions = shippingList.filter((addr: any) => {
    if (shipSelected && isKortek(shipSelected) && isKortek(addr)) return false;
    return true;
  });
  const shipToOptions = shippingList.filter((addr: any) => {
    if (billSelected && isKortek(billSelected) && isKortek(addr)) return false;
    return true;
  });
  useEffect(() => {
    if (isEdit && id) {
      dispatch(getPartCodeChallanDetail({ id })).then((response: any) => {
        const res = response.payload?.data;
        if (res?.success && res?.data) {
          const { bill, ship, materials, header } = res.data;

          setValue("billaddressid", bill?.code || "");
          handleBillAddressChange(bill || "");
          setValue("shipaddressid", ship?.code || "");
          handleShipAddressChange(ship || "");
          setValue("deliveryNoteNo", header?.deliveryNoteNo || "");
          setValue("referenceNoAndDate", header?.referenceNoAndDate || "");
          setValue("otherReferences", header?.otherReferences || "");
          setValue("buyerOrderNo", header?.buyerOrderNo || "");
          setValue("dispatchDocNo", header?.dispatchDocNo || "");
          setValue("dispatchedThrough", header?.dispatchedThrough || "");
          setValue("destination", header?.destination || "");
          setValue("termsOfDelivery", header?.termsOfDelivery || header?.termsofcondition || "");
          setValue("remarks", header?.remarks || header?.poRemarks || "");
          if (header?.pickLocation) setValue("pickLocation", header.pickLocation);
          if (header?.dropLocation) setValue("dropLocation", header.dropLocation);

          dispatch(
            setFormData({
              ...formData,
              termsOfDelivery: header?.termsOfDelivery || "",
            })
          );

          if (!materials?.length) return;
          setRowData(
            materials.map((item: any, index: number) => ({
              id: item.id || item.updateid || `edit-row-${index}`,
              partComponent: {
                lable: item.component_short,
                value: item.componentKey,
              },
              qty: Number(item.orderqty) || 0,
              updaterow: item.updateid,
              rate: Number(item.rate) || 0,
              remarks: item.remark ?? "",
              isNew: true,
              excRate: 1,
              uom: item.uom ?? "",
            }))
          );
          const totalAmount = materials.reduce(
            (acc: number, item: any) =>
              acc + (Number(item.orderqty) || 0) * (Number(item.rate) || 0),
            0
          );
          setTotal({ totalAmount });
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
        {loading && <FullPageLoading />}
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
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.shipping />
                  <h2 className="text-lg font-semibold">Bill To</h2>
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
                      message: "Bill To address is required",
                    },
                  }}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      value={
                        shippingList.find(
                          (address: any) => address.code === field.value
                        ) || null
                      }
                      onChange={(_, newValue) =>
                        handleBillAddressChange(newValue)
                      }
                      disablePortal
                      id="combo-box-billto"
                      options={billToOptions}
                      getOptionLabel={(option: any) => option?.label ?? ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={(billLabel || "Bill To") as any}
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
                  <h2 className="text-lg font-semibold">Ship To</h2>
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
                      message: "Ship To address is required",
                    },
                  }}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      value={
                        shippingList.find(
                          (address: any) => address.code === field.value
                        ) || null
                      }
                      onChange={(_, newValue) =>
                        handleShipAddressChange(newValue)
                      }
                      disablePortal
                      id="combo-box-shipto"
                      options={shipToOptions}
                      getOptionLabel={(option: any) => option?.label ?? ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={(shipLabel || "Ship To") as any}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px] py-[20px]">
                <Controller
                  name="pickLocation"
                  control={control}
                  rules={{ required: "Pick Location is required" }}
                  render={({ field }) => (
                    <SelectLocationAcordingModule
                      endPoint="/req/without-bom/pick-location"
                      label="Pick Location"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.pickLocation}
                      helperText={errors.pickLocation?.message}
                      varient="filled"
                      required
                    />
                  )}
                />
                <Controller
                  name="dropLocation"
                  control={control}
                  rules={{ required: "Drop Location is required" }}
                  render={({ field }) => (
                    <SelectLocationAcordingModule
                      endPoint="/req/without-bom/req-location"
                      label="Drop Location"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.dropLocation}
                      helperText={errors.dropLocation?.message}
                      varient="filled"
                      required
                    />
                  )}
                />
                <TextField
                  variant="filled"
                  fullWidth
                  label="Delivery Note No."
                  {...register("deliveryNoteNo")}
                />
                <TextField
                  variant="filled"
                  fullWidth
                  label="Reference No. & Date."
                  {...register("referenceNoAndDate")}
                />
                <TextField
                  variant="filled"
                  fullWidth
                  label="Other References"
                  {...register("otherReferences")}
                />
                <TextField
                  variant="filled"
                  fullWidth
                  label="Buyer's Order No."
                  {...register("buyerOrderNo")}
                />
                <TextField
                  variant="filled"
                  fullWidth
                  label="Dispatch Doc No."
                  {...register("dispatchDocNo")}
                />
                <TextField
                  variant="filled"
                  fullWidth
                  label="Dispatched through"
                  {...register("dispatchedThrough")}
                />
                <TextField
                  variant="filled"
                  fullWidth
                  label="Destination"
                  {...register("destination")}
                />
                <TextField
                  variant="filled"
                  fullWidth
                  label="Terms of Delivery"
                  {...register("termsOfDelivery")}
                />
              </div>
              <TextField
                variant="filled"
                sx={{ mb: 1 }}
                error={!!errors.remarks}
                helperText={errors?.remarks?.message}
                focused={!!watch("remarks")}
                multiline
                rows={3}
                fullWidth
                label="Remarks"
                className="h-[100px] resize-none"
                {...register("remarks")}
              />
            </div>
          )}
          {activeStep === 1 && (
            <div className="h-[calc(100vh-200px)]   ">
              <AddPOTable
                rowData={rowData}
                setRowData={setRowData}
                setTotal={setTotal}
                exchange={0}
                currency=""
                pickLocation={formData?.pickLocation ?? null}
              />
            </div>
          )}
          {activeStep === 2 && (
            <div className="h-[calc(100vh-200px)] flex items-center justify-center">
              <div className="flex flex-col justify-center gap-[10px]">
                <Success />
                <Typography variant="inherit" fontWeight={500}>
                  Challan No. : {minNo}
                </Typography>
                <LoadingButton
                  onClick={() => setActiveStep(0)}
                  variant="contained"
                >
                  Create New Challan
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
                    Total
                  </Typography>
                </div>
                <Card className="border-0 rounded-none shadow-none">
                  <CardContent className="flex flex-col gap-[20px] pt-[20px]">
                    <div className="flex justify-between">
                      <p className="text-slate-600 font-[500]">Total</p>
                      <p className="text-[14px] text-muted-foreground">
                        {(total.totalAmount ?? 0).toFixed(2)}
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
                    setIsNext(false);
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

export default CreatePartCodeChallan;
