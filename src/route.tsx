import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/authentication/LoginPage";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import Custom404Page from "./pages/commonPages/Custom404Page";
import NotPermissionPage from "./pages/commonPages/NotPermissionPage";
import MasterUOM from "./pages/master/MasterUOM";
import MasterComponent from "./pages/master/MasterComponent";
import MasterComponentsLayout from "./layouts/MasterComponentsLayout";
import MasterComponentProductLayout from "./layouts/MasterComponentProductLayout";
import MasterProductFg from "./pages/master/MasterProductFg";
import MasterProductSFg from "./pages/master/MasterProductSFg";
import MasterBOMLayout from "./layouts/MasterBOMLayout";
import MasterCraeteBOM from "./pages/master/MasterCreateBOM";
import MasterBOMDisabled from "./pages/master/MasterBOMDisabled";
import MasterSfgBOM from "./pages/master/MasterSfgBOM";
import MasterFGBOM from "./pages/master/MasterFGBOM";
import MasterLocation from "./pages/master/MasterLocation";
import MasterVenderLayout from "./layouts/MasterVenderLayout";
import MasterAddVender from "./pages/master/MasterAddVender";
import MsterVendorDetail from "./pages/master/MsterVendorDetail";
import ProductionMaterialRequisitionLayout from "./layouts/ProductionMaterialRequisitionLayout";
import ProductionReqWithBOM from "./pages/production/ProductionReqWithBOM";
import MaterialReqWithoutBom from "./pages/production/MaterialReqWithoutBom";
import MaterialApprovalLayout from "./layouts/MaterialApprovalLayout";
import MaterialApproval from "./pages/wearhouse/MaterialApproval";
import MaterialRequistionRequest from "./pages/wearhouse/MaterialRequistionRequest";
import MaterialInvard from "./pages/wearhouse/MaterialInvard";
import ProductionAndPlanLayout from "./layouts/ProductionAndPlanLayout";
import CraetePPR from "./pages/production/CraetePPR";
import PendingPPR from "./pages/production/PendingPPR";
import CompletePPR from "./pages/production/CompletePPR";
import MasterAddressLayout from "./layouts/MasterAddressLayout";
import MasterBillingAddress from "./pages/master/MasterBillingAddress";
import MasterShippingaddress from "./pages/master/MasterShippingaddress";
import Protected from "./components/shared/Protected";
import DeviceMin from "./pages/wearhouse/DeviceMin";
import Report from "./pages/report/Report";
import ReportLayout from "./layouts/ReportLayout";
import QueryLayout from "./layouts/QueryLayout";

import Query from "./pages/queries/Query";
import UnderConstructionPage from "./pages/commonPages/UnderConstructionPage";
import DashBoard from "./pages/DashBoard";

