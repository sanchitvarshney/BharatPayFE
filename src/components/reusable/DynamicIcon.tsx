import React from "react";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AddIcon from "@mui/icons-material/Add";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CachedIcon from "@mui/icons-material/Cached";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
export const Icons = {
  save: SaveIcon,
  refresh: RefreshIcon,
  delete: DeleteIcon,
  bom: AccountTreeIcon,
  add: AddIcon,
  view: FullscreenIcon,
  refreshv2: CachedIcon,
  close: CloseIcon,
  done: DoneIcon,
  time: AccessTimeIcon,
  checkcircle: CheckCircleOutlineIcon,
  qrScan: QrCodeScannerIcon,
};

type IconName = keyof typeof Icons;

interface IconProps {
  name: IconName; // Ensures the name corresponds to a valid key in Icons
  size?: "small" | "inherit" | "large" | "medium"; // Optional size prop
  color?: string; // Optional color
}
const DynamicIcon: React.FC<IconProps> = ({ name, size = "medium", color = "inherit" }) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    return null; // Optionally handle unknown icon names
  }

  return <IconComponent fontSize={size} style={{ color }} />;
};

export default DynamicIcon;
