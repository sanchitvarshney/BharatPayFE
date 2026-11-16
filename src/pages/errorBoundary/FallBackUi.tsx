import {
  Box,
  Typography,
  Container,
  Button,
  ThemeProvider,
} from "@mui/material";
import warningImg from "../../assets/img/error.webp";
import { ArrowForward } from "@mui/icons-material";
import theme from "../../theme";

// Uses window.location instead of useNavigate so it also works
// when rendered by the root ErrorBoundary (outside the router and ThemeProvider).
const FallBackUi = () => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: "100vh",
        }}
      >
        <Box
          component="img"
          src={warningImg}
          alt="Error"
          sx={{
            width: { xs: 100, sm: 200, md: 300 },
            height: { xs: 100, sm: 180, md: 250 },
            opacity: 0.8,
            mb: 1,
          }}
        />

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            color: "text.primary",
          }}
        >
          Oops! Something didn’t go as planned
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: 520,
            color: "text.secondary",
            lineHeight: 1.6,
          }}
        >
          We ran into an unexpected issue while loading this page. Don’t worry —
          your data is safe. You can try refreshing the page or return to the
          home screen to continue.
        </Typography>
        <Typography variant="caption" sx={{ my: 2, color: "text.disabled" }}>
          If the issue persists, please contact support.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={handleReset}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            onClick={handleGoHome}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              textTransform: "none",
              borderRadius: 2,
            }}
            endIcon={<ArrowForward />}
          >
            Go to Home
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default FallBackUi;
