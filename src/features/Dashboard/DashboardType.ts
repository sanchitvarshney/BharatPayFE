type Product = {
  productName: string;
  productSKU: string;
  openingBalance: string;
  totalIn: string;
  totalOut: string;
  closingBalance: string;
};

type Location = {
  locationName: string;
  locationCode: string;
  products: Product[];
};

export type DeviceApiResponse = {
  success: boolean;
  data: Location[];
  message: string;
};

type RawMaterial = {
  partCode: string; // renamed "Part Code"
  partName: string; // renamed "Part Name"
  opening: string;
  inward: string;
  outward: string;
  balance: string;
};

type RawMaterialLocation = {
  locationName: string;
  locationCode: string;
  products: RawMaterial[];
};

export type RawMaterialResponseData = {
  success: boolean;
  data: RawMaterialLocation[];
  message: string;
};

export type DashBoardType = {
  deviceData: Location[] | null;
  devicedataLoading: boolean;
  rawMaterialData: RawMaterialLocation[] | null;
  rawMaterialLoading: boolean;
  issuedataLoading: boolean;
  issuedata:any[] | null
};
