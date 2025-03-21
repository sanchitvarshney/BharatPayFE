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
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/features/Store";
import { recoveryAccount } from "@/features/authentication/authSlice";
import { useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { useNavigate } from "react-router-dom";

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

const RecoveryPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const {recoveryLoading} = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<any>({});

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
    // setLoading(true);

    try {
        dispatch(recoveryAccount({ email:formData.email })).then((res: any) => { 
          if (res?.payload?.data?.success) {
            showToast(res?.payload?.data?.message, "success");
            navigate("/login");          } 
        });
    } catch (error) {
      console.error("Error:", error);
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
              Account Recovery
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
            
          Enter your email address to receive a verification code.
            </Typography>

            <form onSubmit={handleSubmit}>
              <FormContainer>
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

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={recoveryLoading}
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
                  {recoveryLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) :(
                    "Submit"
                  )}
                </Button>
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

export default RecoveryPassword;