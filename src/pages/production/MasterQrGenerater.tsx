import React, { useEffect, useState } from "react";
import { Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { showToast } from "@/utils/toasterContext";
import LoadingButton from "@mui/lab/LoadingButton";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import { Controller, useForm } from "react-hook-form";
import SelectDevice, { DeviceType } from "@/components/reusable/SelectSku";
import MasterqrCodeTable from "@/table/production/MasterqrCodeTable";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import { GenerateMasterWrPayload } from "@/features/production/QRCode/QRCodeType";
import axiosInstance from "@/api/axiosInstance";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import GeneratedLotListTable from "@/table/production/GeneratedLotListTable";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DatePicker, TimeRangePickerProps } from "antd";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { checkserial, clearLotList, getLotListData } from "@/features/production/QRCode/QRCodeSlice";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const rangePresets: TimeRangePickerProps["presets"] = [
  { label: "Today", value: [dayjs().startOf("day"), dayjs()] },
  { label: "Yesterday", value: [dayjs().add(-1, "d"), dayjs()] },
  { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
];
type RowData = {
  srno: string;
  operator: string;
};

type FormDataType = {
  sku: DeviceType | null;
  model: string;
  Lotsize: string;
};
const MasterQrGenerator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { getlotListLoading ,checkserialLoading} = useAppSelector((state) => state.qr);
  const [resetAlert, setResetAlert] = React.useState(false);
  const [imei, setImei] = React.useState<string>("");
  const [rowData, setRowData] = React.useState<RowData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState<string>("CREATE");
  const [id, setId] = React.useState("");
  const [type, setType] = React.useState("DATE");
  const [calltype, setCalltype] = React.useState<string>("");
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const handleDateChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    if (range) {
      setDate({ from: range[0], to: range[1] });
    } else {
      setDate({ from: null, to: null });
    }
  };
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<FormDataType>({
    defaultValues: {
      sku: null,
      model: "",
      Lotsize: "30",
    },
  });
  const onsubmit = async (data: FormDataType) => {
    if (rowData.length !== Number(data.Lotsize)) {
      return showToast("Please Add All Device", "error");
    }

    const payload: GenerateMasterWrPayload = {
      skuId: data.sku?.id || "",
      lotSize: Number(data.Lotsize),
      deviceModel: data.model,
      srlno: rowData.map((item) => item.srno),
    };

    setLoading(true);

    try {
      const response = await axiosInstance.post("/dispatchDevicePrint/generateLotQr", payload, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = window.URL.createObjectURL(blob);

      window.open(pdfUrl, "_blank");

      reset();
      showToast("PDF generated successfully!", "success");
      setRowData([]);
    } catch (error: any) {
      console.error("Error generating PDF:", error);

      if (error.response) {
        const contentType = error.response.headers["content-type"];

        if (contentType.includes("application/json")) {
          const errorData = await error.response.data.text();
          const parsedError = JSON.parse(errorData);
          const backendMessage = parsedError.message || "An error occurred";
          showToast(backendMessage, "error");
        } else {
          showToast("Error generating PDF", "error");
        }
      } else {
        showToast("Network error or server not reachable", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchlotlist = () => {
    if (type === "DATE") {
      if (date.from && date.to) {
        dispatch(getLotListData({ type: type, from: dayjs(date.from).format("DD-MM-YYYY"), to: dayjs(date.to).format("DD-MM-YYYY"), id: "" }));
      } else {
        showToast("Please select date range", "error");
      }
    } else {
      if (id) {
        dispatch(getLotListData({ type: type, from: "", to: "", id: id }));
      } else {
        showToast("Please enter Lot ID", "error");
      }
    }
  };

  useEffect(() => {
    dispatch(clearLotList());
  }, [page]);
  return (
    <>
      <Dialog open={resetAlert} onClose={setResetAlert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Are you absolutely sure?"}</DialogTitle>
        <DialogContent sx={{ width: "600px" }}>
          <DialogContentText id="alert-dialog-description">Resetting the form will clear all entered data, including any selected device details and entered IMEI numbers. This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetAlert(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => setResetAlert(false)} autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className="h-[calc(100vh-100px)] grid grid-cols-[450px_1fr]  overflow-x-hidden  bg-white ">
          <div className="h-full overflow-y-auto border-e border-slate-300">
            <div className="pt-[20px] px-[20px]">
              <FormControl sx={{ width: "200px" }}>
                <Select onChange={(e) => setPage(e.target.value)} value={page} labelId="demo-simple-select-label" id="demo-simple-select">
                  <MenuItem value={"CREATE"} className="flex items-center ">
                    <QrCodeScannerIcon fontSize="small" sx={{ mr: 1 }} /> Create Master QR
                  </MenuItem>
                  <MenuItem value={"VIEW"} className="flex items-center ">
                    <FullscreenIcon fontSize="small" sx={{ mr: 1 }} />
                    View QR List
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className={`grid gap-[30px] p-[30px] relative `}>
              {page !== "CREATE" && <div className="absolute top-0 bottom-0 left-0 right-0 z-10 cursor-not-allowed bg-white/50"></div>}

              <Card sx={{ p: 2, background: "#fffbeb" }}>
                <Typography fontSize={15} className="text-slate-700">
                  <InfoIcon className="text-amber-400" sx={{ mr: 1, mb: "2px" }} />
                  Generate QR codes in bulk for packed devices. Simply provide the device details, select the SKU, specify the lot size, and input the IMEI/Serial numbers for seamless QR code generation.
                </Typography>
              </Card>
              <TextField error={!!errors.model} helperText={errors.model ? errors.model?.message : "Enter the model name or number of the device for identification."} label="Device Model" fullWidth {...register("model", { required: "Device Model is required" })} />
              <Controller
                name="sku"
                rules={{ required: { value: true, message: "Device is required" } }}
                control={control}
                render={({ field }) => <SelectDevice error={!!errors.sku} helperText={errors.sku ? errors.sku?.message : "Choose the appropriate SKU associated with the device."} size="medium" label="Select SKU" varient="outlined" value={field.value} onChange={field.onChange} />}
              />
              <Controller
                name="Lotsize"
                rules={{ required: { value: true, message: "Lot Size is required" } }}
                control={control}
                render={({ field }) => (
                  <TextField
                    error={!!errors.Lotsize}
                    value={field.value}
                    slotProps={{
                      htmlInput: {
                        min: 1,
                        readOnly: true,
                      },
                    }}
                    onChange={(e) => {
                      if (Number(e.target.value) > 30) {
                        showToast("Lot Size should be less than 30", "error");
                      } else {
                        field.onChange(e.target.value);
                      }
                    }}
                    helperText={errors.Lotsize ? errors.Lotsize?.message : "Specify the number of devices to be included in the batch."}
                    label="Lot Size"
                    type="number"
                    fullWidth
                  />
                )}
              />
            </div>
          </div>
          {page === "CREATE" ? (
            <div>
              <div className="h-[110px] flex items-center px-[20px] justify-between flex-wrap">
                <FormControl sx={{ width: "400px" }} variant="outlined">
                  <InputLabel>SR No.</InputLabel>
                  <OutlinedInput
                    value={imei}
                    label="SR No."
                    id="standard-adornment-qty"
                    aria-describedby="standard-weight-helper-text"
                    inputProps={{
                      "aria-label": "weight",
                    }}
                    onChange={(e) => {
                      setImei("");
                      setImei(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (imei) {
                          if (rowData.some((row) => row.srno === imei)) {
                            showToast("Serial number already added", "error");
                            return;
                          }
                          dispatch(checkserial(imei)).then((response: any) => {
                            if (response.payload?.data.success) {
                              const newdata: RowData = {
                                srno: response.payload?.data.srlNo,
                                operator: response.payload?.data.operator,
                              };
                              if (rowData.length === 0) {
                                setRowData([newdata]);
                              } else {
                                setRowData([newdata, ...rowData]);
                              }
                              setImei("");
                            }
                          });
                        }
                      }
                    }}
                    endAdornment={<InputAdornment position="end">{checkserialLoading ? <CircularProgress size={20} /> : <QrCodeScannerIcon />}</InputAdornment>}
                  />
                  <FormHelperText>Input or scan the unique Serial Numbers of the devices. </FormHelperText>
                </FormControl>
                <div className="flex items-center gap-[10px]">
                  <Button disabled={loading} onClick={() => setResetAlert(true)} startIcon={<RotateLeftIcon fontSize="small" />} variant="contained" sx={{ background: "white", color: "red" }}>
                    Reset
                  </Button>
                  <LoadingButton loading={loading} loadingPosition="start" type="submit" startIcon={<SettingsIcon fontSize="small" />} variant="contained">
                    Generate
                  </LoadingButton>
                </div>
              </div>
              <div className=" h-[calc(100vh-210px)] ">
                <MasterqrCodeTable setRowdata={setRowData} rowData={rowData} />
              </div>
            </div>
          ) : (
            <div>
              <div className="h-[90px] flex items-center px-[20px] gap-[20px]">
                <FormControl sx={{ width: "200px" }} variant="outlined">
                  <Select value={type} onChange={(e) => setType(e.target.value)} labelId="demo-simple-select-label" id="demo-simple-select">
                    <MenuItem value="DATE">Date</MenuItem>
                    <MenuItem value="LOTID">Lot ID</MenuItem>
                  </Select>
                </FormControl>
                {type === "DATE" ? (
                  <RangePicker
                    className="w-[330px] h-[50px] border-2 rounded-md border-neutral-400/70 hover:border-neutral-400"
                    presets={rangePresets}
                    onChange={handleDateChange}
                    disabledDate={(current) => current && current > dayjs()}
                    placeholder={["Start date", "End Date"]}
                    value={date.from && date.to ? [date.from, date.to] : null} // Set value based on `from` and `to`
                    format="DD/MM/YYYY" // Update with your desired format
                  />
                ) : (
                  <TextField sx={{ width: "330px" }} label="Lot ID" variant="outlined" value={id} onChange={(e) => setId(e.target.value)} />
                )}
                <LoadingButton
                  variant="contained"
                  onClick={() => {
                    setCalltype("SEARCH");
                    fetchlotlist();
                  }}
                  loading={getlotListLoading && calltype === "SEARCH"}
                  loadingPosition="start"
                  startIcon={<SearchIcon fontSize="small" />}
                >
                  Saerch
                </LoadingButton>
                <IconButton
                  disabled={getlotListLoading && calltype === "REFRESH"}
                  onClick={() => {
                    setCalltype("REFRESH");
                    fetchlotlist();
                  }}
                >
                  <RefreshIcon className={`${getlotListLoading && calltype === "REFRESH" ? "animate-spin" : ""}`} />
                </IconButton>
              </div>
              <GeneratedLotListTable />
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default MasterQrGenerator;
