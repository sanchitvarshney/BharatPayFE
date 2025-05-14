import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa6";
import { menuData } from "@/data/SidebarData";
import DynamicIcon from "../reusable/DynamicIcon";

const SidebarMenues = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const sidebarWidth = isCollapsed ? 60 : 240;

  // Recursive menu renderer
  const renderMenu = (items, level = 0) => (
    <ul className={`flex flex-col ${level > 0 ? "pl-4" : ""}`}>
      {items.map((item, idx) => {
        const hasChildren = item.children && item.children.length > 0;
        const menuKey = `${item.title}-${level}-${idx}`;
        const isActive = item.path ? location.pathname === item.path : false;

        return (
          <li key={menuKey} className="mb-1">
            <Link
              to={item.path || "#"}
              className={`flex items-center gap-3 cursor-pointer rounded transition-colors ${
                isActive ? "bg-cyan-900 text-white" : "hover:bg-cyan-100"
              }`}
              style={{
                padding: isCollapsed ? "12px 0" : "12px 16px",
                justifyContent: isCollapsed ? "center" : "flex-start",
              }}
            >
              <DynamicIcon name={item.icon || ""} size="1.7em" />
              {!isCollapsed && <span className="text-base">{item.title}</span>}
            </Link>
            {/* Render children below parent */}
            {hasChildren && renderMenu(item.children, level + 1)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div
      className="fixed top-0 left-0 h-screen bg-gradient-to-b from-[#f8fafc] to-[#e0f2fe] flex flex-col justify-between transition-all duration-300 z-50"
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        maxWidth: sidebarWidth,
      }}
    >
      {/* Top: Logo */}
      <div className="flex items-center justify-center h-[60px]">
        <span className="text-black text-lg font-bold">WhatsApp Manager</span>
      </div>
      {/* Menu */}
      <nav className="flex-1 flex flex-col items-center justify-center w-full">
        {renderMenu(menuData)}
      </nav>
      {/* Drag/Expand Button at Bottom */}
      <div className="flex items-center justify-center py-4">
        <button
          className="rounded-full p-2 bg-white text-cyan-800 hover:bg-cyan-100 shadow"
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          <FaBars className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default SidebarMenues;
