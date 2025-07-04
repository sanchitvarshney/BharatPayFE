import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { clearaddressdetail } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import {
  resetDocumentFile,
  storeFormdata,
} from "@/features/wearhouse/Rawmin/RawMinSlice";
import {
  Autocomplete,
  Divider,
  FilledInput,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import SelectClient, {
  LocationType,
} from "@/components/reusable/editor/SelectClient";
import { DeviceType } from "@/components/reusable/SelectSku";
import {
  getClientBranch,
  getChallanById,
  UpdateChallan,
} from "@/features/Dispatch/DispatchSlice";
import {
  getClientAddressDetail,
  getDispatchFromDetail,
} from "@/features/master/client/clientSlice";
import { showToast } from "@/utils/toasterContext";
import { useNavigate, useParams } from "react-router-dom";
import FullPageLoading from "@/components/shared/FullPageLoading";

type FormDataType = {
  clientDetail: {
    client: { code: string; text: string } | null;
    branchId: string;
    address1: string;
    address2: string;
    pincode: string;
  } | null;
  shipToDetails: {
    shipTo: string;
    shipLabel: string;
    address1: string;
    address2: string;
    pincode: string;
    mobileNo: string;
    city: string;
  } | null;
  dispatchFromDetails: {
    dispatchFrom: string;
    dispatchLabel: string;
    address1: string;
    address2: string;
    pin: string;
    mobileNo: string;
    gst: string;
    pan: string;
    city: string;
  } | null;
  invoice: string;
  qty: string;
  document: string;
  location: LocationType | null;
  remark: string;
  file: File[] | null;
  sku: DeviceType | null;
  gstRate: string;
  gstState: string;
  otherRef: string;
  hsnCode: string;
  materialName: string;
  itemPrice: string;
  deviceType?: string;
};

const UpdateChallanPage: React.FC = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [clientDetails, setClientDetails] = useState<any>(null);

  const { clientBranchList, getChallanLoading, updateChallanLoading } =
    useAppSelector((state) => state.dispatch);

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
      itemPrice: "",
      deviceType: "",
    },
  });
  const formValues = watch();
  const formdata = new FormData();

  const resetall = () => {
    reset();
    dispatch(resetDocumentFile());
    dispatch(clearaddressdetail());
    formdata.delete("document");
  };

  const onSubmit: SubmitHandler<FormDataType> = (data) => {
    dispatch(storeFormdata(data));
    // handleNext();
  };

  const finalSubmit = () => {
    const data = formValues;
    if (!data.clientDetail?.client) {
      showToast("Please select a client", "error");
      return;
    }
    if (!data.clientDetail?.branchId) {
      showToast("Please select a client branch", "error");
      return;
    }
    if (!data.shipToDetails?.shipTo) {
      showToast("Please select ship to details", "error");
      return;
    }
    if (!data.dispatchFromDetails?.dispatchFrom) {
      showToast("Please select dispatch from details", "error");
      return;
    }
    if (!data.qty) {
      showToast("Please enter quantity", "error");
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
      challanId: id?.replace(/_/g, "/"),
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
      hsnCode: data.hsnCode,
      materialName: data.materialName,
      itemPrice: data.itemPrice,
      deviceType: data.deviceType,
    };
    dispatch(UpdateChallan(payload)).then((res: any) => {
      if (res.payload.data.success) {
        showToast(res?.payload?.data?.message, "success");
        reset();
        resetall();
        navigate("/manage-challan");
      }
    });
  };

  useEffect(() => {
    dispatch(getDispatchFromDetail());
  }, []);

  useEffect(() => {
    if (formValues.clientDetail?.client) {
      dispatch(
        getClientBranch(
          (formValues.clientDetail.client as any).code ??
            formValues.clientDetail.client
        )
      );
    }
  }, [formValues.clientDetail?.client]);

  useEffect(() => {
    if (isEditMode && id) {
      const shipmentId = id.replace(/_/g, "/");
      dispatch(getChallanById({ challanId: shipmentId })).then((res: any) => {
        const data = res?.payload?.data?.data[0];
        if (data) {
          // Set basic fields
          setValue("otherRef", data?.otherRef);
          setValue("qty", data?.dispatchQty);
          setValue("remark", data?.remark);
          setValue("gstRate", data?.gstrate);

          // Set client details
          setValue("clientDetail", {
            client: {
              code: data?.clientDetail?.clientKey,
              text: data?.clientDetail?.name,
            },
            branchId: data?.clientDetail?.branchKey,

            address1: data?.clientDetail?.address1,
            address2: data?.clientDetail?.address2,
            pincode: data?.clientDetail?.pincode,
          });
          setClientDetails(data?.clientDetail);
          dispatch(getClientAddressDetail(data?.clientDetail?.branchKey));
          // Set ship to details
          setValue("shipToDetails", {
            shipTo: data?.shipToDetails?.shipToKey,
            shipLabel: data?.shipToDetails?.shipLabel,
            address1: data?.shipToDetails?.address1,
            address2: data?.shipToDetails?.address2,
            pincode: data?.shipToDetails?.pincode,
            mobileNo: data?.shipToDetails?.mobileNo,
            city: data?.shipToDetails?.city,
          });
          // Set dispatch from details
          setValue("dispatchFromDetails", {
            dispatchFrom: data?.dispatchFromDetails?.dispatchFromKey,
            dispatchLabel: data?.dispatchFromDetails?.dispatchFromLabel,
            address1: data?.dispatchFromDetails?.address1,
            address2: data?.dispatchFromDetails?.address2,
            pin: data?.dispatchFromDetails?.pin,
            mobileNo: data?.dispatchFromDetails?.mobileNo,
            gst: data?.dispatchFromDetails?.gst,
            pan: data?.dispatchFromDetails?.pan,
            city: data?.dispatchFromDetails?.city,
          });

          // Set GST state
          setValue(
            "gstState",
            data?.gsttype === "inter" ? "Inter State" : "Intra State"
          );
          setValue("hsnCode", data?.hsnCode);
          setValue("materialName", data?.materialName);
          setValue("itemPrice", data?.itemRate);
          setValue(
            "deviceType",
            data?.deviceType === "swipedevice"
              ? "swipeMachine"
              : data?.deviceType === "wrongDevices"
              ? "wrongDevices"
              : "soundBox"
          );
        }
      });
    }
  }, [id, isEditMode, dispatch, setValue]);

  const handleClientBranchChange = (value: any) => {
    if (value) {
      setValue("clientDetail.branchId", value.addressID);
      setValue("clientDetail.address1", value.addressLine1); // Update addressLine1
      setValue("clientDetail.address2", value.addressLine2); // Update addressLine2
      setValue("clientDetail.pincode", value.pinCode); // Update pincode
      dispatch(getClientAddressDetail(value.addressID));
      setClientDetails(value);
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
      setValue("dispatchFromDetails.pan", value.pan);
      setValue("dispatchFromDetails.pin", value.pin);
    }
  };

  return (
    <>
      {getChallanLoading && <FullPageLoading />}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white h-full flex flex-col"
      >
        <div className="flex-1 overflow-y-auto">
          <div className="py-[20px] sm:px-[10px] md:px-[30px] lg:px-[50px] flex flex-col gap-[20px]">
            <div
              id="primary-item-details"
              className="flex items-center w-full gap-3"
            >
              <div className="flex items-center gap-[5px]">
                <Icons.user />
                <h2 id="primary-item-details" className="text-lg font-semibold">
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
                    label={clientDetails?.name || "Select Client"}
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
                        label={"Ship To"}
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
                label="Ship To Address 2"
                className="h-[100px] resize-none"
                {...register("shipToDetails.address2", {
                  required: "Address 2 is required",
                })}
              />
            </div>
            <div className="flex items-center w-full gap-3">
              <div className="flex items-center gap-[5px]">
                <Icons.shipping />
                <h2 className="text-lg font-semibold">Dispatch From Details</h2>
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
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Dispatch From is required",
                  },
                }}
                render={({ field }) => (
                  <Autocomplete
                    value={
                      dispatchFromDetails?.find(
                        (branch: any) => branch.code === field.value
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
                        label={"Dispatch From"}
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
                className="h-[50px] resize-none"
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
                label="Dispatch From Address 2"
                className="h-[100px] resize-none"
                {...register("dispatchFromDetails.address2", {
                  required: "Address 2 is required",
                })}
              />
            </div>
            <div className="flex items-center w-full gap-3">
              <div className="flex items-center gap-[5px]">
                <Icons.info />
                <h2 className="text-lg font-semibold">Device Details</h2>
              </div>
              <Divider
                sx={{
                  borderBottomWidth: 2,
                  borderColor: "#f59e0b",
                  flexGrow: 1,
                }}
              />
            </div>
            <div>
              {" "}
              <Controller
                name="deviceType"
                control={control}
                rules={{
                  required: { value: true, message: "Device Type is required" },
                }}
                render={({ field }) => (
                  <FormControl
                    error={!!errors.deviceType}
                    fullWidth
                    variant="filled"
                  >
                    <InputLabel shrink>Device Type</InputLabel>
                    <div style={{ padding: "16px 0" }}>
                      <label style={{ marginRight: 24,gap: "8px",}}>
                        <input
                          type="radio"
                          value="soundBox"
                          checked={field.value === "soundBox"}
                          onChange={() => field.onChange("soundBox")}
                        />
                        Sound Box
                      </label>
                      <label style={{ marginRight: 24 }}>
                        <input
                          type="radio"
                          value="swipeMachine"
                          checked={field.value === "swipeMachine"}
                          onChange={() => field.onChange("swipeMachine")}
                        />
                        Swipe Machine
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="wrongDevices"
                          checked={field.value === "wrongDevices"}
                          onChange={() => field.onChange("wrongDevices")}
                        />
                        Wrong Device
                      </label>
                    </div>
                    {errors.deviceType && (
                      <FormHelperText>
                        {errors.deviceType.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
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
                  <FormControl error={!!errors.qty} fullWidth variant="filled">
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
                name="itemPrice"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Item Price is required",
                  },
                }}
                render={({ field }) => (
                  <FormControl
                    error={!!errors.itemPrice}
                    fullWidth
                    variant="filled"
                  >
                    <InputLabel htmlFor="itemPrice" shrink={!!field.value}>
                      Rate
                    </InputLabel>
                    <FilledInput
                      {...field}
                      error={!!errors.itemPrice}
                      id="itemPrice"
                      type="text"
                    />
                    {errors.itemPrice && (
                      <FormHelperText>
                        {errors.itemPrice.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name="gstState"
                rules={{
                  required: {
                    value: true,
                    message: "GST Type is required",
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
                        label="GST Type"
                        error={!!errors.gstState}
                        helperText={errors.gstState?.message}
                        variant="filled"
                      />
                    )}
                  />
                )}
              />

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
                      <FormHelperText>{errors.gstRate.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name="hsnCode"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "HSN Code is required",
                  },
                }}
                render={({ field }) => (
                  <FormControl
                    error={!!errors.hsnCode}
                    fullWidth
                    variant="filled"
                  >
                    <InputLabel htmlFor="hsnCode" shrink={!!field.value}>
                      HSN Code
                    </InputLabel>
                    <FilledInput
                      {...field}
                      error={!!errors.hsnCode}
                      id="hsnCode"
                      type="text"
                    />
                    {errors.hsnCode && (
                      <FormHelperText>{errors.hsnCode.message}</FormHelperText>
                    )}
                  </FormControl>
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
                    <InputLabel htmlFor="otherRef" shrink={!!field.value}>
                      Other Reference
                    </InputLabel>
                    <FilledInput
                      {...field}
                      error={!!errors.otherRef}
                      id="otherRef"
                      type="text"
                    />
                    {errors.otherRef && (
                      <FormHelperText>{errors.otherRef.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
             
            </div>
            <div className="grid grid-cols-2 gap-[30px] pt-[30px]">
              <FormControl fullWidth variant="filled">
                <InputLabel
                  htmlFor="materialName"
                  shrink={!!register("materialName")}
                >
                  Material Name
                </InputLabel>
                <FilledInput
                  {...register("materialName")}
                  id="materialName"
                  multiline
                  rows={2}
                />
              </FormControl>
              <FormControl fullWidth variant="filled">
                <InputLabel htmlFor="remark" shrink={!!register("remark")}>
                  Remarks
                </InputLabel>
                <FilledInput
                  {...register("remark")}
                  id="remark"
                  multiline
                  rows={2}
                />
              </FormControl>
            </div>
          </div>
        </div>

        <div className="h-[55px] border-t border-neutral-300 flex items-center justify-end px-[20px] bg-white gap-[10px] sticky bottom-0 z-10">
          <LoadingButton
            loading={updateChallanLoading}
            loadingPosition="start"
            variant="contained"
            startIcon={<Icons.save />}
            onClick={() => {
              finalSubmit();
            }}
            sx={{
              minWidth: "120px",
              height: "40px",
            }}
          >
            Update
          </LoadingButton>
        </div>
      </form>
    </>
  );
};

export default UpdateChallanPage;
