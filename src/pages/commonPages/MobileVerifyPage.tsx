import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { FormControl, IconButton, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import React from "react";
import CircularProgress, { CircularProgressProps } from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { useNavigate } from "react-router-dom";

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
          {`${Math.round(props.value / 3.33333333333)}s`}
        </Typography>
      </Box>
    </Box>
  );
}

const MobileVerifyPage: React.FC = () => {
  const [progress, setProgress] = React.useState(30); // Start with 30 seconds
  const [send, setSend] = React.useState<boolean>(true);
  const navigate = useNavigate();
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

  return (
    <>
      <div className="flex justify-center h-[100vh] bg-white relative">
        <div className="absolute top-[30px] right-[20px]">
          <Button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
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
            Check Your SMS
          </Typography>
          <Typography variant="inherit" fontSize={15} gutterBottom>
            Enter the code that we sent to 9************12
          </Typography>
          <div className="w-full h-[250px] overflow-hidden flex items-end justify-center bg-teal-100">
            <img src="./mailverify.png" alt="" className="w-[50%]" />
          </div>
          <div className="flex flex-col gap-[20px] mt-[20px] justify-start items-center">
            <FormControl fullWidth variant="outlined">
              <OutlinedInput
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
                            onClick={() => {
                              setSend(false);
                              setProgress(30); // Reset timer
                            }}
                            size="small"
                          >
                            <Icons.refresh />
                          </IconButton>
                        </MuiTooltip>
                      ) : (
                        <CircularProgressWithLabel size={30} value={progress * 3.33333333333} />
                      )}
                      <Icons.mobile />
                    </div>
                  </InputAdornment>
                }
              />
            </FormControl>

            <Button className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600">Continue</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileVerifyPage;
