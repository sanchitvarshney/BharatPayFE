import { ChevronRight, Star } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import React, { useEffect } from "react";
import { Props } from "@/types/MainLayout";
import { CgArrowTopRight } from "react-icons/cg";
import { Button } from "../ui/button";
import MuiTooltip from "../reusable/MuiTooltip";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getMenuData } from "@/features/menu/menuSlice";
import { Menu } from "@/features/menu/menuType";
import DynamicIcon from "../reusable/DynamicIcon";

const renderMenu = (menu: Menu[] | undefined, setSidemenu: React.Dispatch<React.SetStateAction<boolean>>) => {
  return (
    <Accordion type="single" collapsible>
      <ul className="flex flex-col gap-[10px]">
        {menu?.map((item: Menu, index) => (
          <li key={index}>
            {item.children ? (
              <AccordionItem value={`${index + item.name}`} className="border-0">
                <AccordionTrigger className="hover:no-underline hover:bg-cyan-800 p-[10px] rounded-md  cursor-pointer">
                  <span className="flex gap-[10px] items-center">{item.name}</span>
                </AccordionTrigger>
                <AccordionContent className="p-[10px] mt-[10px] border-l-2 border-yellow-600 bg-cyan-900 rounded">{renderMenu(item.children, setSidemenu)}</AccordionContent>
              </AccordionItem>
            ) : (
              <div className="flex items-center justify-between w-full">
                <Link onClick={() => setSidemenu(false)} to={`${item.url}` || "#"} className="w-full hover:no-underline hover:bg-cyan-700 p-[10px] rounded-md  cursor-pointer flex items-center gap-[10px]">
                  {item.name} <CgArrowTopRight className="h-[20px] w-[20px] font-[600]" />
                </Link>
                <MuiTooltip title="Add to favorite" placement="right">
                  <div className="h-[30px] min-w-[30px] flex justify-center items-center rounded-md  hover:bg-white hover:text-cyan-600 transition-all cursor-pointer ">
                    <Star className="h-[16px] w-[16px]" />
                  </div>
                </MuiTooltip>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Accordion>
  );
};
const SidebarMenues: React.FC<Props> = ({ uiState }) => {
  const { sheetOpen, setSheetOpen, modalRef } = uiState;
  const dispatch = useAppDispatch();
  const { menu } = useAppSelector((state) => state.menu);
  useEffect(() => {
    dispatch(getMenuData());
  }, []);

  return (
    <div ref={modalRef} className={` absolute  h-[100vh] w-[300px] z-[30] top-0 bg-cyan-800 transition-all duration-500 ${sheetOpen ? "left-[60px]" : "left-[-300px]"}`}>
      <Button variant={"outline"} onClick={() => setSheetOpen(false)} className="cursor-pointer absolute top-[10px] right-[10px] bg-transparent text-white hover:bg-white/20 border-none hover:text-white">
        <FaArrowLeftLong className="text-[20px] " />
      </Button>
      <ul className="flex flex-col text-white py-[5px] mt-[50px] ">
        <li>
          <NavLink to={"/"} onClick={() => setSheetOpen(false)} className={"flex gap-[10px] items-center py-[10px] hover:bg-cyan-900 p-[10px]  "}>
            <MdHome className="h-[20px] w-[20px]" />
            Dashboard
          </NavLink>
        </li>
        {menu?.map((item) =>
          item.children ? (
            <li className="group" key={item.menu_key}>
              <div className={"flex justify-between items-center py-[10px] hover:bg-cyan-900 p-[10px] group-hover:bg-cyan-900  cursor-pointer"}>
                <span className="flex gap-[10px] items-center cursor-pointer">
                  <DynamicIcon name={item?.icon} size="small" />
                  {item.name}
                </span>
                <ChevronRight />
              </div>
              <div className=" top-[10px] bottom-[10px] z-[-9] bg-cyan-950 shadow absolute border-l border-slate-600   right-[0] w-[0]  opacity-0 overflow-hidden  transition-all duration-500 group-hover:w-[400px] group-hover:opacity-100 group-hover:right-[-400px] rounded-md">
                <div className="min-w-[400px]">
                  <div className="p-[10px] h-[130px]">
                    <span className="flex gap-[10px] items-center cursor-pointer text-[18px] opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <DynamicIcon name={item?.icon} size="small" />
                      {item.name}
                    </span>
                    <p className="font-[350] text-[13px] mt-[10px]">{item.description}</p>
                    <a href="#" className="font-[350] text-[13px] mt-[10px] text-blue-200">
                      Explore material management
                    </a>
                  </div>
                  <Separator className="bg-slate-200 text-slate-200" />
                  <ul className="p-[10px] overflow-y-auto h-[calc(100vh-170px)] scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 flex flex-col gap-[10px] ">{renderMenu(item.children, setSheetOpen)}</ul>
                </div>
              </div>
            </li>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Link onClick={() => setSheetOpen(false)} to={`${item.url}` || "#"} className="w-full hover:no-underline hover:bg-cyan-900 p-[10px] roundeded-none  cursor-pointer flex items-center gap-[10px]">
                <DynamicIcon name={item?.icon} size="small" />
                {item.name} <CgArrowTopRight className="h-[20px] w-[20px] font-[600]" />
              </Link>
            </div>
          )
        )}
      </ul>
    </div>
  );
};

export default SidebarMenues;
