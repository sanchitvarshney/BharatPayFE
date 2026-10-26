import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { PauseCircleOutline } from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/Image";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { Icons } from "@/components/icons";
import { DeviceApprovalItem, DeviceDecisionStatus } from "@/features/deviceDefect/deviceDefectSlice";
import { getStatusChip, isPendingStatus } from "@/pages/procurement/adminApproval/helpers";
import { REASON_MAX_LENGTH } from "@/pages/procurement/adminApproval/ApprovalItems";
import {
  DEVICE_ACTIONS,
  DevicePhotoView,
  formatServerDateTime,
  getDeviceTypeLabel,
} from "./deviceDefectApproval.utils";

type Props = {
  item: DeviceApprovalItem;
  photos: DevicePhotoView[];
  action: string;
  remark: string;
  // status being submitted for this device, if any
  submitting: DeviceDecisionStatus | null;
  disabled: boolean;
  error: string | null;
  onActionChange: (value: string) => void;
  onRemarkChange: (value: string) => void;
  onDecision: (status: DeviceDecisionStatus) => void;
  onImageClick: (index: number) => void;
  onClearError: () => void;
};

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, py: 1 }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600} sx={{ textAlign: "right", wordBreak: "break-word" }}>
      {value || "--"}
    </Typography>
  </Box>
);

const PhotoGallery = ({ photos, onImageClick }: Pick<Props, "photos" | "onImageClick">) => (
  <Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
      <ImageIcon fontSize="small" color="action" />
      <Typography variant="subtitle2" fontWeight={600}>
        Device Images
      </Typography>
      {photos.length > 0 && <Chip size="small" label={photos.length} />}
    </Box>
    {photos.length ? (
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" }, gap: 1.5 }}>
        {photos.map((photo, idx) => (
          <Box
            key={photo.key}
            component="button"
            type="button"
            onClick={() => onImageClick(idx)}
            sx={{
              position: "relative",
              p: 0,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1.5,
              overflow: "hidden",
              bgcolor: "#f8fafc",
              cursor: "zoom-in",
              textAlign: "left",
              transition: "border-color .15s, box-shadow .15s",
              "&:hover": { borderColor: "primary.main", boxShadow: 2 },
              "&:hover .zoom": { opacity: 1 },
            }}
          >
            <Box
              component="img"
              src={photo.url}
              alt={photo.label}
              loading="lazy"
              sx={{ display: "block", width: "100%", aspectRatio: "4 / 3", objectFit: "contain" }}
            />
            <ZoomInIcon
              className="zoom"
              sx={{
                position: "absolute",
                top: 6,
                right: 6,
                p: 0.25,
                fontSize: 22,
                borderRadius: "50%",
                color: "#fff",
                bgcolor: "rgba(0,0,0,.45)",
                opacity: 0,
                transition: "opacity .15s",
              }}
            />
            <Typography
              variant="caption"
              fontWeight={500}
              noWrap
              sx={{ display: "block", px: 1, py: 0.75, borderTop: "1px solid", borderColor: "divider", bgcolor: "#fff" }}
            >
              {photo.label}
            </Typography>
          </Box>
        ))}
      </Box>
    ) : (
      <Box
        sx={{
          py: 6,
          textAlign: "center",
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 1.5,
          color: "text.secondary",
        }}
      >
        <ImageIcon sx={{ fontSize: 36, opacity: 0.4 }} />
        <Typography variant="body2">No images available for this device</Typography>
      </Box>
    )}
  </Box>
);

const ACTION_HINTS: Record<string, string> = {
  scrap: "Device cannot be used and will be scrapped",
  repair: "Device will be sent for repair",
};

type RejectDialogProps = Pick<
  Props,
  "item" | "action" | "remark" | "error" | "onActionChange" | "onRemarkChange" | "onClearError"