export const router = createBrowserRouter([
  {
    element: (
      <Protected authentication>
        <App />
      </Protected>
    ),
    path: "/",
    children: [
      {
        element: (
          <MainLayout>
            <HomePage />
          </MainLayout>
        ),
        path: "/",
      },
      {
        element: (
          <MainLayout>
            <DashBoard />
          </MainLayout>
        ),
        path: "/dashboard",
      },
      //master modules

      {
        element: (
          <MainLayout>
            <MasterUOM />
          </MainLayout>
        ),
        path: "/master-uom",
      },
      {
        element: (
          <MainLayout>
            <MasterComponentsLayout>
              <MasterComponent />
            </MasterComponentsLayout>
          </MainLayout>
        ),
        path: "/master-components",
      },
      {
        element: (
          <MainLayout>
            <MasterComponentProductLayout>
              <MasterProductFg />
            </MasterComponentProductLayout>
          </MainLayout>
        ),
        path: "/master-product-fg",
      },
      {
        element: (
          <MainLayout>
            <MasterComponentProductLayout>
              <MasterProductSFg />
            </MasterComponentProductLayout>
          </MainLayout>
        ),
        path: "/master-product-sfg",
      },
      {
        element: (
          <MainLayout>
            <MasterBOMLayout>
              <MasterCraeteBOM />
            </MasterBOMLayout>
          </MainLayout>
        ),
        path: "/master-bom-ceate",
      },
      {
        element: (
          <MainLayout>
            <MasterBOMLayout>
              <MasterSfgBOM />
            </MasterBOMLayout>
          </MainLayout>
        ),
        path: "/master-sfg-bom",
      },
      {
        element: (
          <MainLayout>
            <MasterBOMLayout>
              <MasterFGBOM />
            </MasterBOMLayout>
          </MainLayout>
        ),
        path: "/master-fg-bom",
      },
      {
        element: (
          <MainLayout>
            <MasterBOMLayout>
              <MasterBOMDisabled />
            </MasterBOMLayout>
          </MainLayout>
        ),
        path: "/master-bom-disabled",
      },
      {
        element: (
          <MainLayout>
            <MasterLocation />
          </MainLayout>
        ),
        path: "/master-location",
      },
      {
        element: (
          <MainLayout>
            <MasterVenderLayout>
              <MasterAddVender />
            </MasterVenderLayout>
          </MainLayout>
        ),
        path: "/master-vender-add",
      },
      {
        element: (
          <MainLayout>
            <MasterVenderLayout>
              <MsterVendorDetail />
            </MasterVenderLayout>
          </MainLayout>
        ),
        path: "/master-vender-detail",
      },
      {
        element: (
          <MainLayout>
            <MasterAddressLayout>
              <MasterBillingAddress />
            </MasterAddressLayout>
          </MainLayout>
        ),
        path: "/master-billing-address",
      },
      {
        element: (
          <MainLayout>
            <MasterAddressLayout>
              <MasterShippingaddress />
            </MasterAddressLayout>
          </MainLayout>
        ),
        path: "/master-shipping-address",
      },
      //wearhouse====================================
      {
        element: (
          <MainLayout>
            <MaterialApprovalLayout>
              <MaterialApproval />
            </MaterialApprovalLayout>
          </MainLayout>
        ),
        path: "/pending-material-approval",
      },
      {
        element: (
          <MainLayout>
            <MaterialApprovalLayout>
              <MaterialRequistionRequest />
            </MaterialApprovalLayout>
          </MainLayout>
        ),
        path: "/material-requisition-request",
      },
      {
        element: (
          <MainLayout>
            <MaterialInvard />
          </MainLayout>
        ),
        path: "/rm-materials-in",
      },
      {
        element: (
          <MainLayout>
            <DeviceMin />
          </MainLayout>
        ),
        path: "/device-materials-in",
      },
      // production=======================================
      {
        element: (
          <MainLayout>
            <ProductionMaterialRequisitionLayout>
              <ProductionReqWithBOM />
            </ProductionMaterialRequisitionLayout>
          </MainLayout>
        ),
        path: "/production/material-req-with-bom",
      },
      {
        element: (
          <MainLayout>
            <ProductionMaterialRequisitionLayout>
              <MaterialReqWithoutBom />
            </ProductionMaterialRequisitionLayout>
          </MainLayout>
        ),
        path: "/production/material-req-without-bom",
      },
      {
        element: (
          <MainLayout>
            <ProductionAndPlanLayout>
              <CraetePPR />
            </ProductionAndPlanLayout>
          </MainLayout>
        ),
        path: "/production/create-ppr",
      },
      {
        element: (
          <MainLayout>
            <ProductionAndPlanLayout>
              <PendingPPR />
            </ProductionAndPlanLayout>
          </MainLayout>
        ),
        path: "/production/pending-ppr",
      },
      {
        element: (
          <MainLayout>
            <ProductionAndPlanLayout>
              <CompletePPR />
            </ProductionAndPlanLayout>
          </MainLayout>
        ),
        path: "/production/complete-ppr",
      },

      //report======================================
      {
        element: (
          <MainLayout>
            <ReportLayout>
              <Report />
            </ReportLayout>
          </MainLayout>
        ),
        path: "report",
      },
      //query======================================
      {
        element: (
          <MainLayout>
            <QueryLayout>
              <Query />
            </QueryLayout>
          </MainLayout>
        ),
        path: "queries",
      },
    ],
  },
  {
    path: "*",
    element: (
      <Protected authentication>
        <MainLayout>
          <Custom404Page />
        </MainLayout>
      </Protected>
    ),
  },
  {
    path: "/not-permission",
    element: (
      <Protected authentication>
        <MainLayout>
          <NotPermissionPage />
        </MainLayout>
      </Protected>
    ),
  },
  {
    path: "/under-construction",
    element: (
      <Protected authentication>
        <MainLayout>
          <UnderConstructionPage />
        </MainLayout>
      </Protected>
    ),
  },
  {
    element: (
      <Protected authentication={false}>
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      </Protected>
    ),
    path: "/login",
  },
  {
    element: (
      <Protected authentication={false}>
        <AuthLayout>
          <ForgotPassword />
        </AuthLayout>
      </Protected>
    ),
    path: "/forgot-password",
  },
]);
