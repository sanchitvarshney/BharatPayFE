import {
  Alert,
  Card,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css/effect-fade";
import LoadingButton from "@mui/lab/LoadingButton";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import KeyboardCapslockRoundedIcon from "@mui/icons-material/KeyboardCapslockRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  LoginCredentials,
  loginUserAsync,
  loginUserGoogle,
} from "@/features/authentication/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { checkPermissions } from "@/helper/checkPermissions";
import { showToast } from "@/utils/toasterContext";
import { useNavigate } from "react-router-dom";
import { consumeReturnTo } from "@/utils/returnTo";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleLogin } from "@react-oauth/google";

const SLIDES = [
  {
    title: "Welcome to the Future of ERP",
    subtitle: "Revolutionizing business operations",
    description: "Scalable, secure, and tailored to grow with your business.",
    points: [
      "Scalable design to meet the demands of growing businesses",
      "Instant alerts for stock updates and sales activities",
      "Multi-location tracking for global operations",
      "Seamless integration with accounting, CRM, and e-commerce",
    ],
  },
  {
    title: "Powering Smarter Operations",
    subtitle: "Effortless inventory management",
    description: "Track, manage, and optimize your inventory with ease.",
    points: [
      "Real-time stock tracking and updates",
      "Manage purchases, sales, and stock transfers seamlessly",
      "Team collaboration with role-based permissions",
      "Robust security protocols to keep your data safe",
    ],
  },
];

