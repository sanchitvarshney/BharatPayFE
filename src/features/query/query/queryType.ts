interface Vendor {
  type: string;
  name: string;
  code: string;
}
export type RowData = {
  insertDate: string;
  type: string;
  transaction: string;
  qtyIn: number;
  qtyOut: number;
  locIn: string;
  locOut: string;
  insertBy: string;
  vendor: string;
  vendorCode: string;
};
interface TransactionType {
  type: string;
  txnID: string;
}

export interface BodyItem {
  type: TransactionType;
  vendor: Vendor;
  qtyIn: number;
  qtyOut: number;
  insertBy: string;
  locIn: string;
  locOut: string;
  insertDate: string;
}

interface Head {
  code: string;
  name: string;
  uom: string;
  closingQty: number;
  openingQty: number;
  lasttIN: string;
  lastRate: string;
}

export interface Response {
  head: Head;
  body: BodyItem[];
}

export interface Q1ApiResponse {
  success: boolean;
  status: string;
  response: Response;
}



export type component = {
  NAME: string;
  CODE: string;
  KEY: string;
  SOURCE: string;
  
}
export type componentApiResponse = {
  status: string;
  success: boolean;
  data: component[];
}
export type QueryStateType = {
  q1Data:Response|null;
  getQ1DataLoading:boolean;
  componentData:component[]|null;
  getComponentDataLoading:boolean;

}