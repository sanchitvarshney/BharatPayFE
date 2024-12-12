import React from "react";
import Grid from "@mui/material/Grid2";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import FileUploader from "@/components/reusable/FileUploader";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { getDeviceDetail } from "@/features/production/Batteryqc/BatteryQcSlice";
import ImeiTable from "@/table/dispatch/ImeiTable";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import { Controller, useForm } from "react-hook-form";
import { DispatchItemPayload } from "@/features/Dispatch/DispatchType";
import { clearFile, CreateDispatch, uploadFile } from "@/features/Dispatch/DispatchSlice";
import SelectDevice, { DeviceType } from "@/components/reusable/SelectSku";
import SelectLocationAcordingModule, { LocationType } from "@/components/reusable/SelectLocationAcordingModule";
type RowData = {
  imei: string;
  srno: string;
};

type FormDataType = {
  name: string;
  invoice: string;
  qty: string;
  location: LocationType | null;
  remark: string;
  file: File[] | null;
  sku: DeviceType | null;
};
const CraeteDispatchPage: React.FC = () => {
  const [resetAlert, setResetAlert] = React.useState(false);
  const [imei, setImei] = React.useState<string>("");
  const [rowData, setRowData] = React.useState<RowData[]>([]);
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<FormDataType>({
    defaultValues: {
      name: "",
      invoice: "",
      qty: "",
      location: null,
      remark: "",
      file: null,
      sku: null,
    },
  });
  const { deviceDetailLoading } = useAppSelector((state) => state.batteryQcReducer);
  const { dispatchCreateLoading, uploadFileLoading, file } = useAppSelector((state) => state.dispatch);
  const onsubmit = (data: FormDataType) => {
    if (rowData.length !== Number(data.qty)) return showToast("Please Add All Device", "error");
    const payload: DispatchItemPayload = {
      customer: data.name,
      docNo: data.invoice,
      sku: data.sku?.id || "",
      dispatchQty: Number(data.qty),
      remark: data.remark,
      deviceId: rowData.map((item) => item.imei),
      document: file || "",
      pickLocation: data.location?.code || "",
    };
    dispatch(CreateDispatch(payload)).then((res: any) => {
      if (res.payload.data.success) {
        reset();
        setRowData([]);
        dispatch(clearFile());
      }
    });
  };
  return (
    <>
      <Dialog open={resetAlert} onClose={setResetAlert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Are you absolutely sure?"}</DialogTitle>
        <DialogContent sx={{ width: "600px" }}>
          <DialogContentText id="alert-dialog-description">Resetting the form will clear all entered data, including any selected device details, locations, and added components. This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetAlert(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => setResetAlert(false)} autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className="h-[calc(100vh-100px)] grid grid-cols-[550px_1fr]  overflow-x-hidden  bg-white ">
          <div className="h-full overflow-y-auto border-e border-slate-300">
            <Grid container spacing={3} sx={{ p: "20px" }}>
              <Grid size={6}>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: { value: true, message: "Customer Name is required" },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Customer Name must only contain letters and spaces",
                    },
                    minLength: { value: 2, message: "Customer Name must be at least 2 characters" },
                    maxLength: { value: 50, message: "Customer Name cannot exceed 50 characters" },
                  }}
                  render={({ field }) => <TextField error={!!errors.name} helperText={errors.name?.message} fullWidth {...field} label={"Customer Name"} variant="outlined" sx={{}} />}
                />
              </Grid>
              <Grid size={6}>
                <Controller
                  name="invoice"
                  control={control}
                  rules={{
                    required: { value: true, message: "Customer Name is required" },
                  }}
                  render={({ field }) => <TextField error={!!errors.invoice} helperText={errors.invoice?.message} fullWidth {...field} label={"Invoice/Challan Number"} variant="outlined" />}
                />
              </Grid>
              <Grid size={6}>
                <Controller
                  name="sku"
                  rules={{ required: { value: true, message: "Device is required" } }}
                  control={control}
                  render={({ field }) => <SelectDevice error={!!errors.sku} helperText={errors.sku?.message} size="medium" label="Select Device" varient="outlined" value={field.value} onChange={field.onChange} />}
                />
              </Grid>
              <Grid size={6}>
                <Controller
                  name="qty"
                  control={control}
                  rules={{
                    required: { value: true, message: "Customer Name is required" },
                    min: { value: 0, message: "Quantity must be greater than 0" },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Quantity must be a number",
                    },
                  }}
                  render={({ field }) => (
                    <FormControl error={!!errors.qty} fullWidth variant="outlined">
                      <InputLabel htmlFor="standard-adornment-qty">Dispatch Quantity</InputLabel>
                      <OutlinedInput
                        {...field}
                        label="Dispatch Quantity"
                        type="number"
                        id="standard-adornment-qty"
                        endAdornment={<InputAdornment position="end">NOS</InputAdornment>}
                        aria-describedby="standard-weight-helper-text"
                        inputProps={{
                          "aria-label": "weight",
                          min: 0,
                        }}
                      />
                      {errors.qty && <FormHelperText>{errors.qty.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid size={6}>
                <Controller
                  name="location"
                  rules={{ required: { value: true, message: "Location is required" } }}
                  control={control}
                  render={({ field }) => <SelectLocationAcordingModule endPoint="/dispatchDivice/pickLocation" error={!!errors.location} helperText={errors.location?.message} size="medium" label="Pick Location" varient="outlined" value={field.value} onChange={field.onChange} />}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  name="file"
                  control={control}
                  render={({ field }) => (
                    <FileUploader
                      loading={uploadFileLoading}
                      acceptedFileTypes={{
                        "application/pdf": [".pdf"],
                        "application/msword": [".doc"],
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
                        "image/*": [], // Allows all image types (e.g., jpeg, png, gif, etc.)
                      }}
                      value={field.value}
                      onFileChange={(value) => {
                        console.log(value[0]);
                        const formdata = new FormData();
                        formdata.append("document", value[0]);
                        dispatch(uploadFile(formdata)).then((res: any) => {
                          if (res.payload.data.success) {
                            field.onChange(value);
                          }
                        });
                      }}
                      label="Upload Attachments (Optional)"
                    />
                  )}
                />
              </Grid>
              <Grid size={12}>
                <TextField {...register("remark")} fullWidth label={"Remarks (If any)"} variant="outlined" multiline rows={3} />
              </Grid>
            </Grid>
          </div>
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
                        if (rowData.some((row) => row.srno === imei || row.imei === imei)) {
                          showToast("IMEI already added", "error");
                          return;
                        }
                        dispatch(getDeviceDetail(imei)).then((res: any) => {
                          if (res.payload.data.success) {
                            console.log(res.payload.data);
                            setImei("");
                            const newdata: RowData = {
                              imei: res.payload.data?.data[0].device_imei || "",
                              srno: res.payload.data?.data[0].sl_no || "",
                            };
                            if (rowData.length === 0) {
                              setRowData([newdata]);
                            } else {
                              setRowData([newdata, ...rowData]);
                            }
                          } else {
                            showToast(res.payload.data.message, "error");
                          }
                        });
                      }
                    }
                  }}
                  endAdornment={<InputAdornment position="end">{deviceDetailLoading ? <CircularProgress size={20} color="inherit" /> : <QrCodeScannerIcon />}</InputAdornment>}
                />
              </FormControl>
              <div className="flex items-center gap-[10px]">
                <Button onClick={() => setResetAlert(true)} startIcon={<RotateLeftIcon fontSize="small" />} variant="contained" sx={{ background: "white", color: "red" }}>
                  Reset
                </Button>
                <LoadingButton loadingPosition="start" loading={dispatchCreateLoading} type="submit" startIcon={<SaveIcon fontSize="small" />} variant="contained">
                  Submit
                </LoadingButton>
              </div>
            </div>
            <div className=" h-[calc(100vh-190px)] ">
              <ImeiTable setRowdata={setRowData} rowData={rowData} />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CraeteDispatchPage;
