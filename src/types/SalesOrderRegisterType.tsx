export interface RowData {
    id: number;
    orderId: string;
    customerCode: string;
    customerName: string;
    costCenter: string;
    deliveryTerms: string;
    paymentTerms: string;
    status: string;
    createdBy: string;
  }
export type Payload = {
  wise: string;
  data: string;
}
