import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type Webcam from "react-webcam";
import type { CaptureMap, CaptureView } from "./camera.types";

type Params = {
  open: boolean;
  views: CaptureView[];
  onClose: () => void;
  onUpload?: (images: CaptureMap) => void;
};

// Module-level cache: request camera permission only once per page load.
// After the first grant, enumerateDevices returns labels without re-requesting.
let cameraPermissionGranted = false;

export const useWebcamCapture = ({
  open,
  views,
  onClose,
  onUpload,
}: Params) => {
  const webcamRef = useRef<Webcam>(null);
  const [deviceId, setDeviceId] = useState("");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [captures, setCaptures] = useState<CaptureMap>({});
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [retakeAllOpen, setRetakeAllOpen] = useState(false);

  const videoConstraints = useMemo(
    () => ({
      deviceId: deviceId ? { exact: deviceId } : undefined,
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    }),
    [deviceId]
  );

  const capturedCount = useMemo(
    () => views.reduce((count, v) => (captures[v.key] ? count + 1 : count), 0),
    [views, captures]
  );
  const allCaptured = capturedCount === views.length;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const enumerateCameras = async () => {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      if (cancelled) return;
      const cams = mediaDevices.filter((d) => d.kind === "videoinput");
      setDevices(cams);
      setDeviceId((prev) => {
        if (prev && cams.some((c) => c.deviceId === prev)) return prev;
        return cams[1]?.deviceId || cams[0]?.deviceId || "";
      });
    };

    const loadDevices = async () => {
      // Only request getUserMedia once per page load to avoid accumulating
      // media handles and browser throttling after many open/close cycles.
      if (!cameraPermissionGranted) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach((track) => track.stop());
          cameraPermissionGranted = true;
        } catch {
          // permission denied; still try to enumerate
        }
      }
      await enumerateCameras();
    };

    loadDevices();

    navigator.mediaDevices.addEventListener("devicechange", enumerateCameras);

    return () => {
      cancelled = true;
      navigator.mediaDevices.removeEventListener("devicechange", enumerateCameras);
    };
  }, [open]);

  useEffect(() => {
    // Reset on open AND clear captures on close to free large base64 strings from memory.
    setActiveIndex(0);
    setCaptures({});
    setPreviewIndex(null);
    setRetakeAllOpen(false);
  }, [open]);

  const handleCaptureRef = useRef<() => void>(() => {});
  const handleUploadRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isInteractive = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target as HTMLElement)?.isContentEditable;
      if (e.key === "Escape") onClose();
      if (e.code === "Space" && !isInteractive) {
        e.preventDefault();
        handleCaptureRef.current();
      }
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        handleUploadRef.current();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleCapture = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) return;
    setCaptures((prev) => {
      const view = views[activeIndex];
      if (!view) return prev;
      const next = { ...prev, [view.key]: screenshot };
      const nextUncaptured = views.findIndex(
        (v, i) => i !== activeIndex && !next[v.key]
      );
      if (nextUncaptured !== -1) setActiveIndex(nextUncaptured);
      return next;
    });
  }, [views, activeIndex]);

  handleCaptureRef.current = handleCapture;

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handlePreview = useCallback((index: number) => {
    setPreviewIndex(index);
  }, []);

  const closePreview = useCallback(() => setPreviewIndex(null), []);

  const handleRetake = useCallback(
    (index: number) => {
      setActiveIndex(index);
      setCaptures((prev) => {
        const next = { ...prev };
        delete next[views[index].key];
        return next;
      });
      setPreviewIndex(null);
    },
    [views]
  );

  const requestRetakeAll = useCallback(() => setRetakeAllOpen(true), []);
  const cancelRetakeAll = useCallback(() => setRetakeAllOpen(false), []);

  const confirmRetakeAll = useCallback(() => {
    setCaptures({});
    setActiveIndex(0);
    setPreviewIndex(null);
    setRetakeAllOpen(false);
  }, []);

  const handleUpload = useCallback(() => {
    if (!allCaptured) return;
    onUpload?.(captures);
  }, [allCaptured, captures, onUpload]);

  handleUploadRef.current = handleUpload;

  return {
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
  };
};
