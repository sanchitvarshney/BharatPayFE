import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { AddAPhotoOutlined, AssessmentOutlined, Close, QrCodeScanner } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Icons } from "@/components/icons";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { requestDeviceApproval } from "@/features/deviceDefect/deviceDefectSlice";
import { fieldSx, selectSx } from "../queries/fqcDeviceImage/fqcDeviceImage.constants";
import FqcImagePreviewModal from "../queries/fqcDeviceImage/FqcImagePreviewModal";
import AWBScannerDialog from "../delivery/AWBScannerDialog";
import { MAX_PHOTOS, compressPhoto } from "./deviceQualityCheck.utils";
import FullScreenPhotoCamera from "./FullScreenPhotoCamera";

const deviceTypeData = [
  { value: "swipe", text: "Swipe Machine" },
  { value: "sound", text: "Sound Box" },
];

type Photo = {
  id: string;
  file: File;
  previewUrl: string;
};

const FieldLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <Typography variant="subtitle1" className="text-slate-600 font-medium">
    {children}
    {required && <span className="text-red-500"> *</span>}
  </Typography>
);

const DeviceQualityCheckContent = () => {
  const dispatch = useAppDispatch();
  const { requestApprovalLoading: loading, requestApprovalError } = useAppSelector((state) => state.deviceDefect);

  const [deviceType, setDeviceType] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  // number of photos still being compressed
  const [processing, setProcessing] = useState(0);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [submittedSerial, setSubmittedSerial] = useState<string | null>(null);

  const photosRef = useRef<Photo[]>([]);
  photosRef.current = photos;

  // free preview blobs when leaving the page
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl)), []);

  const isBusy = loading || processing > 0;
  const canAddPhoto = photos.length < MAX_PHOTOS && !loading;

  const handleScanned = useCallback((value: string) => {
    setSerialNo(value.trim());
    setScannerOpen(false);
    showToast(`Serial scanned: ${value}`, "success");
  }, []);

  const handleCapture = useCallback((raw: File) => {
    // photosRef is updated synchronously so fast double taps can't exceed the limit
    if (photosRef.current.length >= MAX_PHOTOS) return;
    const photo: Photo = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file: raw,
      previewUrl: URL.createObjectURL(raw),
    };
    photosRef.current = [...photosRef.current, photo];
    setPhotos((prev) => [...prev, photo]);
    if (photosRef.current.length >= MAX_PHOTOS) setCameraOpen(false);

    // shrink in background; submit stays disabled until done
    setProcessing((count) => count + 1);
    compressPhoto(raw)
      .then((file) => setPhotos((prev) => prev.map((p) => (p.id === photo.id ? { ...p, file } : p))))
      .finally(() => setProcessing((count) => count - 1));
  }, []);

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const resetForm = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setPhotos([]);
    setSerialNo("");
    setShowErrors(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    if (!deviceType || !serialNo.trim() || photos.length === 0) return;

    const serial = serialNo.trim();
    const result = await dispatch(
      requestDeviceApproval({ device_type: deviceType, serial_no: serial, images: photos.map((p) => p.file) }),
    );
    if (requestDeviceApproval.fulfilled.match(result)) {
      resetForm();
      setSubmittedSerial(serial);
    }
  };

  const errors = {
    deviceType: showErrors && !deviceType ? "Device type is required" : "",
    serialNo: showErrors && !serialNo.trim() ? "Serial number is required" : "",
    photos: showErrors && photos.length === 0 ? "Please take at least one photo" : "",
  };

  return (
    <div className="min-h-[100dvh] w-full bg-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-[560px] items-center gap-3 px-4 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-700 text-white">
            <Icons.checkcircle />
          </span>
          <div className="flex flex-col">
            <h1 className="text-base font-semibold text-slate-800">Device Quality Check</h1>
            <p className="text-xs text-slate-500">Scan device and capture defect photos</p>
          </div>
          <Link
            to="/device-quality/reports"
            className="ml-auto flex items-center gap-1 rounded-lg border border-cyan-700 px-3 py-1.5 text-sm font-medium text-cyan-700 hover:bg-cyan-50"
          >
            <AssessmentOutlined fontSize="small" />
            Report
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[560px] p-3 sm:p-6">
        {submittedSerial ? (
          <Card elevation={0} className="border border-slate-200">
            <CardContent className="flex flex-col items-center gap-3 !py-10 text-center">
              <Icons.checkcircle sx={{ fontSize: 64 }} className="text-green-600" />
              <Typography variant="h6" className="!font-semibold text-slate-800">
                Submitted successfully
              </Typography>
              <Typography variant="body2" className="text-slate-500">
                Quality check for serial <span className="font-semibold">{submittedSerial}</span> has been sent for
                approval.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Icons.add />}
                onClick={() => setSubmittedSerial(null)}
                className="!mt-3"
              >
                Check Another Device
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card elevation={0} className="border border-slate-200">
            <CardContent>
              <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
                <div className="flex flex-col gap-[10px]">
                  <FieldLabel required>Device Type</FieldLabel>
                  <FormControl fullWidth error={!!errors.deviceType} disabled={isBusy}>
                    <Select
                      value={deviceType}
                      onChange={(e) => setDeviceType(e.target.value)}
                      displayEmpty
                      sx={selectSx}
                      renderValue={(value) =>
                        value ? (
                          deviceTypeData.find((d) => d.value === value)?.text ?? value
                        ) : (
                          <span className="text-slate-400">Select device type</span>
                        )
                      }
                    >
                      {deviceTypeData.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.text}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.deviceType && <span className="text-[12px] text-red-500">{errors.deviceType}</span>}
                </div>

                <div className="flex flex-col gap-[10px]">
                  <FieldLabel required>Serial No.</FieldLabel>
                  <TextField
                    fullWidth
                    value={serialNo}
                    placeholder={deviceType ? "Enter or scan serial number" : "Select device type first"}
                    disabled={!deviceType || isBusy}
                    error={!!errors.serialNo}
                    helperText={errors.serialNo || undefined}
                    sx={fieldSx}
                    onChange={(e) => setSerialNo(e.target.value)}
                    // Scanners send Enter after the code; don't submit the form.
                    onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                    slotProps={{
                      htmlInput: { autoComplete: "off", autoCapitalize: "characters", spellCheck: false },
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              aria-label="Scan serial barcode"
                              onClick={() => setScannerOpen(true)}
                              disabled={!deviceType || isBusy}
                            >
                              <QrCodeScanner className="text-cyan-700" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </div>

                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-center justify-between">
                    <FieldLabel required>Photos</FieldLabel>
                    <span className="text-xs text-slate-500">
                      {photos.length}/{MAX_PHOTOS}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {photos.map((photo, idx) => (
                      <div
                        key={photo.id}
                        className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                      >
                        <button type="button" className="h-full w-full" onClick={() => setPreviewIndex(idx)}>
                          <img src={photo.previewUrl} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" />
                        </button>
                        <IconButton
                          size="small"
                          aria-label="Remove photo"
                          onClick={() => removePhoto(photo.id)}
                          disabled={isBusy}
                          sx={{ position: "absolute", top: 4, right: 4, bgcolor: "rgba(0,0,0,0.55)", color: "white", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </div>
                    ))}
                    {photos.length < MAX_PHOTOS && (
                      <button
                        type="button"
                        disabled={!canAddPhoto || !deviceType}
                        onClick={() => setCameraOpen(true)}
                        className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-slate-500 transition-colors disabled:opacity-50 ${
                          errors.photos ? "border-red-400 bg-red-50" : "border-slate-300 bg-white active:bg-slate-100"
                        }`}
                      >
                        <AddAPhotoOutlined sx={{ fontSize: 32 }} className="text-cyan-700" />
                        <span className="text-sm font-medium">Take Photo</span>
                      </button>
                    )}
                  </div>
                  {errors.photos && <span className="text-[12px] text-red-500">{errors.photos}</span>}
                </div>

                {requestApprovalError && !loading && (
                  <Alert severity="error" variant="outlined">
                    <span className="block font-medium">{requestApprovalError}</span>
                    <span className="block text-xs">Your details and photos are kept — tap Submit to try again.</span>
                  </Alert>
                )}

                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<Icons.uploadfile />}
                  disabled={isBusy}
                >
                  {loading ? "Submitting..." : "Submit"}
                </LoadingButton>
              </form>
            </CardContent>
          </Card>
        )}
      </main>

      {cameraOpen && (
        <FullScreenPhotoCamera
          takenCount={photos.length}
          maxCount={MAX_PHOTOS}
          thumbnails={photos.map((p) => p.previewUrl)}
          onCapture={handleCapture}
          onClose={() => setCameraOpen(false)}
        />
      )}

      {scannerOpen && (
        <AWBScannerDialog
          open
          title="Scan serial barcode"
          hint="Place the serial number barcode inside the frame"
          onClose={() => setScannerOpen(false)}
          onScan={handleScanned}
        />
      )}

      <FqcImagePreviewModal
        open={previewIndex !== null}
        label={previewIndex !== null ? `Photo ${previewIndex + 1}` : ""}
        imageUrl={previewIndex !== null ? photos[previewIndex]?.previewUrl : undefined}
        currentIndex={previewIndex ?? 0}
        total={photos.length}
        onClose={() => setPreviewIndex(null)}
        onPrev={() => setPreviewIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length))}
        onNext={() => setPreviewIndex((i) => (i === null ? i : (i + 1) % photos.length))}
      />
    </div>
  );
};

// Works on both web and mobile: phone uses the back camera, desktop uses the webcam.
const DeviceQualityCheckPage = () => <DeviceQualityCheckContent />;

export default DeviceQualityCheckPage;
