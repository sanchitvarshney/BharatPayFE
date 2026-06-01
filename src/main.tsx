import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import * as Sentry from "@sentry/react";
import "./index.css";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "./font.css";
import { router } from "./route.tsx";
import { moduleregistri } from "./lib/aggrid/moduleregistry.tsx";
import { Provider } from "react-redux";
import { store } from "./features/Store";
import { Toaster } from "@/components/ui/toaster";
import { ConfigProvider } from "antd";
import { ToasterProvider, ToasterConsumer } from "@/utils/toasterContext.tsx";
import { ThemeProvider } from "@mui/material";
import theme from "./theme/index.ts";
import { SocketProvider } from "./components/context/SocketContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RootLayout from "./layouts/layout.tsx";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_MODE, // "development" or "production"
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance monitoring: capture 10% of transactions in production
  tracesSampleRate: import.meta.env.VITE_MODE === "production" ? 0.1 : 1.0,
  // Session Replay: capture 10% of sessions, 100% on errors
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const googleId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;

moduleregistri();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={googleId}>
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          colorBorder: "#d1d5db",
          colorPrimary: "#0e7490",
        },
        components: {
          DatePicker: {
            activeBorderColor: "#a3a3a3",
            cellRangeBorderColor: "#f0f0f0",
            cellHoverWithRangeBg: "#f0f0f0",
            cellHoverBg: "#f0f0f0",
            hoverBorderColor: "#d1d5db",
            activeShadow: "0 0 0 0 rgba(5, 145, 255, 0.1)",
            activeBg: "#fffbeb",
            colorBorder: "#d4d4d4",
            boxShadowSecondary: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
            colorPrimary: "#aaaaaa",
          },
          Input: {
            colorBorder: "#d4d4d4",
            activeBg: "#fffbeb",
            activeBorderColor: "#a3a3a3",
            activeShadow: "0",
            hoverBorderColor: "#a3a3a3",
          },
          Select: {
            colorBorder: "#d4d4d4",
            activeBorderColor: "#a3a3a3",
            hoverBorderColor: "#a3a3a3",
            activeOutlineColor: "#ffffff0",
            optionActiveBg: "#f0f0f0",
            optionSelectedBg: "#e4e4e4",
            optionSelectedFontWeight: 400,
            boxShadowSecondary: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
          },
        },
      }}
    >
      <ThemeProvider theme={theme}>
        <Toaster />
        <ToasterProvider>
          <SocketProvider>
            <RootLayout>
            {" "}
            <RouterProvider router={router} />
            </RootLayout>
            <ToasterConsumer />
          </SocketProvider>
        </ToasterProvider>
      </ThemeProvider>
    </ConfigProvider>
  </Provider>
  </GoogleOAuthProvider>
);
