import React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { CircularProgress, IconButton } from "@mui/material";
import MuiTooltip from "@/components/reusable/MuiTooltip";
const NotificationPnnel: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [loading, setLoading] = React.useState(false);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <>
      <MuiTooltip title="Notification" placement="bottom">
        <IconButton
          sx={{
            color: open ? "black" : "#525252",
            p: "12px",
            background: open ? "#e5e5e5" : "",
            border: "none",
            borderRadius: 0,
          }}
          aria-describedby={id}
          onClick={handleClick}
          aria-label="delete"
        >
          <NotificationsActiveIcon />
        </IconButton>
      </MuiTooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            border: "none", // Remove border
            borderTopRightRadius: 0, // Remove border radius
            boxShadow: 2,
          },
        }}
      >
        <div className="w-[300px] bg-neutral-200 p-[10px]">
          <div className="min-h-[50px]">
            <Typography sx={{ p: 2 }}>Notification</Typography>
          </div>
          <div className="bg-white h-[300px] rounded flex items-center justify-center">{loading && <CircularProgress size={40} />}</div>
        </div>
      </Popover>
    </>
  );
};

export default NotificationPnnel;
