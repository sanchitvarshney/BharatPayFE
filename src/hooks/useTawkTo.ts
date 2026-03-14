import { useEffect, useRef, useCallback } from "react";

export function useTawkTo({ propertyId, widgetId }: any) {
  const loadedRef = useRef(false);
  const readyRef = useRef(false);
  const pendingActionRef = useRef(null);

  useEffect(() => {
    // Setup Tawk_API early so callbacks work
    //@ts-ignore
    window.Tawk_API = window.Tawk_API || {};
    //@ts-ignore
    window.Tawk_API.onLoad = function () {
      readyRef.current = true;
      //@ts-ignore
      window.Tawk_API.hideWidget();

      // If there's a pending action (open + department), fire it now
      if (pendingActionRef.current) {
        const { department } = pendingActionRef.current;
        //@ts-ignore
        if (department && typeof window.Tawk_API.setAttributes === "function") {
          //@ts-ignore
          window.Tawk_API.setAttributes({ department }, () => {});
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
        // Store pending action before loading
        //@ts-ignore
        pendingActionRef.current = { department };
        await loadWidget();
        // onLoad callback will handle the rest
        return;
      }

      if (!readyRef.current) {
        //@ts-ignore
        pendingActionRef.current = { department };
        return;
      }

      // Tawk.to has no setDepartment(); pass department as visitor attribute so agents see it
      //@ts-ignore
      if (department && typeof window.Tawk_API?.setAttributes === "function") {
        //@ts-ignore
        window.Tawk_API.setAttributes({ department }, () => {});
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
