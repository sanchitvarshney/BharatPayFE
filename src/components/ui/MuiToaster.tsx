// components/Toaster.tsx
import React from "react";
import { Snackbar, Alert, AlertProps } from "@mui/material";

interface ToasterProps {
  message: string;
  severity?: AlertProps["severity"]; // "error" | "warning" | "info" | "success"
  open: boolean;
  duration?: number;
  onClose?: () => void; // Optional, with default behavior if not provided
}

const MuiToaster: React.FC<ToasterProps> = ({ message, severity = "info", open, duration = 3000, onClose }) => {
  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
        
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Always center
    >
      <Alert variant="filled" onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MuiToaster;