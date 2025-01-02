import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { LinearProgress } from "@mui/material";

type Props = {
  open: boolean;
  handleClose: () => void;
  content?: React.ReactNode;
  title?: string;
  loading?: boolean;
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapStyleDialog: React.FC<Props> = ({ open, handleClose, content, title, loading }) => {
  return (
    <React.Fragment>
      <BootstrapDialog maxWidth="md"  onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        {loading && (
          <div className="absolute top-0 left-0 right-0">
            <LinearProgress />
          </div>
        )}
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent  dividers>{content}</DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default BootstrapStyleDialog;
