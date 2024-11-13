import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
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
moduleregistri();
ReactDOM.createRoot(document.getElementById("root")!).render(
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
          <RouterProvider router={router} />
          <ToasterConsumer />
        </ToasterProvider>
      </ThemeProvider>
    </ConfigProvider>
  </Provider>
);
