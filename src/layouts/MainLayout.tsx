import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";
import { FavoriteMenuLinkListType, MainUIStateType } from "@/types/MainLayout";
import FavoriteSidebar from "@/components/shared/FavoriteSidebar";
import ProfileSidebar from "@/components/shared/ProfileSidebar";
import MainLayoutPopovers from "../components/shared/MainLayoutPopovers";
import DownloadIndecator from "@/components/shared/DownloadIndecator";
import { SiSocketdotio } from "react-icons/si";
import { FormControl, IconButton, MenuItem, Select, Tooltip } from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
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
  const [sheet2Open, setSheet2Open] = useState<boolean>(false);
  const [favoriteSheet, setFavoriteSheet] = useState<boolean>(false);
  const [logotAlert, setLogotAlert] = useState<boolean>(false);
  const [notificationSheet, setNotificationSheet] = useState<boolean>(false);
  const [favoriteLinkList, setFavoriteLinkList] = useState<FavoriteMenuLinkListType[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const sidebaref = useRef<HTMLDivElement>(null);
  const favoriteref = useRef<HTMLDivElement>(null);
  const uiState: MainUIStateType = {
    sheetOpen: false,
    setSheetOpen: () => {},
    sheet2Open,
    setSheet2Open,
    favoriteSheet,
    setFavoriteSheet,
    logotAlert,
    setLogotAlert,
    modalRef,
    sidebaref,
    favoriteref,
    notificationSheet,
    setNotificationSheet,
    favoriteLinkList,
    setFavoriteLinkList,
    sidebarWidth,
  };

  const menuItems = useMemo(() => convertMenuToSidebarItems(menu), [menu]);

  const sidebarBottomItems = useMemo<SidebarMenuItem[]>(
    () => [
      {
        key: "favorites",
        label: "Favorites",
        icon: <FaStar />,
        isShown: true,
        onClick: () => {
          setFavoriteSheet(true);
          setSheet2Open(false);
        },
      },
      {
        key: "sop",
        label: "SOP",
        icon: <CreateNewFolderIcon fontSize="small" />,
        isShown: true,
        onClick: () => {
          navigate("/sop");
          setSheet2Open(false);
          setFavoriteSheet(false);
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
      <div
        className={`sheetone absolute z-[50] w-full transition-all ${sheet2Open || favoriteSheet ? "bg-[#00000081]" : "left-[-100%]"}`}
        style={{ top: HEADER_HEIGHT, height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
        onClick={() => {
          setFavoriteSheet(false);
          setSheet2Open(false);
        }}
      />
      <FavoriteSidebar uiState={uiState} headerHeight={HEADER_HEIGHT} />
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
      <ProfileSidebar uiState={uiState} headerHeight={HEADER_HEIGHT} />
      {/* sidebars=========================== */}
      <div>
        <nav
          className={`fixed top-0 left-0 z-[80] flex w-full items-center justify-between h-[50px] px-[20px] transition-all duration-300 ${import.meta.env.VITE_REACT_APP_ENVIRONMENT === "DEV" ? "bg-amber-300" : "bg-neutral-300"}`}
          style={{
            boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
          }}
        >
          <div className="flex gap-[20px] items-center">
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
          
          <div className="flex items-center gap-[16px]">
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
                  className={`h-[22px] w-[22px] ${isConnected ? "text-green-500" : "text-red-500"} ${isLoading ? "animate-spin" : ""}`}
                />
              </IconButton>
            </MuiTooltip>

            <span
              className={`text-[11px] font-semibold px-[8px] py-[3px] rounded-full ${
                isConnected
                  ? "bg-teal-100 text-teal-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isConnected ? "Online" : "Offline"}
            </span>

            <MuiTooltip title="Account" placement="bottom">
              <IconButton
                onClick={() => {
                  setSheet2Open((open) => !open);
                  setFavoriteSheet(false);
                }}
                size="small"
                sx={{ p: 0.5 }}
              >
                <FaCircleUser className="h-[24px] w-[24px] text-gray-700" />
              </IconButton>
            </MuiTooltip>
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
