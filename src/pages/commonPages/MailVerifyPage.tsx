import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { FormControl, IconButton, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import React, { useEffect } from "react";
import CircularProgress, { CircularProgressProps } from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { useUser } from "@/hooks/useUser";
import { getEmailOtpAsync, verifyMailAsync } from "@/features/authentication/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";

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

const MailVerifyPage: React.FC = () => {
  const { verifyMailLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { clearUser, saveUser, user } = useUser();
  const [progress, setProgress] = React.useState(30); // Start with 30 seconds
  const [send, setSend] = React.useState<boolean>(true);
  const [otp, setOtp] = React.useState<string>("");

  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (!send) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress <= 1) {
            setSend(true);
            clearInterval(timer!);
            return 30; // Reset the timer
          }
          return prevProgress - 1; // Decrement by 1 second
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [send]);

  useEffect(() => {
   if(user){
    if (!user?.other?.e_v) {
      dispatch(getEmailOtpAsync()).then((res: any) => {
        if (res.payload.data.success) {
          setSend(false);
          setProgress(100); // Reset timer
        }
      });
    }
   }
  }, [user]);
 
  return (
    <>
      <div className="flex justify-center h-[100vh] bg-white relative">
        <div className="absolute top-[30px] right-[20px]">
          <Button
            onClick={() => {
              localStorage.clear();
              clearUser();
              saveUser(null);
              window.location.reload();
            }}
            className="flex items-center gap-[20px] border border-red-500 hover:bg-red-50 shadow-none bg-transparent text-red-500 "
          >
            Logout <Icons.logout />
          </Button>
        </div>
        <div className="w-[650px] h-full py-[50px] px-[20px]">
          <Typography variant="inherit" fontSize={17} gutterBottom>
            MsCorpres Automation
          </Typography>
          <Typography gutterBottom variant="h1" fontWeight={600} fontSize={25}>
            Check Your E-mail
          </Typography>
          <Typography variant="inherit" fontSize={15} gutterBottom>
            Enter the code that we sent to {user?.crn_email}
          </Typography>
          <div className="w-full h-[300px] overflow-hidden flex items-end justify-center bg-teal-100">
            <img src="./verify3.svg" alt="" className="w-[50%]" />
          </div>
          <div className="flex flex-col gap-[20px] mt-[20px] justify-start items-center">
            <FormControl fullWidth variant="outlined">
              <OutlinedInput
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                autoFocus
                sx={{
                  borderRadius: "15px",

                  "& .MuiInputBase-input::placeholder": {
                    fontSize: "16px", // Font size for the placeholder
                    fontWeight: "bold", // Font weight for the placeholder
                    color: "gray", // Optional: Change placeholder color
                  },
                }}
                placeholder="0000-0000"
                id="input-with-password-adornment"
                endAdornment={
                  <InputAdornment position="end">
                    <div className="flex items-center gap-[10px]">
                      {send ? (
                        <MuiTooltip title="Resend Code" placement="top">
                          <IconButton
                          disabled={verifyMailLoading}
                            onClick={() => {
                              dispatch(getEmailOtpAsync()).then((res: any) => {
                                if (res.payload.data.success) {
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
                      <Icons.email />
                    </div>
                  </InputAdornment>
                }
              />
            </FormControl>

            <Button
              disabled={verifyMailLoading}
              onClick={() => {
                if (!otp) return showToast("Please enter the code", "error");
                dispatch(verifyMailAsync({ otp: otp })).then((res: any) => {
                  if (res.payload.data.success) {
                    if (user) {
                      const newuser = {
                        ...user,
                        other: {
                          ...user?.other,
                          e_v: true,
                        },
                      };
                      saveUser(newuser);
                      window.location.reload();
                    }
                  }
                });
              }}
              className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-neutral-300 disabled:text-slate-400"
            >
              {verifyMailLoading ? <CircularProgress size={25} /> : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MailVerifyPage;
