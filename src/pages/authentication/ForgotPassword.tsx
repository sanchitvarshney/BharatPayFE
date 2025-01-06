import { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/system";
import { IoMdMail } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdSecurity } from "react-icons/md";
// import { AppDispatch } from "@/store";
// import { useDispatch } from "react-redux";
// import { getPasswordOtp, verifyOtp } from "@/features/authentication/authSlice";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  position: "relative",
  overflow: "hidden",
}));

const FormContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    "&.Mui-focused": {
      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15)",
    },
  },
}));

const SecurityImage = styled(Box)({
  width: "100%",
  minHeight: "400px", // Ensure there's a minimum height
  backgroundImage:
    'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: 16,
});

const ForgotPassword = () => {
  const theme = useTheme();
  // const dispatch = useDispatch<AppDispatch>();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [step, setStep] = useState(1);

  const validateEmail = (email:string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (field: string) => (event:any) => {
    const value = event.target.value;
    setFormData({ ...formData, [field]: value });

    if (field === "email") {
      setErrors({
        ...errors,
        email: !validateEmail(value) ? "Invalid email format" : "",
      });
    } else if (field === "confirmPassword") {
      setErrors({
        ...errors,
        confirmPassword:
          value !== formData.newPassword ? "Passwords do not match" : "",
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (step === 1) {
        // dispatch(getPasswordOtp(formData.email)).then((res: any) => {
        //   if (res?.payload?.success) {
        //     setStep(2);
        //   } 
        // });
        setStep(2);
      } else if (step === 2) {
        // const payload = {
        //   emailId: formData.email,
        //   otp: formData.verificationCode, 
        //   password: formData.confirmPassword                                                                       
        // }
        // dispatch(verifyOtp(payload as any)).then((res: any) => {
        //     console.log(res)
        //     if(res?.payload?.success){
        //       setStep(3);
        //     }
        // })
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 4,
          minHeight: "80vh",
          alignItems: "center",
        }}
      >
        <Box flex={1}>
          <StyledPaper elevation={0}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 600, color: theme.palette.primary.main }}
            >
              Password Recovery
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {step === 1
                ? "Enter your email address to receive a verification code."
                : step === 2
                ? "Enter the verification code sent to your email and Create your new password."
                : ""}
            </Typography>

            <form onSubmit={handleSubmit}>
              <FormContainer>
                {step === 1 && (
                  <StyledTextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange("email")}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    required
                    autoComplete="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IoMdMail />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

                {step === 2 && (
                  <>
                  <StyledTextField
                    fullWidth
                    label="Verification Code"
                    value={formData.verificationCode}
                    onChange={handleChange("verificationCode")}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MdSecurity />
                        </InputAdornment>
                      ),
                    }}
                  />
                    <StyledTextField
                      fullWidth
                      label="New Password"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange("newPassword")}
                      required
                      autoComplete="new-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <RiLockPasswordLine />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <StyledTextField
                      fullWidth
                      label="Confirm Password"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange("confirmPassword")}
                      error={Boolean(errors.confirmPassword)}
                      helperText={errors.confirmPassword}
                      required
                      autoComplete="new-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <RiLockPasswordLine />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    backgroundColor: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : step === 1 ? (
                    "Send Verification Code"
                  ) : step === 2 ? (
                    "Submit"
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                {step > 1 && (
                  <Button
                    variant="text"
                    onClick={() => setStep(step - 1)}
                    sx={{ mt: 1 }}
                  >
                    Go Back
                  </Button>
                )}
              </FormContainer>
            </form>
          </StyledPaper>
        </Box>

        {!isMobile && (
          <Box flex={1}>
            <SecurityImage />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ForgotPassword;