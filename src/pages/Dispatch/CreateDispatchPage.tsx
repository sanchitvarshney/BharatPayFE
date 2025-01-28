import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import MaterialInvardUploadDocumentDrawer from "@/components/Drawers/wearhouse/MaterialInvardUploadDocumentDrawer";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  clearaddressdetail,
  getLocationAsync,
  getVendorAsync,
  uploadInvoiceFile,
} from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import {
  resetDocumentFile,
  resetFormData,
  storeDocumentFile,
  storeFormdata,
} from "@/features/wearhouse/Rawmin/RawMinSlice";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { getCurrency } from "@/features/common/commonSlice";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import {
  Autocomplete,
  CircularProgress,
  Divider,
  FilledInput,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import FileUploader from "@/components/reusable/FileUploader";
import { LoadingButton } from "@mui/lab";
import FileUploadIcon from "@mui/icons-material/FileUpload";
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
  getClientBranch,
  uploadFile,
} from "@/features/Dispatch/DispatchSlice";
import SelectLocationAcordingModule from "@/components/reusable/SelectLocationAcordingModule";
import { getDeviceDetails } from "@/features/production/Batteryqc/BatteryQcSlice";
import ImeiTable from "@/table/dispatch/ImeiTable";
import { getClientAddressDetail } from "@/features/master/client/clientSlice";
import { DispatchItemPayload } from "@/features/Dispatch/DispatchType";
type RowData = {
  imei: string;
  srno: string;
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
};

