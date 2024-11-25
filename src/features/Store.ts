import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/authentication/authSlice";
import uomReducer from "@/features/master/UOM/UOMSlice";
import commonReducer from "@/features/common/commonSlice";
import BOMReducer from "@/features/master/BOM/BOMSlice";
import componentReducer from "@/features/master/component/componentSlice";
import productReducer from "@/features/master/products/productSlice";
import diviceminReducer from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import rawminReducer from "@/features/wearhouse/Rawmin/RawMinSlice";
import locationReducer from "@/features/master/location/locationSlice";
import queryReducer from "@/features/query/query/querySlice";
import reportReducer from "@/features/report/report/reportSlice";
import pendingMrRequestReducer from "@/features/wearhouse/MaterialApproval/MrApprovalSlice";
import materialRequestWithoutBomReducer from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import addTrcReducer from "@/features/trc/AddTrc/addtrcSlice";
import viewTrcReducer from "@/features/trc/ViewTrc/viewTrcSlice";
import batteryQcReducer from "@/features/production/Batteryqc/BatteryQcSlice";
import manageProductionTReducer from "@/features/production/ManageProduction/ManageProductionSlie";
import dispatchReducer from "@/features/Dispatch/DispatchSlice";
import sopRedeucer from "@/features/Sop/sopSlice";
import qrslice from "@/features/production/QRCode/QRCodeSlice";
import menuReducer from "@/features/menu/menuSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    uom: uomReducer,
    bom: BOMReducer,
    component: componentReducer,
    product: productReducer,
    divicemin: diviceminReducer,
    rawmin: rawminReducer,
    location: locationReducer,
    materialRequestWithoutBom: materialRequestWithoutBomReducer,
    query: queryReducer,
    report: reportReducer,
    pendingMr: pendingMrRequestReducer,
    common: commonReducer,
    addTrc: addTrcReducer,
    viewTrc: viewTrcReducer,
    batteryQcReducer: batteryQcReducer,
    manageProduction: manageProductionTReducer,
    dispatch: dispatchReducer,
    sop: sopRedeucer,
    qr: qrslice,
    menu: menuReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
