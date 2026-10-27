import axiosInstance from "@/api/axiosInstance";
import publicAxiosInstance from "@/api/publicAxiosInstance";

const authHeaders = (token: string) => ({ authorization: token });

export type RateApprovalStatus = "pending" | "approved" | "rejected";

export type RateApprovalItem = {
  id: string;
  componentKey: string;
  componentLabel: string;
  brand: string;
  specification: string;
  initialRate: number;
  enteredRate: number;
};

type RequestPriceApprovalResponse = {
  success: boolean;
  status: string;
  message: string;
  req_id: string;
  approval_link: string;
  data: {
    vendor_id: string;
    requested_by: string;
  };
};

export const requestPriceApproval = async (
  vendorId: string,
  items: RateApprovalItem[],
  remarks: Record<string, string> = {},
): Promise<RequestPriceApprovalResponse> => {
  const response = await axiosInstance.post("/po/requestPriceApproval", {
    vendor_id: vendorId,
    components: items.map((item) => ({
      component_key: item.componentKey,
      requested_rate: item.enteredRate,
      brand: item.brand,
      specification: item.specification,
      remark: remarks[item.id]?.trim() || "",
    })),
  });
  return response.data;
};

export type RefreshApprovalItem = {
  id: number;
  req_id: string;
  vendor_id: string;
  component_key: string;
  part_code: string;
  component_name: string;
  unit?: string | null;
  brand?: string | null;
  specification?: string | null;
  current_rate: string;
  requested_rate: string;
  is_new_pair?: number;
  requested_by?: string;
  status: string;
  action_by?: string | null;
  action_date?: string | null;
  remarks: string | null;
  created_at?: string;
};

export type RefreshApprovalDataResponse = {
  success: boolean;
  message: string;
  data: {
    req_id: string;
    vendor_id: string;
    vendor_name: string;
    requested_by: string;
    isPending: boolean;
    status: string;
    created_at?: string;
    action_by?: string | null;
    action_date?: string | null;
    items: RefreshApprovalItem[];
  };
};

export const refreshApprovalData = async (
  reqId: string,
): Promise<RefreshApprovalDataResponse> => {
  const response = await axiosInstance.get(
    `/po/refreshApprovalData?req_id=${reqId}`,
  );
  return response.data;
};

export const fetchAdminApprovalRequest = async (
  reqId: string,
  token: string,
): Promise<RefreshApprovalDataResponse> => {
  const response = await publicAxiosInstance.get("/po/adminApprovalList", {
    params: { req_id: reqId },
    headers: authHeaders(token),
  });
  return response.data;
};

export type ComponentLog = {
  req_id: string;
  date: string;
  rate: number;
  status: string;
  action_by?: string | null;
  action_by_name: string | null;
  remarks?: string | null;
  brand?: string | null;
  specification?: string | null;
};

export type PurchaseRecord = {
  vendor_id: string;
  vendor_name: string;
  is_current_vendor: boolean;
  rate: number;
  order_qty: string;
  po_number: string;
  currency: string;
  purchase_date: string; // DD-MM-YYYY
};

export type ComponentMetaData = {
  component_key: string;
  part_code: string;
  component_name: string;
  component_logs: ComponentLog[];
  purchase_history?: PurchaseRecord[];
  other_vendors: PurchaseRecord[];
};

export type ComponentMetaDataResponse = {
  success: boolean;
  status: string;
  message: string;
  data: {
    req_id: string;
    vendor_id: string;
    vendor_name: string;
    items: ComponentMetaData[];
  };
};

export const getComponentMetaData = async (
  reqId: string,
  token: string,
): Promise<ComponentMetaDataResponse> => {
  const response = await publicAxiosInstance.get("/po/getComponentMetaData", {
    params: { req_id: reqId },
    headers: authHeaders(token),
  });
  return response.data;
};

export type AdminApprovalDecision = {
  id: number;
  status: "APPROVED" | "REJECTED";
  remarks: string;
};

type SubmitAdminApprovalResponse = {
  success: boolean;
  message: string;
};

export const submitAdminApproval = async (
  reqId: string,
  token: string,
  decisions: AdminApprovalDecision[],
): Promise<SubmitAdminApprovalResponse> => {
  const response = await publicAxiosInstance.post(
    "/po/submitAdminApproval",
    {
      req_id: reqId,
      decisions,
    },
    { headers: authHeaders(token) },
  );
  return response.data;
};
