import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

const eWayBillTypes = [
  { label: "Duplicate", value: "1" },
  { label: "Order Cancelled", value: "2" },
  { label: "Data Entry Mistake", value: "3" },
  { label: "Others", value: "4" },
];

interface CancelEwayBillModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { remarks: string; cancelType: string }) => void;
  loading?: boolean;
}

interface FormData {
  remarks: string;
  cancelType: string;
}

const CancelEwayBillModal: React.FC<CancelEwayBillModalProps> = ({
  open,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      cancelType: "1",
    },
  });

  const selectedType = watch("cancelType");

  const onSubmit = (data: FormData) => {
    onConfirm(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cancel Eway Bill</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="cancel-type-label">Cancellation Type</InputLabel>
              <Select
                {...register("cancelType", {
                  required: "Cancellation type is required",
                })}
                labelId="cancel-type-label"
                label="Cancellation Type"
                error={!!errors.cancelType}
              >
                {eWayBillTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              {...register("remarks", {
                required: "Remarks are required",
                minLength: {
                  value: 3,
                  message: "Remarks must be at least 3 characters long",
                },
              })}
              fullWidth
              multiline
              rows={4}
              label="Remarks"
              error={!!errors.remarks}
              helperText={errors.remarks?.message}
              placeholder={
                selectedType === "4"
                  ? "Please specify the reason for cancellation"
                  : "Please enter additional remarks"
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            loading={loading}
            variant="contained"
            color="error"
          >
            Confirm Cancellation
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CancelEwayBillModal;
