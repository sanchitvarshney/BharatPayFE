import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import MaterialInvardUploadDocumentDrawer from "@/components/Drawers/wearhouse/MaterialInvardUploadDocumentDrawer";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  clearaddressdetail,
  getLocationAsync,
  getVendorAsync,
} from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import {
  resetDocumentFile,
  resetFormData,
  storeFormdata,
} from "@/features/wearhouse/Rawmin/RawMinSlice";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { getCurrency } from "@/features/common/commonSlice";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  FilledInput,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  ListItem,
  ListItemText,
  Radio,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import FileUploader from "@/components/reusable/FileUploader";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import { showToast } from "@/utils/toasterContext";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import Success from "@/components/reusable/Success";
import SelectClient, {
  LocationType,
} from "@/components/reusable/editor/SelectClient";
import SelectDevice, { DeviceType } from "@/components/reusable/SelectSku";
import {
  CreateDispatch,
  CreateSwipeDispatch,
  getAllBranch,
  getClientBranch,
  uploadFile,
} from "@/features/Dispatch/DispatchSlice";
import SelectLocationAcordingModule from "@/components/reusable/SelectLocationAcordingModule";
import { getDeviceDetails } from "@/features/production/Batteryqc/BatteryQcSlice";
import ImeiTable from "@/table/dispatch/ImeiTable";
import {
  getClientAddressDetail,
  getDispatchFromDetail,
} from "@/features/master/client/clientSlice";
import { DispatchItemPayload } from "@/features/Dispatch/DispatchType";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CostCenterType } from "@/components/reusable/SelectCostCenter";
import SelectDeviceWithType from "@/components/reusable/SelectDeviceWithType";
import SelectBranch from "@/components/reusable/SelectBranch";
import axiosInstance from "@/api/axiosInstance";
type RowData = {
  imei: string;
  srno: string;
  productKey: string;
  serialNo: number;
  modalNo: string;
  deviceSku: string;
  imei2?: string;
};

