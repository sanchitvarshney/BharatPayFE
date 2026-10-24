import React, { memo } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { DeviceApprovalItem } from "@/features/deviceDefect/deviceDefectSlice";
import { getStatusChip, isPendingStatus } from "@/pages/procurement/adminApproval/helpers";
import { REASON_MAX_LENGTH } from "@/pages/procurement/adminApproval/ApprovalItems";
import {
  DEVICE_ACTIONS,
  formatServerDateTime,
  getDeviceActionLabel,
  getDeviceTypeLabel,
} from "./deviceDefectApproval.utils";

type ItemsProps = {
  items: DeviceApprovalItem[];
  selectedIds: Set<number>;
  activeId: number | null;
  pendingCount: number;
  selectedPendingCount: number;
  onToggle: (id: number) => void;
  onToggleAll: () => void;
  onShowImages: (id: number) => void;
  actions: Record<number, string>;
  remarks: Record<number, string>;
  actionErrorIds: Set<number>;
  onActionChange: (id: number, value: string) => void;
  onRemarkChange: (id: number, value: string) => void;
};

type FieldProps = {
  id: number;
  value: string;
  onChange: (id: number, value: string) => void;
};

// Scrap / Repair select: required on reject, optional on approve
const ActionSelect = ({ id, value, error, onChange }: FieldProps & { error: boolean }) => (
  <TextField
    select
    size="small"
    fullWidth
    value={value}
    error={error}
    helperText={error ? "Action is required to reject" : undefined}
    onClick={(e) => e.stopPropagation()}
    onChange={(e) => onChange(id, e.target.value)}
    SelectProps={{
      displayEmpty: true,
      renderValue: (selected) =>
        selected ? getDeviceActionLabel(selected as string) : <span className="text-slate-400">Select action</span>,
    }}
  >
    {DEVICE_ACTIONS.map((action) => (
      <MenuItem key={action.value} value={action.value}>
        {action.label}
      </MenuItem>
    ))}
  </TextField>
);

const RemarkInput = ({ id, value, onChange }: FieldProps) => (
  <TextField
    size="small"
    fullWidth
    multiline
    maxRows={3}
    placeholder="Remark"
    value={value}
    inputProps={{ maxLength: REASON_MAX_LENGTH }}
    onClick={(e) => e.stopPropagation()}
    onChange={(e) => onChange(id, e.target.value)}
  />
);

type RowProps = {
  item: DeviceApprovalItem;
  index: number;
  selected: boolean;
  active: boolean;
  onToggle: (id: number) => void;
  onShowImages: (id: number) => void;
  action: string;
  remark: string;
  actionError: boolean;
  onActionChange: (id: number, value: string) => void;
  onRemarkChange: (id: number, value: string) => void;
};

const DeviceApprovalRow = memo(
  ({
    item,
    index,
    selected,
    active,
    onToggle,
    onShowImages,
    action,
    remark,
    actionError,
    onActionChange,
    onRemarkChange,
  }: RowProps) => {
    const chip = getStatusChip(item.status);
    const isPending = isPendingStatus(item.status);
    return (
      <TableRow hover selected={selected} sx={{ boxShadow: active ? "inset 3px 0 0 #1976d2" : undefined }}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            disabled={!isPending}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onToggle(item.id)}
          />
        </TableCell>
        <TableCell>{index + 1}</TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography
              variant="body2"
              color="primary"
              fontWeight={500}
              onClick={() => onShowImages(item.id)}
              sx={{ "&:hover": { textDecoration: "underline", cursor: "pointer" } }}
            >
              {item.serial_no}
            </Typography>
            <ImageIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          </Box>
        </TableCell>
        <TableCell>{getDeviceTypeLabel(item.device_type)}</TableCell>
        <TableCell>{item.requested_by || "--"}</TableCell>
        <TableCell>{formatServerDateTime(item.created_at)}</TableCell>
        <TableCell align="center">
          <Chip size="small" label={chip.label} color={chip.color} />
        </TableCell>
        <TableCell sx={{ minWidth: 160 }}>
          {isPending ? (
            <ActionSelect id={item.id} value={action} error={actionError} onChange={onActionChange} />
          ) : (
            <Typography variant="body2">{getDeviceActionLabel(item.next || action)}</Typography>
          )}
        </TableCell>
        <TableCell sx={{ minWidth: 200 }}>
          {isPending ? (
            <RemarkInput id={item.id} value={remark} onChange={onRemarkChange} />
          ) : (
            <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
              {item.remarks?.trim() || remark.trim() || "--"}
            </Typography>
          )}
        </TableCell>
        <TableCell align="center">
          <Button size="small" variant="outlined" startIcon={<ImageIcon />} onClick={() => onShowImages(item.id)}>
            View
          </Button>
        </TableCell>
      </TableRow>
    );
  },
);

