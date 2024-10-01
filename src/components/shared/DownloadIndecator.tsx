import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


import { Download } from "lucide-react";
import { Link } from "react-router-dom";

const DownloadIndecator = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="bg-white p-[5px] rounded-md">
              <Download className="text-slate-600 w-[25px] h-[25px] cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent className="bg-cyan-700 " >
              <p>Downloads</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-[20px] border shadow shadow-slate-600" align="end">
      <div className="h-[100px] flex justify-center items-center">
          <img src="/empty.png" alt=""  className="h-[70px] w-[70px]"/>
      </div>
        <Link to={"#"} className="text-center text-cyan-600 text-[14px] hover:underline">See all downloads</Link>
      </PopoverContent>
    </Popover>
  );
};

export default DownloadIndecator;
