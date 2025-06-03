import DynamicIcon from "../reusable/DynamicIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CgArrowTopRight } from "react-icons/cg";
import { Star } from "lucide-react";
import MuiTooltip from "../reusable/MuiTooltip";
import { useAppSelector } from "@/hooks/useReduxHook";
import { IoIosOpen } from "react-icons/io";
import { MdHome } from "react-icons/md";

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
                className="border-0 w-full transition-all duration-500"
              >
                <div className="flex flex-col">
                  {/* Header with icon and name */}
                  {/* <div className="flex justify-between items-center"> */}
                  <MuiTooltip
                    title={!isExpanded ? item?.name : ""}
                    placement="right"
                  >
                    {" "}
                    <Link
                      to={item?.url}
                      className="w-full rounded-md cursor-pointer flex items-center gap-[10px]"
                    >
                      <div
                        onClick={
                          !isExpanded ? () => setIsExpanded(true) : undefined
                        }
                        className={`w-full p-1 flex items-center  cursor-pointer ${
                          isExpanded ? "hover:bg-cyan-300" : ""
                        } rounded-md `}
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
                        <div>
                          {isExpanded && (
                            <AccordionTrigger className="w-[100%] py-1 m-0 leading-none hover:no-underline">
                              {" "}
                              <span
                                className={`ml-3 flex  text-right ${
                                  isNew
                                    ? "text-[18px] font-[500]"
                                    : "text-[14px] font-[500]"
                                }  `}
                              >
                                {item.name}
                              </span>
                            </AccordionTrigger>
                          )}
                        </div>
                        {/* {isExpanded && (
                       
                          )} */}
                      </div>
                    </Link>
                  </MuiTooltip>
                  {/* </div> */}

                  {/* Content below the header */}

                  {isExpanded && item?.children && (
                    <AccordionContent className="p-4 mt-1 border-l-2 border-cyan-600 bg-#fff-300 rounded">
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
              <div
                key={item?.id}
                className={`flex items-center justify-between w-full ${
                  isExpanded && "hover:bg-cyan-300"
                } rounded-md p-1`}
              >
                <MuiTooltip
                  title={!isExpanded ? item?.name : ""}
                  placement="right"
                >
                  <Link
                    // onClick={() => setSidemenu(false)}
                    to={item?.url}
                    className="w-full rounded-md cursor-pointer flex items-center gap-[10px] "
                  >
                    {item?.icon !== "-" && (
                      <DynamicIcon
                        name={item.icon}
                        size="medium"
                        isExpended={isExpanded}
                      />
                    )}

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
                </MuiTooltip>
                {isExpanded && (
                  <MuiTooltip title="Add to favorite" placement="right">
                    <div className="h-[30px] min-w-[30px] flex justify-center items-center rounded-md hover:bg-white hover:text-cyan-600 transition-all cursor-pointer ">
                      <Star className="h-[16px] w-[16px]" />
                    </div>
                  </MuiTooltip>
                )}
              </div>
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
  const { menu } = useAppSelector((state) => state.menu);

  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className=" w-full h-[calc(100vh-50px)] bg-#ffffff-600 flex flex-col">
      <div className="z-3 h-[calc(100vh-50px)] flex justify-center items-center ">
        <div
          className={` h-[95%] ${
            isExpanded ? "w-[350px] p-2 items-center" : "w-[80px] items-center "
          } flex flex-col justify-between py-0 transition-all duration-500 ease-in-out overflow-y-auto bg-#ffffff-600`}
        >
          <div>
            {" "}
            <div
              className={`flex justify-between items-center p-1 pl-1   rounded-md  ${
                isExpanded && "mb-5 hover:bg-cyan-300 "
              }`}
            >
              <MuiTooltip
                title={!isExpanded ? "Dashboard" : ""}
                placement="right"
              >
                <NavLink
                  to={"/"}
                  // onClick={() => setSheetOpen(false)}
                  className={`flex gap-[10px] items-center   ${
                    isExpanded ? "p-0 mb-0" : "mb-5 "
                  } `}
                >
                  <MdHome
                    className={`${
                      isExpanded
                        ? "hover:text-black-700"
                        : "hover:text-cyan-700"
                    }`}
                    size={26}
                  />
                  {isExpanded ? (
                    <span className={` text-[18px] font-[500]`}>Dashboard</span>
                  ) : (
                    ""
                  )}
                </NavLink>
              </MuiTooltip>
              {isExpanded && (
                <MuiTooltip title="Add to favorite" placement="right">
                  <div className="h-[30px] min-w-[30px] flex justify-center  items-center rounded-md hover:bg-white hover:text-cyan-600 transition-all cursor-pointer ">
                    <Star className="h-[16px] w-[16px]" />
                  </div>
                </MuiTooltip>
              )}
            </div>
            {renderMenu(menu, isExpanded, setIsExpanded, true)}
          </div>

          <MuiTooltip title="Expend" placement="right">
            <div
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex ${
                isExpanded ? "self-end mt-10" : "justify-center items-center"
              }  cursor-pointer  p-2 rounded transition`}
            >
              <IoIosOpen
                size={27}
                className={`transform transition-transform duration-400 hover:text-cyan-700   ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </div>
          </MuiTooltip>
        </div>

        <div
          className={` ${isExpanded ? "w-[85%]" : "w-[95%]"} overflow-y-auto`}
        >
          {children}
        </div>
      </div>
    </div>
    // </div>
  );
};

export default CustomSideBarMenu;
