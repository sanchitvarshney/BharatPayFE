// Location used as `loc_out` for the swipe dispatch report.
export const SWIPE_DISPATCH_LOCATION = "06db5f25-c7fc-424e-b87a-326a677a526c";

export type SwipeSkuTab = {
  key: string; // used in the URL: /swipe-billing/sku/:key
  label: string;
  skuId: string; // SKU uuid sent to /swipebill/sku-consumption
};

// TODO: fill the remaining SKU uuids.
export const SWIPE_SKU_TABS: SwipeSkuTab[] = [
  { key: "bharatpe-one-p12", label: "BharatPe_One_P12", skuId: "" },
  { key: "sr600-mini-digital", label: "SR600 Mini Digital", skuId: "" },
  {
    key: "sr600-mini-static",
    label: "SR600 Mini Static",
    skuId: "9af4d49e-b869-4957-9280-4fd5b2754477",
  },
  { key: "android-ingenico", label: "Android_Ingenico", skuId: "" },
  { key: "mosambee-p10", label: "Mosambee_P10", skuId: "" },
  { key: "payswiff-4g", label: "Payswiff_4G", skuId: "" },
];
