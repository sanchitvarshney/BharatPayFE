import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
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
import Report from "./pages/report/Report";
import ReportLayout from "./layouts/ReportLayout";
import QueryLayout from "./layouts/QueryLayout";
import Query from "./pages/queries/Query";
import UnderConstructionPage from "./pages/commonPages/UnderConstructionPage";
import DashBoard from "./pages/DashBoard";
import AddTRC from "./pages/TRC/AddTRC";
import TRCLayout from "./layouts/TRCLayout";
import ViewTRC from "./pages/TRC/ViewTRC";
import CustomRedirection from "./components/shared/CustomRedirection";
import BatteryQC from "./pages/production/BatteryQC";
import ProductionCreate from "./pages/production/ProductionCreate";
import ProductionManage from "./pages/production/ProductionManage";
import DispatchLayout from "./layouts/DispatchLayout";
import ManageDispatch from "./pages/Dispatch/ManageDispatch";
import SopPage from "./pages/fileupload/SopPage";
import QrLayout from "./layouts/QrLayout";
import MasterQrGenerator from "./pages/production/MasterQrGenerater";
import SingleQrGenerator from "./pages/production/SingleQrGenerater";
import LogningV2 from "./pages/commonPages/LogningV2";
import DownloadQrExcel from "./pages/production/DownloadQrExcel";
import ProfilePage from "./pages/ProfilePage";
import MasterReport from "./pages/report/MasterReport";
import MasterComponentDeatil from "./pages/master/MasterComponentDeatil";
import MaterVendorDetail from "./pages/master/MaterVendorDetail";
import MasterCategory from "./pages/master/MasterCategory";
import MailVerifyPage from "./pages/commonPages/MailVerifyPage";
import MobileVerifyPage from "./pages/commonPages/MobileVerifyPage";
import VerifyMobileAndEmail from "./pages/commonPages/VerifyMobileAndEmail";
import DocViewer from "./pages/commonPages/DocViewer";
import MinLayout from "./layouts/MinLayout";
import SimMin from "./pages/wearhouse/SimMin";
import MaterialInvardv2 from "./pages/wearhouse/MaterialInvardv2";
import MasterBomDetailPage from "./pages/master/MasterBomDetailPage";
import MasterClient from "./pages/master/MasterClient";
import MasterClientDetail from "./pages/master/MasterClientDetail";
import MaterialRequestWithBom from "./pages/production/MaterialRequestWithBom";
import StockDetailPage from "./pages/StockDetailPage";
import StoreTRC from "@/pages/TRC/StoreTRC";
import ChangePassword from "@/pages/commonPages/ChangePassword";
import CreateDispatchPage from "@/pages/Dispatch/CreateDispatchPage";
import PendingTRCListTable from "@/table/master/PendingTRCListTable";
import WrongDeviceDispatch from "@/pages/Dispatch/WrongDeviceDispatch";
import WrongDispatchLayout from "@/layouts/WrongDispatchLayout";
import OtpPage from "@/pages/commonPages/otpPage";
import RecoveryPassword from "@/pages/authentication/RecoveryPassword";
import MaterialIn from "@/pages/min/MaterialIn";
import PhysicalQuantityUpdate from "@/pages/PhysicalQuantityReport/PhysicalQuantityUpdate";
import DispatchTableForEwayBill from "@/pages/ewayBill/DispatchForEwayBill";
import CreateEwayBill from "@/pages/ewayBill/CreateEwayBill";
import EwayBillLayout from "@/layouts/EwayBillLayout";
import SwipeDeviceRequest from "@/pages/production/SwipeDeviceRequest";
import SwipeMaterialApprovalLayout from "@/layouts/SwipeMaterialApprovalLayout";
import SwipeMaterialApproval from "@/pages/wearhouse/SwipeMaterialApproval";
import SwipeRequistionRequest from "@/pages/wearhouse/SwipeRequistionRequest";
import SwipeDeviceUpload from "./pages/upload/SwipeDeviceUpload";
import SwipeUploadLayout from "@/layouts/SwipeUploadLayout";
import BranchTransferLayout from "@/layouts/BranchTransferLayout";
import ProcurementLayout from "@/layouts/ProcurementLayout";
import CreatePO from "@/pages/procurement/CreatePO";
import ManageBranchTable from "@/pages/branchTransfer/ManageBranchTable";
import CreateBranchTransferPage from "@/pages/branchTransfer/CreateBranchTransferPage";
import ManagePO from "./pages/procurement/ManagePO";
import CompletedPO from "@/pages/procurement/CompletedPO";
import UpdateProcurementLayout from "@/layouts/UpdateProcurementLayout";
import MINFromPO from "@/pages/min/MINFromPO";
import CustomSideBarMenu from "./components/customSidebarMenu/CustomSideBarMenu";

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
            <CustomSideBarMenu>
              <HomePage />
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/",
      },
      {
        element: <StockDetailPage />,
        path: "/stockdetail",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <EwayBillLayout>
                <DispatchTableForEwayBill />
              </EwayBillLayout>
            </CustomSideBarMenu>
          </MainLayout>
        ),
        path: "/eway-bill-details",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <CreateEwayBill />
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/create/e-waybill/:id",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <DocViewer />
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/docViewer",
      },

      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <PhysicalQuantityUpdate />
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/physical-quantity-update",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <DashBoard />
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/dashboard",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <ProfilePage />
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/profile",
      },
      //master modules

      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MasterUOM />
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-uom",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MasterCategory />
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-category",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MasterComponentsLayout>
                <MasterComponent />
              </MasterComponentsLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-components",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MasterComponentDeatil />
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-components/:id",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MasterComponentProductLayout>
                <MasterProductFg />
              </MasterComponentProductLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-product-fg",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MasterComponentProductLayout>
                <MasterProductSFg />
              </MasterComponentProductLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-product-sfg",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MasterBOMLayout>
                <MasterCraeteBOM />
              </MasterBOMLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-bom-create",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MasterBOMLayout>
                <CustomRedirection UnderDevelopment={true}>
                  <MasterSfgBOM />
                </CustomRedirection>
              </MasterBOMLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-sfg-bom",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MasterBOMLayout>
                <CustomRedirection>
                  <MasterFGBOM />
                </CustomRedirection>
              </MasterBOMLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-fg-bom",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MasterBomDetailPage />
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-fg-bom/:id",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MasterBOMLayout>
                <CustomRedirection UnderDevelopment={true}>
                  <MasterBOMDisabled />
                </CustomRedirection>
              </MasterBOMLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-bom-disabled",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MasterLocation />
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-location",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <CustomRedirection UnderDevelopment={false}>
                <MasterAddVender />
              </CustomRedirection>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-vendor-add",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <CustomRedirection UnderDevelopment={false}>
                <MaterVendorDetail />
              </CustomRedirection>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-vendor/:id",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <CustomRedirection UnderDevelopment={false}>
                <MasterClient />
              </CustomRedirection>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-client",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <CustomRedirection UnderDevelopment={false}>
                <MasterClientDetail />
              </CustomRedirection>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-client/:id",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MasterVenderLayout>
                <CustomRedirection UnderDevelopment={false}>
                  <MsterVendorDetail />
                </CustomRedirection>
              </MasterVenderLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-vender-detail",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MasterAddressLayout>
                <CustomRedirection UnderDevelopment={false}>
                  <MasterBillingAddress />
                </CustomRedirection>
              </MasterAddressLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-billing-address",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MasterAddressLayout>
                <CustomRedirection UnderDevelopment={false}>
                  <MasterShippingaddress />
                </CustomRedirection>
              </MasterAddressLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-shipping-address",
      },
      //wearhouse====================================
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MaterialApprovalLayout>
                <MaterialApproval />
              </MaterialApprovalLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/pending-material-approval",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MaterialApprovalLayout>
                <MaterialRequistionRequest />
              </MaterialApprovalLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/material-requisition-request",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <SwipeMaterialApprovalLayout>
                <SwipeMaterialApproval />
              </SwipeMaterialApprovalLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/swipe-approval",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <SwipeMaterialApprovalLayout>
                <SwipeRequistionRequest />
              </SwipeMaterialApprovalLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/swipe-requisition-request",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MinLayout>
                <MaterialInvard />
              </MinLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/raw-min-v2",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MinLayout>
                <SimMin />
              </MinLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/sim-min",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MinLayout>
                <MaterialInvardv2 />
              </MinLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/raw-min",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <ProcurementLayout>
                <CreatePO />
              </ProcurementLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/procurement/create",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <ProcurementLayout>
                <ManagePO />
              </ProcurementLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/procurement/manage",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <UpdateProcurementLayout>
                <CreatePO />
              </UpdateProcurementLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/procurement/edit-po/:id",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <ProcurementLayout>
                <ManagePO />
              </ProcurementLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/procurement/manage",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <ProcurementLayout>
                <CompletedPO />
              </ProcurementLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/procurement/completed",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              {/* <DeviceMin /> */}
              <MaterialIn />
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/device-materials-in",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MINFromPO />
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/material-in-with-po",
      },
      // {
      //   element: (
      //     <MainLayout>

      //       <MaterialIn />
      //  </MainLayout>
      //   ),
      //   path: "/device-min",
      // },
      // production=======================================
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <ProductionMaterialRequisitionLayout>
                <CustomRedirection UnderDevelopment={false}>
                  <MaterialRequestWithBom />
                </CustomRedirection>
              </ProductionMaterialRequisitionLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/production/material-req-with-bom",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <ProductionMaterialRequisitionLayout>
                <MaterialReqWithoutBom />
              </ProductionMaterialRequisitionLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/production/material-req-without-bom",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <ProductionMaterialRequisitionLayout>
                <SwipeDeviceRequest />
              </ProductionMaterialRequisitionLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/production/swipe-device-request",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <ProductionAndPlanLayout>
                <CustomRedirection UnderDevelopment={true}>
                  <CraetePPR />
                </CustomRedirection>
              </ProductionAndPlanLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/production/create-ppr",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <ProductionAndPlanLayout>
                <CustomRedirection UnderDevelopment={true}>
                  <PendingPPR />
                </CustomRedirection>
              </ProductionAndPlanLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/production/pending-ppr",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <ProductionAndPlanLayout>
                <CustomRedirection UnderDevelopment={true}>
                  <CompletePPR />
                </CustomRedirection>
              </ProductionAndPlanLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/production/complete-ppr",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <TRCLayout>
                <CustomRedirection UnderDevelopment={false}>
                  <AddTRC />
                </CustomRedirection>
              </TRCLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/production/add-trc",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <TRCLayout>
                <CustomRedirection UnderDevelopment={false}>
                  <StoreTRC />
                </CustomRedirection>
              </TRCLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/production/store-trc",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <TRCLayout>
                <CustomRedirection UnderDevelopment={false}>
                  <ViewTRC />
                </CustomRedirection>
              </TRCLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/production/view-trc",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <TRCLayout>
                <CustomRedirection UnderDevelopment={false}>
                  <PendingTRCListTable />
                </CustomRedirection>
              </TRCLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/production/trc-list",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <BatteryQC />
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/production/battery-qc",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <ProductionCreate />
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/production/create",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <CustomRedirection UnderDevelopment={true}>
                <ProductionManage />
              </CustomRedirection>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/production/manage",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <QrLayout>
                <CustomRedirection UnderDevelopment={false}>
                  <MasterQrGenerator />
                </CustomRedirection>
              </QrLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/production/master-qr-generator",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <QrLayout>
                <SingleQrGenerator />
              </QrLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/production/single-qr-generator",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <QrLayout>
                <DownloadQrExcel />
              </QrLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/production/download-excel",
      },
      //branch transfer===========================================
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <BranchTransferLayout>
                <CreateBranchTransferPage />
              </BranchTransferLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/branchTransfer/create",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <BranchTransferLayout>
                <ManageBranchTable />
              </BranchTransferLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/branchTransfer/manage",
      },

      //dispatch===========================================
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <DispatchLayout>
                <CustomRedirection UnderDevelopment={true}>
                  <ManageDispatch />
                </CustomRedirection>
              </DispatchLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/dispatch/manage",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <DispatchLayout>
                <CustomRedirection UnderDevelopment={false}>
                  <CreateDispatchPage />
                </CustomRedirection>
              </DispatchLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/dispatch/create",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <WrongDispatchLayout>
                <WrongDeviceDispatch />
              </WrongDispatchLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/dispatch/wrong-device",
      },

      //dispatch===========================================

      ///////////////////////////////////////
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <SopPage />
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/sop",
      },

      //////////////////////////////////////////////
      //report======================================
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <ReportLayout>
                <Report />
              </ReportLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "report/:id",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <MasterReport />
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/master-report",
      },
      //query======================================
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <QueryLayout>
                <Query />
              </QueryLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "queries/:id",
      },
      {
        element: (
          <MainLayout>
            <CustomSideBarMenu>
              <SwipeUploadLayout>
                <SwipeDeviceUpload />
              </SwipeUploadLayout>
            </CustomSideBarMenu>{" "}
          </MainLayout>
        ),
        path: "/upload/swipe-device-status",
      },
    ],
  },
  {
    path: "*",
    element: (
      <Protected authentication>
        <MainLayout>
          <CustomSideBarMenu>
            <Custom404Page />
          </CustomSideBarMenu>{" "}
        </MainLayout>
      </Protected>
    ),
  },
  {
    path: "/not-permission",
    element: (
      <Protected authentication>
        <MainLayout>
          <CustomSideBarMenu>
            <NotPermissionPage />
          </CustomSideBarMenu>{" "}
        </MainLayout>
      </Protected>
    ),
  },
  {
    path: "/under-construction",
    element: (
      <Protected authentication>
        <MainLayout>
          <CustomSideBarMenu>
            <UnderConstructionPage />
          </CustomSideBarMenu>{" "}
        </MainLayout>
      </Protected>
    ),
  },
  {
    element: (
      <Protected authentication={false}>
        <LogningV2 />
      </Protected>
    ),
    path: "/login",
  },

  {
    element: (
      <Protected authentication={false}>
        {/* <AuthLayout> */}
        <RecoveryPassword />
        {/* </AuthLayout> */}
      </Protected>
    ),
    path: "/password-recovery",
  },

  {
    element: (
      <Protected authentication={false}>
        {/* <AuthLayout> */}
        <ForgotPassword />
        {/* </AuthLayout> */}
      </Protected>
    ),
    path: "/forgot-password",
  },
  {
    element: (
      <Protected authentication={true}>
        <MailVerifyPage />
        {/* <BugAndChat /> */}
      </Protected>
    ),
    path: "/verify-mail",
  },
  {
    element: (
      <Protected authentication={true}>
        <OtpPage />
      </Protected>
    ),
    path: "/verify-otp",
  },
  {
    element: (
      <Protected authentication={true}>
        <MobileVerifyPage />
        {/* <BugAndChat /> */}
      </Protected>
    ),
    path: "/verify-mobile",
  },
  {
    element: (
      <Protected authentication={true}>
        <VerifyMobileAndEmail />
        {/* <BugAndChat /> */}
      </Protected>
    ),
    path: "/verify-mobile-mail",
  },
  {
    element: (
      <Protected authentication={true}>
        <ChangePassword />
      </Protected>
    ),
    path: "/change-password",
  },
]);
