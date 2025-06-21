export type CraeteClientPayload = {
  name: string;
  gst: string;
  country: string;
  state: string;
  city: string;
  address: string;
  panno: string;
  phone: string;
  email: string;
  website: string;
  salesperson: string;
  addressDetails: {
    billToLabel: string;
    billToCountry: string;
    billToState: string;
    billToPincode: string;
    billToPhone: string;
    billToGst: string;
    billToAddresLine1: string;
    billToAddresLine2: string;
    shipToLabel: string;
    shipToCompany: string;
    shipToCountry: string;
    shipToState: string;
    shipToCity: string;
    shipToPincode: string;
    shipToGst: string;
    shipToPan: string;
    shipToAddress1: string;
    shipToAddress2: string;
  };
};

type CustomerData = {
  code: string;
  c_id: string;
  name: string;
  gst: string;
  mobile: string;
  email: string;
  city: string;
};

export type CustomerApiResponse = {
  success: boolean;
  data: CustomerData[];
};

type ClientDetail = {
  client: {
    code: string; // Unique identifier for the customer
    c_id: string; // Alias or alternate ID for the customer
    name: string; // Name of the customer
    gst: string; // GST number of the customer
    mobile: string; // Mobile number (can be empty)
    email: string; // Email address of the customer
    city: string; // City of the customer
    state: {
      name: string; // Name of the state (nullable)
      code: string; // Code of the state
    };
    country: {
      name: string; // Name of the country (nullable)
      code: string; // Code of the country (nullable)
    };
    address: string; // Address of the customer
    panno: string; // PAN number of the customer
    phone: string; // Phone number of the customer
    website: string; // Website of the customer
    salesperson: string; // Salesperson assigned to the customer
    created_at: string; // Timestamp when the customer was created
  };
  branch: {
    id: string;
    name: string;
    address1: string;
    address2: string;
    pincode: string;
    state: {
      stateCode: string;
      stateName: string;
    };
    country: {
      countryID: string;
      countryName: string;
    };
    phone: string;
    gst: string;
    shipAddress: {
      shipId: string;
      pincode: string;
      label: string;
      company: string;
      address1: string;
      address2: string;
      state: {
        stateCode: string;
        stateName: string;
      };
      country: {
        countryID: string;
        countryName: string;
      };
      gstin: string;
      pan: string;
      mobile: string;
    }[];
  }[];
};
export type ClientDetailApiresponse = {
  success: boolean;
  data: ClientDetail;
};

type AddressDetail = {
  addressID?: string; // Optional since it is missing in some entries
  shipId?: string; // Optional since it is missing in some entries
  state: {
    stateCode: string;
    stateName: string;
  };
  country: {
    countryID: string;
    countryName: string;
  };
  addressLine1: string;
  addressLine2: string;
  pinCode: string;
  phoneNo?: string; // Optional as it's missing in some entries
  gst: string;
  clientCode?: string; // Optional since it's not part of shippingAddress
  insertedAt: string; // This includes "Invalid date", so could use stricter validation if needed
  label: string;
  company?: string; // Optional as it appears only in shippingAddress
  panno?: string; // Optional as it appears only in shippingAddress
  city?: string;
};

export type AddressDetailApiResponse = {
  success: boolean;
  data: {
    billingAddress: AddressDetail;
    shippingAddress: AddressDetail[];
  };
};

export type DispatchFromDetail = {
  address: string;
  addressLine1: string;
  cin: string;
  addressLine2: string;
  code: string;
  company: string;
  gst: string;
  insert_dt: string;
  label: string;
  mobileNo: string;
  pan: string;
  pin: string;
};

export type DispatchFromDetailApiResponse = {
  success: boolean;
  data: DispatchFromDetail[];
};

export type AddShipToAddressPayload = {
  addressID: string;
  shipToPincode: string;
  shipToLabel: string;
  shipToCompany: string;
  shipToAddress1: string;
  shipToAddress2: string;
  shipToState: string;
  shipToGst: string;
  shipToPan: string;
  shipToCountry: string;
  shipToCity: string;
};

export type AddBranchPayload = {
  client: string;
  billToLabel: string;
  billToCountry: string;
  billToState: string;
  billToPincode: string;
  billToPhone: string;
  billToGst: string;
  billToAddresLine1: string;
  billToAddresLine2: string;
  shipToLabel: string;
  shipToCompany: string;
  shipToCountry: string;
  shipToState: string;
  shipToPincode: string;
  shipToGst: string;
  shipToPan: string;
  shipToCity: string;
  shipToAddress1: string;
  shipToAddress2: string;
};

export type UpdateShipToPayload = {
  shipCode: string;
  shipToPincode: string; // Pincode as a string for flexibility (e.g., leading zeros in some countries)
  shipToLabel: string;
  shipToCompany: string;
  shipToAddress1: string;
  shipToAddress2: string;
  shipToState: string;
  shipToGst: string;
  shipToPan: string;
  shipToCountry: string;
  shipToCity: string;
};
export type UpdateBillingAddressPayload = {
  addressID: string;
  billToLabel: string;
  billToCountry: string;
  billToState: string;
  billToPincode: string;
  billToPhone: string;
  billToGst: string;
  billToAddresLine1: string;
  billToAddresLine2: string;
};

export type BasicDetailPayload = {
  clientCode: string;
  name: string;
  gst: string;
  country: string;
  state: string;
  city: string;
  address: string;
  panno: string;
  phone: string;
  email: string;
  website: string;
  salesperson: string;
};

export type ClientState = {
  createClientLoading: boolean;
  clientdata: CustomerData[] | null;
  getClientLoading: boolean;
  clientDetail: ClientDetail | null;
  clientDetailLoading: boolean;
  addressDetail: AddressDetailApiResponse | null;
  addressDetailLoading: boolean;
  addShiptoAddressLoading: boolean;
  addBranchLoading: boolean;
  updateshiptoAddressLoading: boolean;
  addressId: string | null;
  shipId: string | null;
  updateBillingAddressLoading: boolean;
  billId: string | null;
  updateBasicDetailLoading: boolean;
  dispatchFromDetailsLoading: boolean;
  dispatchFromDetails: DispatchFromDetail[] | null;
};
