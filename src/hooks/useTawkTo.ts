import { useEffect, useRef, useCallback } from "react";

const LOGGED_IN_USER_KEY = "loggedinUser";

export interface TawkToVisitor {
  name?: string;
  email?: string;
  id?: string | number;
  mobile?: string;
}

export interface UseTawkToOptions {
  propertyId: string;
  widgetId: string;
}

/** Read current_user (id, name, email, mobile) from localStorage (loggedinUser – base64 JSON). */
function getVisitorFromLocalStorage(): TawkToVisitor | null {
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

function setTawkVisitorAttributes(visitor: TawkToVisitor | null | undefined) {
  if (!visitor) return;
  const attrs: Record<string, string> = {};
  const MAX_INT = 2147483647;
  if (visitor.name != null && visitor.name !== "") attrs.name = visitor.name;
  if (visitor.email != null && visitor.email !== "")
    attrs.email = visitor.email;
  if (visitor.id != null && visitor.id !== "") attrs.id = String(visitor.id);
  if (
    visitor.mobile != null &&
    visitor.mobile !== "" &&
    String(visitor.mobile) !== String(MAX_INT)
  ) {
    attrs.mobile = visitor.mobile;
  }
  if (Object.keys(attrs).length === 0) return;
  //@ts-ignore
  if (typeof window.Tawk_API?.setAttributes === "function") {
    //@ts-ignore
    window.Tawk_API.setAttributes(attrs, (error: unknown) => {
      if (error) console.warn("Tawk setAttributes error:", error);
    });
  }
}

export function useTawkTo({ propertyId, widgetId }: UseTawkToOptions) {
  const loadedRef = useRef(false);
  const readyRef = useRef(false);
  const pendingActionRef = useRef<{ department?: string | null } | null>(null);

  useEffect(() => {
    // Setup Tawk_API early so callbacks work
    //@ts-ignore
    window.Tawk_API = window.Tawk_API || {};
    //@ts-ignore
    window.Tawk_API.onLoad = function () {
      readyRef.current = true;
      //@ts-ignore
      window.Tawk_API.hideWidget();

      setTawkVisitorAttributes(getVisitorFromLocalStorage());

      // If there's a pending action (open + department), fire it now
      if (pendingActionRef.current) {
        const { department } = pendingActionRef.current;
        const attrs: Record<string, string> = {};
        if (department) attrs.department = department;
        const MAX_INT = 2147483647;
        const v = getVisitorFromLocalStorage();
        if (v?.name != null && v.name !== "") attrs.name = v.name;
        if (v?.email != null && v.email !== "") attrs.email = v.email;
        if (v?.id != null && v.id !== "") attrs.id = String(v.id);
        if (
          v?.mobile != null &&
          v.mobile !== "" &&
          String(v.mobile) !== String(MAX_INT)
        )
          attrs.mobile = String(v.mobile);

        if (
          Object.keys(attrs).length > 0 &&
          //@ts-ignore
          typeof window.Tawk_API.setAttributes === "function"
        ) {
          //@ts-ignore
          window.Tawk_API.setAttributes(attrs, () => {});
        }
        //@ts-ignore
        if (typeof window.Tawk_API.maximize === "function") {
          //@ts-ignore
          window.Tawk_API.maximize();
        }
        pendingActionRef.current = null;
      }
    };
  }, []);

  const loadWidget = useCallback(() => {
     
    return new Promise((resolve: any) => {
      if (loadedRef.current) {
        resolve();
        return;
      }
      loadedRef.current = true;

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }, [propertyId, widgetId]);

  const openChat = useCallback(
    async (department = null) => {
      if (!loadedRef.current) {
        //@ts-ignore
        pendingActionRef.current = { department };
        await loadWidget();
        return;
      }

      if (!readyRef.current) {
        pendingActionRef.current = { department };
        return;
      }
      const MAX_INT = 2147483647;

      const attrs: Record<string, string> = {};
      if (department) attrs.department = department;
      const v = getVisitorFromLocalStorage();
      if (v?.name != null && v.name !== "") attrs.name = v.name;
      if (v?.email != null && v.email !== "") attrs.email = v.email;
      if (v?.id != null && v.id !== "") attrs.id = String(v.id);
      if (
        v?.mobile != null &&
        v.mobile !== "" &&
        String(v.mobile) !== String(MAX_INT) // skip placeholder value
      ) {
        attrs.mobile = v.mobile;
      }

      if (
        Object.keys(attrs).length > 0 &&
        //@ts-ignore
        typeof window.Tawk_API?.setAttributes === "function"
      ) {
        //@ts-ignore
        window.Tawk_API.setAttributes(attrs, () => {});
      
      }
      //@ts-ignore
      if (typeof window.Tawk_API?.maximize === "function") {
        //@ts-ignore
        window.Tawk_API.maximize();
      }
    },
    [loadWidget],
  );

  return { openChat };
}
