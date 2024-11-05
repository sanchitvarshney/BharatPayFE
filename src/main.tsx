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
            activeBorderColor: "#0e7490",
            cellRangeBorderColor: "#f0f0f0",
            cellHoverWithRangeBg: "#f0f0f0",
            cellHoverBg: "#f0f0f0",
            hoverBorderColor: "#d1d5db",
            activeShadow: "0 0 0 0 rgba(5, 145, 255, 0.1)",
          },
          Input: {
            colorBorder:"#d4d4d4",
            activeBg:"#fffbeb",
            activeBorderColor:"#a3a3a3",
            activeShadow:"0",
            hoverBorderColor:"#a3a3a3"
          },
          Select: {
            controlHeight: 35,
            colorBorder:"#94a3b8",
          
          },
        },
      }}
    >
      <Toaster />
      <RouterProvider router={router} />
      
    </ConfigProvider>
  </Provider>
);
