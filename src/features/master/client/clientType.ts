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
    shipToPincode: string;
    shipToGst: string;
    shipToPan: string;
    shipToAddress1: string;
    shipToAddress2: string;
  };
};

export type ClientState = {
  createClientLoading: boolean;
}