import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { Badge, IconButton } from "@mui/material";
import FileDownloadSharpIcon from "@mui/icons-material/FileDownloadSharp";
import React, { useEffect } from "react";
import Link from "@mui/material/Link";
import MuiTooltip from "../reusable/MuiTooltip";
import { NotificationData, useSocketContext } from "../context/SocketContext";
import ProgressWithParcentage from "../reusable/ProgressWithParcentage";
import { Icons } from "../icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { showToast } from "@/utils/toasterContext";
const DownloadIndecator = () => {
  const { onDownloadReport, off, onnotification } = useSocketContext();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [notification, setNotification] = React.useState<NotificationData[]>([]);
  const [progress, setProgress] = React.useState<{ notificationId: string; percent: string } | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    
  };


  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  useEffect(() => {
    const handlenotification = (data: NotificationData[]) => {
      setNotification(data);
      console.log(data);
    };

    onnotification(handlenotification);
    return () => off("notification");
  }, [onnotification]);
  useEffect(() => {
    const handleDownloadReport = (data: { notificationId: string; percent: string }) => {
      setProgress(data);
      console.log(data)
      if(Number(data.percent) === 100){
        showToast("Download completed", "success");
      }
    };

    onDownloadReport(handleDownloadReport);

    return () => off("progress");
  }, [onDownloadReport]);

  return (
    <>
      
      <MuiTooltip title="Download" placement="bottom">
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
          <Badge badgeContent={notification.length} color="warning">
            <FileDownloadSharpIcon />
          </Badge>
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
            boxShadow: 2, // Optional: remove shadow
          },
        }}
      >
        <div className="w-[350px] bg-neutral-200 p-[10px]">
          <div className="min-h-[50px] max-h-[50px] flex justify-between">
            <Typography sx={{ p: 2 }}>Downloads</Typography>
            <Link
              component="button"
              variant="body2"
              sx={{ color: "black" }}
              onClick={() => {
                console.info("I'm a button.");
              }}
            >
              Clear All
            </Link>
          </div>
          <div className="bg-white rounded justify-center gap-[10px] overflow-y-auto ">
            <ScrollArea className="w-full flex flex-col gap-[10px] h-[300px] p-[10px] pr-[15px]">
              {notification.map((item, index) => (
                <div key={index} className="w-full p-[5px] border rounded-md mb-[10px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography fontSize={14} variant="body2">
                        {item.req_code}
                      </Typography>
                      <Typography color="text.secondary" fontSize={12} variant="body2">
                        {item.insert_date}
                      </Typography>
                    </div>
                    {item.status === "complete" && item.msg_type === "file" && (
                      <IconButton size="small" color="success"
                      onClick={()=>{
                        window.location.href  = (`${import.meta.env.VITE_SOKET_URL}/${JSON.parse(item.other_data)?.fileUrl}`);
                      }}
                      >
                        <Icons.download fontSize="small" />
                      </IconButton>
                    )}
                  </div>
                  {item.status !== "complete" && <ProgressWithParcentage value={item.reactNotificationId === progress?.notificationId ? parseInt(progress?.percent) : 0} />}
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default DownloadIndecator;
