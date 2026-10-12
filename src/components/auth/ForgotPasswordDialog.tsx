import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, IconButton, InputAdornment, Link, TextField, Tooltip, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PasswordRoundedIcon from "@mui/icons-material/PasswordRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ReCAPTCHA from "react-google-recaptcha";
import { getPasswordOtp, updatePassword } from "@/features/authentication/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import AuthDialog, { cancelSx, primarySx } from "./AuthDialog";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN = 30;

type Errors = Partial<Record<"email" | "otp" | "password" | "confirmPassword", string>>;

const StepIndicator = ({ step }: { step: 1 | 2 }) => (
  <div className="flex items-center gap-[8px]">
    {[1, 2].map((s) => (
      <div
        key={s}
        className={`h-[4px] flex-1 rounded-full transition-colors duration-300 ${
          s <= step ? "bg-cyan-600" : "bg-slate-200"
        }`}
      />
    ))}
    <Typography fontSize={12} fontWeight={600} className="!ml-[6px] text-slate-400 whitespace-nowrap">
      Step {step} of 2
    </Typography>
  </div>
);

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { otpLoading } = useAppSelector((state) => state.auth);
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [cooldown, setCooldown] = useState(0);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [recaptchaKey, setRecaptchaKey] = useState(Math.random());
  const [recaptchaError, setRecaptchaError] = useState(false);
  const recaptchaRef = useRef<any>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const reset = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setErrors({});
    setCooldown(0);
    setRecaptchaValue(null);
    setRecaptchaError(false);
    setRecaptchaKey(Math.random());
  };

  const resetRecaptcha = () => {
    setRecaptchaValue(null);
    setRecaptchaKey(Math.random());
  };

  const sendOtp = (onSuccess?: () => void) => {
    dispatch(getPasswordOtp({ emailId: email.trim() })).then((res: any) => {
      if (res?.payload?.data?.success) {
        setCooldown(RESEND_COOLDOWN);
        onSuccess?.();
      }
    });
  };

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    const emailError = !value
      ? "Email address is required"
      : !EMAIL_REGEX.test(value)
        ? "Enter a valid email address"
        : "";
    setErrors({ email: emailError });
    if (emailError) return;
    sendOtp(() => setStep(2));
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {
      otp: otp.trim() ? "" : "Verification code is required",
      password: password ? "" : "New password is required",
      confirmPassword: !confirmPassword
        ? "Please confirm your new password"
        : confirmPassword !== password
          ? "Passwords do not match"
          : "",
    };
    setErrors(next);
    const hasErrors = Object.values(next).some(Boolean);
    setRecaptchaError(!recaptchaValue);
    if (hasErrors || !recaptchaValue) return;

    dispatch(
      updatePassword({ emailId: email.trim(), otp: otp.trim(), password: confirmPassword } as any),
    ).then((res: any) => {
      resetRecaptcha();
      if (res?.payload?.data?.success) onClose();
    });
  };

  const goBack = () => {
    setStep(1);
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    resetRecaptcha();
    setRecaptchaError(false);
  };

  const passwordsMatch = !!confirmPassword && confirmPassword === password;

  const visibilityToggle = (
    <InputAdornment position="end">
      <Tooltip title={showPassword ? "Hide password" : "Show password"}>
        <IconButton
          size="small"
          edge="end"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((v) => !v)}
        >
          {showPassword ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
    </InputAdornment>
  );

  return (
    <AuthDialog
      open={open}
      onExited={reset}
      icon={<LockResetRoundedIcon />}
      header={<StepIndicator step={step} />}
      title={step === 1 ? "Forgot password?" : "Set a new password"}
      subtitle={
        step === 1 ? (
          "No worries. Enter your registered email and we'll send you a verification code."
        ) : (
          <>
            Enter the code sent to <span className="font-semibold text-slate-700">{email.trim()}</span>,
            choose a new password And don't refersh your browser.
          </>
        )
      }
    >
      {step === 1 ? (
        <form onSubmit={handleSendCode} noValidate className="flex flex-col gap-[18px]">
          <TextField
            autoFocus
            fullWidth
            label="Email address"
            type="email"
            autoComplete="email"
            value={email}
            disabled={otpLoading}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({});
            }}
            error={!!errors.email}
            helperText={errors.email}
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
          <div className="flex flex-col-reverse sm:flex-row gap-[10px] mt-[6px]">
            <Button fullWidth size="large" variant="outlined" color="inherit" onClick={onClose} disabled={otpLoading} sx={cancelSx}>
              Cancel
            </Button>
            <LoadingButton
              fullWidth
              loading={otpLoading}
              size="large"
              variant="contained"
              type="submit"
              startIcon={<SendRoundedIcon />}
              loadingPosition="start"
              disableElevation
              sx={primarySx}
            >
              {otpLoading ? "Sending..." : "Send code"}
            </LoadingButton>
          </div>
        </form>
      ) : (
        <form onSubmit={handleReset} noValidate className="flex flex-col gap-[18px]">
          <div>
            <TextField
              autoFocus
              fullWidth
              label="Verification code"
              autoComplete="one-time-code"
              value={otp}
              disabled={otpLoading}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\s/g, ""));
                if (errors.otp) setErrors((p) => ({ ...p, otp: "" }));
              }}
              error={!!errors.otp}
              helperText={errors.otp}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordRoundedIcon className="text-slate-400" />
                    </InputAdornment>
                  ),
                },
                htmlInput: { inputMode: "numeric", style: { letterSpacing: 2 } },
              }}
            />
            <Typography fontSize={12} className="!mt-[6px] text-right text-slate-500">
              {cooldown > 0 ? (
                <>Resend code in {cooldown}s</>
              ) : (
                <>
                  Didn't get it?{" "}
                  <Link
                    component="button"
                    type="button"
                    underline="hover"
                    fontWeight={500}
                    disabled={otpLoading}
                    onClick={() => sendOtp()}
                    sx={{ verticalAlign: "baseline", fontSize: 12 }}
                  >
                    Resend code
                  </Link>
                </>
              )}
            </Typography>
          </div>

          <TextField
            fullWidth
            label="New password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            disabled={otpLoading}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((p) => ({ ...p, password: "" }));
            }}
            error={!!errors.password}
            helperText={errors.password}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon className="text-slate-400" />
                  </InputAdornment>
                ),
                endAdornment: visibilityToggle,
              },
            }}
          />

          <TextField
            fullWidth
            label="Confirm new password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={confirmPassword}
            disabled={otpLoading}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: "" }));
            }}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword || (passwordsMatch ? "Passwords match" : "")}
            FormHelperTextProps={{ sx: passwordsMatch && !errors.confirmPassword ? { color: "success.main" } : undefined }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon className="text-slate-400" />
                  </InputAdornment>
                ),
                endAdornment: passwordsMatch ? (
                  <InputAdornment position="end">
                    <CheckRoundedIcon fontSize="small" className="text-emerald-600" />
                  </InputAdornment>
                ) : undefined,
              },
            }}
          />

          <div className="flex flex-col items-center">
            <div className="origin-center scale-[0.92] sm:scale-100">
              <ReCAPTCHA
                sitekey="6LdmVcArAAAAAOb1vljqG4DTEEi2zP1TIjDd_0wR"
                key={recaptchaKey}
                ref={recaptchaRef}
                onChange={(value) => {
                  setRecaptchaValue(value);
                  if (value) setRecaptchaError(false);
                }}
                onExpired={() => setRecaptchaValue(null)}
              />
            </div>
            {recaptchaError && (
              <Alert severity="error" variant="outlined" sx={{ mt: 1, py: 0, width: "100%" }}>
                Please confirm you're not a robot.
              </Alert>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-[10px] mt-[6px]">
            <Button
              fullWidth
              size="large"
              variant="outlined"
              color="inherit"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={goBack}
              disabled={otpLoading}
              sx={cancelSx}
            >
              Back
            </Button>
            <LoadingButton
              fullWidth
              loading={otpLoading}
              size="large"
              variant="contained"
              type="submit"
              startIcon={<LockResetRoundedIcon />}
              loadingPosition="start"
              disableElevation
              sx={primarySx}
            >
              {otpLoading ? "Updating..." : "Reset password"}
            </LoadingButton>
          </div>
        </form>
      )}
    </AuthDialog>
  );
};

export default ForgotPasswordDialog;
