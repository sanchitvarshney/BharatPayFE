import { BiLinkExternal } from "react-icons/bi";
import { FaWarehouse } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { BiSolidReport } from "react-icons/bi";
import { checkPermissions } from "@/helper/checkPermissions";

const HomePage = () => {
  console.log(checkPermissions())
  return (
    <div className="h-[calc(100vh-50px)] overflow-y-auto bg-white">
      <div className="w-full h-[calc(100vh-250px)] px-[200px]  py-[10px] flex items-center justify-center">
        <div>
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center overflow-hidden border rounded-full pr-[3px] max-w-[450px] min-w-[450px] shadow shadow-zinc-300">
              <Input className="border-none focus-visible:ring-0" placeholder="Search modules" />
              <Button variant={"outline"} className="min-h-[30px] min-w-[30px] max-h-[30px] max-w-[30px]  p-0 bg-zinc-200 rounded-full">
                <Search className=" text-slate-600 h-[17px] w-[17px]" />
              </Button>
            </div>
          </div>
          <div className="flex  items-center mt-[30px] gap-[20px]">
            <div className="h-[150px] w-[250px] bg-cyan-500/30 rounded-md flex flex-col items-center justify-center gap-[3px] opacity-40 pointer-events-none cursor-not-allowed">
              <FaWarehouse className="h-[50px] w-[50px] text-cyan-800" />
              <Link to={"/"} className="flex items-center gap-[5px]">
                <p className="text-cyan-800 font-[600]">Production</p>
                <BiLinkExternal className="text-cyan-800" />
              </Link>
            </div>
            <div className="h-[150px] w-[250px] bg-cyan-500/30 rounded-md flex flex-col items-center justify-center gap-[3px] opacity-40 pointer-events-none cursor-not-allowed">
              <FaWarehouse className="h-[50px] w-[50px] text-cyan-800" />
              <Link to={"/"} className="flex items-center gap-[5px]">
                <p className="text-cyan-800 font-[600]">Warehouse</p>
                <BiLinkExternal className="text-cyan-800" />
              </Link>
            </div>
            <div className="h-[150px] w-[250px] bg-cyan-500/30 rounded-md flex flex-col items-center justify-center gap-[3px] opacity-40 pointer-events-none cursor-not-allowed">
              <BiSolidReport className="h-[50px] w-[50px] text-cyan-800" />
              <Link to={"/"} className="flex items-center gap-[5px]">
                <p className="text-cyan-800 font-[600]">Reports</p>
                <BiLinkExternal className="text-cyan-800" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[200px] bg-zinc-100 px-[200px] flex items justify-between py-[20px]">
        <div className="flex flex-col gap-[10px] w-[500px] items-start text-left justify-end">
          <img src="./ms.png" alt="" className="w-[200px]" />
          <div>
            <p className="text-[13px] text-zinc-500">MsCorpres Automation Pvt Ltd</p>
            <p className="text-[13px] text-zinc-500">Assotech Business Cresterra ,Unit No 321, Tower - 4</p>
            <p className="text-[13px] text-zinc-500">Phone 2: +91 88 26 788880 </p>
            <p className="text-[13px] text-zinc-500">Email: marketing@mscorpres.in</p>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between ">
          <div>
            <p className="text-center text-slate-500">Stay updated with our latest products and updates .</p>
            <div className="flex mt-[10px] items-center overflow-hidden border rounded-full pr-[3px] max-w-[400px] min-w-[400px] shadow shadow-zinc-300 bg-white">
              <Input className="border-none focus-visible:ring-0" placeholder="Email" />
              <Button variant={"outline"} className="min-h-[30px] min-w-[30px] max-h-[30px] max-w-[30px]  p-0 bg-zinc-200 rounded-full">
                <Send className=" text-slate-600 h-[17px] w-[17px]" />
              </Button>
            </div>
          </div>
          <p className="text-[13px] text-zinc-500">© 2024 MsCorpres Automation Pvt. Ltd. | All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
