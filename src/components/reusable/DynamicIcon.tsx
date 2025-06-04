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
import DownloadIcon from "@mui/icons-material/Download";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // Default icon
import WindowIcon from "@mui/icons-material/Window";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import StorageIcon from "@mui/icons-material/Storage";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";

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
  download: DownloadIcon,
  qrcode: QrCodeScannerIcon,
  qrcode2: QrCodeScannerIcon,
  grid: WindowIcon,
  production: PrecisionManufacturingIcon,
  trc: StorageIcon,
  dispatch: WarehouseIcon,
  report: AssessmentIcon,
  ewaybill: LocalShippingIcon,
  Swipe: DriveFolderUploadIcon,
  transfer: SwapHorizontalCircleIcon,
  procurement: FormatListNumberedRtlIcon,
};

type IconName = keyof typeof Icons | string;

interface IconProps {
  name: IconName; // Ensures the name corresponds to a valid key in Icons
  size?: "small" | "inherit" | "large" | "medium"; // Optional size prop
  color?: string; // Optional color
  hover?: boolean;
  isExpended?:boolean
  mr?:boolean
}

const DynamicIcon: React.FC<IconProps> = ({
  name,
  size = "medium",
  // color = "inherit",
 isExpended
}) => {

  // Select the icon if it exists, otherwise fall back to the default icon
  const IconComponent = Icons[name as keyof typeof Icons] || HelpOutlineIcon;

  return <IconComponent fontSize={size}  className= { `hover:no-underline ${isExpended ? "hover:text-black-700 ":"hover:text-white-700"} `} />;
};

export default DynamicIcon;
