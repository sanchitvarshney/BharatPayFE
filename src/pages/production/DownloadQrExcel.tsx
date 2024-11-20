import { Card, CircularProgress, FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput, Typography } from "@mui/material";
import React from "react";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import InfoIcon from "@mui/icons-material/Info";
import { showToast } from "@/utils/toasterContext";
import axiosInstance from "@/api/axiosInstance";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const DownloadQrExcel: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [lotid, setLotid] = React.useState("");

  const downloadLotSheet = async (lotId: string) => {
    if (!lotId) {
      return showToast("Lot ID is required", "error");
    }

    setLoading(true); // Set loading state to true before making the request

    try {
      const response = await axiosInstance.get(`/dispatchDevicePrint/downloadLotSheet/${lotId}`, {
        responseType: "blob", // Expect binary data (Excel file)
      });

      // Check the response headers to ensure it's an Excel file
      const contentType = response.headers["content-type"];
      if (contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
        // Create a Blob URL for the Excel file
        const blob = new Blob([response.data], { type: contentType });
        const fileUrl = window.URL.createObjectURL(blob);

        // Create a temporary anchor element to download the file
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = `LotSheet_${lotId}.xlsx`; // Name the file
        link.click();

        showToast("Excel file downloaded successfully!", "success");
        setLotid("");
      } else {
        showToast("Unexpected response format", "error");
      }
    } catch (error: any) {
      console.error("Error downloading Excel file:", error);

      if (error.response) {
        const contentType = error.response.headers["content-type"];

        if (contentType.includes("application/json")) {
          // Parse JSON error response
          const errorData = await error.response.data.text();
          const parsedError = JSON.parse(errorData);
          const backendMessage = parsedError.message || "An error occurred";
          showToast(backendMessage, "error");
        } else {
          showToast("Error downloading Excel file", "error");
        }
      } else {
        showToast("Network error or server not reachable", "error");
      }
    } finally {
      setLoading(false); // Set loading state to false after the request completes
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] bg-white grid  overflow-x-hidden">
      <div className="h-full border-r border-neutral-300">
        <div className="p-[30px] grid gap-[30px]">
          <Card sx={{ p: 2, background: "#fffbeb" }}>
            <Typography fontSize={15} className="text-slate-700">
              <InfoIcon className="text-amber-400" sx={{ mr: 1, mb: "2px" }} />
              Download Excel files for created lots, scan QR codes to retrieve Lot IDs, and regenerate PDFs as needed.
            </Typography>
          </Card>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Lot ID</InputLabel>
            <OutlinedInput
              value={lotid}
              label="Lot ID"
              id="standard-adornment-qty"
              aria-describedby="standard-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
              onChange={(e) => {
                setLotid(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (Object.keys(JSON.parse(lotid)).length > 0) {
                    downloadLotSheet(JSON.parse(lotid).lotId);
                  } else {
                    downloadLotSheet(lotid);
                  }
                }
              }}
              endAdornment={<InputAdornment position="end">{loading ? <CircularProgress size={20} /> : <QrCodeScannerIcon />}</InputAdornment>}
              startAdornment={
                <InputAdornment position="start">
                  <img src="/excel.svg" alt="" className="h-[25px] w-[25px]" />
                </InputAdornment>
              }
            />
            <FormHelperText> Enter the unique identifier for the lot or scan the QR code for quick input.</FormHelperText>
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default DownloadQrExcel;
