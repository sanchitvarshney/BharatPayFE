import DynamicIcon from "../reusable/DynamicIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CgArrowTopRight } from "react-icons/cg";
// import { Star } from "lucide-react";
import MuiTooltip from "../reusable/MuiTooltip";
import { useAppSelector } from "@/hooks/useReduxHook";
import { IoIosOpen } from "react-icons/io";
import { MdHome } from "react-icons/md";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

const renderMenu = (
  menu: any | undefined,
  isExpanded: boolean,
  setIsExpanded: any,
  isNew: boolean
) => {
  return (
    <Accordion type="single" collapsible>
      <ul className="flex flex-col gap-[20px] ">
        {menu?.map((item: any, index: number) => (
          <li key={item.key}>
            {item?.children ? (
              <AccordionItem
                value={`${index + item.name}`}
                className="border-0 w-full transition-all duration-100"
              >
                <div className="flex flex-col">
                  {!isExpanded && (
                    <MuiTooltip
                      title={!isExpanded ? item?.name : ""}
                      placement="right"
                    >
                      <div
                        className="px-1 flex items-center cursor-pointer"
                        onClick={
                          !isExpanded ? () => setIsExpanded(true) : undefined
                        }
                      >
                        <DynamicIcon
                          name={item.icon}
                          size="medium"
                          isExpended={isExpanded}
                        />
                      </div>
                    </MuiTooltip>
                  )}
                  {isExpanded && (
                    <AccordionTrigger
                      className={`w-[100%] py-1 m-0 leading-none hover:no-underline  rounded-md  ${
                        isExpanded ? "hover:bg-cyan-100" : ""
                      }`}
                    >
                      <MuiTooltip
                        title={!isExpanded ? item?.name : ""}
                        placement="right"
                      >
                        <div
                          className={`w-full p-1 flex items-center  cursor-pointer  rounded-md `}
                        >
                          <div className={`flex items-center  `}>
                            {isNew ? (
                              <DynamicIcon
                                name={item.icon}
                                size="medium"
                                isExpended={isExpanded}
                              />
                            ) : null}
                          </div>

                          <span
                            className={`ml-3 flex  text-right ${
                              isNew
                                ? "text-[18px] font-[500]"
                                : "text-[14px] font-[500]"
                            }  `}
                          >
                            {item.name}
                          </span>
                        </div>
                        {/* </Link> */}
                      </MuiTooltip>
                    </AccordionTrigger>
                  )}
                  {isExpanded && item?.children && (
                    <AccordionContent className="px-4 mt-1 border-l-2 border-cyan-600 bg-#fff-300 rounded">
                      {renderMenu(
                        item.children,
                        isExpanded,
                        setIsExpanded,
                        false
                      )}
                    </AccordionContent>
                  )}
                </div>
              </AccordionItem>
            ) : (
              <MuiTooltip
                title={!isExpanded ? item?.name : ""}
                placement="right"
              >
                <div
                  key={item?.id}
                  className={`flex items-center justify-between w-full ${
                    isExpanded && "hover:bg-cyan-300"
                  } rounded-md p-1`}
                >
                  <Link
                    // onClick={() => setSidemenu(false)}
                    to={item?.url}
                    className="w-full rounded-md cursor-pointer flex items-center gap-[10px] "
                  >
                    {isNew ? (
                      <DynamicIcon
                        name={item.icon}
                        size="medium"
                        isExpended={isExpanded}
                      />
                    ) : null}

                    {isExpanded ? (
                      <div className="flex">
                        <span
                          className={`${
                            isNew
                              ? "text-[18px] font-[500]"
                              : "text-[16px] font-[500]"
                          }`}
                        >
                          {item?.name}
                        </span>
                        <CgArrowTopRight className="h-[20px] w-[20px] font-[600] ml-2" />{" "}
                      </div>
                    ) : (
                      ""
                    )}
                  </Link>
                </div>
              </MuiTooltip>
            )}
          </li>
        ))}
      </ul>
    </Accordion>
  );
};

interface CustomSideBarMenuProps {
  children: React.ReactNode;
  //   item:any
}

const CustomSideBarMenu: React.FC<CustomSideBarMenuProps> = ({ children }) => {
  const { menu, menuLoading } = useAppSelector((state) => state.menu);
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className=" w-full h-[calc(100vh-50px)]  flex flex-col bg-gradient-to-t from-cyan-400 to-cyan-100">
      <div className="z-3 h-[calc(100vh-50px)] flex justify-center items-center ">
        <div
          className={` h-[98%] ${
            isExpanded ? "w-[360px] p-0 items-center" : "w-[80px] items-center "
          } flex flex-col justify-between py-0 transition-all duration-100 ease-in-out   bg-gradient-to-t from-cyan-400 to-cyan-100`}
        >
          {menuLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={22} />
            </Box>
          ) : (
            <>
              <div className="overflow-y-auto p-1">
                {" "}
                {/* <Link to={"/"}> */}
                <div
                  className={`flex justify-between items-center p-1 pl-1   rounded-md  ${
                    isExpanded && "mb-5 hover:bg-cyan-300 "
                  }`}
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  <MuiTooltip
                    title={!isExpanded ? "Dashboard" : ""}
                    placement="right"
                  >
                    <div
                      className={`flex gap-[10px] items-center   ${
                        isExpanded ? "p-0 mb-0" : "mb-5 "
                      } `}
                    >
                      <MdHome size={26} />
                      {isExpanded ? (
                        <span className={` text-[18px] font-[500]`}>
                          Dashboard
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </MuiTooltip>
                </div>
                {/* </Link> */}
                {renderMenu(menu, isExpanded, setIsExpanded, true)}
              </div>
            </>
          )}
          <div
            className={`mt-4  flex  ${
              isExpanded ? "self-end mr-2" : "self-center"
            }`}
          >
            <MuiTooltip title="Expend" placement="right">
              <div
                onClick={() => setIsExpanded(!isExpanded)}
                className={`  cursor-pointer rounded transition`}
              >
                <IoIosOpen
                  size={26}
                  className={`transform transition-transform duration-100  ${
                    isExpanded ? "rotate-180" : ""
                  } `}
                />
              </div>
            </MuiTooltip>
          </div>
        </div>

        <div
          className={` ${isExpanded ? "w-[85%]" : "w-[95%]"} overflow-y-auto`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomSideBarMenu;