> & {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

// Reject needs a next step (Scrap / Repair), so it is confirmed here
const RejectDialog = ({
  open,
  item,
  action,
  remark,
  error,
  loading,
  onActionChange,
  onRemarkChange,
  onClearError,
  onCancel,
  onConfirm,
}: RejectDialogProps) => (
  <Dialog open={open} onClose={loading ? undefined : onCancel} fullWidth maxWidth="xs">
    <DialogTitle sx={{ pb: 0.5 }}>Reject device</DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Choose what happens to <strong>{item.serial_no}</strong> after rejection.
      </Typography>
      <RadioGroup value={action} onChange={(e) => onActionChange(e.target.value)} sx={{ gap: 1, mb: 2 }}>
        {DEVICE_ACTIONS.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio color="error" />}
            disabled={loading}
            label={
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {option.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {ACTION_HINTS[option.value]}
                </Typography>
              </Box>
            }
            sx={{
              m: 0,
              pr: 1.5,
              py: 0.5,
              border: "1px solid",
              borderColor: action === option.value ? "error.main" : "divider",
              borderRadius: 1.5,
              bgcolor: action === option.value ? "rgba(211, 47, 47, 0.04)" : "transparent",
              transition: "border-color .15s",
            }}
          />
        ))}
      </RadioGroup>
      <TextField
        fullWidth
        size="small"
        multiline
        minRows={2}
        maxRows={4}
        label="Remark (optional)"
        value={remark}
        disabled={loading}
        inputProps={{ maxLength: REASON_MAX_LENGTH }}
        helperText={`${remark.length}/${REASON_MAX_LENGTH}`}
        FormHelperTextProps={{ sx: { textAlign: "right", mr: 0 } }}
        onChange={(e) => onRemarkChange(e.target.value)}
      />
      {error && (
        <Alert severity="error" onClose={onClearError} sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2.5 }}>
      <Button color="inherit" onClick={onCancel} disabled={loading}>
        Cancel
      </Button>
      <LoadingButton
        variant="contained"
        color="error"
        disableElevation
        startIcon={<Icons.close />}
        loading={loading}
        loadingPosition="start"
        disabled={!action}
        onClick={onConfirm}
      >
        Reject
      </LoadingButton>
    </DialogActions>
  </Dialog>
);

const DeviceApprovalCard: React.FC<Props> = ({
  item,
  photos,
  action,
  remark,
  submitting,
  disabled,
  error,
  onActionChange,
  onRemarkChange,
  onDecision,
  onImageClick,
  onClearError,
}) => {
  const chip = getStatusChip(item.status);
  const isPending = isPendingStatus(item.status);
  const [rejectOpen, setRejectOpen] = useState(false);

  const cancelReject = () => {
    setRejectOpen(false);
    onActionChange("");
    onClearError();
  };

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      {/* Device header */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
          px: { xs: 2, sm: 3 },
          py: 2,
          bgcolor: "#fafbfc",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary">
            Serial No.
          </Typography>
          <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2, wordBreak: "break-all" }}>
            {item.serial_no}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip size="small" variant="outlined" label={getDeviceTypeLabel(item.device_type)} />
          <Chip size="small" label={chip.label} color={chip.color} />
        </Box>
      </Box>
      <Divider />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 7fr) minmax(0, 5fr)" },
          gap: { xs: 3, md: 4 },
          p: { xs: 2, sm: 3 },
        }}
      >
        <PhotoGallery photos={photos} onImageClick={onImageClick} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
              Request Details
            </Typography>
            <Box sx={{ "& > *:not(:last-child)": { borderBottom: "1px solid", borderColor: "divider" } }}>
              <DetailRow label="Device Type" value={getDeviceTypeLabel(item.device_type)} />
              <DetailRow label="Requested By" value={item.requested_by} />
              <DetailRow label="Requested On" value={formatServerDateTime(item.created_at)} />
            </Box>
          </Box>

          {isPending ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Your Decision
              </Typography>
              <TextField
                fullWidth
                size="small"
                multiline
                minRows={2}
                maxRows={4}
                label="Remark (optional)"
                value={remark}
                inputProps={{ maxLength: REASON_MAX_LENGTH }}
                helperText={`${remark.length}/${REASON_MAX_LENGTH}`}
                FormHelperTextProps={{ sx: { textAlign: "right", mr: 0 } }}
                onChange={(e) => onRemarkChange(e.target.value)}
              />
              {error && !rejectOpen && (
                <Alert severity="error" onClose={onClearError}>
                  {error}
                </Alert>
              )}
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Icons.close />}
                  disabled={disabled}
                  onClick={() => {
                    onClearError();
                    setRejectOpen(true);
                  }}
                >
                  Reject
                </Button>
                <LoadingButton
                  variant="outlined"
                  color="warning"
                  startIcon={<PauseCircleOutline />}
                  loading={submitting === "HOLD"}
                  loadingPosition="start"
                  disabled={disabled}
                  onClick={() => onDecision("HOLD")}
                >
                  Hold
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  color="success"
                  size="large"
                  disableElevation
                  startIcon={<Icons.check />}
                  loading={submitting === "APPROVED"}
                  loadingPosition="start"
                  disabled={disabled}
                  onClick={() => onDecision("APPROVED")}
                  sx={{ gridColumn: "1 / -1" }}
                >
                  Approve
                </LoadingButton>
              </Box>
              <RejectDialog
                open={rejectOpen && isPending}
                item={item}
                action={action}
                remark={remark}
                error={error}
                loading={submitting === "REJECTED"}
                onActionChange={onActionChange}
                onRemarkChange={onRemarkChange}
                onClearError={onClearError}
                onCancel={cancelReject}
                onConfirm={() => onDecision("REJECTED")}
              />
            </Box>
          ) : (
            <Alert severity={chip.color} variant="outlined" sx={{ "& .MuiAlert-message": { width: "100%" } }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                This device has been {chip.label.toLowerCase()}
              </Typography>

            </Alert>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default DeviceApprovalCard;
