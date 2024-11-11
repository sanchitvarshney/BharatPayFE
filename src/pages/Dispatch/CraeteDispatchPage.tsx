import React from "react";
import Grid from "@mui/material/Grid2";
import { FormControl, Input, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import FileUploader from "@/components/reusable/FileUploader";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

const CraeteDispatchPage: React.FC = () => {
  return (
    <>
      <Grid container className="h-[calc(100vh-100px)] grid grid-cols-[500px_1fr]  bg-white ">
        <Grid size={5} className="w-full h-full border-e border-slate-300">
          <Grid container spacing={3} sx={{ p: "20px" }}>
            <Grid size={6}>
              <TextField fullWidth label={"Customer Name"} variant="standard" />
            </Grid>
            <Grid size={6}>
              <TextField fullWidth label={"Invoice/Challan Number"} variant="standard" />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth variant="standard">
                <InputLabel htmlFor="standard-adornment-qty">Dispatch Quantity</InputLabel>
                <Input
                  type="number"
                  id="standard-adornment-qty"
                  endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                  aria-describedby="standard-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                />
              </FormControl>
            </Grid>
            <Grid size={12}>
              <FileUploader label="Upload Attachments (Optional)" />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label={"Remarks"} variant="standard" multiline rows={3} />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={7} sx={{ p: "20px" }}>
          <FormControl sx={{ width: "400px" }} variant="outlined" size="small">
            <OutlinedInput
              placeholder="Scan or Enter QR Code"
              id="standard-adornment-qty"
              endAdornment={
                <InputAdornment position="end">
                  <QrCodeScannerIcon />
                </InputAdornment>
              }
              aria-describedby="standard-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
            />
          </FormControl>
          <div className="py-[20px]"></div>
        </Grid>
      </Grid>
    </>
  );
};

export default CraeteDispatchPage;
