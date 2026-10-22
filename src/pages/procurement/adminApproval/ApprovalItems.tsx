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
  TextField,
  Typography,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import { RefreshApprovalItem } from "@/features/procurement/poRateService";
import { formatRate, getStatusChip, isPendingStatus } from "./helpers";

type ItemsProps = {
  items: RefreshApprovalItem[];
  selectedIds: Set<number>;
  activeKey: string | null;
  pendingCount: number;
  selectedPendingCount: number;
  onToggle: (id: number) => void;
  onToggleAll: () => void;
  onShowDetails: (componentKey: string) => void;
  reasons: Record<number, string>;
  reasonErrorIds: Set<number>;
  onReasonChange: (id: number, value: string) => void;
};

export const REASON_MAX_LENGTH = 200;

type ReasonInputProps = {
  id: number;
  value: string;
  error: boolean;
  onChange: (id: number, value: string) => void;
};

const ReasonInput = ({ id, value, error, onChange }: ReasonInputProps) => (
  <TextField
    size="small"
    fullWidth
    multiline
    maxRows={3}
    placeholder="Remark (required if rejecting)"
    value={value}
    error={error}
    helperText={error ? "Reason is required to reject" : undefined}
    inputProps={{ maxLength: REASON_MAX_LENGTH }}
    onClick={(e) => e.stopPropagation()}
    onChange={(e) => onChange(id, e.target.value)}
  />
);

const rateDiff = (item: RefreshApprovalItem) =>
  (Number(item.requested_rate) - Number(item.current_rate)).toFixed(2);

const NewChip = () => (
  <Chip
    size="small"
    label="New"
    color="info"
    variant="outlined"
    sx={{ ml: 1, height: 20 }}
  />
);

type RowProps = {
  item: RefreshApprovalItem;
  index: number;
  selected: boolean;
  active: boolean;
  onToggle: (id: number) => void;
  onShowDetails: (componentKey: string) => void;
  reason: string;
  reasonError: boolean;
  onReasonChange: (id: number, value: string) => void;
};

