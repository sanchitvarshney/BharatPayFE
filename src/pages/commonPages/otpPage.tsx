import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useUser } from "@/hooks/useUser";
import { showToast } from "@/utils/toasterContext";
import { Icons } from "@/components/icons";
import { getQRStatus, verifyOtpAsync } from "@/features/authentication/authSlice";
import { Button } from "@/components/ui/button";

const OtpPage: React.FC = () => {
  const { qrStatus } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { clearUser, saveUser } = useUser();
  const { qrCodeLoading } = useAppSelector(
    (state) => state.auth
  );
  const [otp, setOtp] = useState<string>("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isShowQr , setIsShowQr] = useState<boolean>(false);
  const [secretKey, setSecretKey] = useState<string>("");

  // Check if the user has already completed 2FA
  useEffect(() => {
    if (qrStatus) {
      setIsShowQr(qrStatus?.qrCode==="Y");
    }
  }, [qrStatus]);
  // Fetch the QR code for 2FA if it's not enabled
  useEffect(() => {
    if (qrStatus?.isTwoStep==="Y") {
      localStorage.setItem("token", qrStatus?.token ?? "");
        dispatch(getQRStatus({ crnId: qrStatus?.token ?? "" })).then(
          (res: any) => {
            console.log(res.payload.data.data);
            if (res.payload.data.code === 200) {
              setQrCode(res.payload.data.data.url); // Set the QR code from the backend
              setSecretKey(res.payload.data.data.secret);
            }
          }
        );
    }
  }, [dispatch, qrStatus]);

  // Handle OTP submission
  const handleOtpSubmit = () => {
    if (!otp) return showToast("Please enter the OTP", "error");
    dispatch(verifyOtpAsync({ otp: otp, secret: secretKey })).then((res: any) => {

      if (res.payload.data.success) {
        showToast("OTP Verified Successfully", "success");
        // window.location.reload();
        window.location.replace("/"); // Assuming "/dashboard" is the user landing page
      } else {
        showToast("Invalid OTP, please try again", "error");
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-white relative">
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

      <div className={`w-[650px] py-[50px] px-[20px] ${isShowQr ? "h-auto" : "h-[calc(100vh-250px)]"}`}>
        <Typography variant="inherit" fontSize={17} gutterBottom>
          MsCorpres Automation
        </Typography>
        <Typography gutterBottom variant="h1" fontWeight={600} fontSize={25}>
          Two-Factor Authentication
        </Typography>

        {/* Display QR Code if 2FA is not enabled */}
        {isShowQr && qrCode && (
          <div className="flex justify-center items-center mt-6">
            <img src={qrCode} alt="QR Code" className="w-[250px] h-[250px]" />
          </div>
        )}

        <Typography
          variant="inherit"
          fontSize={15}
          gutterBottom
          className="mt-4"
        >
          {!isShowQr
            ? "Enter the OTP from your device."
            : "Scan the QR code with your authentication app to enable 2FA, then enter the OTP."}
        </Typography>

        {/* OTP input field */}
        <div className="flex flex-col gap-[20px] mt-[20px] justify-start items-center">
          <FormControl fullWidth variant="outlined">
        
            <OutlinedInput
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              autoFocus
              sx={{
                borderRadius: "15px",
                "& .MuiInputBase-input::placeholder": {
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "gray",
                },
              }}
              placeholder="Enter OTP"
              id="otp-input"
              endAdornment={<InputAdornment position="end"></InputAdornment>}
              inputProps={{ maxLength: 6 }}
            />
          </FormControl>

          <Button
            disabled={qrCodeLoading}
            onClick={handleOtpSubmit}
            className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-neutral-300 disabled:text-slate-400"
          >
            {qrCodeLoading ? <CircularProgress size={25} /> : "Verify OTP"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