export const DeviceApprovalTable: React.FC<ItemsProps> = ({
  items,
  selectedIds,
  activeId,
  pendingCount,
  selectedPendingCount,
  onToggle,
  onToggleAll,
  onShowImages,
  actions,
  remarks,
  actionErrorIds,
  onActionChange,
  onRemarkChange,
}) => (
  <TableContainer sx={{ overflowX: "auto" }}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={selectedPendingCount > 0 && selectedPendingCount < pendingCount}
              checked={pendingCount > 0 && selectedPendingCount === pendingCount}
              disabled={pendingCount === 0}
              onChange={onToggleAll}
            />
          </TableCell>
          <TableCell>#</TableCell>
          <TableCell>Serial No.</TableCell>
          <TableCell>Device Type</TableCell>
          <TableCell>Requested By</TableCell>
          <TableCell>Requested On</TableCell>
          <TableCell align="center">Status</TableCell>
          <TableCell>Action</TableCell>
          <TableCell>Remark</TableCell>
          <TableCell align="center">Images</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item, index) => (
          <DeviceApprovalRow
            key={item.id}
            item={item}
            index={index}
            selected={selectedIds.has(item.id)}
            active={activeId === item.id}
            onToggle={onToggle}
            onShowImages={onShowImages}
            action={actions[item.id] ?? ""}
            remark={remarks[item.id] ?? ""}
            actionError={actionErrorIds.has(item.id)}
            onActionChange={onActionChange}
            onRemarkChange={onRemarkChange}
          />
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const DeviceApprovalCard = memo(
  ({
    item,
    index,
    selected,
    active,
    onToggle,
    onShowImages,
    action,
    remark,
    actionError,
    onActionChange,
    onRemarkChange,
  }: RowProps) => {
    const chip = getStatusChip(item.status);
    const isPending = isPendingStatus(item.status);
    const savedAction = item.next?.trim() || action;
    const savedRemark = item.remarks?.trim() || remark.trim();
    return (
      <Box
        onClick={() => isPending && onToggle(item.id)}
        sx={{
          border: "1px solid",
          borderColor: selected || active ? "primary.main" : "divider",
          bgcolor: selected ? "action.selected" : "background.paper",
          borderRadius: 1,
          p: 1.5,
          cursor: isPending ? "pointer" : "default",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", minWidth: 0 }}>
            <Checkbox
              size="small"
              checked={selected}
              disabled={!isPending}
              onClick={(e) => e.stopPropagation()}
              onChange={() => onToggle(item.id)}
              sx={{ p: 0.5, mr: 1 }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} sx={{ wordBreak: "break-word" }}>
                {index + 1}. {item.serial_no}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getDeviceTypeLabel(item.device_type)}
              </Typography>
            </Box>
          </Box>
          <Chip size="small" label={chip.label} color={chip.color} />
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mt: 1.5 }}>
          {[
            ["Requested By", item.requested_by || "--"],
            ["Requested On", formatServerDateTime(item.created_at)],
          ].map(([label, value]) => (
            <Box key={label}>
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
        {isPending && (
          <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                Action
              </Typography>
              <ActionSelect id={item.id} value={action} error={actionError} onChange={onActionChange} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                Remark
              </Typography>
              <RemarkInput id={item.id} value={remark} onChange={onRemarkChange} />
            </Box>
          </Box>
        )}
        {!isPending &&
          [
            ["Action", savedAction ? getDeviceActionLabel(savedAction) : ""],
            ["Remark", savedRemark],
          ]
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <Typography key={label} variant="body2" sx={{ mt: 1, wordBreak: "break-word" }}>
                <Typography component="span" variant="caption" color="text.secondary">
                  {label}:{" "}
                </Typography>
                {value}
              </Typography>
            ))}
        <Button
          size="small"
          startIcon={<ImageIcon />}
          sx={{ mt: 1, px: 0.5 }}
          onClick={(e) => {
            e.stopPropagation();
            onShowImages(item.id);
          }}
        >
          View images
        </Button>
      </Box>
    );
  },
);

export const DeviceApprovalCards: React.FC<ItemsProps> = ({
  items,
  selectedIds,
  activeId,
  pendingCount,
  selectedPendingCount,
  onToggle,
  onToggleAll,
  onShowImages,
  actions,
  remarks,
  actionErrorIds,
  onActionChange,
  onRemarkChange,
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
    {pendingCount > 0 && (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Checkbox
          indeterminate={selectedPendingCount > 0 && selectedPendingCount < pendingCount}
          checked={selectedPendingCount === pendingCount}
          onChange={onToggleAll}
        />
        <Typography variant="body2">Select all pending</Typography>
      </Box>
    )}
    {items.map((item, index) => (
      <DeviceApprovalCard
        key={item.id}
        item={item}
        index={index}
        selected={selectedIds.has(item.id)}
        active={activeId === item.id}
        onToggle={onToggle}
        onShowImages={onShowImages}
        action={actions[item.id] ?? ""}
        remark={remarks[item.id] ?? ""}
        actionError={actionErrorIds.has(item.id)}
        onActionChange={onActionChange}
        onRemarkChange={onRemarkChange}
      />
    ))}
  </Box>
);
