import { useState } from "react";
import { X } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CustomButton } from "../reusable/CustomButton";
import { Input } from "../ui/input";
import { IoSend } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export default function BugAndChat() {
  const [open, setOpen] = useState(false);
  const [hide, setHide] = useState(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <div className={`fixed z-50   h-[60px] w-[60px] rounded-full shadow-xl shadow-slate-400 border border-slate-300 cursor-move transition-all duration-500  ${hide ? "bottom-[90px] right-[-25px] rotate-[-40deg]" : "bottom-[100px] right-[20px]"}`}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          onClick={() => {
            setOpen(!open);
            setHide(false);
          }}
        >
          {hide || open ? (
            <div className="overflow-hidden rounded-full ">
              <img src="/bot.gif" alt="" className="w-full h-full rounded-full" />
            </div>
          ) : (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="overflow-hidden rounded-full " draggable>
                    <img src="/bot.gif" alt="" className="w-full h-full rounded-full" />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  onClick={(e) => {
                    e.stopPropagation();
                    setHide(true);
                  }}
                  className="h-[20px] w-[20px] rounded-full p-0 flex items-center justify-center bg-zinc-200 text-red-700 cursor-pointer"
                >
                  <RxCross2 />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </PopoverTrigger>
        <PopoverContent side="left" align="end" className="p-0 overflow-hidden rounded-lg w-[350px]">
          <div className="h-[40px]  bg-cyan-800 flex items-center justify-between px-[10px]">
            <CardTitle className="text-white">Chat With Us</CardTitle>
            <Button variant={"outline"} className="p-0 h-[30px] w-[30px] bg-transparent text-white border-0 hover:bg-white/20 hover:text-white" onClick={() => setOpen(!open)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-[50vh] relative">
            <div className="grid grid-cols-2">
              <CustomButton variant={"outline"} className="border-0 border-r rounded-none text-slate-500">
                Create New Ticket
              </CustomButton>
              <CustomButton variant={"outline"} className="border-0 rounded-none text-slate-500">
                View Pending Ticket
              </CustomButton>
            </div>
            <div>
              <CustomButton variant={"outline"} className="w-full border-0 border-t border-b rounded-none text-slate-500">
                Support Portal (View Pending Ticket)
              </CustomButton>
            </div>
            <div className="absolute bottom-[0] w-full px-[10px] py-[5px]">
              <div className="flex items-center overflow-hidden border rounded-full pr-[3px]">
                <Input className="border-none focus-visible:ring-0" placeholder="Type your message" />
                <Button variant={"outline"} className="min-h-[30px] min-w-[30px] max-h-[30px] max-w-[30px]  p-0 bg-zinc-200 rounded-full">
                  <IoSend className="" />
                </Button>
              </div>
            </div>
          </div>
          <div className="h-[10px] bg-cyan-800"></div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
