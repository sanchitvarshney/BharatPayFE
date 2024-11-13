import React from "react";
import Grid from "@mui/material/Grid2";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import FileUploader from "@/components/reusable/FileUploader";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import SelectLocation, { LocationType } from "@/components/reusable/SelectLocation";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { getDeviceDetail } from "@/features/production/Batteryqc/BatteryQcSlice";
import ImeiTable from "@/table/dispatch/ImeiTable";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
type RowData = {
  imei: string;
  srno: string;
};
const CraeteDispatchPage: React.FC = () => {
  const [resetAlert, setResetAlert] = React.useState(false);
  const [location, setLocation] = React.useState<LocationType | null>(null);
  const [imei, setImei] = React.useState<string>("");
  const [rowData, setRowData] = React.useState<RowData[]>([]);
  const dispatch = useAppDispatch();
  const { deviceDetailLoading, deviceDetailData } = useAppSelector((state) => state.batteryQcReducer);
  return (
    <>
      <Dialog open={resetAlert} onClose={setResetAlert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Are you absolutely sure?"}</DialogTitle>
        <DialogContent sx={{ width: "600px" }}>
          <DialogContentText id="alert-dialog-description">Resetting the form will clear all entered data, including any selected device details, locations, and added components. This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetAlert(false)}>Cancel</Button>
          <Button onClick={() => setResetAlert(false)} autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container className="h-[calc(100vh-100px)] grid grid-cols-[500px_1fr]  bg-white ">
        <Grid size={5} className="w-full h-full border-e border-slate-300">
          <Grid container spacing={3} sx={{ p: "20px" }}>
            <Grid size={6}>
              <TextField fullWidth label={"Customer Name"} variant="outlined" />
            </Grid>
            <Grid size={6}>
              <TextField fullWidth label={"Invoice/Challan Number"} variant="outlined" />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="standard-adornment-qty">Dispatch Quantity</InputLabel>
                <OutlinedInput
                  label="Dispatch Quantity"
                  type="number"
                  id="standard-adornment-qty"
                  endAdornment={<InputAdornment position="end">NOS</InputAdornment>}
                  aria-describedby="standard-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                />
              </FormControl>
            </Grid>
            <Grid size={6}>
              <SelectLocation size="medium" label="Pick Location" varient="outlined" value={location} onChange={setLocation} />
            </Grid>
            <Grid size={12}>
              <FileUploader multiple label="Upload Attachments (Optional)" />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label={"Remarks (If any)"} variant="outlined" multiline rows={3} />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={7}>
          <div className="h-[90px] flex items-center px-[20px] justify-between">
            <FormControl sx={{ width: "400px" }} variant="outlined">
              <InputLabel>IMEI/Sr No.</InputLabel>
              <OutlinedInput
                value={imei}
                label="IMEI/Sr No."
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
                    if (imei) {
                      if (rowData.some((row) => row.srno === imei || row.imei === imei)) {
                        showToast("IMEI already added", "error");
                        return;
                      }
                      dispatch(getDeviceDetail(imei)).then((res: any) => {
                        if (res.payload.data.success) {
                          setImei("");
                          const newdata: RowData = {
                            imei: deviceDetailData?.device_imei || "",
                            srno: deviceDetailData?.sl_no || "",
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
              <LoadingButton startIcon={<SaveIcon fontSize="small" />} variant="contained">
                Submit
              </LoadingButton>
            </div>
          </div>
          <div className="bg-red-100">
            <ImeiTable setRowdata={setRowData} rowData={rowData} />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default CraeteDispatchPage;
