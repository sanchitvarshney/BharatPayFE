import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Icons } from "@/components/icons";

type Props = {
  open: boolean;
  title: string;
  image?: string;
  onClose: () => void;
  onRetake: () => void;
};

const ImagePreviewDialog: React.FC<Props> = ({
  open,
  title,
  image,
  onClose,
  onRetake,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        {title}
        <IconButton onClick={onClose} size="small">
          <Icons.close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {image && (
          <img
            src={image}
            alt={title}
            className="w-full rounded object-contain"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<Icons.refresh />}
          onClick={onRetake}
        >
          Retake
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(ImagePreviewDialog);
