import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import MaterialInvardUploadDocumentDrawer from "@/components/Drawers/wearhouse/MaterialInvardUploadDocumentDrawer";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  resetDocumentFile,
  resetFormData,
  storeFormdata,
} from "@/features/wearhouse/Rawmin/RawMinSlice";
import { getCurrency } from "@/features/common/commonSlice";
import {
  Autocomplete,
  Divider,
  FilledInput,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import Success from "@/components/reusable/Success";
import SelectClient, {
  LocationType,
} from "@/components/reusable/editor/SelectClient";
import { DeviceType } from "@/components/reusable/SelectSku";
import {
  CreateChallan,
  getClientBranch,
  getChallanById,
} from "@/features/Dispatch/DispatchSlice";
import {
  getClientAddressDetail,
  getDispatchFromDetail,
} from "@/features/master/client/clientSlice";
import { Dayjs } from "dayjs";
import { showToast } from "@/utils/toasterContext";
import { useParams } from "react-router-dom";

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
  otherRef: string;
  document: string;
  dispatchDate: Dayjs | null;
  gstRate: string;
  gstState: string;
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

const CreateChallanPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const isEditMode = Boolean(id);
  const [alert, setAlert] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);
  const [dispatchNo, setDispatchNo] = useState<string>("");

  const { createChallanLoading, clientBranchList } = useAppSelector(
    (state) => state.dispatch
  );

  const { addressDetail, dispatchFromDetails } = useAppSelector(
    (state) => state.client
  ) as any;

  const {
    register,
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
      gstRate: "",
      gstState: "",
    },
  });
  const formValues = watch();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Form Details", "Submit"];
  const formdata = new FormData();
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const resetall = () => {
    reset();
    dispatch(resetDocumentFile());
    formdata.delete("document");
  };

  const onSubmit: SubmitHandler<FormDataType> = (data) => {
    dispatch(storeFormdata(data));
  };

  const finalSubmit = () => {
    const data = formValues;

    // Client validations
    if (!data.clientDetail?.client) {
      showToast("Please select a client", "error");
      return;
    }
    if (!data.clientDetail?.branchId) {
      showToast("Please select a client branch", "error"); 
      return;
    }
    if (!data.clientDetail?.address1) {
      showToast("Client address 1 is required", "error");
      return;
    }
    if (!data.clientDetail?.address2) {
      showToast("Client address 2 is required", "error");
      return;
    }
    if (!data.clientDetail?.pincode) {
      showToast("Client pincode is required", "error");
      return;
    }

    // Ship to validations
    if (!data.shipToDetails?.shipTo) {
      showToast("Please select ship to details", "error");
      return;
    }
    if (!data.shipToDetails?.address1) {
      showToast("Ship to address 1 is required", "error");
      return;
    }
    if (!data.shipToDetails?.address2) {
      showToast("Ship to address 2 is required", "error");
      return;
    }
    if (!data.shipToDetails?.pincode) {
      showToast("Ship to pincode is required", "error");
      return;
    }
    if (!data.shipToDetails?.mobileNo) {
      showToast("Ship to mobile number is required", "error");
      return;
    }
    if (!data.shipToDetails?.city) {
      showToast("Ship to city is required", "error");
      return;
    }

    // Dispatch from validations
    if (!data.dispatchFromDetails?.dispatchFrom) {
      showToast("Please select dispatch from details", "error");
      return;
    }
    if (!data.dispatchFromDetails?.address1) {
      showToast("Dispatch from address 1 is required", "error");
      return;
    }
    if (!data.dispatchFromDetails?.address2) {
      showToast("Dispatch from address 2 is required", "error");
      return;
    }
    if (!data.dispatchFromDetails?.pin) {
      showToast("Dispatch from pin is required", "error");
      return;
    }
    if (!data.dispatchFromDetails?.mobileNo) {
      showToast("Dispatch from mobile number is required", "error");
      return;
    }
    if (!data.dispatchFromDetails?.gst) {
      showToast("Dispatch from GST is required", "error");
      return;
    }
    if (!data.dispatchFromDetails?.pan) {
      showToast("Dispatch from PAN is required", "error");
      return;
    }
    if (!data.dispatchFromDetails?.city) {
      showToast("Dispatch from city is required", "error");
      return;
    }

    // Other validations
    if (!data.qty || Number(data.qty) <= 0) {
      showToast("Please enter a valid quantity", "error");
      return;
    }
    if (!data.gstRate) {
      showToast("Please enter GST rate", "error");
      return;
    }
    if (!data.gstState) {
      showToast("Please select GST state", "error");
      return;
    }
    // if (formdata) {
    const payload: any = {
      otherRef: data.otherRef,
      dispatchQty: Number(data.qty),
      remark: data.remark,
      clientDetail: data.clientDetail
        ? {
            ...data.clientDetail,
            client: (data.clientDetail?.client as any)?.code,
          }
        : null,
      shipToDetails: data.shipToDetails || null,
      dispatchFromDetails: data.dispatchFromDetails || null,
      gstRate: data.gstRate,
      gstState: data.gstState === "Inter State" ? "inter" : "local",
    };
    dispatch(CreateChallan(payload)).then((res: any) => {
      console.log(res);
      if (res.payload.data.success) {
        setDispatchNo(res?.payload?.data?.data);
        showToast(res?.payload?.data?.message, "success");
        reset();
        handleNext();
        resetall();
      }
    });
  };

  useEffect(() => {
    dispatch(getCurrency());
    dispatch(getDispatchFromDetail());
  }, []);

  useEffect(() => {
    if (formValues.clientDetail?.client) {
      dispatch(getClientBranch((formValues.clientDetail.client as any).code));
    }
  }, [formValues.clientDetail?.client]);

  useEffect(() => {
    if (isEditMode && id) {
      const shipmentId = id.replace(/_/g, "/");
      dispatch(getChallanById({ challanId: shipmentId })).then((res: any) => {
        const data = res?.payload?.data?.data;
        console.log(data);
      });
    }
  }, [id, isEditMode, dispatch]);

  const handleClientBranchChange = (value: any) => {
    if (value) {
      setValue("clientDetail.branchId", value.addressID);
      setValue("clientDetail.address1", value.addressLine1); // Update addressLine1
      setValue("clientDetail.address2", value.addressLine2); // Update addressLine2
      setValue("clientDetail.pincode", value.pinCode); // Update pincode
      dispatch(getClientAddressDetail(value.addressID));
    }
  };
  const handleShipToChange = (value: any) => {
    if (value) {
      setValue("shipToDetails.shipTo", value.shipId);
      setValue("shipToDetails.address1", value.addressLine1); // Update addressLine1
      setValue("shipToDetails.address2", value.addressLine2); // Update addressLine2
      setValue("shipToDetails.pincode", value.pinCode); // Update pincode
      setValue("shipToDetails.mobileNo", value.phoneNo);
      setValue("shipToDetails.city", value.city);
    }
  };
  const handleDispatchFromChange = (value: any) => {
    if (value) {
      setValue("dispatchFromDetails.dispatchFrom", value.code);
      setValue("dispatchFromDetails.address1", value.addressLine1);
      setValue("dispatchFromDetails.address2", value.addressLine2);
      setValue("dispatchFromDetails.mobileNo", value.mobileNo);
      setValue("dispatchFromDetails.city", value.city);
      setValue("dispatchFromDetails.gst", value.gst);
      setValue("dispatchFromDetails.company", value.company);
      setValue("dispatchFromDetails.pan", value.pan);
      setValue("dispatchFromDetails.pin", value.pin);
    }
  };

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
                    Client Details
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
                  name="clientDetail.client"
                  rules={{
                    required: { value: true, message: "Client is required" },
                  }}
                  control={control}
                  render={({ field }) => (
                    <SelectClient
                      endPoint="/backend/client"
                      error={!!errors.clientDetail?.client}
                      helperText={errors.clientDetail?.client?.message}
                      size="medium"
                      label="Select Client"
                      varient="filled"
                      value={field.value as any}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="clientDetail.branchId"
                  rules={{
                    required: {
                      value: true,
                      message: "Client Branch is required",
                    },
                  }}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      value={
                        clientBranchList?.find(
                          (branch: any) => branch.addressID === field.value
                        ) || null
                      }
                      onChange={(_, newValue) =>
                        handleClientBranchChange(newValue)
                      }
                      disablePortal
                      id="combo-box-demo"
                      options={clientBranchList || []}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Client Branch"
                          error={!!errors.clientDetail?.branchId}
                          helperText={errors.clientDetail?.branchId?.message}
                          variant="filled"
                        />
                      )}
                    />
                  )}
                />

                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.clientDetail?.pincode}
                  // helperText={errors.clientDetail.pincode}
                  helperText={errors?.clientDetail?.pincode?.message}
                  focused={!!watch("clientDetail.pincode")}
                  // multiline
                  rows={3}
                  fullWidth
                  label="PinCode"
                  className="h-[10px] resize-none"
                  {...register("clientDetail.pincode", {
                    required: "PinCode is required",
                  })}
                />
                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.clientDetail?.address1}
                  helperText={errors?.clientDetail?.address1?.message}
                  focused={!!watch("clientDetail.address1")}
                  multiline
                  rows={3}
                  fullWidth
                  label="Address 1"
                  className="h-[100px] resize-none"
                  {...register("clientDetail.address1", {
                    required: "Address 1 is required",
                  })}
                />
                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.clientDetail?.address2}
                  helperText={errors?.clientDetail?.address2?.message}
                  focused={!!watch("clientDetail.address2")}
                  multiline
                  rows={3}
                  fullWidth
                  label="Address 2"
                  className="h-[100px] resize-none"
                  {...register("clientDetail.address2", {
                    required: "Address 2 is required",
                  })}
                />
              </div>
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.userAddress />
                  <h2 className="text-lg font-semibold">Ship To Details</h2>
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
                  name="shipToDetails.shipTo"
                  rules={{
                    required: {
                      value: true,
                      message: "Ship To Client Branch is required",
                    },
                  }}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      // value={field.value}
                      value={
                        addressDetail?.data?.shippingAddress?.find(
                          (address: any) => address.shipId === field.value
                        ) || null
                      }
                      onChange={(_, newValue) => handleShipToChange(newValue)}
                      disablePortal
                      id="combo-box-demo"
                      options={addressDetail?.data?.shippingAddress || []}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Client Branch"
                          error={!!errors.shipToDetails?.shipTo}
                          helperText={errors.shipToDetails?.shipTo?.message}
                          variant="filled"
                        />
                      )}
                    />
                  )}
                />

                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.shipToDetails?.pincode}
                  helperText={errors?.shipToDetails?.pincode?.message}
                  focused={!!watch("shipToDetails.pincode")}
                  // multiline
                  rows={3}
                  fullWidth
                  label="PinCode"
                  className="h-[10px] resize-none"
                  {...register("shipToDetails.pincode", {
                    required: "PinCode is required",
                  })}
                />
                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.shipToDetails?.mobileNo}
                  helperText={errors?.shipToDetails?.mobileNo?.message}
                  focused={!!watch("shipToDetails.mobileNo")}
                  // multiline
                  rows={3}
                  fullWidth
                  label="Mobile No"
                  className="h-[10px] resize-none"
                  {...register("shipToDetails.mobileNo", {
                    required: "Mobile No is required",
                  })}
                />

                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.shipToDetails?.city}
                  helperText={errors?.shipToDetails?.city?.message}
                  focused={!!watch("shipToDetails.city")}
                  rows={3}
                  fullWidth
                  label="City"
                  className="h-[100px] resize-none"
                  {...register("shipToDetails.city")}
                />

                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.shipToDetails?.address1}
                  helperText={errors?.shipToDetails?.address1?.message}
                  focused={!!watch("shipToDetails.address1")}
                  multiline
                  rows={3}
                  fullWidth
                  label="Ship To Address 1"
                  className="h-[100px] resize-none"
                  {...register("shipToDetails.address1", {
                    required: "Address 1 is required",
                  })}
                />
                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.shipToDetails?.address2}
                  helperText={errors?.shipToDetails?.address2?.message}
                  focused={!!watch("shipToDetails.address2")}
                  multiline
                  rows={3}
                  fullWidth
                  label="Ship To Addrests 2"
                  className="h-[100px] resize-none"
                  {...register("shipToDetails.address2", {
                    required: "Address 2 is required",
                  })}
                />
              </div>
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.shipping />
                  <h2 className="text-lg font-semibold">
                    Dispatch From Details
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
                  name="dispatchFromDetails.dispatchFrom"
                  rules={{
                    required: {
                      value: true,
                      message: "Ship To Client Branch is required",
                    },
                  }}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      // value={field.value}
                      value={
                        dispatchFromDetails?.find(
                          (address: any) => address.code === field.value
                        ) || null
                      }
                      onChange={(_, newValue) =>
                        handleDispatchFromChange(newValue)
                      }
                      disablePortal
                      id="combo-box-demo"
                      options={dispatchFromDetails || []}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Dispatch From"
                          error={!!errors.dispatchFromDetails?.dispatchFrom}
                          helperText={
                            errors.dispatchFromDetails?.dispatchFrom?.message
                          }
                          variant="filled"
                        />
                      )}
                    />
                  )}
                />

                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.dispatchFromDetails?.pin}
                  helperText={errors?.dispatchFromDetails?.pin?.message}
                  focused={!!watch("dispatchFromDetails.pin")}
                  // multiline
                  rows={3}
                  fullWidth
                  label="PinCode"
                  className="h-[10px] resize-none"
                  {...register("dispatchFromDetails.pin", {
                    required: "PinCode is required",
                  })}
                />

                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.dispatchFromDetails?.mobileNo}
                  helperText={errors?.dispatchFromDetails?.mobileNo?.message}
                  focused={!!watch("dispatchFromDetails.mobileNo")}
                  // multiline
                  rows={3}
                  fullWidth
                  label="Mobile No"
                  className="h-[10px] resize-none"
                  {...register("dispatchFromDetails.mobileNo", {
                    required: "Mobile No is required",
                  })}
                />
                <TextField
                  variant="filled"
                  // sx={{ mb: 1 }}
                  error={!!errors.dispatchFromDetails?.gst}
                  helperText={errors?.dispatchFromDetails?.gst?.message}
                  focused={!!watch("dispatchFromDetails.gst")}
                  // multiline
                  rows={3}
                  fullWidth
                  label="GST"
                  className="h-[10px] resize-none"
                  {...register("dispatchFromDetails.gst", {
                    required: "GST is required",
                  })}
                />
                <TextField
                  variant="filled"
                  // sx={{ mb: 1 }}
                  error={!!errors.dispatchFromDetails?.pan}
                  helperText={errors?.dispatchFromDetails?.pan?.message}
                  focused={!!watch("dispatchFromDetails.pan")}
                  // multiline
                  rows={3}
                  fullWidth
                  label="PAN"
                  className="h-[10px] resize-none"
                  {...register("dispatchFromDetails.pan", {
                    required: "PAN is required",
                  })}
                />
                <TextField
                  variant="filled"
                  // sx={{ mb: 1 }}
                  error={!!errors.dispatchFromDetails?.city}
                  helperText={errors?.dispatchFromDetails?.city?.message}
                  focused={!!watch("dispatchFromDetails.city")}
                  rows={3}
                  fullWidth
                  label="City"
                  className="h-[60px] resize-none"
                  {...register("dispatchFromDetails.city")}
                />

                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.dispatchFromDetails?.address1}
                  helperText={errors?.dispatchFromDetails?.address1?.message}
                  focused={!!watch("dispatchFromDetails.address1")}
                  multiline
                  rows={3}
                  fullWidth
                  label="Dispatch From Address 1"
                  className="h-[100px] resize-none"
                  {...register("dispatchFromDetails.address1", {
                    required: "Address 1 is required",
                  })}
                />
                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.dispatchFromDetails?.address2}
                  helperText={errors?.dispatchFromDetails?.address2?.message}
                  focused={!!watch("dispatchFromDetails.address2")}
                  multiline
                  rows={3}
                  fullWidth
                  label="Dispatch From Addrests 2"
                  className="h-[100px] resize-none"
                  {...register("dispatchFromDetails.address2", {
                    required: "Address 2 is required",
                  })}
                />
              </div>
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.files />
                  <h2 className="text-lg font-semibold">
                    Dispatch Details and Attachments
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
                  name="qty"
                  control={control}
                  rules={{
                    required: { value: true, message: "Quantity is required" },
                    min: {
                      value: 1,
                      message: "Quantity must be greater than 0",
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Quantity must be a number",
                    },
                  }}
                  render={({ field }) => (
                    <FormControl
                      error={!!errors.qty}
                      fullWidth
                      variant="filled"
                    >
                      <InputLabel htmlFor="qty">Dispatch Quantity</InputLabel>
                      <FilledInput
                        {...field}
                        error={!!errors.qty}
                        id="qty"
                        type="number"
                        endAdornment={
                          <InputAdornment position="end">NOS</InputAdornment>
                        }
                      />
                      {errors.qty && (
                        <FormHelperText>{errors.qty.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                <Controller
                  name="gstState"
                  rules={{
                    required: {
                      value: true,
                      message: "GST State is required",
                    },
                  }}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      value={field.value}
                      onChange={(_, newValue) => field.onChange(newValue)}
                      disablePortal
                      id="combo-box-demo"
                      options={["Inter State", "Intra State"]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="GST State"
                          error={!!errors.gstState}
                          helperText={errors.gstState?.message}
                          variant="filled"
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="otherRef"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Other Reference is required",
                    },
                  }}
                  render={({ field }) => (
                    <FormControl
                      error={!!errors.otherRef}
                      fullWidth
                      variant="filled"
                    >
                      <InputLabel htmlFor="otherRef">
                        Other Reference
                      </InputLabel>
                      <FilledInput
                        {...field}
                        error={!!errors.otherRef}
                        id="otherRef"
                        type="text"
                      />
                      {errors.otherRef && (
                        <FormHelperText>
                          {errors.otherRef.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>
              <div className="grid grid-cols-2">
                <Controller
                  name="gstRate"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "GST Rate is required",
                    },
                  }}
                  render={({ field }) => (
                    <FormControl
                      error={!!errors.otherRef}
                      fullWidth
                      variant="filled"
                    >
                      <InputLabel htmlFor="gstRate">GST Rate</InputLabel>
                      <FilledInput
                        {...field}
                        error={!!errors.gstRate}
                        id="gstRate"
                        type="text"
                      />
                      {errors.gstRate && (
                        <FormHelperText>
                          {errors.gstRate.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                <div className="pl-10">
                  <FormControl fullWidth variant="filled">
                    <InputLabel htmlFor="remark">Remarks</InputLabel>
                    <FilledInput
                      {...register("remark")}
                      id="remark"
                      multiline
                      rows={5}
                    />
                  </FormControl>
                </div>
              </div>
            </div>
          )}
          {activeStep === 1 && (
            <div className="h-[calc(100vh-200px)] flex items-center justify-center">
              <div className="flex flex-col justify-center gap-[10px]">
                <Success />
                <Typography variant="inherit" fontWeight={500}>
                  Challan Number - {dispatchNo ?? ""}
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
                  loading={createChallanLoading}
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

export default CreateChallanPage;
