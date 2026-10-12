import React from "react";
import { Dialog, DialogContent, Slide, Typography, useMediaQuery, useTheme } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

const SlideUp = React.forwardRef(function SlideUp(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const primarySx = { height: 48, borderRadius: 2, fontSize: 15, fontWeight: 600, textTransform: "none" } as const;
export const cancelSx = { ...primarySx, borderColor: "#e2e8f0", color: "#475569" } as const;

interface AuthDialogProps {
  open: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
  onExited?: () => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({
  open,
  icon,
  title,
  subtitle,
  header,
  children,
  onExited,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const titleId = React.useId();

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="xs"
      fullScreen={isMobile}
      disableEscapeKeyDown
      disableEnforceFocus
      TransitionComponent={SlideUp}
      TransitionProps={{ onExited }}
      aria-labelledby={titleId}
      slotProps={{
        backdrop: { sx: { backgroundColor: "rgba(15, 23, 42, 0.55)", backdropFilter: "blur(4px)" } },
      }}
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: isMobile ? 0 : 4,
          boxShadow: "0 24px 64px rgba(15, 23, 42, 0.25)",
          overflow: "hidden",
        },
      }}
    >
      <div className="h-[4px] w-full bg-gradient-to-r from-cyan-600 via-cyan-500 to-teal-400" />
      <DialogContent
        sx={{
          px: { xs: 3, sm: 4 },
          pt: 4,
          pb: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: isMobile ? "center" : "flex-start",
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            bgcolor: "#f8fafc",
            transition: "background-color 0.2s",
            "& fieldset": { borderColor: "#e2e8f0" },
            "&:hover fieldset": { borderColor: "#cbd5e1" },
            "&.Mui-focused": { bgcolor: "#ffffff" },
          },
        }}
      >
        <div className="h-[52px] w-[52px] rounded-[14px] bg-cyan-50 ring-1 ring-cyan-100 flex items-center justify-center text-cyan-700">
          {icon}
        </div>
        {header && <div className="mt-[20px]">{header}</div>}
        <Typography id={titleId} variant="h2" fontSize={22} fontWeight={700} className="!mt-[16px] text-slate-800">
          {title}
        </Typography>
        {subtitle && (
          <Typography component="div" fontSize={14} className="!mt-[6px] text-slate-500 leading-[1.6]">
            {subtitle}
          </Typography>
        )}
        <div className="mt-[24px]">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
