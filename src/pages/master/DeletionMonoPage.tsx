import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  LinearProgress,
  CardHeader,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "@/api/axiosInstance";
import { showToast } from "@/utils/toasterContext";

const DeletionMonoPage = () => {
  const [monoInput, setMonoInput] = useState<string>("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const handleDeleteClick = () => {
    if (!monoInput.trim()) {
      showToast("Please enter a Mono number to delete", "warning");
      return;
    }
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!monoInput.trim()) {
      showToast("Mono number cannot be empty", "error");
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await axiosInstance.delete(
        `/swipeMachine/packaging/deleteMono`,
        {
          data: { serial: monoInput.trim() },
        }
      );

      if (response.data?.success) {
        showToast(
          response.data?.message || "Mono deleted successfully",
          "success"
        );
        setMonoInput("");
        setOpenConfirmDialog(false);
      } else {
        showToast(response.data?.message || "Failed to delete Mono", "error");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message?.msg ||
        error.response?.data?.message ||
        "An error occurred while deleting Mono";
      showToast(errorMessage, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseDialog = () => {
    if (!deleteLoading) {
      setOpenConfirmDialog(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-50px)] justify-center items-center">
      <Card className="max-w-xl !important w-full">
        <CardHeader title="Delete Mono" />
        <CardContent>
          <Alert severity="warning" sx={{ mb: 1 }} icon={<WarningIcon />}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              Permanent Deletion Warning
            </Typography>
            <Typography variant="body2">
              When you delete a Mono, it will be{" "}
              <strong>permanently removed</strong> from the system. This action
              cannot be undone. All associated data, records, and references to
              this Mono will be permanently deleted. Please ensure you have
              verified the Mono number before proceeding.
            </Typography>
          </Alert>
          <TextField
            fullWidth
            label="Enter Mono to Delete"
            variant="outlined"
            value={monoInput}
            onChange={(e) => setMonoInput(e.target.value)}
            sx={{ my: 3 }}
            placeholder="Enter Mono number"
            onKeyPress={(e) => {
              if (e.key === "Enter" && monoInput.trim()) {
                handleDeleteClick();
              }
            }}
          />
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteClick}
            disabled={!monoInput.trim()}
            startIcon={<DeleteIcon />}
            sx={{ display: "flex", justifySelf: "flex-end" }}
          >
            Delete Mono
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        maxWidth="md"
        open={openConfirmDialog}
        onClose={handleCloseDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <div className="absolute top-0 left-0 right-0">
          {deleteLoading && <LinearProgress />}
        </div>
        <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 600 }}>
          Are you absolutely sure?
        </DialogTitle>
        <DialogContent sx={{ width: "600px" }}>
          <DialogContentText
            id="delete-dialog-description"
            color="warning"
            fontSize={14}
            sx={{ mb: 2 }}
          >
            <WarningIcon
              color="warning"
              sx={{ mr: 1, verticalAlign: "middle" }}
              fontSize="small"
            />
            Do you want to delete Mono <strong>"{monoInput}"</strong>?
          </DialogContentText>
          <Typography
            variant="body2"
            sx={{ mb: 2, color: "error.main", fontWeight: 500 }}
          >
            This action will permanently delete the selected Mono and all
            associated data. This operation cannot be undone. Please verify the
            Mono number before proceeding.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            disabled={deleteLoading}
            onClick={handleCloseDialog}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            disabled={deleteLoading}
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            autoFocus
            startIcon={<DeleteIcon />}
          >
            {deleteLoading ? "Deleting..." : "Delete Mono"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeletionMonoPage;
