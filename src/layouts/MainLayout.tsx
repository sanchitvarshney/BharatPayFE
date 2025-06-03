import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import styled from "styled-components";
import { FavoriteMenuLinkListType, MainUIStateType } from "@/types/MainLayout";
import SidebarMenues from "@/components/shared/SidebarMenues";
import FavoriteSidebar from "@/components/shared/FavoriteSidebar";
import ProfileSidebar from "@/components/shared/ProfileSidebar";
import MainLayoutPopovers from "../components/shared/MainLayoutPopovers";
import DownloadIndecator from "@/components/shared/DownloadIndecator";
import { SiSocketdotio } from "react-icons/si";
import {
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import NotificationPnnel from "./NotificationPnnel";
import { useSocketContext } from "@/components/context/SocketContext";
import MenuBreadcrumb from "@/components/shared/MenuBreadcrumb";

function MainLayout(props: { children: React.ReactNode }) {
  // const tab = useParams();
  // console.log(tab)
  const { isConnected, refreshConnection, isLoading, emitGetNotification } =
    useSocketContext();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [selectedSession, setSelectedSession] = useState("25-26");
  const [selectedCompanyBranch, setSelectedCompanyBranch] =
    useState("BRMSC031");
  const [sheet2Open, setSheet2Open] = useState<boolean>(false);
  const [favoriteSheet, setFavoriteSheet] = useState<boolean>(false);
  const [logotAlert, setLogotAlert] = useState<boolean>(false);
  const [notificationSheet, setNotificationSheet] = useState<boolean>(false);
  const [favoriteLinkList, setFavoriteLinkList] = useState<
    FavoriteMenuLinkListType[]
  >([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const sidebaref = useRef<HTMLDivElement>(null);
  const favoriteref = useRef<HTMLDivElement>(null);
  const uiState: MainUIStateType = {
    sheetOpen,
    setSheetOpen,
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
  };

  const handleSheetOpen = () => {
    setSheetOpen(!sheetOpen);
    setSheet2Open(false);
    setFavoriteSheet(false);
  };

  useEffect(() => {
    if (isConnected) {
      emitGetNotification();
    }
  }, [isConnected]);

  const handleSessionChange = (newSession: string) => {
    setSelectedSession(newSession);
    // Store the selected session in localStorage
    localStorage.setItem("session", newSession);
  };

  const handleCompanyBranchChange = (newCompanyBranch: string) => {
    setSelectedCompanyBranch(newCompanyBranch);
    // Store the selected company branch in localStorage
    localStorage.setItem("companyBranch", newCompanyBranch);
  };

  return (
    <Wrapper className="">
      {/* alert disalogs start=============== */}
      <MainLayoutPopovers uiState={uiState} />
      {/* alert disalogs start=============== */}
      {/* sidebars=========================== */}
      <div
        className={`sheetone absolute  h-[100vh] z-[50] top-0 w-full transition-all  ${
          sheetOpen || sheet2Open || favoriteSheet
            ? "bg-[#00000081]"
            : "left-[-100%]"
        }`}
      ></div>
      <FavoriteSidebar uiState={uiState} />
      <SidebarMenues uiState={uiState} />
      <ProfileSidebar uiState={uiState} />
      {/* sidebars=========================== */}
      <div>
        <nav
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
          }}
          className={`  z-[7] flex  items-center justify-between h-[50px] px-[20px] fixed top-0 left-[50px] w-[calc(100vw-50px)]   ${
            import.meta.env.VITE_REACT_APP_ENVIRONMENT === "DEV"
              ? "bg-amber-300"
              : "bg-neutral-300"
          }`}
        >
          <div className="ml-4">
            <MenuBreadcrumb />
          </div>
          <div className="flex gap-[20px] items-center">
            <div className="date flex gap-[20px] items-center">
              <FormControl sx={{ width: "200px" }}>
                <Tooltip title="Session">
                  <Select
                    defaultValue={selectedSession}
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
                    <MenuItem value={"25-26"}> 2025-2026</MenuItem>
                    <MenuItem value={"24-25"}> 2024-2025</MenuItem>
                    <MenuItem value={"23-24"}> 2023-2024</MenuItem>
                    <MenuItem value={"22-23"}> 2022-2023</MenuItem>
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
        </nav>
      </div>
      <div className="mt-[50px] ">
        <div
          className={`w-[60px] overflow-hidden h-[100vh] bg-cyan-800 fixed left-0 top-0 pt-[20px] pb-[10px] flex items-center justify-between flex-col z-[70] ${
            sheetOpen ? "border-r border-white" : "border-r border-transparent"
          }`}
        >
          <div className="flex flex-col items-center gap-[20px]">
            <div className="flex items-center justify-center">
              <Link
                to="/"
                onClick={() => {
                  setFavoriteSheet(false);
                  setSheet2Open(false);
                  setSheetOpen(false);
                }}
              >
                <img
                  src="/bharatpay.svg"
                  alt=""
                  className="h-[35px] w-[35px] rounded-full "
                />
              </Link>
            </div>
            <div>
              <MuiTooltip title="Favorite Pages" placement="right">
                <IconButton
                  onClick={() => {
                    setFavoriteSheet(!favoriteSheet);
                    setSheet2Open(false);
                    setSheetOpen(false);
                  }}
                >
                  <FaStar className="h-[25px] w-[25px] text-white" />
                </IconButton>
              </MuiTooltip>
            </div>
            <MuiTooltip title="SOP" placement="right">
              <IconButton
                onClick={() => {
                  navigate("/sop");
                  setSheet2Open(false);
                  setSheetOpen(false);
                  setFavoriteSheet(false);
                }}
                size="small"
                sx={{
                  background: "white",
                  color: "#ca8a04",
                  "&:hover": {
                    background: "#ca8a04",
                    color: "white",
                  },
                }}
              >
                <CreateNewFolderIcon fontSize="medium" />
              </IconButton>
            </MuiTooltip>
          </div>
          <div className="flex flex-col gap-[30px]  ">
            <div className="line"></div>
            <Button
              onClick={() => {
                handleSheetOpen();
              }}
              className="btn rotate-[270deg] border-[3px] border-yellow-600 bg-transparent rounded-full max-w-max"
            >
              <span></span>
              Menu
            </Button>
          </div>
          <div className="flex flex-col gap-[20px] items-center">
            <MuiTooltip
              title={`Socket ${isConnected ? "Connected" : "Disconnected"}`}
              placement="right"
            >
              <IconButton onClick={() => refreshConnection()}>
                <SiSocketdotio
                  className={`h-[25px] w-[25px] ${
                    isConnected ? "text-green-500" : "text-red-500"
                  }  ${isLoading ? "animate-spin" : ""}`}
                />
              </IconButton>
            </MuiTooltip>
            {/* <div className="flex flex-col items-center "> */}

            {/* <div className="download"> */}
            <DownloadIndecator />
            {/* </div> */}

            <NotificationPnnel />
            {/* </div> */}

            <MuiTooltip title="Account" placement="right">
              <IconButton
                onClick={() => {
                  setSheet2Open(!sheet2Open);
                  setSheetOpen(false);
                  setFavoriteSheet(false);
                }}
              >
                <FaCircleUser className="h-[25px] w-[25px] text-white" />
              </IconButton>
            </MuiTooltip>
          </div>
        </div>
        <main className="ml-[60px]  bg-[#f1f1f1] h-full">{props.children}</main>
      </div>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  .btn {
    overflow: hidden;
    position: relative;

    span {
      position: absolute;
      background-color: #d1d101a3;
      height: 100px;
      width: 10px;
      rotate: 30deg;
      left: -20px;
      transition: all 1.3s;
    }
    &:hover {
      span {
        left: 120px;
        transition: all 1.3s;
      }
    }
  }
`;
export default MainLayout;
