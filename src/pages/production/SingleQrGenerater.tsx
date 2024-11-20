import { Button, CircularProgress, FormControl, FormHelperText, InputAdornment, InputLabel, LinearProgress, MenuItem, OutlinedInput, Select } from "@mui/material";
import React, { useState } from "react";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import LinkIcon from "@mui/icons-material/Link";
import SimCardIcon from "@mui/icons-material/SimCard";
import LoadingButton from "@mui/lab/LoadingButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { useForm } from "react-hook-form";
import axiosInstance from "@/api/axiosInstance";
import { showToast } from "@/utils/toasterContext";

type FormDataType = {
  imei: string;
  qrurl: string;
  simno: string;
  srno: string;
};
const SingleQrGenerater: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [operater, setOperater] = useState<string>("");
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormDataType>({
    defaultValues: {
      imei: "",
      qrurl: "",
      simno: "",
      srno: "",
    },
  });
  const onsubmit = async (data: FormDataType) => {
    if (!operater) return showToast("Please Select Sim Operater", "error");
    const requestData = {
      srLno: data.srno,
      imeiNo: data.imei,
      operater: operater,
      simNo: data.simno,
      url: data.qrurl,
    };

    setLoading(true); // Set loading state to true before making the request
    setPdfUrl(null);

    try {
      const response = await axiosInstance.post("/dispatchDevicePrint/generateSingleDeviceQr", requestData, {
        responseType: "blob", // Treat response as binary data
      });

      // Create a Blob URL for the received PDF data
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      setPdfUrl(url); // Set the Blob URL to state
      reset();
      setOperater("");
    } catch (error) {
      console.error("Error fetching PDF:", error);
      showToast("Error fetching PDF", "error");
    } finally {
      setLoading(false); // Set loading state to false after the request completes
    }
  };
  return (
    <div className="grid h-full grid-cols-[500px_1fr] bg-white">
      <form onSubmit={handleSubmit(onsubmit)} className="h-full overflow-y-auto">
        <div className="border-r border-neutral-300 p-[20px] h-full ">
          <div className="grid  gap-[25px] mt-[20px]">
            <FormControl error={errors.imei ? true : false} fullWidth variant="outlined">
              <InputLabel>IMEI No.</InputLabel>
              <OutlinedInput
              autoComplete="off"
                {...register("imei", {
                  required: { value: true, message: "IMEI is required." },
                })}
                error={errors.imei ? true : false}
                label="IMEI No."
                id="standard-adornment-qty"
                aria-describedby="standard-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                endAdornment={<InputAdornment position="end">{false ? <CircularProgress size={20} color="inherit" /> : <QrCodeScannerIcon />}</InputAdornment>}
            
              />
              {errors.imei && <FormHelperText>{errors.imei.message}</FormHelperText>}
            </FormControl>
            <FormControl error={errors.srno ? true : false} fullWidth variant="outlined">
              <InputLabel>Sr No.</InputLabel>
              <OutlinedInput
                  autoComplete="off"
                {...register("srno", {
                  required: { value: true, message: "Serial No. is required." },
                })}
                error={errors.imei ? true : false}
                label="Sr No."
                inputProps={{
                  "aria-label": "weight",
                }}
                endAdornment={<InputAdornment position="end">{false ? <CircularProgress size={20} color="inherit" /> : <QrCodeScannerIcon />}</InputAdornment>}
              />
              {errors.srno && <FormHelperText>{errors.srno.message}</FormHelperText>}
            </FormControl>
            <FormControl error={errors.qrurl ? true : false} fullWidth variant="outlined">
              <InputLabel>QR URL</InputLabel>
              <OutlinedInput
                  autoComplete="off"
                error={errors.qrurl ? true : false}
                {...register("qrurl", {
                  required: { value: true, message: "QR URL is required." },
                })}
                label="QR URL."
                inputProps={{
                  "aria-label": "weight",
                }}
                endAdornment={<InputAdornment position="end">{false ? <CircularProgress size={20} color="inherit" /> : <LinkIcon />}</InputAdornment>}
              />
              {errors.qrurl && <FormHelperText>{errors.qrurl.message}</FormHelperText>}
            </FormControl>
            <FormControl error={errors.simno ? true : false} fullWidth variant="outlined">
              <InputLabel>SIM No.</InputLabel>
              <OutlinedInput
                  autoComplete="off"
                error={errors.simno ? true : false}
                {...register("simno", {
                  required: { value: true, message: "SIM No. is required." },
                })}
                label="Sim No."
                id="standard-adornment-qty"
                aria-describedby="standard-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                endAdornment={<InputAdornment position="end">{false ? <CircularProgress size={20} color="inherit" /> : <SimCardIcon />}</InputAdornment>}
              />
              {errors.simno && <FormHelperText>{errors.simno.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">SIM Operator</InputLabel>
              <Select
                onChange={(e) => {
                  setOperater(e.target.value);
                }}
                value={operater}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="SIM Operator"
              >
                <MenuItem value={"Airtel"}>Airtel</MenuItem>
                <MenuItem value={"Vodafone Idea"}> Vodafone Idea</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="mt-[40px] flex items-center justify-end gap-[10px]">
            <Button
              onClick={() => {
                reset();
                setOperater("");
              }}
              sx={{ color: "red", backgroundColor: "white" }}
              startIcon={<RefreshIcon fontSize="small" />}
              variant="contained"
            >
              Reset
            </Button>
            <LoadingButton loadingPosition="start" loading={loading} type="submit" startIcon={<LocalPrintshopIcon fontSize="small" />} variant="contained">
              Generate
            </LoadingButton>
          </div>
        </div>
      </form>
      <div className="relative h-full">
        {loading && (
          <div className="absolute top-0 left-0 right-0">
            <LinearProgress />
          </div>
        )}
        {pdfUrl ? (
          <div style={{ width: "100%", height: "calc(100vh - 100px)" }}>
            <iframe src={pdfUrl} width="100%" height="100%" style={{ border: "none" }} title="PDF Viewer" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <img src="/qr.svg" alt="" className="h-[200px] w-[200px] opacity-50" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleQrGenerater;
