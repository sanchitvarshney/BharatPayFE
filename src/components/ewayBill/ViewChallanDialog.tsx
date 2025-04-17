import React from "react";
import {
  Dialog,
  DialogContent,
  Grid,
  Divider,
  Paper,
  Step,
  StepLabel,
  Stepper,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";

interface ChallanDetails {
  challanId: string;
  dispatchQty: number;
  clientDetail: {
    clientName: string;
    name: string;
    branchName: string;
    pincode: string;
    address1: string;
    address2: string;
  };
  shipToDetails: {
    shipLabel: string;
    pincode: string;
    mobileNo: string;
    city: string;
    address1: string;
    address2: string;
  };
  dispatchFromDetails: {
    address1: string;
    address2: string;
    mobileNo: string;
    gst: string;
    pan: string;
    city: string;
    pin: string;
    dispatchFromLabel: string;
  };
  otherRef: string;
  date: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  challanDetails: ChallanDetails | null;
}

const ViewChallanDialog: React.FC<Props> = ({
  open,
  onClose,
  challanDetails,
}) => {
  if (!challanDetails) return null;

  console.log(challanDetails);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: "#f8fafc",
          width: "90%",
          maxWidth: "1200px",
          margin: "20px",
        },
      }}
    >
      <div className="h-[calc(100vh-100px)]">
        <div className="h-[50px] flex items-center w-full px-[20px] bg-neutral-50 border-b border-neutral-300">
          <Stepper activeStep={0} className="w-full">
            <Step>
              <StepLabel>View Details</StepLabel>
            </Step>
          </Stepper>
        </div>

        <DialogContent className="p-6">
          <div className="h-[calc(95vh-200px)] py-[20px] sm:px-[20px] md:px-[40px] lg:px-[60px] flex flex-col gap-[30px] overflow-y-auto">
            {/* Basic Information */}
            <div className="flex items-center w-full gap-3">
              <div className="flex items-center gap-[5px]">
                <Icons.info />
                <h2 className="text-lg font-semibold">Basic Information</h2>
              </div>
              <Divider
                sx={{
                  borderBottomWidth: 2,
                  borderColor: "#f59e0b",
                  flexGrow: 1,
                }}
              />
            </div>

            <Paper elevation={0} className="p-6 bg-white rounded-lg shadow-sm">
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Challan ID</InputLabel>
                    <FilledInput value={challanDetails.challanId} disabled />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Dispatch Quantity</InputLabel>
                    <FilledInput
                      value={challanDetails.dispatchQty}
                      disabled
                      endAdornment={
                        <InputAdornment position="end">NOS</InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Date</InputLabel>
                    <FilledInput value={challanDetails.date} disabled />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Other Reference</InputLabel>
                    <FilledInput value={challanDetails.otherRef} disabled />
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Client Details */}
            <div className="flex items-center w-full gap-3">
              <div className="flex items-center gap-[5px]">
                <Icons.user />
                <h2 className="text-lg font-semibold">Client Details</h2>
              </div>
              <Divider
                sx={{
                  borderBottomWidth: 2,
                  borderColor: "#f59e0b",
                  flexGrow: 1,
                }}
              />
            </div>

            <Paper elevation={0} className="p-6 bg-white rounded-lg shadow-sm">
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Name</InputLabel>
                    <FilledInput
                      value={challanDetails.clientDetail.name}
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Branch Name</InputLabel>
                    <FilledInput
                      value={challanDetails.clientDetail.branchName}
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>PinCode</InputLabel>
                    <FilledInput
                      value={challanDetails.clientDetail.pincode}
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Address Line 1</InputLabel>
                    <FilledInput
                      value={challanDetails.clientDetail.address1}
                      disabled
                      multiline
                      rows={3}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Address Line 2</InputLabel>
                    <FilledInput
                      value={challanDetails.clientDetail.address2}
                      disabled
                      multiline
                      rows={3}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Ship To Details */}
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

            <Paper elevation={0} className="p-6 bg-white rounded-lg shadow-sm">
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Label</InputLabel>
                    <FilledInput
                      value={challanDetails.shipToDetails.shipLabel}
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Pin Code</InputLabel>
                    <FilledInput
                      value={challanDetails.shipToDetails.pincode}
                      disabled
                    />
                  </FormControl>
                </Grid>
               
                <Grid item xs={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Mobile</InputLabel>
                    <FilledInput
                      value={challanDetails.shipToDetails.mobileNo}
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>City</InputLabel>
                    <FilledInput
                      value={challanDetails.shipToDetails.city}
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Address Line 1</InputLabel>
                    <FilledInput
                      value={challanDetails.shipToDetails.address1}
                      disabled
                      multiline
                      rows={3}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Address Line 2</InputLabel>
                    <FilledInput
                      value={challanDetails.shipToDetails.address2}
                      disabled
                      multiline
                      rows={3}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
             {/* Dispatch From Details */}
             <div className="flex items-center w-full gap-3">
              <div className="flex items-center gap-[5px]">
                <Icons.userAddress />
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

            <Paper elevation={0} className="p-6 bg-white rounded-lg shadow-sm">
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Dispatch From</InputLabel>
                    <FilledInput
                      value={challanDetails.dispatchFromDetails.dispatchFromLabel}
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Pin Code</InputLabel>
                    <FilledInput
                      value={challanDetails.dispatchFromDetails.pin}
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Mobile No</InputLabel>
                    <FilledInput
                      value={challanDetails.dispatchFromDetails.mobileNo}
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>GSTIN</InputLabel>
                    <FilledInput
                      value={challanDetails.dispatchFromDetails.gst}
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>PAN</InputLabel>
                    <FilledInput
                      value={challanDetails.dispatchFromDetails.pan}
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>City</InputLabel>
                    <FilledInput
                      value={challanDetails.dispatchFromDetails.city}
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Address Line 1</InputLabel>
                    <FilledInput
                      value={challanDetails.dispatchFromDetails.address1}
                      disabled
                      multiline
                      rows={3}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Address Line 2</InputLabel>
                    <FilledInput
                      value={challanDetails.dispatchFromDetails.address2}
                      disabled
                      multiline
                      rows={3}
                    />
                  </FormControl>
                </Grid>
                
              </Grid>
            </Paper>

          </div>
        </DialogContent>

        <div className="h-[50px] border-t border-neutral-300 flex items-center justify-end px-[20px] bg-neutral-50 gap-[10px] relative">
          <LoadingButton
            variant="contained"
            startIcon={<Icons.close />}
            onClick={onClose}
            sx={{
              minWidth: "120px",
              height: "36px",
            }}
          >
            Close
          </LoadingButton>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewChallanDialog;
