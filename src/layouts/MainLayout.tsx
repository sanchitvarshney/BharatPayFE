import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { MainUIStateType } from "@/types/MainLayout";
import MainLayoutPopovers from "../components/shared/MainLayoutPopovers";
import DownloadIndecator from "@/components/shared/DownloadIndecator";
import { SiSocketdotio } from "react-icons/si";
import {
  FormControl,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationPnnel from "./NotificationPnnel";
import { useSocketContext } from "@/components/context/SocketContext";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import {
  buildIndianFYSessionOptions,
  getInitialIndianFYSession,
} from "@/utils/indianFinancialYear";
import Sidebar from "@/components/Sidebar/Sidebar";
import { convertMenuToSidebarItems } from "@/components/Sidebar/menuAdapter";
import { SidebarMenuItem } from "@/components/Sidebar/types";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getMenuData } from "@/features/menu/menuSlice";
import ModuleSearch from "@/components/ModuleSearch/ModuleSearch";

/** Indian FY dropdown: current year + this many prior years (5 rows total). */
const SESSION_YEARS_BACK = 4;
const HEADER_HEIGHT = 50;

function MainLayout(props: { children: React.ReactNode }) {
  const { isConnected, refreshConnection, isLoading, emitGetNotification } = useSocketContext();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { menu, menuLoading } = useAppSelector((state) => state.menu);
  const [showSideBar, setShowSideBar] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(56);
  const [selectedSession, setSelectedSession] = useState(() =>
    getInitialIndianFYSession(SESSION_YEARS_BACK),
  );
  const sessionOptions = useMemo(
    () => buildIndianFYSessionOptions(SESSION_YEARS_BACK),
    [],
  );
  const [selectedCompanyBranch, setSelectedCompanyBranch] = useState('BRMSC031');
  const [logotAlert, setLogotAlert] = useState<boolean>(false);
  const [notificationSheet, setNotificationSheet] = useState<boolean>(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
  const accountMenuOpen = Boolean(accountMenuAnchor);
  const modalRef = useRef<HTMLDivElement>(null);
  const uiState: MainUIStateType = {
    sheetOpen: false,
    setSheetOpen: () => {},
    logotAlert,
    setLogotAlert,
    modalRef,
    notificationSheet,
    setNotificationSheet,
    sidebarWidth,
  };

  const menuItems = useMemo(() => convertMenuToSidebarItems(menu), [menu]);

  const sidebarBottomItems = useMemo<SidebarMenuItem[]>(
    () => [
      {
        key: "sop",
        label: "SOP",
        icon: <CreateNewFolderIcon fontSize="small" />,
        isShown: true,
        onClick: () => {
          navigate("/sop");
        },
      },
    ],
    [navigate],
  );

  useEffect(() => {
    dispatch(getMenuData());
  }, [dispatch]);
  
  useEffect(() => {
    if (isConnected) {
      emitGetNotification();
    }
  }, [isConnected]);

  const handleSessionChange = (newSession:string) => {
    setSelectedSession(newSession);
    // Store the selected session in localStorage
    localStorage.setItem('session', newSession);
  };

  const handleCompanyBranchChange = (newCompanyBranch:string) => {
    setSelectedCompanyBranch(newCompanyBranch);
    // Store the selected company branch in localStorage
    localStorage.setItem('companyBranch', newCompanyBranch);
  };

  return (
    <div className="">
      {/* alert disalogs start=============== */}
      <MainLayoutPopovers uiState={uiState} />
      {/* alert disalogs start=============== */}
      {/* sidebars=========================== */}
      <Sidebar
        showSideBar={showSideBar}
        setShowSideBar={setShowSideBar}
        items={menuItems}
        items1={sidebarBottomItems}
        topOffset={HEADER_HEIGHT}
        menuLoading={menuLoading}
        onRefreshMenu={() => dispatch(getMenuData())}
        onWidthChange={setSidebarWidth}
      />
      {/* sidebars=========================== */}
      <div>
        <nav
          className={`fixed top-0 left-0 z-[80] grid w-full grid-cols-[1fr_auto_1fr] items-center h-[50px] px-[20px] transition-all duration-300 ${import.meta.env.VITE_REACT_APP_ENVIRONMENT === "DEV" ? "bg-amber-300" : "bg-neutral-300"}`}
          style={{
            boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
          }}
        >
          <div className="flex gap-[20px] items-center justify-self-start">
            <div className="date flex gap-[20px] items-center">
              <FormControl sx={{ width: "200px" }}>
                <Tooltip title="Session">
                <Select
                  value={selectedSession}
                  className="shadow"
                  sx={{
                    background: "white",
                    border: "none",
                    outline: "none",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "& .MuiSelect-select": {
                      padding: "8px 12px",
                    },
                  }}
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={(e) => handleSessionChange(e.target.value)}
                >
                  {sessionOptions.map((opt) => (
                    <MenuItem value={opt.value} key={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
                </Tooltip>
              </FormControl>
              <FormControl sx={{ width: "200px" }}>
                <Tooltip title="Company Branch">
                <Select
                  defaultValue={selectedCompanyBranch}
                  className="shadow"
                  sx={{
                    background: "white",
                    border: "none",
                    outline: "none",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "& .MuiSelect-select": {
                      padding: "8px 12px",
                    },
                  }}
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={(e) => handleCompanyBranchChange(e.target.value)}
                >
                  <MenuItem value={"BRMSC031"}> B88</MenuItem>
                  <MenuItem value={"BRMSC030"}> Kortek</MenuItem>
                </Select>
                </Tooltip>
              </FormControl>
            </div>
          </div>

          <div className="flex justify-center justify-self-center px-[12px]">
            <ModuleSearch menu={menu} />
          </div>
          
          <div className="flex items-center gap-[16px] justify-self-end">
            <div className="download">
              <DownloadIndecator />
            </div>

            <NotificationPnnel />

            <MuiTooltip
              title={`Socket ${isConnected ? "Connected" : "Disconnected"}`}
              placement="bottom"
            >
              <IconButton
                onClick={() => refreshConnection()}
                disabled={isLoading}
                size="small"
                sx={{ p: 0.5 }}
              >
                <SiSocketdotio
                  className={`h-[22px] w-[22px] ${isConnected ? "text-green-600" : "text-red-500"} ${isLoading ? "animate-spin" : ""}`}
                />
              </IconButton>
            </MuiTooltip>


            <MuiTooltip title="Account" placement="bottom">
              <IconButton
                onClick={(e) => setAccountMenuAnchor(e.currentTarget)}
                size="small"
                sx={{ p: 0.5 }}
                aria-controls={accountMenuOpen ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={accountMenuOpen ? "true" : undefined}
              >
                <FaCircleUser className="h-[24px] w-[24px] text-gray-700" />
              </IconButton>
            </MuiTooltip>
            <Menu
              id="account-menu"
              anchorEl={accountMenuAnchor}
              open={accountMenuOpen}
              onClose={() => setAccountMenuAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: {
                  elevation: 2,
                  sx: {
                    mt: 1,
                    minWidth: 160,
                    border: "1px solid #e5e7eb",
                  },
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  setAccountMenuAnchor(null);
                  navigate("/profile");
                }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAccountMenuAnchor(null);
                  setLogotAlert(true);
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </nav>
      </div>
      <div style={{ marginTop: HEADER_HEIGHT }}>
        <main
          className="bg-[#f1f1f1] min-h-[calc(100vh-50px)] transition-all duration-300"
          style={{ marginLeft: sidebarWidth }}
        >
          {props.children}
        </main>
      </div>
    </div>
  );
}
export default MainLayout;
