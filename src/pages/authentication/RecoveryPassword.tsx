import React, { useState } from "react";
import { Button, Card, InputAdornment, Link, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LockPersonOutlinedIcon from "@mui/icons-material/LockPersonOutlined";
import { useNavigate } from "react-router-dom";
import { recoveryAccount } from "@/features/authentication/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const POINTS = [
  "Unlock your account after too many failed sign-in attempts",
  "Lock your account instantly if you suspect misuse",
  "Instructions are sent only to your registered email",
];

const RecoveryPassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { recoveryLoading } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const validate = (value: string) => {
    if (!value.trim()) return "Email address is required";
    if (!EMAIL_REGEX.test(value.trim())) return "Enter a valid email address";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Only re-validate live once the user has left the field or tried submitting
    if (touched) setError(validate(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const message = validate(email);
    setError(message);
    if (message) return;

    dispatch(recoveryAccount({ email: email.trim() })).then((res: any) => {
      if (res?.payload?.data?.success) {
        showToast(res?.payload?.data?.message, "success");
        setSentTo(email.trim());
      }
    });
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] bg-white">
      <div className="relative hidden lg:flex flex-col overflow-hidden bg-gradient-to-br from-cyan-700 via-cyan-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url(/loginv2bg2.svg)] bg-cover bg-center opacity-20" />
        <div className="relative z-[1] flex items-center gap-[10px] px-[48px] pt-[40px]">
          <img src="/ms.png" alt="BharatPay" className="h-[36px] w-auto brightness-0 invert" />
        </div>
        <div className="relative z-[1] flex-1 flex items-center px-[48px]">
          <div className="max-w-[520px]">
            <Typography variant="overline" className="text-cyan-200 tracking-[2px]" fontWeight={600}>
              Account security
            </Typography>
            <Typography variant="h1" fontSize={42} fontWeight={700} lineHeight={1.15} className="mt-[6px]">
              Stay in control of your account
            </Typography>
            <Typography fontSize={17} className="mt-[14px] text-cyan-50/80">
              Lock or unlock your BharatPay account securely in a few seconds.
            </Typography>
            <ul className="flex flex-col gap-[14px] mt-[32px]">
              {POINTS.map((text) => (
                <li key={text} className="flex items-start gap-[12px]">
                  <CheckCircleRoundedIcon fontSize="small" className="text-cyan-300 mt-[2px]" />
                  <Typography fontSize={15} className="text-white/90">
                    {text}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Typography fontSize={12} className="relative z-[1] px-[48px] pb-[24px] text-white/60">
          &copy; 2019 - {new Date().getFullYear()} MsCorpres Automation Pvt. Ltd. All rights reserved.
        </Typography>
      </div>

      <div className="flex flex-col items-center justify-center px-[16px] py-[32px] bg-white">
        <Card
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 400,
            p: { xs: 1, sm: 2 },
            bgcolor: "transparent",
            boxShadow: "none",
            borderRadius: 0,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "#f8fafc",
              transition: "background-color 0.2s",
              "& fieldset": { borderColor: "#e2e8f0" },
              "&:hover fieldset": { borderColor: "#cbd5e1" },
              "&.Mui-focused": { bgcolor: "#ffffff" },
            },
          }}
        >
          <img src="/bharatpay.svg" alt="BharatPay" className="h-[120px] w-[120px] object-contain lg:hidden" />

          {sentTo ? (
            <div className="flex flex-col">
              <div className="h-[56px] w-[56px] rounded-full bg-cyan-50 flex items-center justify-center">
                <MarkEmailReadOutlinedIcon className="text-cyan-700" />
              </div>
              <Typography variant="h1" fontSize={28} fontWeight={700} className="!mt-[20px] text-slate-800">
                Check your inbox
              </Typography>
              <Typography fontSize={14} className="!mt-[6px] text-slate-500 leading-[1.6]">
                We've sent instructions to <span className="font-semibold text-slate-700">{sentTo}</span>.
                It can take a few minutes to arrive, so check your spam folder too.
              </Typography>

              <Button
                fullWidth
                size="large"
                variant="contained"
                disableElevation
                onClick={() => navigate("/login")}
                sx={{ mt: 4, height: 48, borderRadius: 2, fontSize: 15, fontWeight: 600, textTransform: "none" }}
              >
                Back to sign in
              </Button>
              <Typography fontSize={13} className="!mt-[16px] text-center text-slate-500">
                Didn't get the email?{" "}
                <Link
                  component="button"
                  type="button"
                  underline="hover"
                  fontWeight={500}
                  onClick={() => setSentTo(null)}
                  sx={{ verticalAlign: "baseline" }}
                >
                  Try again
                </Link>
              </Typography>
            </div>
          ) : (
            <>
              <div className="h-[56px] w-[56px] rounded-full bg-cyan-50 items-center justify-center hidden lg:flex">
                <LockPersonOutlinedIcon className="text-cyan-700" />
              </div>
              <Typography variant="h1" fontSize={28} fontWeight={700} className="lg:!mt-[20px] text-slate-800">
                Lock / Unlock account
              </Typography>
              <Typography fontSize={14} className="!mt-[6px] text-slate-500">
                Enter your registered email and we'll send you a verification link.
              </Typography>

              <form onSubmit={handleSubmit} noValidate>
                <div className="mt-[32px] flex flex-col gap-[18px]">
                  <TextField
                    autoFocus
                    fullWidth
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={handleChange}
                    onBlur={() => {
                      setTouched(true);
                      if (email) setError(validate(email));
                    }}
                    error={!!error}
                    helperText={error}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailOutlineRoundedIcon className="text-slate-400" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <LoadingButton
                    loading={recoveryLoading}
                    size="large"
                    variant="contained"
                    fullWidth
                    type="submit"
                    startIcon={<SendRoundedIcon />}
                    loadingPosition="start"
                    disableElevation
                    sx={{ height: 48, borderRadius: 2, fontSize: 15, fontWeight: 600, textTransform: "none" }}
                  >
                    {recoveryLoading ? "Sending..." : "Send verification link"}
                  </LoadingButton>
                </div>
              </form>

              <Link
                href="/login"
                underline="hover"
                fontSize={14}
                fontWeight={500}
                className="!mt-[24px] flex items-center justify-center gap-[6px]"
              >
                <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
                Back to sign in
              </Link>
            </>
          )}
        </Card>

        <Typography fontSize={12} className="mt-[24px] text-center text-slate-500">
          Performance & security by{" "}
          <Link href="https://mscorpres.com/" target="_blank" rel="noopener noreferrer" underline="hover">
            MsCorpres Automation
          </Link>
        </Typography>
      </div>
    </div>
  );
};

export default RecoveryPassword;
