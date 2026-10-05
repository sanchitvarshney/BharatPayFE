import React, { useState } from "react";
import { Button, InputAdornment, Link, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LockPersonOutlinedIcon from "@mui/icons-material/LockPersonOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import { recoveryAccount } from "@/features/authentication/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import AuthDialog, { cancelSx, primarySx } from "./AuthDialog";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (value: string) => {
  if (!value.trim()) return "Email address is required";
  if (!EMAIL_REGEX.test(value.trim())) return "Enter a valid email address";
  return "";
};

interface LockUnlockDialogProps {
  open: boolean;
  onClose: () => void;
}

const LockUnlockDialog: React.FC<LockUnlockDialogProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { recoveryLoading } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const reset = () => {
    setEmail("");
    setError("");
    setTouched(false);
    setSentTo(null);
  };

  const handleClose = () => {
    if (recoveryLoading) return;
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const message = validateEmail(email);
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
    <AuthDialog
      open={open}
      onExited={reset}
      icon={sentTo ? <MarkEmailReadOutlinedIcon /> : <LockPersonOutlinedIcon />}
      title={sentTo ? "Check your inbox" : "Lock / Unlock account"}
      subtitle={
        sentTo ? (
          <>
            We've sent instructions to <span className="font-semibold text-slate-700">{sentTo}</span>.
            It can take a few minutes to arrive, so check your spam folder too.
          </>
        ) : (
          "Enter your registered email and we'll send you a verification link to lock or unlock your account."
        )
      }
    >
      {sentTo ? (
        <>
          <Button
            fullWidth
            size="large"
            variant="contained"
            disableElevation
            onClick={handleClose}
            sx={primarySx}
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
        </>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[18px]">
          <TextField
            autoFocus
            fullWidth
            label="Email address"
            type="email"
            autoComplete="email"
            value={email}
            disabled={recoveryLoading}
            onChange={(e) => {
              setEmail(e.target.value);
              if (touched) setError(validateEmail(e.target.value));
            }}
            onBlur={() => {
              setTouched(true);
              if (email) setError(validateEmail(email));
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

          <div className="flex flex-col-reverse sm:flex-row gap-[10px] mt-[6px]">
            <Button
              fullWidth
              size="large"
              variant="outlined"
              color="inherit"
              onClick={handleClose}
              disabled={recoveryLoading}
              sx={cancelSx}
            >
              Cancel
            </Button>
            <LoadingButton
              fullWidth
              loading={recoveryLoading}
              size="large"
              variant="contained"
              type="submit"
              startIcon={<SendRoundedIcon />}
              loadingPosition="start"
              disableElevation
              sx={primarySx}
            >
              {recoveryLoading ? "Sending..." : "Send link"}
            </LoadingButton>
          </div>
        </form>
      )}
    </AuthDialog>
  );
};

export default LockUnlockDialog;
