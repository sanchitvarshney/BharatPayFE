import { Card, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css/effect-fade";
import LoadingButton from "@mui/lab/LoadingButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PasswordIcon from "@mui/icons-material/Password";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PhonelinkLockRoundedIcon from "@mui/icons-material/PhonelinkLockRounded";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginCredentials, loginUserAsync } from "@/features/authentication/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { checkPermissions } from "@/helper/checkPermissions";
import { showToast } from "@/utils/toasterContext";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const LogningV2: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null); // Add state to track the reCAPTCHA value
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

  
  const onSubmit: SubmitHandler<LoginCredentials> = (data) => {
    if (!recaptchaValue) {
      showToast("Please verify the reCAPTCHA", "error");
      // return;
    }

    dispatch(loginUserAsync(data)).then((response: any) => {
      if (response.payload?.data?.success) {
        showToast(response.payload?.data?.message, "success");
        navigate("/");
      } else {
        showToast(response.payload?.data?.message, "error");
      }
    });
  };

  const handleRecaptchaChange = (value: string | null) => {
    setRecaptchaValue(value);
  };

  return (
    <div className="h-[100vh]  w-full grid grid-cols-2">
      <div className="w-full h-full bg-neutral-100 ">
        <Swiper
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          effect={"fade"}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, EffectFade, Autoplay]}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="h-[50vh] bg-[url(/loginv2bg2.svg)] bg-cover flex items-center justify-center ">
              <Typography variant="h1" fontSize={50} fontWeight={500} className="text-white">
                Welcome to the Future of ERP
              </Typography>
            </div>
            <div className="h-[50vh] py-[20px] px-[50px] bg-neutral-100  ">
              <Typography variant="h2" fontSize={25} fontWeight={500} className="text-stone-700">
                Revolutionizing Business Operations
              </Typography>
              <Typography variant="h3" fontSize={17} fontWeight={500} className="text-stone-700">
                Scalable, secure, and tailored to grow with your business.
              </Typography>
              <ul className="flex flex-col gap-[15px] mt-[20px] ml-2 h-[calc(50vh-120px)] overflow-y-auto ">
                {[
                  "Scalable design to meet the demands of growing businesses.",
                  "Instant alerts for stock updates and sales activities",
                  "Multi-location tracking for global operations.",
                  "Seamless integration with accounting, CRM, and e-commerce.",
                  "Regular updates to keep the system future-proof.",
                ].map((text, index) => (
                  <li key={index} className="flex items-center gap-[10px]">
                    <DoneAllIcon color="primary" />
                    <Typography fontSize={15}>{text}</Typography>
                  </li>
                ))}
              </ul>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[50vh]  bg-[url(/loginv2bg2.svg)] bg-cover flex items-center justify-center">
              <Typography variant="h1" fontSize={50} fontWeight={500} className="text-white">
                Powering Smarter Operations
              </Typography>
            </div>
            <div className="h-[50vh] py-[20px] px-[50px] bg-neutral-100  ">
              <Typography variant="h2" fontSize={25} fontWeight={500} className="text-stone-700">
                Effortless Inventory Management
              </Typography>
              <Typography variant="h3" fontSize={17} fontWeight={500} className="text-stone-700">
                Track, manage, and optimize your inventory with ease.
              </Typography>
              <ul className="flex flex-col gap-[15px] mt-[20px] ml-2 h-[calc(50vh-120px)] overflow-y-auto ">
                {[
                  "Real-Time Inventory Updates: Stay informed with real-time stock tracking and updates.",
                  "Streamlined Operations: Manage purchases, sales, and stock transfers seamlessly.",
                  "User-Friendly Dashboard: Access all essential features through an intuitive and responsive interface.",
                  "Multi-User Access: Enable team collaboration with role-based permissions.",
                  "Secure Data Management: Ensure the safety of your data with robust security protocols.",
                ].map((text, index) => (
                  <li key={index} className="flex items-center gap-[10px]">
                    <DoneAllIcon color="primary" />
                    <Typography fontSize={15}>{text}</Typography>
                  </li>
                ))}
              </ul>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="relative flex items-center justify-center w-full h-full">
        <Card elevation={4} sx={{ width: "500px", padding: "20px" }}>
          <Typography color="primary" variant="h1" component={"div"} className="flex items-center justify-center  text-slate-600 gap-[5px]" fontSize={35} fontWeight={500}>
            <PhonelinkLockRoundedIcon fontSize="large" />
            Secure Login
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-[50px] flex flex-col gap-[30px]">
              <FormControl error={!!errors.username} fullWidth variant="outlined">
                <InputLabel htmlFor="input-with-icon-adornment">Username</InputLabel>
                <OutlinedInput
                  autoFocus
                  autoComplete="off"
                  {...register("username", { required: "username is required" })}
                  label="Username"
                  id="input-with-icon-adornment"
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountCircleIcon />
                    </InputAdornment>
                  }
                />
                {errors.username && <FormHelperText id="component-error-text">{errors.username.message}</FormHelperText>}
              </FormControl>
              <div className="flex flex-col items-end gap-[3px]">
                <FormControl error={!!errors.password} fullWidth variant="outlined">
                  <InputLabel htmlFor="input-with-password-adornment">Password</InputLabel>
                  <OutlinedInput
                    autoComplete="off"
                    {...register("password", { required: "password is required" })}
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    id="input-with-password-adornment"
                    startAdornment={
                      <InputAdornment position="start">
                        <PasswordIcon />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {errors.password && <FormHelperText id="component-error-text">{errors.password.message}</FormHelperText>}
                </FormControl>
                <Link href="/forgot-password" fontSize={12} className="">
                  Forgot Password
                </Link>
              </div>
            <div className=" flex justify-center">
              <ReCAPTCHA sitekey="6LfnCN8qAAAAAGEKq5Biwbq4OqdpP6zwY1uuRiTE" onChange={handleRecaptchaChange} />
            </div>
              <LoadingButton loading={loading} size="large" variant="contained" fullWidth type="submit">
                Login
              </LoadingButton>
            </div>
            <div className="mt-[30px]">
              <Typography fontSize={12} className="text-center">
                This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply. For more info, please visit
                <Link sx={{ ml: "4px" }} href="www.mscorpres.com" target="_blank">
                  www.mscorpres.com
                </Link>
                .
              </Typography>
            </div>
          </form>
        </Card>
        <div className="absolute bottom-0 left-0 flex items-center justify-center w-full text-center  py-[10px]">
          <Typography fontSize={13}>
            &copy; 2019 - {new Date().getFullYear()}. All Rights Reserved
            <br />
            Performance & security by{" "}
            <Link href="https://mscorpres.com/" target="blank">
              MsCorpres Automation Pvt. Ltd.
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default LogningV2;
