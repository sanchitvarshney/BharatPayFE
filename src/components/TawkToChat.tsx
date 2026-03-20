"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "../hooks/useUser";

// ─── CONFIG — Replace these with your actual IDs ───────────────────────────
const TAWK_PROPERTY_ID = "69b4f160ffafbe1c36c96d79";
const TAWK_WIDGET_ID = "1jjlctou9";

/** Paths where Tawk chat must be hidden (login, forgot password, two-factor). */
const HIDE_TAWK_PATHS = ["/login", "/forgot-password", "/verify-otp", "/password-recovery"];

const LOGGED_IN_USER_KEY = "loggedinUser";

type TawkVisitor = {
  name?: string;
  email?: string;
  id?: string | number;
  mobile?: string;
};

function getVisitorFromLocalStorage(): TawkVisitor | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOGGED_IN_USER_KEY);
    if (!raw) return null;

    const decoded = atob(raw);
    const data = JSON.parse(decoded) as {
      username?: string;
      crn_email?: string;
      crn_id?: string;
      crn_mobile?: string;
    };

    if (!data) return null;

    const name = data.username ?? "";
    const email = data.crn_email ?? "";
    const id = data.crn_id ?? "";
    const mobile = data.crn_mobile ?? "";

    if (!name && !email && !id && !mobile) return null;

    return {
      name: name || undefined,
      email: email || undefined,
      id: id || undefined,
      mobile: mobile || undefined,
    };
  } catch {
    return null;
  }
}

function setTawkVisitorAttributes(visitor: TawkVisitor | null | undefined) {
  if (!visitor) return;
  const attrs: Record<string, string> = {};
  const MAX_INT = 2147483647;

  if (visitor.name != null && visitor.name !== "") attrs.name = visitor.name;
  if (visitor.email != null && visitor.email !== "") attrs.email = visitor.email;
  if (visitor.id != null && visitor.id !== "") attrs.id = String(visitor.id);

  if (
    visitor.mobile != null &&
    visitor.mobile !== "" &&
    String(visitor.mobile) !== String(MAX_INT)
  ) {
    attrs.mobile = visitor.mobile;
  }

  if (Object.keys(attrs).length === 0) return;

  // @ts-ignore
  if (typeof window.Tawk_API?.setAttributes === "function") {
    // @ts-ignore
    window.Tawk_API.setAttributes(attrs, (error: unknown) => {
      if (error) console.warn("Tawk setAttributes error:", error);
    });
  }
}

function usePathnameForTawk() {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return window.location.pathname;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const w = window as any;
    const eventName = "tawk-location-change";

    if (!w.__tawkHistoryPatched) {
      w.__tawkHistoryPatched = true;

      const notify = () => window.dispatchEvent(new Event(eventName));

      const pushState = history.pushState;
      history.pushState = function (...args: any[]) {
        const ret = pushState.apply(this, args as any);
        notify();
        return ret;
      };

      const replaceState = history.replaceState;
      history.replaceState = function (...args: any[]) {
        const ret = replaceState.apply(this, args as any);
        notify();
        return ret;
      };
    }

    const onChange = () => setPathname(window.location.pathname);

    window.addEventListener("popstate", onChange);
    window.addEventListener(eventName, onChange as any);

    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener(eventName, onChange as any);
    };
  }, []);

  return pathname;
}

export default function TawkToChat() {
  const { user } = useUser();
  const pathname = usePathnameForTawk();

  const shouldHideTawk = useMemo(() => {
    const showOtpPage =
      typeof window !== "undefined" && localStorage.getItem("showOtpPage") === "Y";
    return !user || HIDE_TAWK_PATHS.includes(pathname) || showOtpPage;
  }, [pathname, user]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const w = window as any;
    const scriptId = `tawk-embed-${TAWK_PROPERTY_ID}-${TAWK_WIDGET_ID}`;
    const scriptSrc = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;

    // Keep the latest hide/show intent accessible to the one-time onLoad handler.
    w.__tawkBharatShouldHide = shouldHideTawk;

    // Setup the onLoad callback once, so visitor attributes can be applied.
    if (!w.__tawkBharatOnLoadSet) {
      w.__tawkBharatOnLoadSet = true;

      // @ts-ignore
      window.Tawk_API = window.Tawk_API || {};
      // @ts-ignore
      window.Tawk_API.onLoad = function () {
        setTawkVisitorAttributes(getVisitorFromLocalStorage());
        // @ts-ignore
        if (w.__tawkBharatShouldHide) {
          // @ts-ignore
          window.Tawk_API.hideWidget?.();
        } else {
          // @ts-ignore
          window.Tawk_API.showWidget?.();
        }
      };
    }

    // If the widget API is ready, hide/show immediately on route changes.
    if (w.Tawk_API) {
      // @ts-ignore
      if (shouldHideTawk) w.Tawk_API.hideWidget?.();
      // @ts-ignore
      else w.Tawk_API.showWidget?.();
    }

    // Load the widget script only if we should show it.
    if (!shouldHideTawk) {
      const existing = document.getElementById(scriptId);
      if (!existing && !w.__tawkBharatScriptRequested) {
        w.__tawkBharatScriptRequested = true;
        const script = document.createElement("script");
        script.id = scriptId;
        script.async = true;
        script.src = scriptSrc;
        script.charset = "UTF-8";
        script.setAttribute("crossorigin", "*");
        document.head.appendChild(script);
      }
    }
  }, [shouldHideTawk]);

  // The Tawk script injects its own UI into the DOM.
  return null;
}
