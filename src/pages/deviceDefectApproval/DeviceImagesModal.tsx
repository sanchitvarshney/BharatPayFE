import React from "react";
import { Alert, Box, Chip, Divider, Drawer, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { PauseCircleOutline } from "@mui/icons-material";
import { Icons } from "@/components/icons";
import { DeviceApprovalItem, DeviceDecisionStatus } from "@/features/deviceDefect/deviceDefectSlice";
import { getStatusChip, isPendingStatus } from "@/pages/procurement/adminApproval/helpers";
import { REASON_MAX_LENGTH } from "@/pages/procurement/adminApproval/ApprovalItems";
import {
  DEVICE_ACTIONS,
  DevicePhotoView,
  formatServerDateTime,
  getDeviceActionLabel,
  getDeviceTypeLabel,
} from "./deviceDefectApproval.utils";

type Props = {
  open: boolean;
  device: DeviceApprovalItem | null;
  photos: DevicePhotoView[];
  action: string;
  remark: string;
  actionError: boolean;
  decisionLoading: DeviceDecisionStatus | null;
  error: string | null;
  onActionChange: (value: string) => void;
  onRemarkChange: (value: string) => void;
  onDecision: (status: DeviceDecisionStatus) => void;
  onImageClick: (index: number) => void;
  onClose: () => void;
};

const DeviceImagesModal: React.FC<Props> = ({
  open,
  device,
  photos,
  action,
  remark,
  actionError,
  decisionLoading,
  error,
  onActionChange,
  onRemarkChange,
  onDecision,
  onImageClick,
  onClose,
}) => {
  const isPending = isPendingStatus(device?.status);
  const statusChip = getStatusChip(device?.status);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", md: "50vw" }, display: "flex", flexDirection: "column" } }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, px: 3, py: 2 }}>
        {device && (
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Typography variant="h6" fontWeight={600} sx={{ wordBreak: "break-all" }}>
                {device.serial_no}
              </Typography>
              <Chip size="small" label={statusChip.label} color={statusChip.color} variant="outlined" />
            </Box>
            <Typography variant="body2" className="text-slate-500">
              Type: {getDeviceTypeLabel(device.device_type)} • Requested by {device.requested_by || "--"} •{" "}
              {formatServerDateTime(device.created_at)}
            </Typography>
            {!isPending && (
              <Typography variant="body2" className="text-slate-500">
                {statusChip.label} by {device.action_by || "--"} • {formatServerDateTime(device.action_date)}
                {device.next ? ` • Action: ${getDeviceActionLabel(device.next)}` : ""}
                {device.remarks ? ` • Remark: ${device.remarks}` : ""}
              </Typography>
            )}
          </Box>
        )}
        <IconButton onClick={onClose} size="small" aria-label="Close">
          <Icons.close />
        </IconButton>
      </Box>
      <Divider />

      {/* Images */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
        {device &&
          (photos.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {photos.map((photo, idx) => (
                <button
                  key={photo.key}
                  type="button"
                  onClick={() => onImageClick(idx)}
                  className="flex flex-col items-center border rounded-lg p-3 shadow-sm bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <img src={photo.url} alt={photo.label} className="rounded object-contain max-h-[220px] w-full" />
                  <Typography variant="subtitle2" className="mt-2 font-medium text-slate-700">
                    {photo.label}
                  </Typography>
                </button>
              ))}
            </div>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No images available for this device
            </Typography>
          ))}
      </Box>

      {/* Footer */}
      {device && (
        <>
          <Divider />
          <Box sx={{ px: 3, py: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
            {isPending ? (
              <>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Action"
                  value={action}
                  error={actionError}
                  helperText={actionError ? "Select Scrap or Repair to reject this device" : "Required when rejecting"}
                  onChange={(e) => onActionChange(e.target.value)}
                >
                  {DEVICE_ACTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  maxRows={3}
                  label="Remark"
                  value={remark}
                  inputProps={{ maxLength: REASON_MAX_LENGTH }}
                  onChange={(e) => onRemarkChange(e.target.value)}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, "& > *": { flex: { xs: 1, sm: "none" } } }}>
                  <LoadingButton
                    variant="outlined"
                    color="error"
                    startIcon={<Icons.close />}
                    loading={decisionLoading === "REJECTED"}
                    loadingPosition="start"
                    disabled={decisionLoading !== null}
                    onClick={() => onDecision("REJECTED")}
                  >
                    Reject
                  </LoadingButton>
                  <LoadingButton
                    variant="outlined"
                    color="warning"
                    startIcon={<PauseCircleOutline />}
                    loading={decisionLoading === "HOLD"}
                    loadingPosition="start"
                    disabled={decisionLoading !== null}
                    onClick={() => onDecision("HOLD")}
                  >
                    Hold
                  </LoadingButton>
                  <LoadingButton
                    variant="contained"
                    color="success"
                    startIcon={<Icons.check />}
                    loading={decisionLoading === "APPROVED"}
                    loadingPosition="start"
                    disabled={decisionLoading !== null}
                    onClick={() => onDecision("APPROVED")}
                  >
                    Approve
                  </LoadingButton>
                </Box>
              </>
            ) : (
              <Alert severity={statusChip.color}>This device has already been {statusChip.label.toLowerCase()}.</Alert>
            )}
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default DeviceImagesModal;
