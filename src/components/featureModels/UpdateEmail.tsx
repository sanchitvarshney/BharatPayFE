import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, CircularProgress, CircularProgressProps, Divider, IconButton, InputAdornment, LinearProgress, TextField, Typography } from "@mui/material";
import { Icons } from "../icons";

import MuiTooltip from "../reusable/MuiTooltip";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getEmailOtpAsync, updateEmailAsync } from "@/features/authentication/authSlice";
import { showToast } from "@/utils/toasterContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
type Props = {
  open: boolean;
  handleClose: () => void;
};
function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" sx={{ color: "text.secondary" }}>
          {`${Math.round(props.value)}s`}
        </Typography>
      </Box>
    </Box>
  );
}

const UpadteEmail: React.FC<Props> = ({ open, handleClose }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { emailOtpLoading, updateEmailLoading } = useAppSelector((state) => state.auth);
  const [update, setUpdate] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState(100); // Start with 30 seconds
  const [send, setSend] = React.useState<boolean>(true);
  const [otp, setOtp] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");

  useEffect(() => {
    setUpdate(false);
    setEmail("");
    setOtp("");
  }, [open]);
  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (!send) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress <= 1) {
            setSend(true);
            clearInterval(timer!);
            return 100; // Reset the timer
          }
          return prevProgress - 1; // Decrement by 1 second
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [send]);
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <div className="absolute top-0 left-0 right-0">{(emailOtpLoading || updateEmailLoading) && <LinearProgress />}</div>
      <DialogTitle id="alert-dialog-title">
        <Typography fontWeight={600} fontSize={20}>
          {update ? "Update Email" : "   Are you sure ?"}
        </Typography>
      </DialogTitle>

      {update && <Divider />}
      {update ? (
        <DialogContent className="max-h-[70vh] overflow-y-auto flex flex-col gap-[20px] min-w-[600px]">
          <Typography>Enter the OTP sent to your email address</Typography>
          <TextField
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            variant="filled"
            label="OTP"
            placeholder="0000"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <div className="flex items-center gap-[10px]">
                      {send ? (
                        <MuiTooltip title="Resend Code" placement="top">
                          <IconButton
                            disabled={emailOtpLoading}
                            onClick={() => {
                              dispatch(getEmailOtpAsync()).then((res: any) => {
                                if (res.payload.data.success) {
                                  setUpdate(true);
                                  setSend(false);
                                  setProgress(100); // Reset timer
                                }
                              });
                            }}
                            size="small"
                          >
                            <Icons.refresh />
                          </IconButton>
                        </MuiTooltip>
                      ) : (
                        <CircularProgressWithLabel size={30} value={progress} />
                      )}
                      <Icons.code />
                    </div>
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="filled"
            label="New Email"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Icons.email />
                  </InputAdornment>
                ),
              },
            }}
          />
        </DialogContent>
      ) : (
        <DialogContent className="max-h-[70vh] overflow-y-auto">Are you sure you want to update your email address? An OTP will be sent to your email for verification.</DialogContent>
      )}
      {update && <Divider />}
      <DialogActions>
        <Button disabled={emailOtpLoading || updateEmailLoading} onClick={handleClose} sx={{ color: "red", background: "white" }} variant="contained">
          Cancel
        </Button>
        {update ? (
          <Button
            disabled={emailOtpLoading || updateEmailLoading}
            onClick={() => {
              if (!email) return showToast("Please enter email", "error");
              if (!otp) return showToast("Please enter otp", "error");
              if (user?.crn_email === email) return showToast("Please enter different email", "error");
              //regex for chekc valid emal
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast("Please enter valid email", "error");
              dispatch(updateEmailAsync({ otp: otp, emailId: email })).then((res: any) => {
                if (res.payload.data.success) {
                  setUpdate(false);
                  localStorage.clear();
                  navigate("/login");
                }
              });
            }}
            variant="contained"
          >
            Update
          </Button>
        ) : (
          <Button
            disabled={emailOtpLoading}
            onClick={() => {
              dispatch(getEmailOtpAsync()).then((res: any) => {
                if (res.payload.data.success) {
                  setUpdate(true);
                  setSend(false);
                  setProgress(100); // Reset timer
                }
              });
            }}
            autoFocus
            variant="contained"
          >
            Continue
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UpadteEmail;
