import { useEffect, useRef, useState } from "react";
import { Button, CircularProgress, Dialog, IconButton } from "@mui/material";
import { Close, VideocamOffOutlined } from "@mui/icons-material";
import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";

type Props = {
  open: boolean;
  onClose: () => void;
  onScan: (value: string) => void;
};

const FORMATS = [
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.CODE_93,
  BarcodeFormat.CODABAR,
  BarcodeFormat.EAN_13,
  BarcodeFormat.ITF,
  BarcodeFormat.QR_CODE,
  BarcodeFormat.DATA_MATRIX,
];

const getErrorMessage = (err: unknown) => {
  const name = (err as DOMException)?.name;
  if (typeof window !== "undefined" && !window.isSecureContext) {
    return "The camera only works over a secure (HTTPS) connection.";
  }
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "Camera access is blocked. Allow camera permission for this site, then tap Try Again.";
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return "We couldn't find a camera on this device.";
  }
  if (name === "NotReadableError") {
    return "Another app is using the camera. Close it and tap Try Again.";
  }
  return "Couldn't start the camera. Please try again.";
};

const AWBScannerDialog = ({ open, onClose, onScan }: Props) => {
  // Callback ref: the dialog renders in a portal, so the element may appear after the first effect.
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!open || !video) return;

    let controls: IScannerControls | null = null;
    let cancelled = false;
    setReady(false);
    setError(null);

    const hints = new Map([[DecodeHintType.POSSIBLE_FORMATS, FORMATS]]);
    const reader = new BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 150 });

    reader
      .decodeFromConstraints(
        {
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        video,
        (result, _err, ctrl) => {
          if (!result || cancelled) return;
          const text = result.getText().trim();
          if (!text) return;
          cancelled = true;
          ctrl.stop();
          navigator.vibrate?.(80);
          onScanRef.current(text);
        }
      )
      .then((ctrl) => {
        if (cancelled) {
          ctrl.stop();
          return;
        }
        controls = ctrl;
        setReady(true);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      });

    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [open, video, attempt]);

  return (
    <Dialog open={open} onClose={onClose} fullScreen PaperProps={{ sx: { bgcolor: "black" } }}>
      <div className="relative flex h-full w-full flex-col">
        <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-3">
          <span className="rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white">
            Scan AWB barcode
          </span>
          <IconButton onClick={onClose} sx={{ color: "white", bgcolor: "rgba(0,0,0,0.5)" }}>
            <Close />
          </IconButton>
        </div>

        <video
          ref={setVideo}
          className="h-full w-full object-cover"
          muted
          playsInline
          autoPlay
        />

        {ready && !error && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
            <div className="relative h-[38%] w-full max-w-[420px] rounded-xl border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
              <div className="absolute left-3 right-3 top-1/2 h-0.5 animate-pulse bg-red-500" />
            </div>
            <span className="text-center text-sm text-white">
              Place the AWB barcode inside the frame
            </span>
          </div>
        )}

        {!ready && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <CircularProgress sx={{ color: "white" }} />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <VideocamOffOutlined sx={{ fontSize: 48 }} className="text-white" />
            <span className="text-sm text-slate-200">{error}</span>
            <div className="flex gap-2">
              <Button variant="contained" onClick={() => setAttempt((n) => n + 1)}>
                Try Again
              </Button>
              <Button variant="outlined" onClick={onClose} sx={{ color: "white", borderColor: "white" }}>
                Enter Manually
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default AWBScannerDialog;