type FormData = {
  product: DeviceType | null;
  toLocation: any;
  fromLocation: any;
  fromBranch: any;
  toBranch: any;
  quantity: number;
  remark: string;
  cc: CostCenterType | null;
  type: string;
  branchType: string;
  fromLocationAddress: string;
  toLocationAddress: string;
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
  const [filename, setFilename] = useState<string>("");
  const [alert, setAlert] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [imei, setImei] = React.useState<string>("");
  const [dispatchNo, setDispatchNo] = useState<string>("");
  const [fromLocationList, setFromLocationList] = useState<any[]>([]);
  const [toLocationList, setToLocationList] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const { deviceDetailLoading } = useAppSelector(
    (state) => state.batteryQcReducer
  );
  const [isMultiple, setIsMultiple] = useState<boolean>(true); // Default is multiple IMEIs
  const {
    dispatchCreateLoading,
    uploadFileLoading,
    clientBranchList,
    branchList,
  } = useAppSelector((state) => state.dispatch);

  const { addressDetail, dispatchFromDetails } = useAppSelector(
    (state) => state.client
  ) as any;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      product: null,
      toLocation: null,
      fromLocation: null,
      quantity: 1,
      remark: "",
      cc: null,
      type: "soundBox",
      fromLocationAddress: "",
      toLocationAddress: "",
    },
  });
  const formValues = watch();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Form Details", "Add Component Details", "Review & Submit"];
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
    setFilename("");
    dispatch(clearaddressdetail());
    formdata.delete("document");
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (!data.document)
      return showToast("Please Upload Invoice Documents", "error");
    dispatch(storeFormdata(data));
    handleNext();
  };

  const onFinalSubmit: SubmitHandler<FormData> = (data) => {
    if (rowData.length === 0) {
      showToast("Please add at least one device", "error");
      return;
    }
    if (data.fromBranch === data.toBranch) {
      showToast("From and To Branch cannot be the same", "error");
      return;
    }
    const imei = rowData.map((row: any) => row.imei);
    const serial = rowData.map((row: any) => row.srno || "");
    dispatch(
      createTransferRequest({
        imei,
        serial,
        fromBranch: data.fromBranch?.id || "",
        fromLocation: data.fromLocation || "",
        toBranch: data.toBranch?.id || "",
        toLocation: data.toLocation || "",
        product: data.product?.id || "",
        type: data.type,
        qty: data.quantity,
      })
    ).then((res: any) => {
      if (res.payload?.data.success) {
        reset();
        setRowData([]);
        showToast(
          res.payload.data.message || "Transfer Request Created Successfully",
          "success"
        );
      }
    });
  };

  useEffect(() => {
    dispatch(getPertCodesync(null));
    dispatch(getCurrency());
    dispatch(getDispatchFromDetail());
    dispatch(getAllBranch());
  }, []);

  useEffect(() => {
    if (formValues.clientDetail?.client) {
      dispatch(getClientBranch((formValues.clientDetail.client as any).code));
    }
  }, [formValues.clientDetail?.client]);

  const handleFromBranchChange = (value: any) => {
    if (value) {
      console.log(value);
    }
  };
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
  const onImeiSubmit = (imei: string) => {
    const imeiArray = imei ? imei.split("\n") : []; // Handle empty string
    const validImeiCount = imeiArray.filter((num) => num.trim() !== "").length;
    const requiredCount = formValues.deviceType === "soundbox" ? 30 : 20;

    if (validImeiCount === requiredCount) {
      console.log("open");
      setOpen(true);
    }
  };

  const onSingleImeiSubmit = (imei: string) => {
    const imeiArray = imei ? imei.split("\n") : []; // Handle empty string
    if (imeiArray.filter((num) => num.trim() !== "").length === 1) {
      setOpen(true);
    }
  };
  const handleClose = (_: object, reason: string) => {
    if (reason === "backdropClick") return; // Prevent closing on outside click
    setOpen(false);
  };
  const fetchLocations = async (endPoint: string) => {
    // setLoading(true);
    try {
      const response = await axiosInstance.get(`${endPoint}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };
  useEffect(() => {
    if (watch("fromBranch")) {
      fetchLocations(
        `/deviceBranchTransfer/getLocationListBranchWise/${
          watch("fromBranch")?.branch_code
        }`
      ).then((res) => {
        setFromLocationList(res);
      });
    }
  }, [watch("fromBranch")]);
  console.log(fromLocationList, watch("fromBranch"));
  useEffect(() => {
    if (watch("toBranch")) {
      fetchLocations(
        `/deviceBranchTransfer/getLocationListBranchWise/${
          watch("toBranch")?.branch_code
        }`
      ).then((res) => {
        console.log(res);
        setToLocationList(res);
      });
    }
  }, [watch("toBranch")]);

  console.log(branchList);
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
              dispatch(
                getDeviceDetails({
                  imei: imei,
                  deviceType: formValues.deviceType,
                })
              ).then((res: any) => {
                if (res.payload.data.success) {
                  setImei("");
                  // const newdata: RowData = {
                  //   imei: res.payload.data?.data[0].device_imei || "",
                  //   srno: res.payload.data?.data[0].sl_no || "",
                  // };
                  const newRowData = res?.payload?.data?.data?.map(
                    (device: any) => {
                      console.log(device);
                      return {
                        imei: device.device_imei || device.imei_no1 || "",
                        srno: device.sl_no || "",
                        modalNo: device?.p_name || "",
                        deviceSku: device?.device_sku || "",
                        productKey: device?.product_key || "",
                        imei2: device?.imei_no2 || "",
                      };
                    }
                  );
                  console.log(newRowData);
                  // Update rowData by appending newRowData to the existing rowData
                  setRowData((prevRowData) => [...newRowData, ...prevRowData]);
                  setOpen(false);
                } else {
                  showToast(res.payload.data.message, "error");
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
                    Device Details
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
                <div>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: "Device Type is required" }}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Device Type
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Device Type"
                          onChange={(e) => {
                            field.onChange(e.target.value || "");
                          }}
                          value={field.value || ""}
                        >
                          <MenuItem value="soundBox">SoundBox</MenuItem>
                          <MenuItem value="swipeMachine">
                            Swipe Machine
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                  {errors.type && (
                    <p className="text-red-500 text-[12px]">
                      {errors.type.message?.toString()}
                    </p>
                  )}
                </div>
                <Controller
                  name="product"
                  rules={{ required: "Device is required" }}
                  control={control}
                  render={({ field }) => (
                    <SelectDeviceWithType
                      {...field}
                      label="Search Device"
                      error={!!errors.product}
                      helperText={errors?.product?.message}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    />
                  )}
                />
                <Controller
                  name="quantity"
                  control={control}
                  rules={{ required: "Quantity is required" }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Quantity</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={!!errors.quantity}
                        {...field}
                        value={field.value}
                        type="number"
                        label="Quantity"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                  )}
                />
              </div>
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.userAddress />
                  <h2 className="text-lg font-semibold">From Details</h2>
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
                  name="fromBranch"
                  rules={{ required: "From Branch is required" }}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="from-branch-label">
                        From Branch
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="from-branch-label"
                        id="from-branch-select"
                        label="From Branch"
                        onChange={(e) => {
                          console.log(e);
                          const selectedBranch = branchList?.find(
                            (branch: any) =>
                              branch.branch_code === e.target.value
                          );
                          setValue(
                            "fromLocationAddress",
                            selectedBranch?.address
                          );
                          field.onChange(selectedBranch || null);
                        }}
                        value={field.value?.branch_code || ""}
                      >
                        {branchList?.map((branch: any) => (
                          <MenuItem
                            key={branch.branch_code}
                            value={branch.branch_code}
                          >
                            {branch.branch_name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.fromBranch && (
                        <FormHelperText error>
                          {errors.fromBranch.message?.toString()}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                <div>
                  <Controller
                    name="fromLocation"
                    control={control}
                    rules={{ required: "From Location is required" }}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          From Location
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="From Location"
                          onChange={(e) => {
                            const selectedLocation = fromLocationList.find(
                              (loc: any) => loc.loc_name === e.target.value
                            );
                            field.onChange(
                              selectedLocation?.location_key || ""
                            );
                          }}
                          value={
                            fromLocationList.find(
                              (loc: any) => loc.location_key === field.value
                            )?.loc_name || ""
                          }
                        >
                          {fromLocationList?.length > 0 ? (
                            fromLocationList.map((location: any) => (
                              <MenuItem
                                key={location.location_key}
                                value={location.loc_name}
                              >
                                {location.loc_name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value="">No Location Found</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    )}
                  />
                  {errors.fromLocation && (
                    <p className="text-red-500 text-[12px]">
                      {errors.fromLocation.message?.toString()}
                    </p>
                  )}
                </div>
                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.fromLocationAddress}
                  helperText={errors?.fromLocationAddress?.message}
                  focused={!!watch("fromLocationAddress")}
                  multiline
                  rows={3}
                  fullWidth
                  label="From Branch Address"
                  disabled
                />
              </div>
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.userAddress />
                  <h2 className="text-lg font-semibold">To Details</h2>
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
                  name="toBranch"
                  rules={{ required: "To Branch is required" }}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="to-branch-label">To Branch</InputLabel>
                      <Select
                        {...field}
                        labelId="to-branch-label"
                        id="to-branch-select"
                        label="To Branch"
                        onChange={(e) => {
                          console.log(e);
                          const selectedBranch = branchList?.find(
                            (branch: any) =>
                              branch.branch_code === e.target.value
                          );
                          setValue(
                            "toLocationAddress",
                            selectedBranch?.address
                          );
                          field.onChange(selectedBranch || null);
                        }}
                        value={field.value?.branch_code || ""}
                      >
                        {branchList?.map((branch: any) => (
                          <MenuItem
                            key={branch.branch_code}
                            value={branch.branch_code}
                          >
                            {branch.branch_name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.toBranch && (
                        <FormHelperText error>
                          {errors.toBranch.message?.toString()}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                <div>
                  <Controller
                    name="toLocation"
                    control={control}
                    rules={{ required: "To Location is required" }}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          To Location
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="To Location"
                          onChange={(e) => {
                            const selectedLocation = toLocationList.find(
                              (loc: any) => loc.loc_name === e.target.value
                            );
                            field.onChange(
                              selectedLocation?.location_key || ""
                            );
                          }}
                          value={
                            toLocationList.find(
                              (loc: any) => loc.location_key === field.value
                            )?.loc_name || ""
                          }
                        >
                          {toLocationList?.length > 0 ? (
                            toLocationList.map((location: any) => (
                              <MenuItem
                                key={location.location_key}
                                value={location.loc_name}
                              >
                                {location.loc_name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value="">No Location Found</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    )}
                  />
                  {errors.toLocation && (
                    <p className="text-red-500 text-[12px]">
                      {errors.toLocation.message?.toString()}
                    </p>
                  )}
                </div>
                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.toLocationAddress}
                  helperText={errors?.toLocationAddress?.message}
                  focused={!!watch("toLocationAddress")}
                  multiline
                  rows={3}
                  fullWidth
                  label="To Branch Address"
                  disabled
                />
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
                <div className="flex items-center gap-4 pl-10">
                  <FormControlLabel
                    control={
                      <Radio
                        checked={isMultiple}
                        onChange={() => setIsMultiple(true)} // Select multiple IMEIs
                        value="multiple"
                        name="imei-type"
                        color="primary"
                      />
                    }
                    label="Multiple IMEIs"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={!isMultiple}
                        onChange={() => setIsMultiple(false)} // Select single IMEI
                        value="single"
                        name="imei-type"
                        color="primary"
                      />
                    }
                    label="Single IMEI"
                  />

                  <div className="h-[90px] flex items-center px-[20px] justify-between flex-wrap">
                    {isMultiple ? (
                      <FormControl sx={{ width: "400px" }} variant="outlined">
                        <TextField
                          multiline
                          rows={2}
                          value={imei}
                          label="IMEI/SR No."
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
                              onImeiSubmit(imei);
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
                      </FormControl>
                    ) : (
                      <FormControl sx={{ width: "400px" }} variant="outlined">
                        <TextField
                          rows={2}
                          value={imei}
                          label="Single IMEI/SR No."
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
                              onSingleImeiSubmit(imei);
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
                      </FormControl>
                    )}

                    <div className="flex items-center p-4 space-x-6 bg-white rounded-lg">
                      <p className="text-lg font-semibold text-blue-600">
                        Total Devices:
                        <span className="pl-1 text-gray-800">
                          {rowData.length}
                        </span>
                      </p>
                      <p className="text-lg font-semibold text-green-600">
                        Total L Devices:
                        <span className="pl-1 text-gray-800">
                          {
                            rowData.filter((item: any) =>
                              item.modalNo.includes("(L)")
                            )?.length
                          }
                        </span>
                      </p>
                      <p className="text-lg font-semibold text-red-600">
                        Total E Devices:
                        <span className="pl-1 text-gray-800">
                          {
                            rowData.filter((item: any) =>
                              item.modalNo.includes("(E)")
                            )?.length
                          }
                        </span>
                      </p>
                      <p className="text-lg font-semibold text-yellow-700">
                        Total F Devices:
                        <span className="pl-1 text-gray-800">
                          {
                            rowData.filter((item: any) =>
                              item.modalNo.includes("(F)")
                            )?.length
                          }
                        </span>
                      </p>
                    </div>

                    {/* <div className="flex items-center gap-[10px]">
                <LoadingButton loadingPosition="start" loading={dispatchCreateLoading} type="submit" startIcon={<SaveIcon fontSize="small" />} variant="contained">
                  Submit
                </LoadingButton>
              </div> */}
                  </div>
                </div>
                <div className="h-[calc(100vh-250px)]">
                  <ImeiTable
                    setRowdata={setRowData}
                    rowData={rowData}
                    module={watch("type")}
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
                  Create New Branch Transfer
                </LoadingButton>
              </div>
            </div>
          )}
          <div className="h-[50px] border-t border-neutral-300 flex items-center justify-center px-[20px] bg-neutral-50 gap-[10px] relative">
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
                    onFinalSubmit(watch());
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

export default CreateDispatchPage;
