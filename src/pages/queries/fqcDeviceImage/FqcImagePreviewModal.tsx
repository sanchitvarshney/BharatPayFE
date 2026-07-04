import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Icons } from "@/components/icons";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.5;

type Props = {
  open: boolean;
  label: string;
  imageUrl?: string;
  currentIndex: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

const FqcImagePreviewModal: React.FC<Props> = ({
  open,
  label,
  imageUrl,
  currentIndex,
  total,
  onClose,
  onPrev,
  onNext,
}) => {
  const showNav = total > 1;
  const [zoom, setZoom] = useState(MIN_ZOOM);

  useEffect(() => {
    setZoom(MIN_ZOOM);
  }, [imageUrl]);

  const handleZoomIn = () =>
    setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM));
  const handleZoomOut = () =>
    setZoom((z) => Math.max(z - ZOOM_STEP, MIN_ZOOM));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
        }}
      >
        <span>Preview Image</span>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            onClick={handleZoomOut}
            size="small"
            aria-label="Zoom out"
            disabled={zoom <= MIN_ZOOM}
          >
            <Icons.zoomOut fontSize="small" />
          </IconButton>
          <Typography variant="caption" sx={{ minWidth: 36, textAlign: "center" }}>
            {Math.round(zoom * 100)}%
          </Typography>
          <IconButton
            onClick={handleZoomIn}
            size="small"
            aria-label="Zoom in"
            disabled={zoom >= MAX_ZOOM}
          >
            <Icons.zoomIn fontSize="small" />
          </IconButton>
          <IconButton onClick={onClose} size="small" aria-label="Close preview">
            <Icons.close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            minHeight: 420,
            width: "100%",
          }}
        >
          {showNav ? (
            <IconButton
              onClick={onPrev}
              aria-label="Previous image"
              sx={{
                flexShrink: 0,
                bgcolor: "grey.100",
                "&:hover": { bgcolor: "grey.200" },
              }}
            >
              <Icons.left fontSize="large" />
            </IconButton>
          ) : (
            <Box sx={{ width: 48, flexShrink: 0 }} />
          )}

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 0,
              px: 1,
            }}
          >
            {imageUrl ? (
              <Box
                sx={{
                  width: "100%",
                  height: "65vh",
                  overflow: "auto",
                  display: "flex",
                  alignItems: zoom > MIN_ZOOM ? "flex-start" : "center",
                  justifyContent: zoom > MIN_ZOOM ? "flex-start" : "center",
                }}
              >
                <Box
                  component="img"
                  src={imageUrl}
                  alt={label}
                  sx={{
                    display: "block",
                    maxHeight: zoom > MIN_ZOOM ? "none" : "65vh",
                    maxWidth: zoom > MIN_ZOOM ? "none" : "100%",
                    width: zoom > MIN_ZOOM ? `${zoom * 100}%` : "auto",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: 1,
                    transition: "width 0.15s ease",
                  }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Image not available
              </Typography>
            )}

            {showNav && (
              <Typography variant="caption" sx={{ mt: 2, color: "text.secondary" }}>
                {currentIndex + 1} / {total}
              </Typography>
            )}
          </Box>

          {showNav ? (
            <IconButton
              onClick={onNext}
              aria-label="Next image"
              sx={{
                flexShrink: 0,
                bgcolor: "grey.100",
                "&:hover": { bgcolor: "grey.200" },
              }}
            >
              <Icons.right fontSize="large" />
            </IconButton>
          ) : (
            <Box sx={{ width: 48, flexShrink: 0 }} />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FqcImagePreviewModal;
