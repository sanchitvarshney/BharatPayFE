import React, { useState } from "react";
import {
  CardContent,
  FormControl,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { showToast } from "@/utils/toasterContext";
import { Icons } from "@/components/icons";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getDeviceImages } from "@/features/common/commonSlice";

const ViewImage: React.FC = () => {
  const [deviceType, setDeviceType] = useState<string>("");
  const [awbNumber, setAwbNumber] = useState<string>("");
  const [serialNo, setSerialNo] = useState<string>("");
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const dispatch = useAppDispatch();
  const { deviceImages, deviceImagesLoading, deviceImagesError } =
    useAppSelector((state) => state.common);

  const handleSearch = async () => {
    if (!deviceType || !awbNumber || !serialNo) {
      showToast(
        "Please enter Device Type, AWB Number, and Serial Number",
        "error"
      );
      return;
    }
    setCurrentImageIdx(0);
    dispatch(getDeviceImages({ deviceType, awbNumber, serialNo }));
  };

  const handlePrev = () => {
    if (!deviceImages) return;
    setCurrentImageIdx((idx) =>
      idx === 0 ? deviceImages.length - 1 : idx - 1
    );
  };
  const handleNext = () => {
    if (!deviceImages) return;
    setCurrentImageIdx((idx) =>
      idx === deviceImages.length - 1 ? 0 : idx + 1
    );
  };

  const currentImage = deviceImages?.[currentImageIdx];
  const currentImgUrl = currentImage?.img_url?.[0];

  return (
    <div className="relative flex bg-white">
      {/* Left: Device Info & Search */}
      <div
        className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)] border-r border-neutral-300 min-w-[400px] max-w-[400px] items-center`}
      >
        <Paper elevation={0} className="m-8 w-full">
          <CardContent>
            {/* Beautiful heading */}
            <Typography
              variant="h4"
              className="text-slate-800 font-bold mb-3 mt-2 text-center tracking-tight"
              style={{ letterSpacing: 1 }}
            >
              View Image
            </Typography>
            <div className="flex flex-col gap-[20px] px-[20px] py-[20px]">
              <div className="flex flex-col gap-[10px]">
                <Typography
                  variant="subtitle1"
                  className="text-slate-600 font-medium"
                >
                  Device Type
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    displayEmpty
                    inputProps={{ "aria-label": "Device Type" }}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgb(203 213 225)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgb(148 163 184)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgb(14 116 144)",
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select Device Type</em>
                    </MenuItem>
                    <MenuItem value="soundbox">Sound Box Image</MenuItem>
                    <MenuItem value="swipe">Swipe Machine Image</MenuItem>
                    <MenuItem value="sim">SIM Image</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="flex flex-col gap-[10px]">
                <Typography
                  variant="subtitle1"
                  className="text-slate-600 font-medium"
                >
                  AWB Number
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={awbNumber}
                  onChange={(e) => setAwbNumber(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgb(203 213 225)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgb(148 163 184)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "rgb(14 116 144)",
                      },
                    },
                  }}
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <Typography
                  variant="subtitle1"
                  className="text-slate-600 font-medium"
                >
                  Serial Number
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={serialNo}
                  onChange={(e) => setSerialNo(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgb(203 213 225)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgb(148 163 184)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "rgb(14 116 144)",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </CardContent>
          <div className="h-[50px] px-[20px] flex items-center justify-between gap-[10px] pb-4">
            <LoadingButton
              loading={deviceImagesLoading}
              onClick={handleSearch}
              startIcon={<Icons.search />}
              variant="contained"
            >
              Search
            </LoadingButton>
          </div>
        </Paper>
      </div>
      {/* Right: Image Carousel & Device Info */}
      <div className="w-full flex flex-col h-[calc(100vh-100px)] overflow-y-auto items-center justify-center">
        <div className="flex flex-col items-center justify-center h-full w-full p-6">
          {deviceImagesLoading ? (
            <Typography variant="body1">Loading...</Typography>
          ) : deviceImagesError ? (
            <Typography color="error">{deviceImagesError}</Typography>
          ) : !deviceImages || deviceImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <img
                src="/search.svg"
                className="w-[200px] opacity-60 mb-4"
                alt="No images"
              />
              <Typography variant="body2" color="textSecondary">
                No images to display
              </Typography>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <div className="relative w-full flex items-center justify-center">
                {deviceImages.length > 1 && (
                  <IconButton
                    onClick={handlePrev}
                    className="absolute left-0 z-10"
                  >
                    <Icons.left fontSize="large" />
                  </IconButton>
                )}
                <div className="flex flex-col items-center w-full">
                  <img
                    src={currentImgUrl}
                    alt={currentImage?.img_name}
                    className="rounded-lg object-contain max-h-[400px] max-w-full border shadow"
                  />
                  <Typography
                    variant="subtitle1"
                    className="mt-2 font-semibold text-slate-700"
                  >
                    {currentImage?.img_name}
                  </Typography>
                </div>
                {deviceImages.length > 1 && (
                  <IconButton
                    onClick={handleNext}
                    className="absolute right-0 z-10"
                  >
                    <Icons.right fontSize="large" />
                  </IconButton>
                )}
              </div>
              {deviceImages.length > 1 && (
                <Typography variant="caption" className="mt-2 text-slate-500">
                  {currentImageIdx + 1} / {deviceImages.length}
                </Typography>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewImage;
