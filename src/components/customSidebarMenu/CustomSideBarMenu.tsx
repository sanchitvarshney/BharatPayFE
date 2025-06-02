import { Menu } from "@/features/menu/menuType";
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

const renderMenu = (menu: any | undefined, isExpanded: boolean) => {
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
                  <div className="flex justify-between items-center">
                    <div>
                      {item?.icon !== "-" && (
                        <DynamicIcon name={item.icon} size="small" />
                      )}

                      {isExpanded && <span className="ml-3">{item.name}</span>}
                    </div>
                    {isExpanded && (
                      <AccordionTrigger className="ml-auto p-1 m-0 h-auto min-h-0 leading-none"></AccordionTrigger>
                    )}
                  </div>

                  {/* Content below the header */}

                  {isExpanded && item?.children && (
                    <AccordionContent className="px-2 py-2 mt-2 border-l-2 border-yellow-600 bg-cyan-900 rounded">
                      {/* {item.children.map((childItem: any) => (
                              <div key={childItem.id} className="py-1">
                                {childItem.name}
                              </div>
                            ))} */}
                      {renderMenu(item.children, isExpanded)}
                    </AccordionContent>
                  )}
                </div>
              </AccordionItem>
            ) : (
              <div
                key={item?.id}
                className="flex items-center justify-between w-full"
              >
                <Link
                  // onClick={() => setSidemenu(false)}
                  to={item?.url}
                  className="w-full hover:no-underline hover:bg-cyan-700  rounded-md cursor-pointer flex items-center gap-[10px]"
                >
                  {item?.icon !== "-" && (
                    <DynamicIcon name={item.icon} size="small" />
                  )}

                  {isExpanded ? (
                    <>
                      <span>{item?.name}</span>
                      <CgArrowTopRight className="h-[20px] w-[20px] font-[600]" />{" "}
                    </>
                  ) : (
                    ""
                  )}
                </Link>
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
  const { menu, menuLoading } = useAppSelector((state) => state.menu);
  console.log(menu);
  const [sidemenu, setSidemenu] = useState<any>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className=" w-full h-[calc(100vh-50px)] flex flex-col">
      {/* <div className="flex "> */}

      {/* <div className="absolute top-4 left-10  flex items-center justify-center z-10">
        <h2>Tab</h2>
      </div> */}
      <div className="z-3 h-[calc(100vh-50px)] flex justify-center items-center ">
        <div
          className={` items-center h-[80%] ${
            isExpanded ? "w-[320px] p-4" : "w-[80px] "
          } flex flex-col justify-between py-4 transition-all duration-500 ease-in-out overflow-y-auto`}
        >
          {/* <li> */}
          <NavLink
            to={"/"}
            // onClick={() => setSheetOpen(false)}
            className={
              "flex gap-[10px] items-center py-[10px] hover:bg-cyan-900 p-[10px]  "
            }
          >
            <MdHome className="h-[20px] w-[20px]" />
            Dashboard
          </NavLink>
          {/* </li> */}
          {renderMenu(menu, isExpanded)}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex ${
              isExpanded ? "self-end mt-10" : "justify-center items-center"
            }  cursor-pointer  p-2 rounded transition`}
          >
            <IoIosOpen
              size={22}
              className={`transform transition-transform duration-400 hover:text-cyan-700   ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        <div
          className={` ${
            isExpanded ? "w-[85%]" : "w-[95%]"
          } h-[80%] overflow-y-auto
 `}
        >
          {children}
        </div>
      </div>
    </div>
    // </div>
  );
};

export default CustomSideBarMenu;
