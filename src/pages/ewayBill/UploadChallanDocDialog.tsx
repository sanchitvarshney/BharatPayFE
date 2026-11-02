import React, { useEffect, useState } from "react";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { uploadEwayBill } from "@/features/Dispatch/DispatchSlice";
import { showToast } from "@/utils/toasterContext";
import DocDropzone from "@/components/reusable/DocDropzone";

const MAX_FILES = 2;

type Props = {
  open: boolean;
  challanId?: string;
  invoiceNo?: string | null;
  onClose: () => void;
  onUploaded?: () => void;
};

const UploadChallanDocDialog: React.FC<Props> = ({
  open,
  challanId,
  invoiceNo,
  onClose,
  onUploaded,
}) => {
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<File[]>([]);
  const [documentInvoiceNo, setDocumentInvoiceNo] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (open) {
      setFiles([]);
      setDocumentInvoiceNo(invoiceNo ?? "");
      setProgress(0);
    }
  }, [open, invoiceNo]);

  const handleClose = () => {
    if (!uploading) onClose();
  };

  const handleUpload = () => {
    if (!challanId || files.length === 0) return;
    setUploading(true);
    setProgress(0);
    dispatch(
      uploadEwayBill({
        challanId,
        files,
        documentInvoiceNo: documentInvoiceNo.trim() || undefined,
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      })
    ).then((res: any) => {
      setUploading(false);
      if (res?.payload?.data?.success) {
        showToast(
          res.payload.data.message || "E-way bill uploaded successfully",
          "success"
        );
        onUploaded?.();
        onClose();
      } else {
        showToast(
          res?.payload?.data?.message || "Failed to upload e-way bill",
          "error"
        );
      }
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      {uploading && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ position: "absolute", top: 0, left: 0, right: 0 }}
        />
      )}
      <DialogTitle
        sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}
      >
        Upload E-way Bill
        {challanId && <Chip size="small" label={challanId} />}
        <IconButton
          size="small"
          onClick={handleClose}
          disabled={uploading}
          sx={{ ml: "auto" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
     
        <DocDropzone
          files={files}
          onChange={setFiles}
          maxFiles={MAX_FILES}
          disabled={uploading}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          variant="outlined"
          color="inherit"
          disabled={uploading}
          onClick={handleClose}
        >
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          loading={uploading}
          loadingPosition="start"
          startIcon={<CloudUploadOutlinedIcon />}
          disabled={files.length === 0 || !challanId}
          onClick={handleUpload}
        >
          {uploading ? `Uploading ${progress}%` : `Upload (${files.length})`}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default UploadChallanDocDialog;
