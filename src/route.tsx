import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import Custom404Page from "./pages/commonPages/Custom404Page";
import NotPermissionPage from "./pages/commonPages/NotPermissionPage";
import MasterUOM from "./pages/master/MasterUOM";
import MasterComponent from "./pages/master/MasterComponent";
import MasterComponentPercentage from "./pages/master/MasterComponentPercentage";
import MasterComponentPercentageReport from "./pages/master/MasterComponentPercentageReport";
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
import CreateChallanPage from "@/pages/Dispatch/CreateChallanPage";
import ManageChallan from "@/pages/Dispatch/ManageChallan";
import UpdateChallanPage from "@/pages/Dispatch/UpdateChallanPage";
import ChallanLayout from "@/layouts/ChallanLayout ";
import SwipeDeviceRequest from "@/pages/production/SwipeDeviceRequest";
import SwipeMaterialApprovalLayout from "@/layouts/SwipeMaterialApprovalLayout";
import SwipeMaterialApproval from "@/pages/wearhouse/SwipeMaterialApproval";
import SwipeRequistionRequest from "@/pages/wearhouse/SwipeRequistionRequest";
import SwipeDeviceUpload from "./pages/upload/SwipeDeviceUpload";
import MasterUpload from "./pages/upload/MasterUpload";
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
import ViewImage from "@/pages/queries/ViewImage";
import MigrationUpload from "@/pages/upload/MigrationUpload";
import MaterialManagement from "@/pages/materialManagement/MaterialManagement";
import MaterialMovementLayout from "@/layouts/MaterialMovementLayout";
import PartCodeConversion from "@/pages/partCodeConversion/PartCodeConversion";
import PartCodeConversionLayout from "@/layouts/PartCodeConversionLayout";
import PartCodeConversionReport from "@/pages/partCodeConversion/PartCodeConversionReport";
import ProdReturnMin from "@/pages/wearhouse/ProdReturnMin";
import ProdReturnMinLayout from "@/layouts/ProdReturnMinLayout";
import GPLayout from "@/layouts/GPLayout";
import CreateGP from "@/pages/GPDCChallan/CreateGP";
import ManageGP from "@/pages/GPDCChallan/ManageGP";
import { AddAreaReport } from "./pages/areaReport/AddAreaReport";
import AddAreaReportLayout from "./layouts/AddAreareportLayout";
import ViewAreaReport from "./pages/areaReport/ViewAreaReport";
import WrongDeviceMin from "./pages/Dispatch/WrongDeviceMin";
import FormLayout from "./layouts/WrongDeviceMINLayout";
import DeletionMonoPage from "./pages/master/DeletionMonoPage";
import AddPartCodeLayout from "./layouts/AddPartCodeLayout";
import TransferPartData from "./pages/tranferPartCode/TransferPartData";
import WorkersReports from "./pages/areaReport/WorkersReports";
import DeviceTransferLayout from "./layouts/DeviceTransferLayout";
import DeviceTransfer from "./pages/transferDevice/DeviceTransfer";
import CreatePartCodeChallan from "@/pages/partCodeChallan/CreatePartCodeChallan";
import CreatePartCodeChallanLayout from "@/layouts/CreatePartCodeChallanLayout";
import SwipeTransferLayout from "./layouts/SwipeTransferLayout";
import SwipeTransfer from "./pages/transferDevice/SwipeTransfer";
import CRMRemarkLayout from "./layouts/CRMRemarkLayout";
import CRMRemarkReport from "./pages/crm-remark/CRMRemarkReport";
import CRMUpload from "./pages/crm-remark/CRMUpload";
import PercentageComponentLayout from "./layouts/PercentageComponentLayout";
import WrongDeviceReport from "./pages/Dispatch/WrongDeviceReport";
import ViewImageLayout from "./layouts/ViewImageLayout";
import FQCDeviceImage from "./pages/queries/FQCDeviceImage";
import ImageCapturePage from "./pages/imageCapture/ImageCapturePage";
import SummaryLayout from "./layouts/SummaryLayout";
import AssemblyAndTRC from "./pages/summary-pages/AssemblyAndTRC";
import Dispatched from "./pages/summary-pages/Dispatched";
import MaterialPurchase from "./pages/summary-pages/MaterialPurchase";

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
        element: <StockDetailPage />,
        path: "/stockdetail",
      },
      {
        element: (
          <MainLayout>
            <EwayBillLayout>
              <DispatchTableForEwayBill />
            </EwayBillLayout>
          </MainLayout>
        ),
        path: "/eway-bill-details",
      },
      {
        element: (
          <MainLayout>
            <CreateEwayBill />
          </MainLayout>
        ),
        path: "/create/e-waybill/:id",
      },
      {
        element: (
          <MainLayout>
            <DocViewer />
          </MainLayout>
        ),
        path: "/docViewer",
      },

      {
        element: (
          <MainLayout>
            <PhysicalQuantityUpdate />
          </MainLayout>
        ),
        path: "/physical-quantity-update",
      },
      {
        element: (
          <MainLayout>
            <DashBoard />
          </MainLayout>
        ),
        path: "/dashboard",
      },
      {
        element: (
          <MainLayout>
            <AddAreaReportLayout>
              <AddAreaReport />
            </AddAreaReportLayout>
          </MainLayout>
        ),
        path: "/worker-data",
      },
      {
        element: (
          <MainLayout>
            <AddPartCodeLayout>
              <TransferPartData />
            </AddPartCodeLayout>
          </MainLayout>
        ),
        path: "/transfer-part-data",
      },
      {
        element: (
          <MainLayout>
            <FormLayout>
              <WrongDeviceMin />
            </FormLayout>
          </MainLayout>
        ),
        path: "/wrong-device-min",
      },
      {
        element: (
          <MainLayout>
            <ViewImageLayout>
              <WrongDeviceReport />
            </ViewImageLayout>
          </MainLayout>
        ),
        path: "/wrong-device/reports",
      },
      {
        element: (
          <MainLayout>
            <AddAreaReportLayout>
              <ViewAreaReport />
            </AddAreaReportLayout>
          </MainLayout>
        ),
        path: "/view-worker-data",
      },
      {
        element: (
          <MainLayout>
            <AddAreaReportLayout>
              <WorkersReports />
            </AddAreaReportLayout>
          </MainLayout>
        ),
        path: "/workers/reports",
      },
      {
        element: (
          <MainLayout>
            <DeviceTransferLayout>
              <DeviceTransfer />
            </DeviceTransferLayout>
          </MainLayout>
        ),
        path: "/device/transfer",
      },
      {
        element: (
          <MainLayout>
            <SwipeTransferLayout>
              <SwipeTransfer />
            </SwipeTransferLayout>
          </MainLayout>
        ),
        path: "/swipe/transfer",
      },
      {
        element: (
          <MainLayout>
            <ProfilePage />
          </MainLayout>
        ),
        path: "/profile",
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
            <DeletionMonoPage />
          </MainLayout>
        ),
        path: "/master-mono-delete",
      },
      {
        element: (
          <MainLayout>
            <MasterCategory />
          </MainLayout>
        ),
        path: "/master-category",
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
            <PercentageComponentLayout>
              <MasterComponentPercentage />
            </PercentageComponentLayout>
          </MainLayout>
        ),
        path: "/master-components/percentage",
      },
      {
        element: (
          <MainLayout>
            <PercentageComponentLayout>
              <MasterComponentPercentageReport />
            </PercentageComponentLayout>
          </MainLayout>
        ),
        path: "/master-components/report",
      },
      {
        element: (
          <MainLayout>
            <MasterComponentDeatil />
          </MainLayout>
        ),
        path: "/master-components/:id",
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
        path: "/master-bom-create",
      },
      {
        element: (
          <MainLayout>
            <MasterBOMLayout>
              <CustomRedirection UnderDevelopment={true}>
                <MasterSfgBOM />
              </CustomRedirection>
            </MasterBOMLayout>
          </MainLayout>
        ),
        path: "/master-sfg-bom",
      },
      {
        element: (
          <MainLayout>
            <MasterBOMLayout>
              <CustomRedirection>
                <MasterFGBOM />
              </CustomRedirection>
            </MasterBOMLayout>
          </MainLayout>
        ),
        path: "/master-fg-bom",
      },
      {
        element: (
          <MainLayout>
            <MasterBomDetailPage />
          </MainLayout>
        ),
        path: "/master-fg-bom/:id",
      },
      {
        element: (
          <MainLayout>
            <MasterBOMLayout>
              <CustomRedirection UnderDevelopment={true}>
                <MasterBOMDisabled />
              </CustomRedirection>
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
            <CustomRedirection UnderDevelopment={false}>
              <MasterAddVender />
            </CustomRedirection>
          </MainLayout>
        ),
        path: "/master-vendor-add",
      },
      {
        element: (
          <MainLayout>
            <CustomRedirection UnderDevelopment={false}>
              <MaterVendorDetail />
            </CustomRedirection>
          </MainLayout>
        ),
        path: "/master-vendor/:id",
      },
      {
        element: (
          <MainLayout>
            <CustomRedirection UnderDevelopment={false}>
              <MasterClient />
            </CustomRedirection>
          </MainLayout>
        ),
        path: "/master-client",
      },
      {
        element: (
          <MainLayout>
            <CustomRedirection UnderDevelopment={false}>
              <MasterClientDetail />
            </CustomRedirection>
          </MainLayout>
        ),
        path: "/master-client/:id",
      },
      {
        element: (
          <MainLayout>
            <MasterVenderLayout>
              <CustomRedirection UnderDevelopment={false}>
                <MsterVendorDetail />
              </CustomRedirection>
            </MasterVenderLayout>
          </MainLayout>
        ),
        path: "/master-vender-detail",
      },
      {
        element: (
          <MainLayout>
            <MasterAddressLayout>
              <CustomRedirection UnderDevelopment={false}>
                <MasterBillingAddress />
              </CustomRedirection>
            </MasterAddressLayout>
          </MainLayout>
        ),
        path: "/master-billing-address",
      },
      {
        element: (
          <MainLayout>
            <MasterAddressLayout>
              <CustomRedirection UnderDevelopment={false}>
                <MasterShippingaddress />
              </CustomRedirection>
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
            <SwipeMaterialApprovalLayout>
              <SwipeMaterialApproval />
            </SwipeMaterialApprovalLayout>
          </MainLayout>
        ),
        path: "/swipe-approval",
      },
      {
        element: (
          <MainLayout>
            <SwipeMaterialApprovalLayout>
              <SwipeRequistionRequest />
            </SwipeMaterialApprovalLayout>
          </MainLayout>
        ),
        path: "/swipe-requisition-request",
      },
      {
        element: (
          <MainLayout>
            <MinLayout>
              <MaterialInvard />
            </MinLayout>
          </MainLayout>
        ),
        path: "/raw-min-v2",
      },
      {
        element: (
          <MainLayout>
            <MinLayout>
              <SimMin />
            </MinLayout>
          </MainLayout>
        ),
        path: "/sim-min",
      },
      {
        element: (
          <MainLayout>
            <MinLayout>
              <MaterialInvardv2 />
            </MinLayout>
          </MainLayout>
        ),
        path: "/raw-min",
      },
      {
        element: (
          <MainLayout>
            <ProdReturnMinLayout>
              <ProdReturnMin />
            </ProdReturnMinLayout>
          </MainLayout>
        ),
        path: "/warehouse/prod-return-MIN",
      },
      {
        element: (
          <MainLayout>
            <CRMRemarkLayout>
              <CRMRemarkReport />
            </CRMRemarkLayout>
          </MainLayout>
        ),
        path: "/crm/report",
      },
      {
        element: (
          <MainLayout>
            <CRMRemarkLayout>
              <CRMUpload />
            </CRMRemarkLayout>
          </MainLayout>
        ),
        path: "/crm/upload-excel",
      },
      {
        element: (
          <MainLayout>
            <ProcurementLayout>
              <CreatePO />
            </ProcurementLayout>
          </MainLayout>
        ),
        path: "/procurement/create",
      },
      {
        element: (
          <MainLayout>
            <GPLayout>
              <CreateGP />
            </GPLayout>
          </MainLayout>
        ),
        path: "/warehouse/create-gp",
      },
      {
        element: (
          <MainLayout>
            <GPLayout>
              <ManageGP />
            </GPLayout>
          </MainLayout>
        ),
        path: "/warehouse/manage-gp",
      },
      {
        element: (
          <MainLayout>
            <ProcurementLayout>
              <ManagePO />
            </ProcurementLayout>
          </MainLayout>
        ),
        path: "/procurement/manage",
      },
      {
        element: (
          <MainLayout>
            <UpdateProcurementLayout>
              <CreatePO />
            </UpdateProcurementLayout>
          </MainLayout>
        ),
        path: "/procurement/edit-po/:id",
      },
      {
        element: (
          <MainLayout>
            <ProcurementLayout>
              <ManagePO />
            </ProcurementLayout>
          </MainLayout>
        ),
        path: "/procurement/manage",
      },
      {
        element: (
          <MainLayout>
            <ProcurementLayout>
              <CompletedPO />
            </ProcurementLayout>
          </MainLayout>
        ),
        path: "/procurement/completed",
      },
      {
        element: (
          <MainLayout>
            {/* <DeviceMin /> */}
            <MaterialIn />
          </MainLayout>
        ),
        path: "/device-materials-in",
      },
      {
        element: (
          <MainLayout>
            <MINFromPO />
          </MainLayout>
        ),
        path: "/material-in-with-po",
      },
        {
        element: (
          <MainLayout>
            <SummaryLayout>
            <Custom404Page />
            </SummaryLayout>
          </MainLayout>
        ),
        path: "/summary",
      },
       {
        element: (
          <MainLayout>
            <SummaryLayout>
            <Custom404Page />
            </SummaryLayout>
          </MainLayout>
        ),
        path: "/summary/trc",
      },
       {
        element: (
          <MainLayout>
            <SummaryLayout>
            <Custom404Page />
            </SummaryLayout>
          </MainLayout>
        ),
        path: "/summary/speaker-assembly",
      },
        
           {
        element: (
          <MainLayout>
            <SummaryLayout>
            <AssemblyAndTRC />
            </SummaryLayout>
          </MainLayout>
        ),
        path: "/summary/assembly-and-trc",
      },
            {
        element: (
          <MainLayout>
            <SummaryLayout>
            <Dispatched />
            </SummaryLayout>
          </MainLayout>
        ),
        path: "/summary/dispatch",
      },
            {
        element: (
          <MainLayout>
            <SummaryLayout>
            <MaterialPurchase />
            </SummaryLayout>
          </MainLayout>
        ),
        path: "/summary/material-purchase",
      },

      // {
      //   element: (
      //     <MainLayout>
      //       <MaterialIn />
      //     </MainLayout>
      //   ),
      //   path: "/device-min",
      // },
      // production=======================================
      {
        element: (
          <MainLayout>
            <ProductionMaterialRequisitionLayout>
              <CustomRedirection UnderDevelopment={false}>
                <MaterialRequestWithBom />
              </CustomRedirection>
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
            <ProductionMaterialRequisitionLayout>
              <SwipeDeviceRequest />
            </ProductionMaterialRequisitionLayout>
          </MainLayout>
        ),
        path: "/production/swipe-device-request",
      },
      {
        element: (
          <MainLayout>
            <ProductionAndPlanLayout>
              <CustomRedirection UnderDevelopment={true}>
                <CraetePPR />
              </CustomRedirection>
            </ProductionAndPlanLayout>
          </MainLayout>
        ),
        path: "/production/create-ppr",
      },
      {
        element: (
          <MainLayout>
            <ProductionAndPlanLayout>
              <CustomRedirection UnderDevelopment={true}>
                <PendingPPR />
              </CustomRedirection>
            </ProductionAndPlanLayout>
          </MainLayout>
        ),
        path: "/production/pending-ppr",
      },
      {
        element: (
          <MainLayout>
            <ProductionAndPlanLayout>
              <CustomRedirection UnderDevelopment={true}>
                <CompletePPR />
              </CustomRedirection>
            </ProductionAndPlanLayout>
          </MainLayout>
        ),
        path: "/production/complete-ppr",
      },
      {
        element: (
          <MainLayout>
            <TRCLayout>
              <CustomRedirection UnderDevelopment={false}>
                <AddTRC />
              </CustomRedirection>
            </TRCLayout>
          </MainLayout>
        ),
        path: "/production/add-trc",
      },
      {
        element: (
          <MainLayout>
            <TRCLayout>
              <CustomRedirection UnderDevelopment={false}>
                <StoreTRC />
              </CustomRedirection>
            </TRCLayout>
          </MainLayout>
        ),
        path: "/production/store-trc",
      },
      {
        element: (
          <MainLayout>
            <TRCLayout>
              <CustomRedirection UnderDevelopment={false}>
                <ViewTRC />
              </CustomRedirection>
            </TRCLayout>
          </MainLayout>
        ),
        path: "/production/view-trc",
      },
      {
        element: (
          <MainLayout>
            <TRCLayout>
              <CustomRedirection UnderDevelopment={false}>
                <PendingTRCListTable />
              </CustomRedirection>
            </TRCLayout>
          </MainLayout>
        ),
        path: "/production/trc-list",
      },
      {
        element: (
          <MainLayout>
            <BatteryQC />
          </MainLayout>
        ),
        path: "/production/battery-qc",
      },
      {
        element: (
          <MainLayout>
            <ProductionCreate />
          </MainLayout>
        ),
        path: "/production/create",
      },
      {
        element: (
          <MainLayout>
            <CustomRedirection UnderDevelopment={true}>
              <ProductionManage />
            </CustomRedirection>
          </MainLayout>
        ),
        path: "/production/manage",
      },
      {
        element: (
          <MainLayout>
            <QrLayout>
              <CustomRedirection UnderDevelopment={false}>
                <MasterQrGenerator />
              </CustomRedirection>
            </QrLayout>
          </MainLayout>
        ),
        path: "/production/master-qr-generator",
      },
      {
        element: (
          <MainLayout>
            <QrLayout>
              <SingleQrGenerator />
            </QrLayout>
          </MainLayout>
        ),
        path: "/production/single-qr-generator",
      },
      {
        element: (
          <MainLayout>
            <QrLayout>
              <DownloadQrExcel />
            </QrLayout>
          </MainLayout>
        ),
        path: "/production/download-excel",
      },
      //branch transfer===========================================
      {
        element: (
          <MainLayout>
            <BranchTransferLayout>
              <CreateBranchTransferPage />
            </BranchTransferLayout>
          </MainLayout>
        ),
        path: "/branchTransfer/create",
      },
      {
        element: (
          <MainLayout>
            <BranchTransferLayout>
              <ManageBranchTable />
            </BranchTransferLayout>
          </MainLayout>
        ),
        path: "/branchTransfer/manage",
      },

      //dispatch===========================================
      {
        element: (
          <MainLayout>
            <DispatchLayout>
              <CustomRedirection UnderDevelopment={true}>
                <ManageDispatch />
              </CustomRedirection>
            </DispatchLayout>
          </MainLayout>
        ),
        path: "/dispatch/manage",
      },
      {
        element: (
          <MainLayout>
            <ChallanLayout>
              <CreateChallanPage />
            </ChallanLayout>
          </MainLayout>
        ),
        path: "/create-challan",
      },
      {
        element: (
          <MainLayout>
            <CreatePartCodeChallanLayout>
              <CreatePartCodeChallan />
            </CreatePartCodeChallanLayout>
          </MainLayout>
        ),
        path: "/create-part-code-challan",
      },
      {
        element: (
          <MainLayout>
            <ChallanLayout>
              <UpdateChallanPage />
            </ChallanLayout>
          </MainLayout>
        ),
        path: "/update-challan/:id",
      },
      {
        element: (
          <MainLayout>
            <ChallanLayout>
              <ManageChallan />
            </ChallanLayout>
          </MainLayout>
        ),
        path: "/manage-challan",
      },
      {
        element: (
          <MainLayout>
            <CreatePartCodeChallanLayout>
              <ManageChallan challanType="PART" />
            </CreatePartCodeChallanLayout>
          </MainLayout>
        ),
        path: "/manage-part-code-challan",
      },
      {
        element: (
          <MainLayout>
            <DispatchLayout>
              <CreateDispatchPage />
            </DispatchLayout>
          </MainLayout>
        ),
        path: "/dispatch/create",
      },
      {
        element: (
          <MainLayout>
            <DispatchLayout>
              <CreateDispatchPage />
            </DispatchLayout>
          </MainLayout>
        ),
        path: "/dispatch/create/:id",
      },
      {
        element: (
          <MainLayout>
            <WrongDispatchLayout>
              <WrongDeviceDispatch />
            </WrongDispatchLayout>
          </MainLayout>
        ),
        path: "/dispatch/wrong-device",
      },
      {
        element: (
          <MainLayout>
            <WrongDispatchLayout>
              <WrongDeviceDispatch />
            </WrongDispatchLayout>
          </MainLayout>
        ),
        path: "/dispatch/wrong-device/:id",
      },

      //dispatch===========================================

      ///////////////////////////////////////
      {
        element: (
          <MainLayout>
            <SopPage />
          </MainLayout>
        ),
        path: "/sop",
      },
      //////////////////////////////////////////////
      //report======================================
      {
        element: (
          <MainLayout>
            <ReportLayout>
              <Report />
            </ReportLayout>
          </MainLayout>
        ),
        path: "report/:id",
      },
      {
        element: (
          <MainLayout>
            <MasterReport />
          </MainLayout>
        ),
        path: "/master-report",
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
        path: "queries/:id",
      },
      {
        element: (
          <MainLayout>
            <ViewImageLayout>
              {" "}
              <ViewImage />
            </ViewImageLayout>
          </MainLayout>
        ),
        path: "/inward-device/view-image",
      },
          {
        element: (
          <MainLayout>
            <ViewImageLayout>
              {" "}
              <ImageCapturePage />
            </ViewImageLayout>
          </MainLayout>
        ),
        path: "/image-capture",
      },
      {
        element: (
          <MainLayout>
            <ViewImageLayout>
              {" "}
              <FQCDeviceImage />
            </ViewImageLayout>
          </MainLayout>
        ),
        path: "/fqc-device/view-image",
      },
      {
        element: (
          <MainLayout>
            <SwipeUploadLayout>
              <SwipeDeviceUpload />
            </SwipeUploadLayout>
          </MainLayout>
        ),
        path: "/upload/swipe-device-status",
      },
      {
        element: (
          <MainLayout>
            <SwipeUploadLayout>
              <MigrationUpload />
            </SwipeUploadLayout>
          </MainLayout>
        ),
        path: "/upload/migration-status",
      },
      {
        element: (
          <MainLayout>
            <MasterUpload />
          </MainLayout>
        ),
        path: "/upload/master-upload",
      },
      // Material Management
      {
        element: (
          <MainLayout>
            <MaterialMovementLayout>
              <MaterialManagement />
            </MaterialMovementLayout>
          </MainLayout>
        ),
        path: "/material-movement",
      },
      // Part Code Conversion
      {
        element: (
          <MainLayout>
            <PartCodeConversionLayout>
              <PartCodeConversion />
            </PartCodeConversionLayout>
          </MainLayout>
        ),
        path: "/warehouse/part-code-conversion",
      },
      {
        element: (
          <MainLayout>
            <PartCodeConversionLayout>
              <PartCodeConversionReport />
            </PartCodeConversionLayout>
          </MainLayout>
        ),
        path: "/warehouse/part-code-conversion-report",
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