const LogningV2: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [capsLockOn, setCapsLockOn] = React.useState<boolean>(false);
  const [recaptchaValue, setRecaptchaValue] = React.useState<string | null>(
    null
  ); 
  const [recaptchaKey, setRecaptchaKey] = React.useState(Math.random());
  const [recaptchaError, setRecaptchaError] = React.useState<boolean>(false);
  const recaptchaRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const checkUserPermissions = async () => {
      await checkPermissions();
    };

    checkUserPermissions();
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();
  const { loading } = useAppSelector((state) => state.auth);
  const { ref: usernameRef, ...usernameField } = register("username", {
    required: "Please enter your username",
  });
  const { ref: passwordRef, ...passwordField } = register("password", {
    required: "Please enter your password",
  });

  const resetRecaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
    setRecaptchaValue(null);
    setRecaptchaKey(Math.random());
  };

  const onSubmit: SubmitHandler<LoginCredentials> = (data: any) => {
    if (!recaptchaValue) {
      setRecaptchaError(true);
      showToast("Please verify the reCAPTCHA", "error");
      return;
    }

    dispatch(loginUserAsync(data)).then((response: any) => {
      if (response.payload?.data?.success) {
        showToast(response.payload?.data?.message, "success");
        navigate(consumeReturnTo() || "/", { replace: true });
      } else {
        // Check for message in different possible locations
        const errorMessage =
          response.payload?.data?.message || response.payload?.message;
        if (errorMessage) {
          showToast(errorMessage, "error");
        }
        resetRecaptcha();
      }
    });
  };

  const handleRecaptchaChange = (value: string | null) => {
    setRecaptchaValue(value);
    if (value) setRecaptchaError(false);
  };

  const handleLoginWithGoogle = (googleResponse: any) => {
    const data: any = {
      credential: googleResponse.credential,
    };
    dispatch(loginUserGoogle(data)).then((response: any) => {
      if (response.payload?.data?.success) {
        showToast(response.payload?.data?.message, "success");
        navigate(consumeReturnTo() || "/", { replace: true });
      } else {
        // Check for message in different possible locations
        const errorMessage =
          response.payload?.data?.message || response.payload?.message;
        if (errorMessage) {
          showToast(errorMessage, "error");
        }
        resetRecaptcha();
      }
    });
  };

  const handlePasswordKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(e.getModifierState?.("CapsLock") ?? false);
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] bg-white">
      <div className="relative hidden lg:flex flex-col overflow-hidden bg-gradient-to-br from-cyan-700 via-cyan-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url(/loginv2bg2.svg)] bg-cover bg-center opacity-20" />
        <div className="relative z-[1] flex items-center gap-[10px] px-[48px] pt-[40px]">
          <img src="/ms.png" alt="BharatPay" className="h-[36px] w-auto brightness-0 invert" />
        </div>
        <div className="relative z-[1] flex-1 flex items-center px-[48px]">
          <Swiper
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            effect={"fade"}
            fadeEffect={{ crossFade: true }}
            pagination={{ clickable: true }}
            modules={[Pagination, EffectFade, Autoplay]}
          
            className="w-full [&_.swiper-pagination]:!text-left [&_.swiper-pagination]:!left-0"
            style={
              {
                "--swiper-pagination-color": "#ffffff",
                "--swiper-pagination-bullet-inactive-color": "#ffffff",
                "--swiper-pagination-bullet-inactive-opacity": "0.4",
                "--swiper-pagination-bottom": "0px",
                "--swiper-pagination-bullet-horizontal-gap": "4px",
              } as React.CSSProperties
            }
          >
            {SLIDES.map((slide) => (
              <SwiperSlide key={slide.title}>
                <div className="max-w-[520px] pb-[48px]">
                  <Typography
                    variant="overline"
                    className="text-cyan-200 tracking-[2px]"
                    fontWeight={600}
                  >
                    {slide.subtitle}
                  </Typography>
                  <Typography
                    variant="h1"
                    fontSize={42}
                    fontWeight={700}
                    lineHeight={1.15}
                    className="mt-[6px]"
                  >
                    {slide.title}
                  </Typography>
                  <Typography fontSize={17} className="mt-[14px] text-cyan-50/80">
                    {slide.description}
                  </Typography>
                  <ul className="flex flex-col gap-[14px] mt-[32px]">
                    {slide.points.map((text) => (
                      <li key={text} className="flex items-start gap-[12px]">
                        <CheckCircleRoundedIcon fontSize="small" className="text-cyan-300 mt-[2px]" />
                        <Typography fontSize={15} className="text-white/90">
                          {text}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <Typography fontSize={12} className="relative z-[1] px-[48px] pb-[24px] text-white/60">
          &copy; 2019 - {new Date().getFullYear()} MsCorpres Automation Pvt. Ltd. All rights reserved.
        </Typography>
      </div>

      {/* Login form */}
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
            // Softer, flat inputs on the plain white panel
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
          <img src="/bharatpay.svg" alt="BharatPay" className="h-[160px] w-[160px] object-contain mb-[0px] lg:hidden" />
          <Typography variant="h1" fontSize={28} fontWeight={700} className="text-slate-800">
            Welcome back
          </Typography>
          <Typography fontSize={14} className="mt-[6px] text-slate-500">
            Sign in to your account to continue
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mt-[32px] flex flex-col gap-[18px]">
              <TextField
                autoFocus
                fullWidth
                label="Username"
                autoComplete="username"
                error={!!errors.username}
                helperText={errors.username?.message}
                inputRef={usernameRef}
                {...usernameField}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineRoundedIcon className="text-slate-400" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <div>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  onKeyUp={handlePasswordKey}
                  onKeyDown={handlePasswordKey}
                  inputRef={passwordRef}
                  {...passwordField}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon className="text-slate-400" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title={showPassword ? "Hide password" : "Show password"}>
                            <IconButton
                              size="small"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityIcon fontSize="small" />
                              ) : (
                                <VisibilityOffIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                {capsLockOn && (
                  <Typography
                    fontSize={12}
                    className="mt-[6px] flex items-center gap-[4px] text-amber-600"
                  >
                    <KeyboardCapslockRoundedIcon sx={{ fontSize: 16 }} />
                    Caps Lock is on
                  </Typography>
                )}
                <div className="mt-[10px] flex items-center justify-between">
                  <Link href="/password-recovery" fontSize={13} underline="hover">
                    Lock / Unlock user
                  </Link>
                  <Link href="/forgot-password" fontSize={13} underline="hover" fontWeight={500}>
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="origin-center scale-[0.92] sm:scale-100">
                  <ReCAPTCHA
                    sitekey="6LdmVcArAAAAAOb1vljqG4DTEEi2zP1TIjDd_0wR"
                    onChange={handleRecaptchaChange}
                    onExpired={() => setRecaptchaValue(null)}
                    key={recaptchaKey}
                    ref={recaptchaRef}
                  />
                </div>
                {recaptchaError && (
                  <Alert severity="error" variant="outlined" sx={{ mt: 1, py: 0, width: "100%" }}>
                    Please confirm you're not a robot.
                  </Alert>
                )}
              </div>

              <LoadingButton
                loading={loading}
                size="large"
                variant="contained"
                fullWidth
                type="submit"
                startIcon={<LoginRoundedIcon />}
                loadingPosition="start"
                disableElevation
                sx={{ height: 48, borderRadius: 2, fontSize: 15, fontWeight: 600, textTransform: "none" }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </LoadingButton>

              {!loading && (
                <>
                  <Divider sx={{ my: 0.5 }}>
                    <Typography fontSize={12} className="text-slate-400">
                      OR CONTINUE WITH
                    </Typography>
                  </Divider>
                  <div className="flex justify-center w-full">
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        handleLoginWithGoogle(credentialResponse);
                      }}
                      onError={() => {
                        showToast("Google login failed. Please try again.", "error");
                      }}
                      use_fedcm_for_button
                      shape="pill"
                      width="320"
                      text="signin_with"
                    />
                  </div>
                </>
              )}
            </div>
          </form>

          <Typography fontSize={11} className="!mt-[20px] text-center text-slate-400 leading-[1.6]">
            This site is protected by reCAPTCHA and the Google Privacy Policy and
            Terms of Service apply.
          </Typography>
        </Card>

        <Typography fontSize={12} className="mt-[24px] text-center text-slate-500">
          Performance & security by{" "}
          <Link href="https://mscorpres.com/" target="_blank" rel="noopener noreferrer" underline="hover">
            MsCorpres Automation Pvt. Ltd.
          </Link>
        </Typography>
      </div>
    </div>
  );
};

export default LogningV2;
