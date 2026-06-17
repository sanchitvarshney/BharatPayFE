import { Button, Chip, MenuItem, Select } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Webcam from "react-webcam";
import { useEffect, useRef, useState } from "react";
import { Icons } from "@/components/icons";
import type { CaptureMap, CaptureView } from "./camera/camera.types";
import { useWebcamCapture } from "./camera/useWebcamCapture";
import CameraThumbnail from "./camera/CameraThumbnail";
import ImagePreviewDialog from "./camera/ImagePreviewDialog";
import ConfirmDialog from "./camera/ConfirmDialog";

const UPLOAD_WORDS = ["Capture", "Photo", "Save", "New"];

function useUploadingLabel(uploading: boolean) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (uploading) {
      setIdx(0);
      timerRef.current = setInterval(() => {
        setIdx((prev) => (prev + 1) % UPLOAD_WORDS.length);
      }, 600);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setIdx(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [uploading]);

  return UPLOAD_WORDS[idx];
}

export type { CaptureView } from "./camera/camera.types";

const DEFAULT_VIEWS: CaptureView[] = [
  { key: "front", label: "Front Image" },
  { key: "back", label: "Back Image" },
  { key: "left", label: "Left Side" },
  { key: "right", label: "Right Side" },
  { key: "top", label: "Top View" },
  { key: "bottom", label: "Bottom View" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  onUpload?: (images: CaptureMap) => void;
  views?: CaptureView[];
  stepTitle?: string;
  uploading?: boolean;
};

const FullScreenCamera: React.FC<Props> = ({
  open,
  onClose,
  onUpload,
  views = DEFAULT_VIEWS,
  stepTitle = "Step 1",
  uploading = false,
}) => {
  const {
    webcamRef,
    videoConstraints,
    deviceId,
    setDeviceId,
    devices,
    activeIndex,
    captures,
    previewIndex,
    retakeAllOpen,
    capturedCount,
    allCaptured,
    handleCapture,
    handleSelect,
    handlePreview,
    closePreview,
    handleRetake,
    requestRetakeAll,
    cancelRetakeAll,
    confirmRetakeAll,
    handleUpload,
  } = useWebcamCapture({ open, views, onClose, onUpload });

  const uploadingLabel = useUploadingLabel(uploading);

  if (!open) return null;

  const activeView = views[activeIndex];
  const previewView = previewIndex !== null ? views[previewIndex] : null;

  return (
    <div className="fixed inset-0 z-[1300] flex flex-col bg-black text-white">
      <div className="flex items-start justify-between px-6 py-4">
        <div className="flex flex-col">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Icons.device fontSize="small" /> Webcam Capture
          </span>
          <span className="text-2xl font-bold">{activeView?.label}</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-1 px-4">
          <Select
            size="small"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            displayEmpty
            className="!bg-white/10 !text-white"
            sx={{
              minWidth: 240,
              color: "white",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.3)",
              },
              ".MuiSvgIcon-root": { color: "white" },
            }}
          >
            {devices.length === 0 && (
              <MenuItem value="" disabled>
                No camera detected
              </MenuItem>
            )}
            {devices.map((device, i) => (
              <MenuItem key={device.deviceId || i} value={device.deviceId}>
                {device.label || `Camera ${i + 1}`}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <Chip
            label={stepTitle}
            size="small"
            className="!bg-cyan-50 !text-cyan-600 !font-semibold"
          />
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<Icons.left />}
            onClick={onClose}
          >
            Back
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
        <Webcam
          key={deviceId}
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          videoConstraints={videoConstraints}
          minScreenshotHeight={1080}
          minScreenshotWidth={1920}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <div className="flex w-full max-w-[52%] items-center justify-between">
          <div className="flex flex-wrap gap-3">
            {views.map((view, i) => (
              <CameraThumbnail
                key={view.key}
                index={i}
                view={view}
                image={captures[view.key]}
                isActive={i === activeIndex}
                onSelect={handleSelect}
                onPreview={handlePreview}
              />
            ))}
          </div>

          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleCapture}
              aria-label="Capture"
              className="h-[72px] w-[72px] rounded-full border-4 border-white bg-white/20 transition-transform hover:scale-105 active:scale-95"
            >
              <span className="block h-full w-full rounded-full bg-white" />
            </button>
            <span className="mt-1 text-xs tracking-wide text-slate-300">
              CAPTURE
            </span>
            <span className="text-[10px] text-slate-500">Press Space</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <LoadingButton
            variant="contained"
            loading={uploading}
            loadingPosition="start"
            startIcon={<Icons.uploadfile />}
            disabled={!allCaptured}
            onClick={handleUpload}
            sx={{
              "&.Mui-disabled": {
                bgcolor: uploading ? "primary.main" : undefined,
                color: uploading ? "white" : undefined,
                opacity: uploading ? 1 : undefined,
              },
              ".MuiLoadingButton-loadingIndicator": {
                color: "white",
              },
            }}
          >
            {uploading
              ? uploadingLabel
              : `Upload (${capturedCount}/${views.length})`}
          </LoadingButton>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<Icons.refresh />}
            disabled={capturedCount === 0}
            onClick={requestRetakeAll}
          >
            Retake All
          </Button>
        </div>
      </div>

      <ImagePreviewDialog
        open={previewIndex !== null}
        title={previewView?.label ?? ""}
        image={previewView ? captures[previewView.key] : undefined}
        onClose={closePreview}
        onRetake={() => previewIndex !== null && handleRetake(previewIndex)}
      />

      <ConfirmDialog
        open={retakeAllOpen}
        title="Retake all photos?"
        message="This will clear all captured images for this step and start over. Do you want to continue?"
        confirmText="Retake All"
        cancelText="Cancel"
        onConfirm={confirmRetakeAll}
        onCancel={cancelRetakeAll}
      />
    </div>
  );
};

export default FullScreenCamera;