const ApprovalItemRow = memo(
  ({
    item,
    index,
    selected,
    active,
    onToggle,
    onShowDetails,
    reason,
    reasonError,
    onReasonChange,
  }: RowProps) => {
    const chip = getStatusChip(item.status);
    return (
      <TableRow
        hover
        selected={selected}
        sx={{
         
          boxShadow: active ? "inset 3px 0 0 #1976d2" : undefined,
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            disabled={!isPendingStatus(item.status)}
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
              onClick={() => onShowDetails(item.component_key)}
              sx={{ "&:hover": { textDecoration: "underline", cursor: "pointer", } }}
            >
              {item.component_name?.trim()}
            </Typography>
            <HistoryIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            {item.is_new_pair === 1 && <NewChip />}
          </Box>
        </TableCell>
        <TableCell>{item.part_code}</TableCell>
        <TableCell>{item.unit?.trim() || "--"}</TableCell>
        <TableCell sx={{ maxWidth: 160, wordBreak: "break-word" }}>
          {item.brand?.trim() || "--"}
        </TableCell>
        <TableCell sx={{ maxWidth: 220, wordBreak: "break-word" }}>
          {item.specification?.trim() || "--"}
        </TableCell>
        <TableCell align="right">{formatRate(item.current_rate)}</TableCell>
        <TableCell align="right">{formatRate(item.requested_rate)}</TableCell>
        <TableCell align="right" sx={{ color: "error.main" }}>
          +{rateDiff(item)}
        </TableCell>
        <TableCell align="center">
          <Chip size="small" label={chip.label} color={chip.color} />
        </TableCell>
        <TableCell sx={{ maxWidth: 200, wordBreak: "break-word" }}>
          {item.remarks || "--"}
        </TableCell>
        <TableCell sx={{ minWidth: 220 }}>
          {isPendingStatus(item.status) ? (
            <ReasonInput
              id={item.id}
              value={reason}
              error={reasonError}
              onChange={onReasonChange}
            />
          ) : (
            <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
              {reason.trim() || "--"}
            </Typography>
          )}
        </TableCell>
      </TableRow>
    );
  },
);

export const ApprovalItemsTable: React.FC<ItemsProps> = ({
  items,
  selectedIds,
  activeKey,
  pendingCount,
  selectedPendingCount,
  onToggle,
  onToggleAll,
  onShowDetails,
  reasons,
  reasonErrorIds,
  onReasonChange,
}) => (
  <TableContainer sx={{ overflowX: "auto" }}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={
                selectedPendingCount > 0 && selectedPendingCount < pendingCount
              }
              checked={
                pendingCount > 0 && selectedPendingCount === pendingCount
              }
              disabled={pendingCount === 0}
              onChange={onToggleAll}
            />
          </TableCell>
          <TableCell>#</TableCell>
          <TableCell>Component</TableCell>
          <TableCell>Part Code</TableCell>
          <TableCell>UOM</TableCell>
          <TableCell>Brand</TableCell>
          <TableCell>Specification</TableCell>
          <TableCell align="right">Current Rate</TableCell>
          <TableCell align="right">Requested Rate</TableCell>
          <TableCell align="right">Difference</TableCell>
          <TableCell align="center">Status</TableCell>
          <TableCell>Requester Remark</TableCell>
          <TableCell>APR/REJ Remark</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item, index) => (
          <ApprovalItemRow
            key={item.id}
            item={item}
            index={index}
            selected={selectedIds.has(item.id)}
            active={activeKey === item.component_key}
            onToggle={onToggle}
            onShowDetails={onShowDetails}
            reason={reasons[item.id] ?? ""}
            reasonError={reasonErrorIds.has(item.id)}
            onReasonChange={onReasonChange}
          />
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const ApprovalItemCard = memo(
  ({
    item,
    index,
    selected,
    active,
    onToggle,
    onShowDetails,
    reason,
    reasonError,
    onReasonChange,
  }: RowProps) => {
    const chip = getStatusChip(item.status);
    const isPending = isPendingStatus(item.status);
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
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
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
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ wordBreak: "break-word" }}
              >
                {index + 1}. {item.component_name?.trim()}
                {item.is_new_pair === 1 && <NewChip />}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.part_code}
                {item.unit?.trim() && ` · ${item.unit.trim()}`}
              </Typography>
            </Box>
          </Box>
          <Chip size="small" label={chip.label} color={chip.color} />
        </Box>
        {(item.brand?.trim() || item.specification?.trim()) && (
          <Box sx={{ mt: 1 }}>
            {[
              ["Brand", item.brand?.trim()],
              ["Specification", item.specification?.trim()],
            ]
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <Typography
                  key={label}
                  variant="body2"
                  sx={{ wordBreak: "break-word" }}
                >
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                  >
                    {label}:{" "}
                  </Typography>
                  {value}
                </Typography>
              ))}
          </Box>
        )}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 1,
            mt: 1.5,
          }}
        >
          {[
            ["Current", formatRate(item.current_rate)],
            ["Requested", formatRate(item.requested_rate)],
            ["Difference", `+${rateDiff(item)}`],
          ].map(([label, value]) => (
            <Box key={label}>
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                color={label === "Difference" ? "error.main" : undefined}
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
        {item.remarks && (
          <Typography variant="body2" sx={{ mt: 1, wordBreak: "break-word" }}>
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              Requester Remark:{" "}
            </Typography>
            {item.remarks}
          </Typography>
        )}
        {isPending && (
          <Box sx={{ mt: 1.5 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.5 }}
            >
              APR/REJ Remark
            </Typography>
            <ReasonInput
              id={item.id}
              value={reason}
              error={reasonError}
              onChange={onReasonChange}
            />
          </Box>
        )}
        {!isPending && reason.trim() && (
          <Typography variant="body2" sx={{ mt: 1, wordBreak: "break-word" }}>
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              APR/REJ Remark:{" "}
            </Typography>
            {reason.trim()}
          </Typography>
        )}
        <Button
          size="small"
          startIcon={<HistoryIcon />}
          sx={{ mt: 1, px: 0.5 }}
          onClick={(e) => {
            e.stopPropagation();
            onShowDetails(item.component_key);
          }}
        >
          Rate history & vendors
        </Button>
      </Box>
    );
  },
);

export const ApprovalItemCards: React.FC<ItemsProps> = ({
  items,
  selectedIds,
  activeKey,
  pendingCount,
  selectedPendingCount,
  onToggle,
  onToggleAll,
  onShowDetails,
  reasons,
  reasonErrorIds,
  onReasonChange,
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
    {pendingCount > 0 && (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Checkbox
          indeterminate={
            selectedPendingCount > 0 && selectedPendingCount < pendingCount
          }
          checked={selectedPendingCount === pendingCount}
          onChange={onToggleAll}
        />
        <Typography variant="body2">Select all pending</Typography>
      </Box>
    )}
    {items.map((item, index) => (
      <ApprovalItemCard
        key={item.id}
        item={item}
        index={index}
        selected={selectedIds.has(item.id)}
        active={activeKey === item.component_key}
        onToggle={onToggle}
        onShowDetails={onShowDetails}
        reason={reasons[item.id] ?? ""}
        reasonError={reasonErrorIds.has(item.id)}
        onReasonChange={onReasonChange}
      />
    ))}
  </Box>
);