const CreateDispatchPage: React.FC = () => {
  const [filename, setFilename] = useState<string>("");
  const [alert, setAlert] = useState<boolean>(false);
  const [file, setfile] = useState<File[] | null>(null);
  const [upload, setUpload] = useState<boolean>(false);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [imei, setImei] = React.useState<string>("");
  const [dispatchNo, setDispatchNo] = useState<string>("");
  const dispatch = useAppDispatch();
  const { deviceDetailLoading } = useAppSelector(
    (state) => state.batteryQcReducer
  );

  const {
    dispatchCreateLoading,
    uploadFileLoading,
    clientBranchList,
  } = useAppSelector((state) => state.dispatch);

  const { addressDetail } = useAppSelector((state) => state.client) as any;

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
    setfile(null);
    dispatch(clearaddressdetail());
    formdata.delete('document')
  };

  const onSubmit: SubmitHandler<FormDataType> = (data) => {
    if (!data.document)
      return showToast("Please Upload Invoice Documents", "error");
    dispatch(storeFormdata(data));
    handleNext();
  };
  console.log(rowData);
  const finalSubmit = () => {
    const data = formValues;
    // if (formdata) {
    if (rowData.length !== Number(data.qty))
      return showToast(
        "Total Devices should be equal to Quantity you have entered",
        "error"
      );
    const payload: DispatchItemPayload = {
      docNo: data.docNo,
      sku: data.sku?.id || "",
      dispatchQty: Number(data.qty),
      remark: data.remark,
      imeis: rowData.map((item) => item.imei),
      srlnos: rowData.map((item) => item.srno),
      document: data.document || "",
      pickLocation: data.location?.code || "",
      clientDetail: data.clientDetail
        ? {
            ...data.clientDetail,
            client: (data.clientDetail?.client as any)?.code,
          }
        : null,
      shipToDetails: data.shipToDetails || null,
    };
    dispatch(CreateDispatch(payload)).then((res: any) => {
      if (res.payload.data.success) {
        setDispatchNo(res?.payload?.data?.data?.refID);
        reset();
        setRowData([]);
        handleNext();
        resetall();
        //  dispatch(clearFile());
      }
    });
    //  };
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
  }, []);

  useEffect(() => {
    if (formValues.clientDetail?.client) {
      dispatch(getClientBranch((formValues.clientDetail.client as any).code));
    }
  }, [formValues.clientDetail?.client]);

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
    }
  };

  // useEffect(() => {
  //   if(formValues.clientDetail?.client){
  //     setValue("clientDetail.branchId","");
  //     setValue("clientDetail.address1","");
  //     setValue("clientDetail.address2","");
  //     setValue("clientDetail.pincode","");
  //     setValue("shipToDetails.shipTo","");
  //     setValue("shipToDetails.address1","");
  //     setValue("shipToDetails.address2","");
  //     setValue("shipToDetails.pincode","");
  //     setValue("shipToDetails.mobileNo","");
  //   }
  // },[formValues.clientDetail?.client])

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
                      message: "Ship To Client is required",
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
                  className="h-[100px] resize-none"
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
                  className="h-[100px] resize-none"
                  {...register("shipToDetails.mobileNo", {
                    required: "Mobile No is required",
                  })}
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
                  name="sku"
                  rules={{
                    required: { value: true, message: "Device is required" },
                  }}
                  control={control}
                  render={({ field }) => (
                    <SelectDevice
                      error={!!errors.sku}
                      helperText={errors.sku?.message}
                      size="medium"
                      label="Select Device"
                      varient="filled"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

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
                  name="docNo"
                  control={control}
                  rules={{
                    required: { value: true, message: "Document is required" },
                  }}
                  render={({ field }) => (
                    <FormControl
                      error={!!errors.docNo}
                      fullWidth
                      variant="filled"
                    >
                      <InputLabel htmlFor="docNo">Document No</InputLabel>
                      <FilledInput
                        {...field}
                        error={!!errors.docNo}
                        id="docNo"
                        type="text"
                      />
                      {errors.docNo && (
                        <FormHelperText>{errors.docNo.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                <Controller
                  name="location"
                  rules={{
                    required: { value: true, message: "Location is required" },
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
              <div className="grid grid-cols-2">
                <div className=" flex flex-col gap-[20px] py-[20px] ">
                  <div>
                    <Controller
                      name="file"
                      control={control}
                      render={({ field }) => (
                        <FileUploader
                          loading={uploadFileLoading}
                          acceptedFileTypes={{
                            "application/pdf": [".pdf"],
                            "application/msword": [".doc"],
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                              [".docx"],
                            "image/*": [],
                          }}
                          multiple
                          value={field.value}
                          onFileChange={(value) => {
                            
                            value?.forEach((file: File) => {
                              formdata.append("document", file);
                            });
                            dispatch(uploadFile(formdata)).then((res: any) => {
                              if (res.payload.data.success) {
                                const docNos = res.payload.data?.data;
                                setValue("document", docNos);
                              }
                            });
                          }}
                          label="Upload Attachments"
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center ">
                    <LoadingButton
                      variant="contained"
                      loadingPosition="start"
                      loading={uploadFileLoading}
                      type="button"
                      startIcon={<FileUploadIcon fontSize="small" />}
                      onClick={InvoiceFileUpload}
                    >
                      Upload
                    </LoadingButton>
                  </div>
                </div>
                <div className=" pl-10 pt-10">
                  <TextField
                    {...register("remark")}
                    fullWidth
                    label={"Remarks (If any)"}
                    variant="outlined"
                    multiline
                    rows={5}
                  />
                </div>
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
                <div className="h-[90px] flex items-center px-[20px] justify-between flex-wrap">
                  <FormControl sx={{ width: "400px" }} variant="outlined">
                    <InputLabel>IMEI/SR No.</InputLabel>
                    <OutlinedInput
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
                          e.preventDefault();
                          if (imei) {
                            if (
                              rowData.some(
                                (row) => row.srno === imei || row.imei === imei
                              )
                            ) {
                              showToast("IMEI already added", "error");
                              return;
                            }
                            const payload = {
                              data: imei,
                            };
                            dispatch(getDeviceDetails(payload)).then(
                              (res: any) => {
                                if (res.payload.data.success) {
                                  setImei("");
                                  // const newdata: RowData = {
                                  //   imei: res.payload.data?.data[0].device_imei || "",
                                  //   srno: res.payload.data?.data[0].sl_no || "",
                                  // };
                                  const newRowData =
                                    res?.payload?.data?.data?.map(
                                      (device: any) => {
                                        return {
                                          imei: device.device_imei || "",
                                          srno: device.sl_no || "",
                                          modalNo: device?.productDetail?.p_name||"",
                                          deviceSku: device?.productDetail?.device_sku||"",
                                        };
                                      }
                                    );

                                  // Update rowData by appending newRowData to the existing rowData
                                  setRowData((prevRowData) => [
                                    ...newRowData,
                                    ...prevRowData,
                                  ]);
                                } else {
                                  showToast(res.payload.data.message, "error");
                                }
                              }
                            );
                          }
                        }
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          {deviceDetailLoading ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <QrCodeScannerIcon />
                          )}
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  {/* <div className="flex items-center gap-[10px]">
                <LoadingButton loadingPosition="start" loading={dispatchCreateLoading} type="submit" startIcon={<SaveIcon fontSize="small" />} variant="contained">
                  Submit
                </LoadingButton>
              </div> */}
                </div>

                <div className="h-[calc(100vh-250px)]">
                  <ImeiTable setRowdata={setRowData} rowData={rowData} />
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
                  // onClick={handleNext}
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
    </>
  );
};

export default CreateDispatchPage;
