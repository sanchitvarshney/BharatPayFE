import React from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Props } from '@/types/MainLayout';
import { LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useUser } from '@/hooks/useUser';
const ProfileSidebar:React.FC<Props> = ({uiState}) => {
    const {sidebaref,setSheet2Open,sheet2Open,setLogotAlert} = uiState
    const { user } = useUser();
    
  return (
    <div ref={sidebaref} className={`absolute  h-[100vh] w-[300px] z-[30] top-0 bg-neutral-200 transition-all duration-500 ${sheet2Open ? "left-[60px]" : "left-[-300px]"}`}>
    <FaArrowLeftLong onClick={() => setSheet2Open(false)} className="text-[20px] cursor-pointer absolute top-[10px] right-[10px] text-slate-600" />
    <div>
      <div className="user mt-[60px] flex flex-col items-center text-slate-600">
        <Avatar className="w-[100px] h-[100px]">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="name mt-[10px]">{user?.username}</div>
        <p className="text-[13px] text-slate-600">{user?.crn_type}</p>
      </div>
      <div className="p-[10px] mt-[10px] flex flex-col gap-[10px] items-center">
        <div className="flex items-center gap-[10px] ">
          <p className=" font-[500] text-[14px] text-slate-600">Address :</p>
          <p className='text-[13px] text-slate-600'>Noida sector 59</p>
        </div>
        <div className="flex items-center gap-[10px] ">
          <p className="  font-[500] text-[14px] text-slate-600">Phone no. :</p>
          <p className='text-[13px] text-slate-600'>{user?.crn_mobile}</p>
        </div>
        <div className="flex items-center gap-[10px] ">
          <p className="  font-[500] text-[14px] text-slate-600">Email :</p>
          <p className='text-[13px] text-slate-600'>{user?.crn_email}</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 p-[10px] w-full flex justify-center items-center">
        <Button onClick={() => setLogotAlert(true)} variant={"outline"} className="w-full flex items-center gap-[10px] bg-red-800 hover:bg-red-700 hover:text-white border-0 text-white">
          <LogOut />
          Logout
        </Button>
      </div>
    </div>
  </div>
  )
}

export default ProfileSidebar
