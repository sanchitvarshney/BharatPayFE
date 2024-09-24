import React from 'react'
import { NavLink } from 'react-router-dom'

const POLayout = (props:{children:React.ReactNode}) => {
  return (
    <div className="">
      <div className="w-full bg-white tab h-[50px] shadow z-10 border-b border-slate-300">
        <ul className="group flex items-center  h-[50px] ">
          <li className="h-[50px]">
            <NavLink to={"/create-po"} className={({ isActive })=>`h-[50px] text-[14px] px-[20px] flex items-center text-center ${isActive && "bg-cyan-50  border-b-[4px] border-cyan-400"}    hover:bg-cyan-50  `}>
              Create PO
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink to={"/manage-po"} className={({ isActive })=>`h-[50px] text-[14px] px-[20px] flex items-center text-center ${isActive && "bg-cyan-50  border-b-[4px] border-cyan-400"}    hover:bg-cyan-50  `}>
              Manage PO
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink to={"/completed-po"} className={({ isActive })=>`h-[50px] text-[14px] px-[20px] flex items-center text-center ${isActive && "bg-cyan-50  border-b-[4px] border-cyan-400"}    hover:bg-cyan-50  `}>
              Completed PO
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink to={"/approve-po"} className={({ isActive })=>`h-[50px] text-[14px] px-[20px] flex items-center text-center ${isActive && "bg-cyan-50  border-b-[4px] border-cyan-400"}    hover:bg-cyan-50  `}>
              Approve PO
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="h-[calc(100vh-100px)] bg-transparent overflow-y-auto ">
        {props.children}
      </div>
    </div>
  )
}

export default POLayout
