import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import MaterialInvardUploadDocumentDrawer from "@/components/Drawers/wearhouse/MaterialInvardUploadDocumentDrawer";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { clearaddressdetail, getLocationAsync, getVendorAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { resetDocumentFile, resetFormData, storeFormdata } from "@/features/wearhouse/Rawmin/RawMinSlice";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { getCurrency } from "@/features/common/commonSlice";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Autocomplete, Button, CircularProgress, Divider, FilledInput, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, LinearProgress, ListItem, ListItemText, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import FileUploader from "@/components/reusable/FileUploader";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import { showToast } from "@/utils/toasterContext";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import Success from "@/components/reusable/Success";
import SelectClient, { LocationType } from "@/components/reusable/editor/SelectClient";
import { DeviceType } from "@/components/reusable/SelectSku";
import { CreateDispatch, getClientBranch, uploadFile } from "@/features/Dispatch/DispatchSlice";
import SelectLocationAcordingModule from "@/components/reusable/SelectLocationAcordingModule";
import { getDeviceDetails } from "@/features/production/Batteryqc/BatteryQcSlice";
import ImeiTable from "@/table/dispatch/ImeiTable";
import { getClientAddressDetail } from "@/features/master/client/clientSlice";
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
type RowData = {
  imei: string;  
  srno: string;
  productKey: string;
  serialNo: number;
  modalNo: string;
  deviceSku: string;
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

const CreateTicket: React.FC = () => {
  const [filename, setFilename] = useState<string>("");
  const [alert, setAlert] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [imei, setImei] = React.useState<string>("");
  const [dispatchNo, setDispatchNo] = useState<string>("");
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const { deviceDetailLoading } = useAppSelector((state) => state.batteryQcReducer);

  const { dispatchCreateLoading, uploadFileLoading, clientBranchList } = useAppSelector((state) => state.dispatch);

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
  const formdata = new FormData();
   const resetall = () => {
    setRowData([]);
    reset();
    dispatch(resetDocumentFile());
    setFilename("");
    dispatch(clearaddressdetail());
    formdata.delete("document");
  };

  const finalSubmit = () => {
    console.log(rowData)
    const data = formValues;
    // if (formdata) {
    if (rowData.length !== Number(data.qty)) return showToast("Total Devices should be equal to Quantity you have entered", "error");
    const payload: DispatchItemPayload = {
      docNo: data.docNo,
      // sku: data.sku?.id || "",
      sku: rowData.map((item) => item.productKey),
      dispatchQty: Number(data.qty),
      remark: data.remark,
      imeis: rowData.map((item) => item.imei),
      srlnos: rowData.map((item) => item.srno),
      document: data.document || "",
      dispatchDate: dayjs(data.dispatchDate).format("DD-MM-YYYY"),
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
        resetall();
        //  dispatch(clearFile());
      }
    });
    //  };
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

  const onImeiSubmit = (imei: string) => {
    const imeiArray = imei ? imei.split("\n") : []; // Handle empty string
    console.log(imeiArray.filter((num) => num.trim() !== "").length);
    if (imeiArray.filter((num) => num.trim() !== "").length === 30) {
      console.log("open");
      setOpen(true);
    }
  };
  console.log(open);
  const handleClose = (_: object, reason: string) => {
    if (reason === "backdropClick") return; // Prevent closing on outside click
    setOpen(false);
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <div className="absolute top-0 left-0 right-0">
      {
        deviceDetailLoading &&  <LinearProgress/>
      } 
      </div>
        <div className="absolute font-[500]  right-[10px] top-[10px]">Total Devices: {imei.split("\n").length}</div>
        <DialogTitle id="alert-dialog-title">{"Dispatch Devices"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className="grid grid-cols-5 gap-[10px] ">
            {imei.split("\n").map((no) => (
              <ListItemText key={no} primary={no} />
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={deviceDetailLoading} color="error" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
          autoFocus
          disabled={deviceDetailLoading}
            onClick={() => {
              
              dispatch(getDeviceDetails(imei)).then((res: any) => {
                if (res.payload.data.success) {
                  setImei("");
                  // const newdata: RowData = {
                  //   imei: res.payload.data?.data[0].device_imei || "",
                  //   srno: res.payload.data?.data[0].sl_no || "",
                  // };
                  const newRowData = res?.payload?.data?.data?.map((device: any) => {
                    console.log(device)
                    return {
                      imei: device.device_imei || "",
                      srno: device.sl_no || "",
                      modalNo: device?.p_name || "",
                      deviceSku: device?.device_sku || "",
                      productKey: device?.product_key || "",
                    };
                  });
                    console.log(newRowData)
                  // Update rowData by appending newRowData to the existing rowData
                  setRowData((prevRowData) => [...newRowData, ...prevRowData]);
                  setOpen(false)
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
      <form onSubmit={handleSubmit(onsubmit)} className="bg-white ">
        <MaterialInvardUploadDocumentDrawer open={upload} setOpen={setUpload} />

        <div className="h-[calc(100vh-100px)]   "> 

          {activeStep === 0 && (
            <div className="h-[calc(100vh-200px)] py-[20px] sm:px-[10px] md:px-[30px] lg:px-[50px] flex flex-col gap-[20px] overflow-y-auto">
              <div id="primary-item-details" className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.user />
                  <h2 id="primary-item-details" className="text-lg font-semibold">
                    Contact Information
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
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[30px] pb-20">
                <TextField
                  variant="filled"
                  sx={{ mb: 5 }}
                  error={!!errors.clientDetail?.pincode}
                  // helperText={errors.clientDetail.pincode}
                  helperText={errors?.clientDetail?.pincode?.message}
                  focused={!!watch("clientDetail.pincode")}
                  // multiline
                  rows={3}
                  fullWidth
                  label="Email"
                  className="h-[10px] resize-none"
                  {...register("clientDetail.pincode", {
                    required: "PinCode is required",
                  })}
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
                  label="Name"
                  className="h-[10px] resize-none"
                  {...register("clientDetail.pincode", {
                    required: "PinCode is required",
                  })}
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
                  label="Phone Number "
                  className="h-[10px] resize-none"
                  {...register("clientDetail.pincode", {
                    required: "PinCode is required",
                  })}
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
                  label="Ext"
                  className="h-[10px] resize-none"
                  {...register("clientDetail.pincode", {
                    required: "PinCode is required",
                  })}
                />
                
               
              </div>
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.userAddress />
                  <h2 className="text-lg font-semibold">Ticket Details</h2>
                </div>
                <Divider
                  sx={{
                    borderBottomWidth: 2,
                    borderColor: "#f59e0b",
                    flexGrow: 1,
                  }}
                />
              </div>
              <div className="gap-[30px]">
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
                  label="Ticket Summary"
                  className="h-[10px] resize-none"
                  {...register("clientDetail.pincode", {
                    required: "PinCode is required",
                  })}
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
                <div className="h-[90px] flex items-center px-[20px] justify-between flex-wrap">
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
                          endAdornment: <InputAdornment position="end">{deviceDetailLoading ? <CircularProgress size={20} color="inherit" /> : <QrCodeScannerIcon />}</InputAdornment>,
                        },
                      }}
                    />
                  </FormControl>

                  <div className="flex items-center p-4 space-x-6 bg-white rounded-lg">
                    <p className="text-lg font-semibold text-blue-600">
                      Total Devices:
                      <span className="pl-1 text-gray-800">{rowData.length}</span>
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      Total L Devices:
                      <span className="pl-1 text-gray-800">{rowData.filter((item: any) => item.modalNo.includes("(L)"))?.length}</span>
                    </p>
                    <p className="text-lg font-semibold text-red-600">
                      Total E Devices:
                      <span className="pl-1 text-gray-800">{rowData.filter((item: any) => item.modalNo.includes("(E)"))?.length}</span>
                    </p>
                    <p className="text-lg font-semibold text-yellow-700">
                      Total F Devices:
                      <span className="pl-1 text-gray-800">{rowData.filter((item: any) => item.modalNo.includes("(F)"))?.length}</span>
                    </p>
                  </div>

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
                <LoadingButton onClick={() => setActiveStep(0)} variant="contained">
                  Create New Dispatch
                </LoadingButton>
              </div>
            </div>
          )}
          <div className="h-[50px] border-t border-neutral-300 flex items-center justify-end px-[20px] bg-neutral-50 gap-[10px] relative">
            {activeStep === 0 && (
              <>
                <LoadingButton type="submit" variant="contained" endIcon={<Icons.next />} >
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

export default CreateTicket;
