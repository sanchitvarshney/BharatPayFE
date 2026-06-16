import React from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Icons } from "@/components/icons";

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
        }}
      >
        <span>Preview Image</span>
        <IconButton onClick={onClose} size="small" aria-label="Close preview">
          <Icons.close />
        </IconButton>
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
                component="img"
                src={imageUrl}
                alt={label}
                sx={{
                  display: "block",
                  maxHeight: "65vh",
                  maxWidth: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: 1,
                }}
              />
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
