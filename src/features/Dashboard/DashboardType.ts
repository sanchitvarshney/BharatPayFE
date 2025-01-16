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

export type DashBoardType = {
  deviceData: Location[]  | null;
  devicedataLoading: boolean;
};
