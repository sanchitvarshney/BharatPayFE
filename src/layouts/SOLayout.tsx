import React from "react";
import { NavLink } from "react-router-dom";

const SOLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className="">
      <div className="w-full bg-white tab h-[50px] shadow z-10 border-b border-slate-300">
        <ul className="group flex items-center  h-[50px] ">
          <li className="h-[50px]">
            <NavLink
              to={"/create-sales-order"}
              className={({ isActive }) =>
                `h-[50px] text-[14px] px-[20px] flex items-center text-center ${
                  isActive && "bg-cyan-50  border-b-[4px] border-cyan-400"
                }    hover:bg-cyan-50  `
              }
            >
              Create
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/sales-order/register"}
              className={({ isActive }) =>
                `h-[50px] text-[14px] px-[20px] flex items-center text-center ${
                  isActive && "bg-cyan-50  border-b-[4px] border-cyan-400"
                }    hover:bg-cyan-50  `
              }
            >
              Register
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/sales-order/shipment"}
              className={({ isActive }) =>
                `h-[50px] text-[14px] px-[20px] flex items-center text-center ${
                  isActive && "bg-cyan-50  border-b-[4px] border-cyan-400"
                }    hover:bg-cyan-50  `
              }
            >
              Shipment
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/sales-order/invoice"}
              className={({ isActive }) =>
                `h-[50px] text-[14px] px-[20px] flex items-center text-center ${
                  isActive && "bg-cyan-50  border-b-[4px] border-cyan-400"
                }    hover:bg-cyan-50  `
              }
            >
              Invoice
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/sales-order/allocated-invoice"}
              className={({ isActive }) =>
                `h-[50px] text-[14px] px-[20px] flex items-center text-center ${
                  isActive && "bg-cyan-50  border-b-[4px] border-cyan-400"
                }    hover:bg-cyan-50  `
              }
            >
              Allocated Invoice
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/sales-order/e-transaction-register"}
              className={({ isActive }) =>
                `h-[50px] text-[14px] px-[20px] flex items-center text-center ${
                  isActive && "bg-cyan-50  border-b-[4px] border-cyan-400"
                }    hover:bg-cyan-50  `
              }
            >
              E Transaction Register
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="h-[calc(100vh-100px)] bg-transparent overflow-y-auto ">
        {props.children}
      </div>
    </div>
  );
};

export default SOLayout;
