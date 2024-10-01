import { ChevronRight, Star } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { IoGrid } from "react-icons/io5";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TbReportSearch } from "react-icons/tb";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Props } from "@/types/MainLayout";
import { CgArrowTopRight } from "react-icons/cg";
import { materialmenu, productionMenu, TRC } from "@/data/SidebarMenuData";
import CustomTooltip from "./CustomTooltip";
import { FaCartFlatbed } from "react-icons/fa6";
import { Button } from "../ui/button";
import { AiFillDatabase } from "react-icons/ai";

const renderMenu = (menu: any, setSidemenu: any) => {
  return (
    <Accordion type="single" collapsible>
      <ul className="flex flex-col gap-[10px]">
        {menu.map((item: any, index: number) => (
          <li key={index}>
            {item.subMenu ? (
              <AccordionItem value={`${index + item.name}`} className="border-0">
                <AccordionTrigger className="hover:no-underline hover:bg-cyan-800 p-[10px] rounded-md cursor-pointer">
                  <span className="flex gap-[10px] items-center">{item.name}</span>
                </AccordionTrigger>
                <AccordionContent className="p-[10px] mt-[10px] border-l-2 border-yellow-600 bg-cyan-900 rounded">{renderMenu(item.subMenu, setSidemenu)}</AccordionContent>
              </AccordionItem>
            ) : (
              <div className="flex items-center justify-between w-full">
                <Link onClick={() => setSidemenu(false)} to={item.path} className="w-full hover:no-underline hover:bg-cyan-700 p-[10px] rounded-md cursor-pointer flex items-center gap-[10px]">
                  {item.name} <CgArrowTopRight className="h-[20px] w-[20px] font-[600]" />
                </Link>
                <CustomTooltip message="Add to favorite" side="right">
                  <div className="h-[30px] min-w-[30px] flex justify-center items-center  hover:bg-white hover:text-cyan-600 transition-all cursor-pointer rounded-md">
                    <Star className="h-[16px] w-[16px]" />
                  </div>
                </CustomTooltip>
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
  return (
    <div ref={modalRef} className={`absolute  h-[100vh] w-[300px] z-[30] top-0 bg-cyan-950 transition-all duration-500 ${sheetOpen ? "left-[60px]" : "left-[-300px]"}`}>
      <Button variant={"outline"} onClick={() => setSheetOpen(false)} className="cursor-pointer absolute top-[10px] right-[10px] bg-transparent text-white hover:bg-white/20 border-none hover:text-white">
        <FaArrowLeftLong className="text-[20px] " />
      </Button>
      <ul className="flex flex-col text-white p-[5px] mt-[50px] ">
        <li>
          <NavLink to={"/"} className={"flex gap-[10px] items-center py-[10px] hover:bg-cyan-800 p-[10px] rounded-md "}>
            <MdHome className="h-[20px] w-[20px]" />
            Dashboard
          </NavLink>
        </li>
        <li className="group">
          <div className={"flex justify-between items-center py-[10px] hover:bg-cyan-800 p-[10px] group-hover:bg-cyan-800 rounded-md cursor-pointer"}>
            <span className="flex gap-[10px] items-center cursor-pointer">
              <IoGrid className="h-[20px] w-[20px]" />
              Material Management
            </span>
            <ChevronRight />
          </div>
          <div className=" top-[20px] bottom-[20px] z-[-9] bg-cyan-950 shadow absolute border-l border-slate-600 rounded-md  right-[0] w-[0]  opacity-0 overflow-hidden  transition-all duration-500 group-hover:w-[400px] group-hover:opacity-100 group-hover:right-[-400px]">
            <div className="min-w-[400px]">
              <div className="p-[10px] h-[130px]">
                <span className="flex gap-[10px] items-center cursor-pointer text-[18px] opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <IoGrid className="h-[20px] w-[20px]" />
                  Material Management
                </span>
                <p className="font-[350] text-[13px] mt-[10px]">Control and track materials seamlessly. Ensure efficient handling, storage, and supply chain operations.</p>
                <a href="#" className="font-[350] text-[13px] mt-[10px] text-blue-200">
                  Explore material management
                </a>
              </div>
              <Separator className="bg-slate-200 text-slate-200" />
              <ul className="p-[10px] overflow-y-auto h-[calc(100vh-170px)] scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 flex flex-col gap-[10px]">{renderMenu(materialmenu, setSheetOpen)}</ul>
            </div>
          </div>
        </li>
        <li className="group">
          <div className={" flex justify-between items-center py-[10px] hover:bg-cyan-800 group-hover:bg-cyan-800 p-[10px] rounded-md cursor-pointer"}>
            <span className="flex gap-[10px] items-center cursor-pointer">
              <FaCartFlatbed className="h-[20px] w-[20px]" />
              Production Management
            </span>
            <ChevronRight />
          </div>
          <div className=" top-[20px] bottom-[20px] z-[-9] bg-cyan-950 shadow absolute border-l border-slate-600 rounded-md  right-[0] w-[0]  opacity-0 overflow-hidden  transition-all duration-500 group-hover:w-[400px] group-hover:opacity-100 group-hover:right-[-400px]">
            <div className="min-w-[400px]">
              <div className="p-[10px]">
                <span className="flex gap-[10px] items-center cursor-pointer text-[18px] opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <FaCartFlatbed className="h-[20px] w-[20px]" />
                  Production Management
                </span>
                <p className="font-[350] text-[13px] mt-[10px]">Streamline production workflows and enhance efficiency. Plan, monitor, and control your production processes effectively.</p>
                <a href="#" className="font-[350] text-[13px] mt-[10px] text-blue-200">
                  Explore Production Management
                </a>
              </div>
              <Separator className="bg-slate-200 text-slate-200" />
              <ul className="p-[10px] overflow-y-auto h-[500px] scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300">{renderMenu(productionMenu, setSheetOpen)}</ul>
            </div>
          </div>
        </li>
        <li className="group">
          <div className={" flex justify-between items-center py-[10px] hover:bg-cyan-800 group-hover:bg-cyan-800 p-[10px] rounded-md cursor-pointer"}>
            <span className="flex gap-[10px] items-center cursor-pointer">
              <AiFillDatabase className="h-[20px] w-[20px]" />
              TRC
            </span>
            <ChevronRight />
          </div>
          <div className=" top-[20px] bottom-[20px] z-[-9] bg-cyan-950 shadow absolute border-l border-slate-600 rounded-md  right-[0] w-[0]  opacity-0 overflow-hidden  transition-all duration-500 group-hover:w-[400px] group-hover:opacity-100 group-hover:right-[-400px]">
            <div className="min-w-[400px]">
              <div className="p-[10px]">
                <span className="flex gap-[10px] items-center cursor-pointer text-[18px] opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <AiFillDatabase className="h-[20px] w-[20px]" />
                  TRC Management
                </span>
                <p className="font-[350] text-[13px] mt-[10px]">Streamline production workflows and enhance efficiency. Plan, monitor, and control your production processes effectively.</p>
                <a href="#" className="font-[350] text-[13px] mt-[10px] text-blue-200">
                  Explore TRC Management
                </a>
              </div>
              <Separator className="bg-slate-200 text-slate-200" />
              <ul className="p-[10px] overflow-y-auto h-[500px] scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300">{renderMenu(TRC, setSheetOpen)}</ul>
            </div>
          </div>
        </li>
        <li className="group">
          <Link to={"/report?reportno=R1"} onClick={() => setSheetOpen(false)}>
            <div className={" flex justify-between items-center py-[10px] hover:bg-cyan-800 group-hover:bg-cyan-800 p-[10px] rounded-md cursor-pointer"}>
              <span className="flex gap-[10px] items-center cursor-pointer">
                <TbReportSearch className="h-[20px] w-[20px]" />
                Report
              </span>
              <CgArrowTopRight className="h-[20px] w-[20px] font-[600]" />
            </div>
          </Link>
        </li>
        <li className="group">
          <Link to={"/queries?query=Q1"} onClick={() => setSheetOpen(false)}>
            <div className={" flex justify-between items-center py-[10px] hover:bg-cyan-800 group-hover:bg-cyan-800 p-[10px] rounded-md cursor-pointer"}>
              <span className="flex gap-[10px] items-center cursor-pointer">
                <TbReportSearch className="h-[20px] w-[20px]" />
                Query
              </span>
              <CgArrowTopRight className="h-[20px] w-[20px] font-[600]" />
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarMenues;
