import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Empty, InputRef } from "antd";
import { SearchOutlined, CloseCircleFilled } from "@ant-design/icons";
import { Menu } from "@/features/menu/menuType";
import {
  buildIndexedModuleOptionsFromMenu,
  extractQueryWords,
  filterModuleOptions,
  ModuleSearchOption,
} from "./moduleSearchUtils";

const escapeRegex = (s:any) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightWords = (text:any, words:any) => {
  if (!words.length || !text) return text;
  const parts = text.split(
    new RegExp(`(${words.map(escapeRegex).join("|")})`, "gi"),
  );
  return parts.map((part:any, i:any) =>
    i % 2 === 1 ? (
      <mark key={i} style={{ background: "#fef08a", borderRadius: 2, padding: "0 1px" }}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

const PALETTE_STYLES = `
  .cmd-palette-overlay {
    position: fixed;
    inset: 0;
    z-index: 1200;
    background: rgba(20, 24, 28, 0.35);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 72px;
    opacity: 0;
    transition: opacity 180ms ease;
  }
  .cmd-palette-overlay.open {
    opacity: 1;
  }
  .cmd-palette-panel {
    width: min(620px, calc(100vw - 32px));
    max-height: min(480px, calc(100vh - 96px));
    background: #f8f9fa;
    border: 1px solid #d6dde3;
    border-radius: 14px;
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22);
    overflow: hidden;
    transform: translateY(-8px) scale(0.98);
    opacity: 0;
    transition: transform 180ms ease, opacity 180ms ease;
    display: flex;
    flex-direction: column;
  }
  .cmd-palette-panel.open {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  .cmd-palette-search-input.ant-input-affix-wrapper {
    padding: 0 !important;
    font-size: 16px !important;
    line-height: 24px !important;
    min-height: 36px !important;
    background: transparent !important;
    box-shadow: none !important;
  }
  .cmd-palette-search-input .ant-input {
    font-size: 16px !important;
    line-height: 24px !important;
    height: 36px !important;
    padding: 0 !important;
    background: transparent !important;
  }
  .cmd-palette-results {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
  .cmd-palette-footer {
    flex-shrink: 0;
    border-top: 1px solid #e5e7eb;
    background: #fffbeb;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
`;

type ModuleSearchProps = {
  menu: Menu[] | null;
};

export default function ModuleSearch({ menu }: ModuleSearchProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<InputRef>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const allModules = useMemo(() => buildIndexedModuleOptionsFromMenu(menu), [menu]);

  const results = useMemo(
    () => filterModuleOptions(allModules, query),
    [allModules, query],
  );
    const queryWords = useMemo(() => extractQueryWords(query), [query]);

  const open = () => {
    setQuery("");
    setActiveIndex(0);
    setIsVisible(true);
    requestAnimationFrame(() => setIsOpen(true));
  };

  const close = () => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);
    setTimeout(() => setIsVisible(false), 180);
  };

  const selectItem = (item: ModuleSearchOption) => {
    navigate(item.value);
    close();
  };

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
    itemRefs.current = [];
  }, [query]);

  useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeIndex, results]);

  useEffect(() => {
    const isTypingElement = (target: EventTarget | null) => {
      if (!target || !(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return true;
      return Boolean(
        target.isContentEditable || target.closest?.("[contenteditable='true']"),
      );
    };

    const onSlash = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTypingElement(e.target)) return;
      e.preventDefault();
      if (!isVisible) open();
    };

    window.addEventListener("keydown", onSlash);
    return () => window.removeEventListener("keydown", onSlash);
  }, [isVisible]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, Math.max(results.length - 1, 0)));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) selectItem(results[activeIndex]);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };



  return (
    <>
      <style>{PALETTE_STYLES}</style>
      <button
        type="button"
        onClick={open}
        style={{
          width: 220,
          height: 34,
          borderRadius: 8,
          border: "1px solid #d1d5db",
          background: "#ffffff",
          color: "#374151",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 12px",
          cursor: "pointer",
          justifyContent: "space-between",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <SearchOutlined />
          <span style={{ opacity: 0.85 }}>Search</span>
        </span>
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 20,
            height: 20,
            borderRadius: 6,
            border: "1px solid #d1d5db",
            fontSize: 12,
            fontWeight: 700,
            color: "#6b7280",
            background: "#f3f4f6",
          }}
        >
          /
        </span>
      </button>

      {isVisible && (
        <div
          className={`cmd-palette-overlay ${isOpen ? "open" : ""}`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className={`cmd-palette-panel ${isOpen ? "open" : ""}`}>
          <div style={{ padding: "14px 16px 10px" }}>
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search pages..."
                variant="borderless"
               prefix={<SearchOutlined style={{ color: "#6b7280", fontSize: 20 }} />}
                suffix={
                  query ? (
                    <CloseCircleFilled
                      onClick={() => setQuery("")}
        style={{ color: "#9ca3af", cursor: "pointer", fontSize: 18 }}
                    />
                  ) : null
                }
                 style={{
                  color: "#1f2937",
                  fontSize: 28,
                  lineHeight: "36px",
                  background: "transparent",
                  padding: 0,
                }}
              />
            </div>

        <div style={{ borderTop: "1px solid #e5e7eb" }}>
              {query.trim().length > 0 &&
                (results.length > 0 ? (
                  <div style={{ maxHeight: 280, overflowY: "auto", padding: "8px 0" }}>
                    {results.map((item:any, idx:any) => {
                      const isActive = idx === activeIndex;
                      return (
                        <button
                          key={`${item.value}-${item.key}`}
                          ref={(el) => {
                            itemRefs.current[idx] = el;
                          }}
                          type="button"
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => selectItem(item)}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            border: "none",
                             background: isActive ? "#e8f4fd" : "transparent",
                            color: "#1f2937",
                            padding: "10px 14px",
                            cursor: "pointer",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <div>
                              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>
                                               {highlightWords(item.label, queryWords)}
                              </div>
                              <div style={{ marginTop: 4, color: "#4b5563", fontSize: 12 }}>
                                {item.breadcrumb}
                              </div>
                              <div style={{ marginTop: 2, color: "#4b5563", fontSize: 12 }}>
                              {highlightWords(item.breadcrumb, queryWords)}
                              </div>
                            </div>
                               {(() => {
                                const matched = item.aliases?.find((a: any, i: any) =>
                                  queryWords.some((w) =>
                                    item.searchAliases?.[i]?.includes(w),
                                  ),
                                );
                                return matched ? (
                                  <div style={{ marginTop: 2, color: "#9ca3af", fontSize: 12 }}>
                                    Also: {highlightWords(matched, queryWords)}
                                  </div>
                                ) : null;
                              })()}
                            <div
                              style={{
                                color: "#475569",
                                fontSize: 13,
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                           
                              }}
                            >
                              ID {item.searchIndex}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ padding: "30px 0" }}>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <span style={{ color: "#6b7280" }}>No matching page found</span>
                      }
                    />
                  </div>
                ))}
            </div>

                <div
              style={{
                borderTop: "1px solid #e5e7eb",
                padding: "8px 14px",
                display: "flex",
                gap: 16,
                               alignItems: "center",
                color: "#6b7280",
                fontSize: 13,
              }}
            >
              <span>↑ ↓ Navigate</span>
              <span>Enter Select</span>
              <span>Esc Close</span>
                <span style={{ marginLeft: "auto" }}>
                {query.trim()
                  ? <>search match(s) <strong style={{ color: "#1f2937" }}>{results.length}</strong></>
                  : null}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
