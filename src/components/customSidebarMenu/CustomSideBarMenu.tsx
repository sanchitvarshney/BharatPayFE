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

import MuiTooltip from "../reusable/MuiTooltip";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { IoIosOpen } from "react-icons/io";
import { MdHome } from "react-icons/md";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import { Menu } from "@/features/menu/menuType";
import { Icons } from "../icons";
import { getMenuData } from "@/features/menu/menuSlice";
const getTextSize = (level: number) => {
  switch (level) {
    case 0:
      return "text-[19px]";
    case 1:
      return "text-[18px]";
    case 2:
      return "text-[17px]";
    default:
      return "text-[16px]";
  }
};
const renderMenu = (
  menu: Menu[] | null,
  isExpanded: boolean,
  setIsExpanded: (value: boolean) => void,
  isNew: boolean,
  accordionValues: { [key: string]: string },
  setAccordionValues: (value: { [key: string]: string }) => void,
  path: string = "",
  level: number = 0
) => {
  
  return (
    <Accordion
      type="single"
      collapsible
      value={accordionValues[path] || ""}
      onValueChange={(val) =>
        setAccordionValues({ ...accordionValues, [path]: val })
      }
    >
      <ul className="flex flex-col gap-[20px]">
        {menu?.map((item: any, index: number) => {
          const currentPath = `${path}/${item.name}-${index}`;

          return (
            <li key={item.key || item.name + index}>
              {item?.children ? (
                <AccordionItem
                  value={currentPath}
                  className="border-0 w-full transition-all duration-100"
                >
                  <div className="flex flex-col px-2">
                    {!isExpanded && (
                      <MuiTooltip title={item?.name} placement="right">
                        <div
                          className="px-1 rounded-md cursor-pointer "
                          onClick={() => {
                            if (!isExpanded) {
                              setIsExpanded(true);
                              setAccordionValues({
                                ...accordionValues,
                                [path]: currentPath,
                              });
                            }
                          }}
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
                        className="w-[100%] py-1   m-0 leading-none hover:no-underline rounded-md hover:bg-white"
                        onClick={() => {
                          setAccordionValues({
                            ...accordionValues,
                            [path]: currentPath,
                          });
                        }}
                      >
                        <div className="w-full p-1 flex items-center cursor-pointer rounded-md gap-2">
                          {isNew && (
                            <DynamicIcon
                              name={item.icon}
                              size="medium"
                              isExpended={isExpanded}
                              
                            />
                          )}
                          <span
                            className={` ${getTextSize(level)} font-[500]`}
                          >
                            {item.name}
                          </span>
                        </div>
                      </AccordionTrigger>
                    )}
                    {isExpanded && item.children && (
                      <AccordionContent className=" mx-4  border-l-2 border-cyan-600">
                        {renderMenu(
                          item.children,
                          isExpanded,
                          setIsExpanded,
                          false,
                          accordionValues,
                          setAccordionValues,
                          currentPath,
                          level + 1
                        )}
                      </AccordionContent>
                    )}
                  </div>
                </AccordionItem>
              ) : (
                <MuiTooltip title={isExpanded ? "" :item.name} placement="right">
                  <div
                    className={` flex items-center justify-between w-full px-2 ${
                      isExpanded && ""
                    } rounded-md `}
                  >
                    <Link
                      to={item?.url}
                      className={`w-full rounded-md cursor-pointer flex items-center gap-[10px] ${
                        !isExpanded ? "pl-1" : "pl-1 hover:bg-white p-[6px]"
                      } `}
                      onClick={() => {
                        setIsExpanded(false);
                        setAccordionValues({});
                      }}
                    >
                      {isNew && (
                        <DynamicIcon
                          name={item.icon}
                          size="medium"
                          isExpended={isExpanded}
                        />
                      )}
                      {isExpanded && (
                        <div className="flex">
                          <span className={`${getTextSize(level)} font-[500]`}>
                            {item.name}
                          </span>
                          <CgArrowTopRight className="h-[20px] w-[20px] ml-2" />
                        </div>
                      )}
                    </Link>
                  </div>
                </MuiTooltip>
              )}
            </li>
          );
        })}
      </ul>
    </Accordion>
  );
};

interface CustomSideBarMenuProps {
  children: React.ReactNode;
  //   item:any
}

const CustomSideBarMenu: React.FC<CustomSideBarMenuProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { menu, menuLoading } = useAppSelector((state) => state.menu);
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(false);
  const [accordionValues, setAccordionValues] = useState<{
    [key: string]: string;
  }>({});

  return (
    <div className=" w-full h-[calc(100vh-50px)]  flex flex-col bg-gradient-to-t from-cyan-400 to-cyan-100">
      <div className="z-3 h-[calc(100vh-50px)] flex justify-center items-center ">
        <div
          className={` h-[95%] ${
            isExpanded ? "w-[360px] items-center" : "w-[80px] items-center "
          } flex flex-col justify-between  transition-all duration-100 ease-in-out   bg-gradient-to-t from-cyan-400 to-cyan-100`}
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
              <div className="overflow-y-auto custom-scrollbar-for-menu p-1 ">
                <div
                  className={`flex justify-between items-center p-1 pl-1   rounded-md  ${
                    isExpanded && "mb-5 hover:bg-white"
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
                      className={`flex gap-[8px] items-center px-[7px] cursor-pointer  ${
                        isExpanded
                          ? "py-1 mb-0 hover:bg-white"
                          : "mb-4  rounded-md flex items-center justify-center  "
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
                {renderMenu(
                  menu,
                  isExpanded,
                  setIsExpanded,
                  true,
                  accordionValues,
                  setAccordionValues
                )}
              </div>
            </>
          )}
          <div
            className={`mt-4 w-full  flex  ${
              isExpanded
                ? "justify-between items-center px-7"
                : "justify-center items-center flex-col gap-y-4"
            }`}
          >
            {" "}
            <div>
              <MuiTooltip title="Refresh" placement="right">
                <div
                  onClick={() => dispatch(getMenuData())}
                  className={`  cursor-pointer rounded-md transition`}
                >
                  <Icons.refresh />
                </div>
              </MuiTooltip>
            </div>
            <div>
              <MuiTooltip title="Expend" placement="right">
                <div
                  onClick={() => {
                    setIsExpanded(!isExpanded);
                  }}
                  className={` cursor-pointer rounded-md transition`}
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
