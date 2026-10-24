import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, CircularProgress, IconButton } from "@mui/material";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import NoPhotographyOutlinedIcon from "@mui/icons-material/NoPhotographyOutlined";
import Webcam from "react-webcam";
import { Icons } from "@/components/icons";
import { dataUrlToFile } from "@/features/imageCapture/imageCapture.utils";

type FacingMode = "environment" | "user";
type CameraError = "permission" | "notFound" | "inUse" | "unsupported" | "unknown";

type Props = {
  takenCount: number;
  maxCount: number;
  thumbnails: string[];
  onCapture: (file: File) => void;
  onClose: () => void;
};

const ERROR_MESSAGES: Record<CameraError, { title: string; message: string }> = {
  permission: {
    title: "Camera access blocked",
    message: "Allow camera permission for this site in your browser settings, then tap Try Again.",
  },
  notFound: { title: "No camera found", message: "We couldn't find a camera on this device." },
  inUse: { title: "Camera is busy", message: "Another app is using the camera. Close it and tap Try Again." },
  unsupported: {
    title: "Camera not supported",
    message:
      typeof window !== "undefined" && !window.isSecureContext
        ? "The camera only works over a secure (HTTPS) connection."
        : "This browser can't open the camera. Please use the latest Chrome or Safari.",
  },
  unknown: { title: "Couldn't start the camera", message: "Something went wrong while opening the camera. Please try again." },
};

const mapCameraError = (error: string | DOMException): CameraError => {
  const name = typeof error === "string" ? error : error?.name;
  switch (name) {
    case "NotAllowedError":
    case "PermissionDeniedError":
    case "SecurityError":
      return "permission";
    case "NotFoundError":
    case "DevicesNotFoundError":
    case "OverconstrainedError":
      return "notFound";
    case "NotReadableError":
    case "TrackStartError":
      return "inUse";
    default:
      return "unknown";
  }
};

const isCameraSupported = () => typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;

const FullScreenPhotoCamera: React.FC<Props> = ({ takenCount, maxCount, thumbnails, onCapture, onClose }) => {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>("environment");
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<CameraError | null>(() => (isCameraSupported() ? null : "unsupported"));
  const [attempt, setAttempt] = useState(0);
  const [flash, setFlash] = useState(false);

  const videoConstraints = useMemo<MediaTrackConstraints>(
    () => ({ facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } }),
    [facingMode],
  );

  // Lock page scroll behind the overlay.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const handleCapture = useCallback(() => {
    const dataUrl = webcamRef.current?.getScreenshot();
    if (!dataUrl) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
    onCapture(dataUrlToFile(dataUrl, `photo-${Date.now()}.jpg`));
  }, [onCapture]);

  const retryCamera = () => {
    setError(isCameraSupported() ? null : "unsupported");
    setIsReady(false);
    setAttempt((a) => a + 1);
  };

  const errorInfo = error ? ERROR_MESSAGES[error] : null;
  const canCapture = isReady && !error && takenCount < maxCount;

  return (
    <div className="fixed inset-0 z-[1300] flex h-[100dvh] flex-col bg-black text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-[max(12px,env(safe-area-inset-top))]">
        <Button color="inherit" startIcon={<Icons.left />} onClick={onClose} sx={{ color: "white" }}>
          Back
        </Button>
        <span className="rounded-full bg-black/50 px-3 py-1 text-sm font-semibold tracking-wide text-slate-200">
          Photo {Math.min(takenCount + 1, maxCount)} of {maxCount}
        </span>
        <span className="w-[76px]" />
      </div>

      {/* Preview */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        {errorInfo ? (
          <div className="flex max-w-[320px] flex-col items-center gap-3 px-6 text-center">
            <NoPhotographyOutlinedIcon sx={{ fontSize: 48 }} className="text-slate-400" />
            <span className="text-lg font-semibold">{errorInfo.title}</span>
            <span className="text-sm text-slate-300">{errorInfo.message}</span>
            {error !== "unsupported" && error !== "notFound" && (
              <Button variant="contained" startIcon={<Icons.refresh />} onClick={retryCamera} className="!mt-2">
                Try Again
              </Button>
            )}
          </div>
        ) : (
          <>
            <Webcam
              key={`${facingMode}-${attempt}`}
              ref={webcamRef}
              audio={false}
              mirrored={facingMode === "user"}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.92}
              forceScreenshotSourceSize
              videoConstraints={videoConstraints}
              onUserMedia={() => {
                setIsReady(true);
                setError(null);
              }}
              onUserMediaError={(err) => {
                setIsReady(false);
                setError(mapCameraError(err));
              }}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
            {!isReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
                <CircularProgress size={40} sx={{ color: "white" }} />
                <span className="text-sm text-slate-300">Starting camera…</span>
              </div>
            )}
            {flash && <div className="pointer-events-none absolute inset-0 bg-white/70" />}
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-6 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
        {/* Last photo + count; tap to finish */}
        <button
          type="button"
          onClick={onClose}
          disabled={!thumbnails.length}
          aria-label="Done"
          className="relative h-12 w-12 overflow-hidden rounded-lg border-2 border-white/60 bg-white/10 disabled:opacity-40"
        >
          {thumbnails.length > 0 && (
            <img src={thumbnails[thumbnails.length - 1]} alt="Last photo" className="h-full w-full object-cover" />
          )}
          {thumbnails.length > 0 && (
            <span className="absolute -right-0 -top-0 rounded-bl-md bg-cyan-600 px-1 text-[11px] font-bold">
              {thumbnails.length}
            </span>
          )}
        </button>

        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={handleCapture}
            disabled={!canCapture}
            aria-label="Take photo"
            className="flex h-[76px] w-[76px] items-center justify-center rounded-full border-4 border-white transition-transform active:scale-95 disabled:opacity-40"
          >
            <span className="block h-[60px] w-[60px] rounded-full bg-white" />
          </button>
          <span className="text-xs tracking-wide text-slate-300">
            {takenCount > 0 ? `${takenCount}/${maxCount} taken · tap photo to finish` : "TAP TO CAPTURE"}
          </span>
        </div>

        <IconButton
          onClick={() => {
            setIsReady(false);
            setFacingMode((m) => (m === "environment" ? "user" : "environment"));
          }}
          disabled={!!error}
          aria-label="Switch camera"
          className="!h-12 !w-12 !bg-white/15 !text-white disabled:!opacity-40"
        >
          <FlipCameraAndroidIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default FullScreenPhotoCamera;
