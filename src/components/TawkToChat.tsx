"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTawkTo } from "../hooks/useTawkTo";
//@ts-ignore
import styles from "../theme/TawkToChat.module.css";

// ─── CONFIG — Replace these with your actual IDs ───────────────────────────
const TAWK_PROPERTY_ID = "69b4f160ffafbe1c36c96d79" 
const TAWK_WIDGET_ID = "1jjlctou9"

console.log(TAWK_PROPERTY_ID, TAWK_WIDGET_ID);

const BUBBLE_SIZE = 62;
const DEFAULT_OFFSET = 28;
/** Default distance from right edge so bubble is visible on laptop/smaller screens */
const DEFAULT_RIGHT_MARGIN = 300;

const DEPARTMENTS = [
  {
    id: "BharatPe",
    label: "BharatPe",
    description: "Queries related to BharatPe",
    tawkName: "BharatPe",
    color: "#6366f1",
    icon: "A",
  },
];

// ───────────────────────────────────────────────────────────────────────────

function getDefaultPosition(): { left: number; bottom: number } {
  if (typeof window === "undefined") return { left: 0, bottom: DEFAULT_OFFSET };
  const maxLeft = Math.max(0, window.innerWidth - BUBBLE_SIZE);
  const maxBottom = Math.max(0, window.innerHeight - BUBBLE_SIZE);
  const left = Math.min(window.innerWidth - DEFAULT_RIGHT_MARGIN - BUBBLE_SIZE, maxLeft);
  const bottom = Math.min(DEFAULT_OFFSET, maxBottom);
  return { left: Math.max(0, left), bottom: Math.max(0, bottom) };
}

export default function TawkToChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(null);
  const [position, setPosition] = useState<{ left: number; bottom: number }>(getDefaultPosition);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const dragStartRef = useRef<{ x: number; y: number; left: number; bottom: number } | null>(null);
  const hasDraggedRef = useRef(false);

  const { openChat } = useTawkTo({
    propertyId: TAWK_PROPERTY_ID,
    widgetId: TAWK_WIDGET_ID,
  });

  const clampPosition = useCallback((left: number, bottom: number) => {
    if (typeof window === "undefined") return { left: 0, bottom: DEFAULT_OFFSET };
    const maxLeft = Math.max(0, window.innerWidth - BUBBLE_SIZE);
    const maxBottom = Math.max(0, window.innerHeight - BUBBLE_SIZE);
    return {
      left: Math.max(0, Math.min(left, maxLeft)),
      bottom: Math.max(0, Math.min(bottom, maxBottom)),
    };
  }, []);

  // Client-only: set initial position to bottom-right so bubble is visible from first render
  useEffect(() => {
    setPosition(clampPosition(
      window.innerWidth - DEFAULT_RIGHT_MARGIN - BUBBLE_SIZE,
      DEFAULT_OFFSET
    ));
  }, [clampPosition]);

  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY : e.clientY;
      if (typeof clientX !== "number" || typeof clientY !== "number") return;
      dragStartRef.current = {
        x: clientX,
        y: clientY,
        left: position.left,
        bottom: position.bottom,
      };
      hasDraggedRef.current = false;
    },
    [position]
  );

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!dragStartRef.current) return;
      let clientX: number;
      let clientY: number;
      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else return;
      const dx = clientX - dragStartRef.current.x;
      const dy = clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDraggedRef.current = true;
      const left = dragStartRef.current.left + dx;
      const bottom = dragStartRef.current.bottom - dy;
      const next = clampPosition(left, bottom);
      if (Number.isFinite(next.left) && Number.isFinite(next.bottom)) {
        setPosition(next);
      }
    };

    const handleUp = () => {
      dragStartRef.current = null;
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("touchmove", handleMove, { passive: true });
    document.addEventListener("touchend", handleUp);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleUp);
    };
  }, [clampPosition]);

  // Close menu on outside click
  useEffect(() => {
    function handleOutside(e: any) {
      if (
        menuRef.current &&
        //@ts-ignore
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        //@ts-ignore
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleBubbleClick = useCallback(() => {
    if (hasDraggedRef.current) return;
    setIsOpen((prev) => !prev);
  }, []);

  async function handleSelectDepartment(dept: any) {
    setLoading(dept.id);
    setIsOpen(false);
    await openChat(dept.tawkName);
    setLoading(null);
  }

  const wrapperStyle = {
    left: position.left,
    bottom: position.bottom,
    right: "auto" as const,
  };

  return (
    <div className={styles.wrapper} style={wrapperStyle}>
      {/* Department selector menu */}
      <div
        ref={menuRef}
        className={`${styles.menu} ${isOpen ? styles.menuVisible : ""}`}
        role="menu"
        aria-label="Select department"
      >
        <p className={styles.menuHeading}>How can we help?</p>
        <p className={styles.menuSub}>Choose the right team</p>

        <div className={styles.deptList}>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept.id}
              className={styles.deptButton}
              onClick={() => handleSelectDepartment(dept)}
              disabled={loading === dept.id}
              role="menuitem"
              //@ts-ignore
              style={{ "--dept-color": dept.color }}
            >
              <span className={styles.deptIcon}>{dept.icon}</span>
              <span className={styles.deptInfo}>
                <span className={styles.deptLabel}>{dept.label}</span>
                <span className={styles.deptDesc}>{dept.description}</span>
              </span>
              {loading === dept.id ? (
                <span className={styles.spinner} aria-hidden="true" />
              ) : (
                <span className={styles.arrow}>→</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Floating bubble button */}
      <button
        ref={buttonRef}
        className={`${styles.bubble} ${isOpen ? styles.bubbleActive : ""}`}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onClick={handleBubbleClick}
        aria-label="Open chat"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className={`${styles.bubbleIcon} ${styles.chatIcon}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className={`${styles.bubbleIcon} ${styles.closeIcon}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </span>

        {/* Pulse ring */}
        <span className={styles.pulse} aria-hidden="true" />
      </button>
    </div>
  );
}
